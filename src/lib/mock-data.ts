import type { Article } from "./types";

export const MOCK_SESSION_ARTICLES: Article[] = [
  {
    id: "pubmed-1",
    stream: "literature",
    title:
      "Neoadjuvant Short-Course Radiotherapy Versus Chemoradiotherapy for Locally Advanced Rectal Cancer: Updated RAPIDO Results",
    authors: "van der Valk et al.",
    journal: "J Clin Oncol",
    publishedAt: "Mar 28",
    excerpt:
      "Updated results from the RAPIDO trial demonstrate that short-course radiotherapy followed by preoperative chemotherapy improves disease-free survival compared with standard chemoradiotherapy in locally advanced rectal cancer.",
    abstract:
      "Background: The RAPIDO trial previously demonstrated that short-course radiotherapy (5x5 Gy) followed by preoperative chemotherapy reduced disease-related treatment failure compared with standard chemoradiotherapy in locally advanced rectal cancer. We report updated long-term outcomes.\n\nMethods: In this multicentre, open-label, randomised controlled trial, patients with locally advanced rectal cancer (cT4 or cN2 or mesorectal fascia involvement or lateral lymph node involvement) were randomly assigned to short-course radiotherapy followed by 6 cycles of CAPOX or 9 cycles of FOLFOX4 before surgery (experimental group) or chemoradiotherapy (25x2 Gy with concurrent capecitabine) followed by surgery and optional adjuvant chemotherapy (standard group).\n\nResults: With a median follow-up of 5.6 years, disease-related treatment failure occurred in 102 (23.3%) of 438 patients in the experimental group versus 130 (30.4%) of 428 patients in the standard group (HR 0.73, 95% CI 0.56-0.95; p=0.019). Overall survival at 5 years was 81.7% in the experimental group versus 76.8% in the standard group (HR 0.79, 95% CI 0.59-1.06; p=0.12). The pathological complete response rate remained higher in the experimental group (28.4% vs 14.3%).\n\nConclusion: Long-term follow-up confirms that short-course radiotherapy followed by preoperative chemotherapy reduces disease-related treatment failure compared with standard chemoradiotherapy. The experimental approach should be considered a standard of care for locally advanced rectal cancer.",
    fullText:
      "## Introduction\n\nLocally advanced rectal cancer (LARC) remains a significant clinical challenge. Standard treatment has consisted of neoadjuvant long-course chemoradiotherapy (CRT) followed by total mesorectal excision (TME) and optional adjuvant chemotherapy. However, compliance with adjuvant chemotherapy has been historically poor, with only 50-60% of patients completing planned treatment.\n\nThe RAPIDO trial was designed to test whether delivering systemic chemotherapy in the neoadjuvant setting, preceded by short-course radiotherapy (SCRT), could improve outcomes by increasing chemotherapy compliance and reducing distant metastases, the primary cause of treatment failure.\n\n## Methods\n\nThis was a multicentre, open-label, superiority, randomised controlled trial conducted at 54 centres across 7 European countries. Patients aged 18 years or older with histologically confirmed rectal adenocarcinoma staged as locally advanced (cT4a/b, cN2, involved mesorectal fascia, or enlarged lateral lymph nodes) by MRI were eligible.\n\nPatients were randomly assigned (1:1) to receive either experimental treatment (SCRT 5x5 Gy over one week, followed by 6 cycles of CAPOX or 9 cycles of FOLFOX4, followed by TME) or standard treatment (CRT 25x2 Gy with concurrent capecitabine 825 mg/m2 twice daily, followed by TME, followed by optional adjuvant chemotherapy with 8 cycles of CAPOX or 12 cycles of FOLFOX4).\n\nThe primary endpoint was disease-related treatment failure (DrTF), defined as locoregional failure, distant metastasis, new primary colorectal tumour, or treatment-related death.\n\n## Results\n\nBetween June 2011 and June 2018, 920 patients were enrolled (462 experimental, 458 standard). After exclusions, 912 were included in the intention-to-treat analysis (460 experimental, 452 standard).\n\nChemotherapy compliance was substantially higher in the experimental group: 84.2% completed all planned neoadjuvant cycles compared with 57.8% who completed adjuvant chemotherapy in the standard group.\n\nWith a median follow-up of 5.6 years, DrTF occurred in 102 (23.3%) of 438 evaluable patients in the experimental group versus 130 (30.4%) of 428 in the standard group (hazard ratio [HR] 0.73, 95% CI 0.56-0.95; p=0.019). The cumulative incidence of distant metastasis at 5 years was 19.8% versus 26.6% (HR 0.70, 95% CI 0.52-0.94; p=0.017).\n\nOverall survival at 5 years was 81.7% in the experimental group versus 76.8% in the standard group (HR 0.79, 95% CI 0.59-1.06; p=0.12). While not reaching statistical significance for OS, the trend favouring the experimental arm was consistent across pre-specified subgroups.\n\nPathological complete response (pCR) was achieved in 28.4% of experimental patients versus 14.3% of standard patients. Organ preservation (watch-and-wait or local excision) was achieved in 9.4% versus 4.6% of patients.\n\n## Discussion\n\nThese updated results with mature follow-up confirm the benefit of the RAPIDO approach. The total neoadjuvant treatment (TNT) strategy successfully addressed the problem of poor adjuvant chemotherapy compliance by delivering all systemic therapy before surgery, when patients are more motivated and physically able to tolerate treatment.\n\nThe magnitude of benefit in reducing distant metastases (HR 0.70) is clinically meaningful and supports the hypothesis that early delivery of full-dose systemic chemotherapy can eradicate micrometastatic disease more effectively than the same chemotherapy delivered after the physiological insult of major surgery.\n\nThese findings, together with results from the PRODIGE 23 trial, establish total neoadjuvant therapy as a standard of care for locally advanced rectal cancer.",
    tags: ["rectal", "chemoradiation", "phase III"],
    readingTimeMin: 15,
    hasFullText: true,
    url: "https://pubmed.ncbi.nlm.nih.gov/example-1/",
    status: "unread",
  },
  {
    id: "pubmed-2",
    stream: "literature",
    title:
      "Stereotactic Body Radiation Therapy for Hepatocellular Carcinoma: NRG Oncology/RTOG 1112 Phase III Results",
    authors: "Dawson et al.",
    journal: "Lancet Oncol",
    publishedAt: "Mar 27",
    excerpt:
      "SBRT added to sorafenib significantly improved overall survival compared with sorafenib alone in patients with locally advanced hepatocellular carcinoma not amenable to standard therapies.",
    abstract:
      "Background: Hepatocellular carcinoma (HCC) patients ineligible for resection or transplant have limited treatment options. Sorafenib has been the standard systemic therapy, but overall survival remains poor. We investigated whether stereotactic body radiation therapy (SBRT) added to sorafenib could improve outcomes.\n\nMethods: In this randomised, phase III trial (NRG-RTOG 1112), patients with locally advanced HCC not eligible for surgical or ablative therapies were randomly assigned to SBRT followed by sorafenib versus sorafenib alone. The primary endpoint was overall survival.\n\nResults: 193 patients were randomly assigned. Median overall survival was 15.8 months in the SBRT plus sorafenib group versus 12.3 months in the sorafenib-alone group (HR 0.77, 95% CI 0.55-1.08; one-sided p=0.065). In the per-protocol analysis excluding early discontinuations, OS was significantly improved (HR 0.69, 95% CI 0.48-1.00; p=0.025). Progression-free survival was significantly improved with SBRT (HR 0.55, 95% CI 0.40-0.75; p<0.001). Grade 3+ adverse events were similar between groups.\n\nConclusion: SBRT followed by sorafenib showed clinically meaningful improvement in overall survival and statistically significant improvement in progression-free survival for locally advanced HCC. SBRT should be considered as a component of multimodal therapy for HCC.",
    tags: ["HCC", "SBRT", "phase III"],
    readingTimeMin: 18,
    hasFullText: false,
    url: "https://pubmed.ncbi.nlm.nih.gov/example-2/",
    status: "unread",
  },
  {
    id: "leadership-1",
    stream: "leadership",
    title: "The Real Work of Leadership Is Emotional Labor",
    authors: "Marcus Buckingham",
    journal: "First Round Review",
    publishedAt: "Mar 26",
    excerpt:
      "What distinguishes effective leaders isn't strategic vision — it's the willingness to sit with ambiguity and hold space for their team's uncertainty during periods of change.",
    abstract:
      "Leadership development programs focus almost exclusively on strategy, communication, and decision-making. But the leaders who actually retain talent and build high-performing teams distinguish themselves through something far less glamorous: emotional labor. This article examines why the willingness to sit with discomfort, hold space for uncertainty, and regulate your own emotional state under pressure is the single most important leadership skill -- and why most organizations systematically ignore it.",
    fullText:
      "## The Invisible Skill\n\nAsk any departing employee why they are leaving, and you will hear about their manager. Not strategy. Not compensation (usually). Their manager. Specifically: how their manager made them feel during moments of ambiguity, failure, or change.\n\nThis is not news. Gallup has been telling us for two decades that people leave managers, not companies. But what we have failed to articulate is what exactly those good managers are doing differently. It is not that they are better communicators or more strategic thinkers. It is that they are doing emotional labor -- consistently, quietly, often at significant personal cost.\n\n## What Emotional Labor Looks Like\n\nEmotional labor in leadership is the work of managing your own emotional state so that your team can function. It is:\n\n- Staying calm when the board just cut your budget by 30% and your team is looking at you for reassurance\n- Listening to the same complaint for the fourth time because the person needs to feel heard, not fixed\n- Delivering honest feedback that will hurt, without either sugarcoating it into meaninglessness or weaponizing it\n- Holding back your own anxiety about a project deadline so your team has the cognitive space to actually solve the problem\n- Absorbing organizational dysfunction so it does not cascade down to people who cannot change it\n\nNone of this appears on a leadership competency model. None of it is measured in 360-degree reviews. It is invisible work, and it is the work that matters most.\n\n## The Cost of Ignoring It\n\nOrganizations that do not recognize emotional labor as real work create two failure modes:\n\nFirst, they burn out their best leaders. The leaders who naturally do this work -- who absorb stress, who hold space, who regulate -- are spending enormous energy that nobody sees. When they burn out, everyone is surprised. He seemed so calm. She always had it together.\n\nSecond, they promote people who cannot do this work. A brilliant individual contributor who becomes a manager without the capacity for emotional labor will optimize for their own comfort: avoiding difficult conversations, reacting visibly to stress, making decisions to reduce their own anxiety rather than serve their team.\n\n## What Can Be Done\n\nThe first step is recognition: emotional labor is labor. It requires energy, skill, and recovery time. Leaders who do it well need the same support structures we provide for any other demanding work: adequate rest, reasonable scope, and acknowledgment that what they are doing is difficult and valuable.\n\nThe second step is development. Emotional labor is a skill, not a personality trait. It can be learned, practiced, and improved. But it requires different development methods than traditional leadership training. Coaching, therapy, reflective practice, and peer support groups are more effective than case studies and role-plays.\n\nThe third step is measurement. If emotional labor matters -- and the evidence overwhelmingly says it does -- we need to find ways to see it, name it, and value it in how we evaluate leaders.",
    tags: ["emotional intelligence", "management"],
    readingTimeMin: 8,
    hasFullText: true,
    url: "https://review.firstround.com/the-real-work-of-leadership",
    status: "unread",
  },
  {
    id: "lesson-1",
    stream: "lesson",
    title: "Anatomy of a Flow — Triggers, Actions, and Connections",
    publishedAt: "Module 1",
    excerpt:
      "Understand the three building blocks that every Power Automate flow is made of, and learn to read any flow at a glance.",
    abstract:
      "Every Power Automate flow is built from three fundamental components: triggers, actions, and connections. This lesson teaches you to identify each component, understand how they relate to each other, and read any flow diagram at a glance.",
    fullText:
      "## What Is a Flow?\n\nA flow is an automated workflow -- a sequence of steps that runs when something happens. Think of it as a recipe: when this event occurs, do these things in this order. Every flow, from the simplest email notification to the most complex multi-system integration, is built from the same three building blocks.\n\n## Triggers: The Starting Gun\n\nEvery flow starts with exactly one trigger. A trigger is the event that sets the flow in motion. Without a trigger, a flow is just a list of instructions with no reason to run.\n\nCommon triggers include:\n\n- **When an email arrives** -- the flow runs every time a new email hits your inbox (or a specific folder)\n- **When a file is created** -- the flow runs when a new file appears in a SharePoint library or OneDrive folder\n- **When a form is submitted** -- the flow runs when someone completes a Microsoft Form\n- **On a schedule** -- the flow runs at a specific time (daily, weekly, every 15 minutes)\n- **When manually triggered** -- you click a button to run the flow\n\nThe trigger determines two things: when the flow runs, and what data is available to the rest of the flow. An email trigger gives you access to the sender, subject, body, and attachments. A file trigger gives you the file name, path, and content.\n\n## Actions: The Work\n\nActions are the steps that do the actual work. After the trigger fires, the flow executes actions in sequence (and sometimes in parallel). Each action does one thing:\n\n- Send an email\n- Create a file\n- Update a row in a spreadsheet\n- Post a message to Teams\n- Call an API\n- Transform data\n\nActions can use data from the trigger and from previous actions. This is where expressions come in -- but we will cover those in Lesson 3.\n\nA simple flow might have 2-3 actions. A complex integration flow might have 50+. But each individual action is straightforward.\n\n## Connections: The Bridges\n\nConnections are how Power Automate talks to other services. When you add an action that sends an email through Outlook, Power Automate needs permission to access your Outlook account. That permission is stored as a connection.\n\nYou create connections once. After that, any flow can use them. Think of connections as saved credentials -- they let Power Automate act on your behalf in other systems.\n\nCommon connections:\n\n- Microsoft 365 (Outlook, Teams, SharePoint, OneDrive)\n- SQL Server\n- HTTP (for calling any REST API)\n- Custom connectors (for internal systems)\n\n## Reading a Flow\n\nWhen you open any flow in Power Automate, you will see a visual diagram. The trigger is always at the top. Actions flow downward, connected by arrows. Branches (conditions) split the path into two or more routes.\n\nPractice reading flows top-to-bottom: What starts it? What does it do? What services does it connect to? With these three questions, you can understand any flow at a glance.",
    tags: [],
    readingTimeMin: 20,
    hasFullText: true,
    status: "unread",
    module: "Module 1: Foundations",
    lessonNumber: 1,
    totalLessonsInModule: 3,
  },
  {
    id: "pubmed-3",
    stream: "literature",
    title:
      "Large Language Models for Clinical Decision Support in Radiation Oncology: A Multi-Institutional Validation Study",
    authors: "Chen et al.",
    journal: "Nat Med",
    publishedAt: "Mar 25",
    excerpt:
      "A prospective validation of GPT-4-based clinical decision support across five academic medical centers showed concordance with expert tumor board recommendations in 87% of cases.",
    abstract:
      "Background: Large language models (LLMs) have shown promising results in medical knowledge tasks, but their utility in real-world clinical decision support for radiation oncology has not been prospectively validated across multiple institutions.\n\nMethods: We conducted a prospective validation study across five academic medical centers comparing GPT-4-based clinical decision support recommendations with multidisciplinary tumor board decisions for radiation therapy planning. 450 consecutive cases spanning 12 disease sites were evaluated.\n\nResults: Overall concordance between LLM recommendations and tumor board decisions was 87.1% (392/450). Concordance was highest for breast (94.2%) and prostate (92.8%) and lowest for head and neck (78.3%). In discordant cases, an independent expert panel judged the LLM recommendation as clinically reasonable in 71% of cases, suggesting true disagreement rather than error.\n\nConclusion: LLM-based clinical decision support shows high concordance with expert multidisciplinary recommendations across radiation oncology disease sites. These tools may be most valuable in settings without regular tumor board access.",
    tags: ["AI", "clinical decision support", "validation"],
    readingTimeMin: 12,
    hasFullText: false,
    url: "https://pubmed.ncbi.nlm.nih.gov/example-3/",
    status: "completed",
  },
];

// Extended archive data for past sessions
export const MOCK_ARCHIVE_ARTICLES: Article[] = [
  ...MOCK_SESSION_ARTICLES,
  {
    id: "pubmed-4",
    stream: "literature",
    title:
      "Proton Versus Photon Therapy for Esophageal Cancer: Final Results of NRG-GI006",
    authors: "Lin et al.",
    journal: "Int J Radiat Oncol Biol Phys",
    publishedAt: "Mar 22",
    excerpt:
      "Proton beam therapy reduced total toxicity burden by 24% compared with IMRT for locally advanced esophageal cancer without compromising progression-free survival.",
    abstract:
      "This phase IIB randomised trial compared proton beam therapy versus intensity-modulated radiation therapy for locally advanced esophageal cancer. Proton therapy significantly reduced mean total toxicity burden (primary endpoint) by 24.2% while maintaining comparable progression-free survival.",
    tags: ["esophageal", "proton therapy", "phase IIB"],
    readingTimeMin: 14,
    hasFullText: false,
    url: "https://pubmed.ncbi.nlm.nih.gov/example-4/",
    status: "completed",
  },
  {
    id: "leadership-2",
    stream: "leadership",
    title: "The Quiet Strategy of Saying No",
    authors: "Jim Collins",
    journal: "HBR",
    publishedAt: "Mar 21",
    excerpt:
      "The discipline to say no to good opportunities is what separates leaders who achieve sustained excellence from those who remain perpetually busy.",
    abstract:
      "Based on decades of research into companies that made the leap from good to great, this article argues that strategic discipline -- the ability to say no to opportunities that do not align with your hedgehog concept -- is the most undervalued leadership skill. It examines how leaders can build organizational cultures that protect focus.",
    tags: ["strategy", "focus", "discipline"],
    readingTimeMin: 10,
    hasFullText: true,
    url: "https://hbr.org/the-quiet-strategy-of-saying-no",
    status: "completed",
  },
  {
    id: "pubmed-5",
    stream: "literature",
    title:
      "Adaptive Radiation Therapy Using MR-Linac for Pancreatic Cancer: Prospective Multi-Center Feasibility Study",
    authors: "Parikh et al.",
    journal: "Pract Radiat Oncol",
    publishedAt: "Mar 20",
    excerpt:
      "Daily online adaptive radiation therapy using MR-Linac was feasible across eight centers and enabled significant dose escalation to pancreatic tumors while respecting gastrointestinal constraints.",
    abstract:
      "Purpose: To evaluate the feasibility and preliminary outcomes of daily online adaptive radiation therapy using MR-guided linear accelerators for locally advanced pancreatic cancer across multiple institutions.\n\nResults: 127 patients were treated across 8 centers. Adaptive replanning was performed for 89% of fractions. Median BED10 to the GTV was 85 Gy (range 70-100 Gy). All GI dose constraints were met in 96% of fractions. Grade 3+ GI toxicity was 8.7%. One-year local control was 88%.",
    tags: ["pancreatic", "adaptive RT", "MR-Linac"],
    readingTimeMin: 11,
    hasFullText: true,
    url: "https://pubmed.ncbi.nlm.nih.gov/example-5/",
    status: "completed",
  },
  {
    id: "lesson-2",
    stream: "lesson",
    title: "Your First Flow — Email Notification on File Upload",
    publishedAt: "Module 1",
    excerpt:
      "Build a complete flow from scratch: when a file is added to a SharePoint folder, send a notification email with the file details.",
    tags: [],
    readingTimeMin: 25,
    hasFullText: true,
    status: "completed",
    module: "Module 1: Foundations",
    lessonNumber: 2,
    totalLessonsInModule: 3,
  },
  {
    id: "pubmed-6",
    stream: "literature",
    title:
      "Ultra-Hypofractionated Radiotherapy for Localized Prostate Cancer: 10-Year Results of the HYPO-RT-PC Trial",
    authors: "Widmark et al.",
    journal: "Lancet Oncol",
    publishedAt: "Mar 18",
    excerpt:
      "Ten-year follow-up confirms that ultra-hypofractionated radiotherapy (42.7 Gy in 7 fractions) is non-inferior to conventional fractionation for intermediate-to-high risk prostate cancer.",
    abstract:
      "The HYPO-RT-PC trial randomized 1200 men with intermediate-to-high risk prostate cancer to ultra-hypofractionated RT (42.7 Gy in 7 fractions over 2.5 weeks) or conventionally fractionated RT (78 Gy in 39 fractions over 8 weeks). Ten-year failure-free survival was 72.4% vs 71.8% (HR 0.98, 95% CI 0.80-1.20), confirming non-inferiority. Late grade 2+ GU toxicity was similar between arms.",
    tags: ["prostate", "hypofractionation", "phase III"],
    readingTimeMin: 13,
    hasFullText: false,
    url: "https://pubmed.ncbi.nlm.nih.gov/example-6/",
    status: "completed",
  },
  {
    id: "leadership-3",
    stream: "leadership",
    title: "Building a Culture of Psychological Safety in High-Stakes Environments",
    authors: "Amy Edmondson",
    journal: "MIT Sloan Management Review",
    publishedAt: "Mar 16",
    excerpt:
      "In healthcare and other high-stakes settings, psychological safety is not a nice-to-have -- it is the foundation on which patient safety, learning, and innovation depend.",
    abstract:
      "Drawing on two decades of research across hospitals, airlines, and technology companies, this article presents a practical framework for building psychological safety in environments where the cost of mistakes is high. Paradoxically, these are precisely the environments where people are most afraid to speak up.",
    tags: ["psychological safety", "healthcare culture"],
    readingTimeMin: 9,
    hasFullText: true,
    url: "https://sloanreview.mit.edu/psychological-safety-high-stakes",
    status: "completed",
  },
];

// Saved articles subset
export const MOCK_SAVED_ARTICLES: Article[] = [
  {
    ...MOCK_SESSION_ARTICLES[0],
    status: "saved",
    savedAt: "Mar 28",
  },
  {
    ...MOCK_ARCHIVE_ARTICLES[7],
    id: "pubmed-5-saved",
    status: "saved",
    savedAt: "Mar 21",
  },
  {
    ...MOCK_ARCHIVE_ARTICLES[10],
    id: "leadership-3-saved",
    status: "saved",
    savedAt: "Mar 17",
  },
];

// Helper to find an article by ID across all mock data
export function findArticleById(id: string): Article | undefined {
  return (
    MOCK_SESSION_ARTICLES.find((a) => a.id === id) ??
    MOCK_ARCHIVE_ARTICLES.find((a) => a.id === id)
  );
}

// Helper to get the next article in the session
export function getNextArticleId(currentId: string): string | null {
  const idx = MOCK_SESSION_ARTICLES.findIndex((a) => a.id === currentId);
  if (idx === -1 || idx === MOCK_SESSION_ARTICLES.length - 1) return null;
  return MOCK_SESSION_ARTICLES[idx + 1].id;
}
