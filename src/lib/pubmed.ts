/**
 * PubMed E-utilities client library.
 *
 * Provides helpers for ESearch, ESummary, EFetch, and ID Converter,
 * plus the curated disease-site search queries from Raj's research.
 */

// ---------------------------------------------------------------------------
// Configuration
// ---------------------------------------------------------------------------

const EUTILS_BASE = "https://eutils.ncbi.nlm.nih.gov/entrez/eutils";
const PMC_ID_CONVERTER =
  "https://www.ncbi.nlm.nih.gov/pmc/utils/idconv/v1.0/";

/** If set in env, we get 10 req/sec instead of 3. */
const API_KEY = process.env.NCBI_API_KEY ?? "";
const MAX_CONCURRENT = API_KEY ? 10 : 3;

// Simple token-bucket rate limiter (per-process).
let tokens = MAX_CONCURRENT;
let lastRefill = Date.now();
const REFILL_INTERVAL_MS = 1000;

function refillTokens() {
  const now = Date.now();
  if (now - lastRefill >= REFILL_INTERVAL_MS) {
    tokens = MAX_CONCURRENT;
    lastRefill = now;
  }
}

async function acquireToken(): Promise<void> {
  // eslint-disable-next-line no-constant-condition
  while (true) {
    refillTokens();
    if (tokens > 0) {
      tokens--;
      return;
    }
    // Wait until the next refill window.
    await new Promise((r) => setTimeout(r, 100));
  }
}

function apiKeyParam(): string {
  return API_KEY ? `&api_key=${API_KEY}` : "";
}

// ---------------------------------------------------------------------------
// Search queries
// ---------------------------------------------------------------------------

export interface DiseaseQuery {
  id: string;
  label: string;
  query: string;
}

// Top 20 cancer journals by impact factor + Red/Green rad onc journals
const JOURNAL_FILTER = [
  '"CA Cancer J Clin"[ta]',
  '"N Engl J Med"[ta]',
  '"Lancet"[ta]',
  '"BMJ"[ta]',
  '"Nat Rev Clin Oncol"[ta]',
  '"Nat Rev Cancer"[ta]',
  '"Nature"[ta]',
  '"Cell"[ta]',
  '"Nat Med"[ta]',
  '"JAMA"[ta]',
  '"Lancet Oncol"[ta]',
  '"Ann Oncol"[ta]',
  '"Cancer Cell"[ta]',
  '"J Clin Oncol"[ta]',
  '"Nat Cancer"[ta]',
  '"Cancer Discov"[ta]',
  '"JAMA Oncol"[ta]',
  '"Mol Cancer"[ta]',
  '"J Thorac Oncol"[ta]',
  '"Clin Cancer Res"[ta]',
  '"Int J Radiat Oncol Biol Phys"[ta]',
  '"Radiother Oncol"[ta]',
  '"Pract Radiat Oncol"[ta]',
].join(" OR ");

const JOURNAL_CLAUSE = `(${JOURNAL_FILTER})`;

export const DISEASE_QUERIES: DiseaseQuery[] = [
  {
    id: "esophageal",
    label: "Esophageal",
    query:
      `("esophageal neoplasms"[MeSH] OR "esophageal cancer"[tiab]) AND ("radiotherapy"[MeSH] OR "radiation therapy"[tiab] OR "chemoradiation"[tiab]) AND ${JOURNAL_CLAUSE}`,
  },
  {
    id: "pancreatic",
    label: "Pancreatic",
    query:
      `("pancreatic neoplasms"[MeSH] OR "pancreatic cancer"[tiab]) AND ("radiotherapy"[MeSH] OR "radiation therapy"[tiab] OR "SBRT"[tiab]) AND ${JOURNAL_CLAUSE}`,
  },
  {
    id: "hcc",
    label: "HCC",
    query:
      `("carcinoma, hepatocellular"[MeSH] OR "hepatocellular carcinoma"[tiab] OR "HCC"[tiab]) AND ("radiotherapy"[MeSH] OR "radiation therapy"[tiab] OR "SBRT"[tiab]) AND ${JOURNAL_CLAUSE}`,
  },
  {
    id: "cholangiocarcinoma",
    label: "Cholangiocarcinoma",
    query:
      `("cholangiocarcinoma"[MeSH] OR "cholangiocarcinoma"[tiab]) AND ("radiotherapy"[MeSH] OR "radiation therapy"[tiab] OR "SBRT"[tiab]) AND ${JOURNAL_CLAUSE}`,
  },
  {
    id: "rectal",
    label: "Rectal",
    query:
      `("rectal neoplasms"[MeSH] OR "rectal cancer"[tiab]) AND ("radiotherapy"[MeSH] OR "radiation therapy"[tiab] OR "chemoradiation"[tiab] OR "total neoadjuvant"[tiab]) AND ${JOURNAL_CLAUSE}`,
  },
  {
    id: "anal",
    label: "Anal",
    query:
      `("anus neoplasms"[MeSH] OR "anal cancer"[tiab]) AND ("radiotherapy"[MeSH] OR "radiation therapy"[tiab] OR "chemoradiation"[tiab]) AND ${JOURNAL_CLAUSE}`,
  },
  {
    id: "prostate",
    label: "Prostate",
    query:
      `("prostatic neoplasms"[MeSH] OR "prostate cancer"[tiab]) AND ("radiotherapy"[MeSH] OR "radiation therapy"[tiab] OR "brachytherapy"[tiab] OR "SBRT"[tiab]) AND ${JOURNAL_CLAUSE}`,
  },
  {
    id: "rcc",
    label: "RCC",
    query:
      `("carcinoma, renal cell"[MeSH] OR "renal cell carcinoma"[tiab] OR "kidney neoplasms"[MeSH]) AND ("radiotherapy"[MeSH] OR "radiation therapy"[tiab] OR "SBRT"[tiab]) AND ${JOURNAL_CLAUSE}`,
  },
  {
    id: "bladder",
    label: "Bladder",
    query:
      `("urinary bladder neoplasms"[MeSH] OR "bladder cancer"[tiab]) AND ("radiotherapy"[MeSH] OR "radiation therapy"[tiab] OR "chemoradiation"[tiab] OR "bladder preservation"[tiab]) AND ${JOURNAL_CLAUSE}`,
  },
  {
    id: "ai-medicine",
    label: "AI in Medicine",
    query:
      `("artificial intelligence"[MeSH] OR "machine learning"[tiab] OR "deep learning"[tiab] OR "large language model"[tiab]) AND ${JOURNAL_CLAUSE}`,
  },
];

// ---------------------------------------------------------------------------
// Raw PubMed types
// ---------------------------------------------------------------------------

export interface PubMedArticleSummary {
  pmid: string;
  pmcid?: string;
  title: string;
  authors: string;
  journal: string;
  pubDate: string;
  abstract?: string;
  doi?: string;
}

// ---------------------------------------------------------------------------
// ESearch — returns a list of PMIDs for a query
// ---------------------------------------------------------------------------

export async function esearch(
  query: string,
  opts: { maxResults?: number; reldate?: number } = {}
): Promise<string[]> {
  const { maxResults = 10, reldate = 7 } = opts;
  await acquireToken();

  const params = new URLSearchParams({
    db: "pubmed",
    term: query,
    retmax: String(maxResults),
    reldate: String(reldate),
    datetype: "edat",
    retmode: "json",
    sort: "date",
  });

  const url = `${EUTILS_BASE}/esearch.fcgi?${params}${apiKeyParam()}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`ESearch failed: ${res.status}`);

  const data = await res.json();
  return (data.esearchresult?.idlist as string[]) ?? [];
}

// ---------------------------------------------------------------------------
// ESummary — returns metadata for a list of PMIDs
// ---------------------------------------------------------------------------

export async function esummary(
  pmids: string[]
): Promise<PubMedArticleSummary[]> {
  if (pmids.length === 0) return [];
  await acquireToken();

  const params = new URLSearchParams({
    db: "pubmed",
    id: pmids.join(","),
    retmode: "json",
  });

  const url = `${EUTILS_BASE}/esummary.fcgi?${params}${apiKeyParam()}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`ESummary failed: ${res.status}`);

  const data = await res.json();
  const result: PubMedArticleSummary[] = [];

  for (const pmid of pmids) {
    const doc = data.result?.[pmid];
    if (!doc) continue;

    const authors = (doc.authors ?? [])
      .map((a: { name: string }) => a.name)
      .join(", ");

    result.push({
      pmid,
      title: doc.title ?? "",
      authors,
      journal: doc.fulljournalname ?? doc.source ?? "",
      pubDate: doc.pubdate ?? "",
      doi: (doc.elocationid ?? "").replace("doi: ", ""),
    });
  }

  return result;
}

// ---------------------------------------------------------------------------
// EFetch abstract — retrieves the abstract text for given PMIDs
// ---------------------------------------------------------------------------

export async function efetchAbstracts(
  pmids: string[]
): Promise<Map<string, string>> {
  if (pmids.length === 0) return new Map();
  await acquireToken();

  const params = new URLSearchParams({
    db: "pubmed",
    id: pmids.join(","),
    rettype: "abstract",
    retmode: "xml",
  });

  const url = `${EUTILS_BASE}/efetch.fcgi?${params}${apiKeyParam()}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`EFetch abstracts failed: ${res.status}`);

  const xml = await res.text();
  return parseAbstractsXml(xml);
}

/** Minimal XML parsing to extract abstracts without a full XML parser. */
function parseAbstractsXml(xml: string): Map<string, string> {
  const result = new Map<string, string>();

  // Split on <PubmedArticle> elements.
  const articleChunks = xml.split(/<PubmedArticle[^>]*>/);
  for (const chunk of articleChunks) {
    const pmidMatch = chunk.match(
      /<PMID[^>]*>(\d+)<\/PMID>/
    );
    if (!pmidMatch) continue;
    const pmid = pmidMatch[1];

    // Grab everything inside <Abstract>…</Abstract>
    const abstractMatch = chunk.match(
      /<Abstract>([\s\S]*?)<\/Abstract>/
    );
    if (!abstractMatch) continue;

    // Strip XML tags, collapse whitespace.
    const text = abstractMatch[1]
      .replace(/<[^>]+>/g, " ")
      .replace(/\s+/g, " ")
      .trim();

    result.set(pmid, text);
  }

  return result;
}

// ---------------------------------------------------------------------------
// ID Converter — check which PMIDs have corresponding PMCIDs
// ---------------------------------------------------------------------------

export async function convertIds(
  pmids: string[]
): Promise<Map<string, string>> {
  if (pmids.length === 0) return new Map();
  await acquireToken();

  const params = new URLSearchParams({
    ids: pmids.join(","),
    format: "json",
    tool: "morning-round",
    email: "morning-round@example.com",
  });

  const url = `${PMC_ID_CONVERTER}?${params}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`ID Converter failed: ${res.status}`);

  const data = await res.json();
  const map = new Map<string, string>();

  for (const record of data.records ?? []) {
    if (record.pmid && record.pmcid) {
      map.set(record.pmid, record.pmcid);
    }
  }

  return map;
}

// ---------------------------------------------------------------------------
// EFetch full text (PMC JATS XML → HTML)
// ---------------------------------------------------------------------------

export async function efetchFullText(pmcid: string): Promise<string> {
  await acquireToken();

  // Normalise: ensure the pmcid starts with "PMC"
  const id = pmcid.startsWith("PMC") ? pmcid : `PMC${pmcid}`;

  const params = new URLSearchParams({
    db: "pmc",
    id,
    rettype: "full",
    retmode: "xml",
  });

  const url = `${EUTILS_BASE}/efetch.fcgi?${params}${apiKeyParam()}`;
  const res = await fetch(url);
  if (!res.ok)
    throw new Error(`EFetch full text for ${id} failed: ${res.status}`);

  const xml = await res.text();
  return jatsToHtml(xml);
}

// ---------------------------------------------------------------------------
// JATS XML → readable HTML (lightweight, no external XML parser)
// ---------------------------------------------------------------------------

export function jatsToHtml(xml: string): string {
  const sections: string[] = [];

  // Extract article title
  const titleMatch = xml.match(
    /<article-title[^>]*>([\s\S]*?)<\/article-title>/
  );
  if (titleMatch) {
    const titleText = stripTags(titleMatch[1]);
    sections.push(`<h1>${titleText}</h1>`);
  }

  // Extract body sections
  const bodyMatch = xml.match(/<body[^>]*>([\s\S]*?)<\/body>/);
  if (bodyMatch) {
    const body = bodyMatch[1];

    // Process <sec> elements — each gets a heading + paragraphs.
    const secRegex = /<sec[^>]*>([\s\S]*?)(?=<sec[^>]*>|<\/body>|$)/g;
    let secMatch: RegExpExecArray | null;

    while ((secMatch = secRegex.exec(body)) !== null) {
      const secContent = secMatch[1];

      // Section title
      const secTitleMatch = secContent.match(
        /<title[^>]*>([\s\S]*?)<\/title>/
      );
      if (secTitleMatch) {
        sections.push(`<h2>${stripTags(secTitleMatch[1])}</h2>`);
      }

      // Paragraphs
      const pRegex = /<p[^>]*>([\s\S]*?)<\/p>/g;
      let pMatch: RegExpExecArray | null;
      while ((pMatch = pRegex.exec(secContent)) !== null) {
        sections.push(`<p>${stripTags(pMatch[1])}</p>`);
      }
    }

    // If no <sec> elements found, just grab all <p> tags from body.
    if (sections.length <= 1) {
      const pRegex = /<p[^>]*>([\s\S]*?)<\/p>/g;
      let pMatch: RegExpExecArray | null;
      while ((pMatch = pRegex.exec(body)) !== null) {
        sections.push(`<p>${stripTags(pMatch[1])}</p>`);
      }
    }
  }

  // Fallback: if nothing extracted, return a message.
  if (sections.length === 0) {
    return "<p>Full text could not be parsed from the JATS XML.</p>";
  }

  return sections.join("\n");
}

function stripTags(html: string): string {
  return html
    .replace(/<xref[^>]*>[\s\S]*?<\/xref>/g, "")
    .replace(/<[^>]+>/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

// ---------------------------------------------------------------------------
// High-level: fetch articles for all configured queries
// ---------------------------------------------------------------------------

export interface FetchedArticle extends PubMedArticleSummary {
  diseaseQuery: string;
  diseaseLabel: string;
  hasFullText: boolean;
}

export async function fetchAllQueries(): Promise<FetchedArticle[]> {
  const allArticles: FetchedArticle[] = [];
  const seenPmids = new Set<string>();

  for (const dq of DISEASE_QUERIES) {
    try {
      // Step 1: ESearch
      const pmids = await esearch(dq.query);
      if (pmids.length === 0) continue;

      // Deduplicate across queries
      const newPmids = pmids.filter((id) => !seenPmids.has(id));
      newPmids.forEach((id) => seenPmids.add(id));
      if (newPmids.length === 0) continue;

      // Step 2: ESummary
      const summaries = await esummary(newPmids);

      // Step 3: Fetch abstracts
      const abstracts = await efetchAbstracts(newPmids);

      // Step 4: Check for PMCIDs
      const pmcIds = await convertIds(newPmids);

      // Merge
      for (const s of summaries) {
        s.abstract = abstracts.get(s.pmid) ?? undefined;
        s.pmcid = pmcIds.get(s.pmid) ?? undefined;

        allArticles.push({
          ...s,
          diseaseQuery: dq.id,
          diseaseLabel: dq.label,
          hasFullText: !!s.pmcid,
        });
      }
    } catch (err) {
      console.error(`Error fetching query "${dq.label}":`, err);
      // Continue with next query rather than failing entirely.
    }
  }

  return allArticles;
}
