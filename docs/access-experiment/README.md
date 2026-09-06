# Measuring access and finding the bottleneck: Radiation Oncology, all sites

Status: draft recommendation for discussion. Written 2026-09-06.

"Radiation Ecology" in the brief is read as Radiation Oncology. Nothing below assumes
any existing report, extract, or dashboard. Every number the experiment uses is
collected by the experiment itself.

## 1. The short version

The persona idea is sound. Keep it. Four changes make it answer the actual questions.

1. **Ask for a date, not a yes/no.** "Could you book this today?" collapses the one
   thing you want, the wait, into a bit. Ask each leader for the earliest date the
   persona could get a consult, a sim, an approved plan, or a first fraction under
   standard process. Wait in business days becomes the measurement; yes/no falls out
   of it by comparing to the standard.
2. **Measure what did happen, not only what could.** Self-reported "could" is a
   capacity signal. It cannot tell you whether patients are flowing. Run a tracer log
   of real new patients with five milestone dates, and start it two weeks before the
   persona survey so you have a baseline the survey has not yet disturbed.
3. **Find the bottleneck from real intervals, not from survey miss-rates.** A stage
   that misses its standard because the stage before it was late is not the
   constraint. The bottleneck is the stage that adds the most wait of its own, on real
   patients, once patient-driven and outside-driven delays are set aside.
4. **Measure leakage from the referrer's side.** "Never lose a patient to turnaround"
   is not observable from inside the scheduling office, because referring practices
   rarely say the patient went elsewhere. Log what was offered, and ask the top
   referrers directly.

Do these plus a one-time capacity census, for eight weeks, at every site. The persona
survey is the prototype of the permanent instrument: the questions that survive eight
weeks become the spec for the automated report eventually built from the scheduling
system.

## 2. What "access" and "bottleneck" have to mean

Access for one patient is end-to-end lead time, first contact to first fraction, along
a fixed chain:

```
referral/first contact -> consult -> decision to treat -> simulation
   -> contour/plan/QA/approve -> first fraction
```

Each stage is a slot, a queue, or a slot series, and each needs a different question:

| Stage | Type | Right question |
|---|---|---|
| Consult | Slot, physician-specific | Third next available new-patient slot for this disease site and urgency |
| Simulation | Slot, type-specific | First available sim slot of this type |
| Planning | Queue | Plans waiting, and the date an approved plan would be ready for a case handed over today |
| Machine | Slot series, class-specific | First date a new course of this class could start on a capable machine |

Third-next-available is the standard ambulatory access measure for pooled consult
templates because first-available is polluted by cancellations. It does not apply to
sim, planning, or machines, which are not pooled panels.

The bottleneck moves: by day of week, by site, by season, and it can hide (a full
machine makes sim slack irrelevant). It has to be measured repeatedly, per site and
per stage, and reported as a distribution, not an average.

One political point decided in advance: results are reported as **where work waits**,
never as who is slow. A chief dosimetrist whose queue is the constraint is the person
you most need on side.

## 3. Personas

Eight is the right cap. The design rule: each persona exercises a distinct combination
of urgency tier, consult pool, sim type, planning tier, and machine class. Two
personas in the same five cells add burden and no information. Full definitions,
placeholder standards, and the rule sheet for classifying real patients are in
`personas.md`. In brief:

| # | Persona | What it tests |
|---|---|---|
| P1 | Painful spine met, no cord compression, palliative | Urgent pathway: protected slots, same-day consult-and-sim, simple plan |
| P2 | Definitive cervix, chemoRT plus brachytherapy | Multidisciplinary coordination and a brachy resource with its own schedule |
| P3 | Favorable intermediate-risk prostate, hypofractionated | The high-volume routine case; GU consult pool |
| P4 | Post-lumpectomy breast, left, breath-hold | Surgery-clocked start; breast pool; the largest volume |
| P5 | Locally advanced oropharynx, definitive chemoRT | Complex planning, dental clearance, PET, outcome-sensitive package time |
| P6 | Stage I NSCLC, SBRT | 4D sim, physics QA, SBRT-capable machine |
| P7 | Three brain mets, SRS | MRI lead time from radiology, SRS platform |
| P8 | Re-irradiation needing dose summation and proton evaluation | Cross-site routing to a specialized resource; fixed department-wide, not per site |

Excluded on purpose: true emergencies (cord compression, SVC, airway, bleeding). They
bypass standard scheduling and contaminate the routine signal. Count them separately
with a door-to-beam time if the department wants to.

Standards in `personas.md` are placeholders. Section chiefs replace them before day
one, and the placeholder column is deleted at that point so nobody quotes it later.

## 4. Recommended design: five layers, ten weeks

Timeline: Layers 0, 2, and 3 start in week 1. Layer 1 starts in week 3. Layer 4 runs
in weeks 4 to 10. Weeks 1 and 2 of the tracer log are the pre-survey baseline.

### Layer 0. One-time structural census (week 1)

Without this you cannot tell a structural shortage from a template problem. One page
per site (`schemas/capacity_census.md`), filled once by the site manager. The
non-obvious line is consult: for each physician, new-patient slots **offered** per
week versus slots actually **bookable** after blocks for research, admin, and
second-site coverage. In an academic department consult wait is usually template
policy, not scheduler capacity, and the census makes that visible. Agree with section
chiefs beforehand that physician-level numbers are shown blinded in the first
read-out.

Also run one two-hour pathway-mapping session per site with the scheduler, sim lead,
chief dosimetrist, chief therapist, and one physician. Draw the actual chain including
handoffs and the places work waits. This tells you where the sensors go and usually
surfaces two or three fixes that need no data at all.

### Layer 1. Persona sensing (the original proposal, modified)

Who answers: one person per stage per site. Scheduler lead, sim lead, chief
dosimetrist, chief therapist. Each answers only for their stage.

What they answer, per slot type (`schemas/persona_daily.csv`):

- "If this patient were handed to you today, what is the earliest date under standard
  process?" A date. Consult uses third-next-available; the others use first.
- "Is that under standard process?" No means it needs an overbook, a favor, or staff
  staying late. This field is the point; it has to be safe to answer no.
- If past the standard, one reason code from a fixed list.
- Planning additionally reports queue depth, one number.

Personas are consolidated into slot types so nobody answers the same question eight
times: about 16 dates per site per day across four people. Realistic time is ten to
fifteen minutes per person, not five, because the therapist scans several machine
templates and the dosimetrist has no queue tool.

Cadence: every business day for weeks 3 and 4 to capture day-of-week structure, then
Monday, Wednesday, Friday for weeks 5 to 10. If completion drops below 80 percent in
any week, stop, find out why, and revise before continuing. A survey that decays
silently produces a biased series that looks like a trend.

Expect a Hawthorne effect: leaders will hold slots for the personas and fix things as
they answer. That is why Layer 2 starts first, and why weeks 1 and 2 of Layer 2 are
reported separately as the baseline for any hiring or capital case.

### Layer 2. Tracer log of real patients (weeks 1 to 10)

Every new patient at every site, or every Nth if volume forces it, gets one row
(`schemas/tracer_log.csv`) kept by the site's new-patient coordinator: persona class,
the five milestone dates, a status, and for any interval past standard a reason code
and a **delay owner**: patient, outside input, or internal. The owner field is what
lets you separate a second-opinion delay or a dental extraction from a handoff that
sat in someone's in-basket.

This is the single most valuable layer. It costs one coordinator around ten minutes a
day and produces the actual lead-time distribution, per site and per stage, that
nobody currently has.

### Layer 3. Referral intake log and referrer check (weeks 1 to 10)

At first contact, whoever takes referrals records the source, urgency, the **first
consult date actually offered**, the accepted date, and a disposition
(`schemas/referral_intake.csv`). The first-offered date is the honest version of the
consult persona question: what a real patient was really offered.

The disposition code "declined due to wait" will undercount, because referring offices
rarely say so. Treat it as a floor, not the metric. Two additions get closer to the
truth:

- In week 8, a fifteen-minute call or short survey to the top ten to fifteen referring
  practices per site: how long do your patients wait, have you sent anyone elsewhere
  in the last three months because of wait, and what would make you stop.
- An audit of patients scheduled but cancelled before consult, with the reason as
  recorded.

### Layer 4. Validation calls (weeks 4 to 10, internal only)

Every two weeks, someone outside the scheduling team calls each site's new-patient
line as a referring office with personas P3 and P4, asks for the first available
consult, and declines. Nothing enters the EHR. Site leaders are told in advance that
these calls happen during the study; the front desk is not told which day. If the
shopped wait matches the Layer 1 self-report, trust Layer 1 for consults. If not, the
gap is a finding.

Calling competing centers is not recommended. It is a legal and reputational question
that belongs with legal and communications, not in an operations experiment.

## 5. How the bottleneck is actually identified

From Layer 2, for each real patient, compute the stage intervals: referral to consult,
consult to sim, sim to plan approval, plan approval to first fraction. For each site
and stage:

1. Drop intervals whose delay owner is patient or outside input. What remains is the
   department's own wait.
2. Compute the median and 90th percentile of the remaining intervals and the fraction
   past the standard. Weight by the number of real patients passing through.
3. The stage with the largest excess over standard, on the most patients, is the
   bottleneck candidate for that site.
4. Confirm with Layer 1: the candidate stage should also show out-of-standard
   next-available dates with reason codes "no slot", "physician unavailable", or
   "staffing". If Layer 1 says the stage has slack but Layer 2 says patients wait
   there, the constraint is coordination, and the fix is a rule or a navigator, not a
   hire.
5. Report network access as well: for each persona, the best next-available across
   all sites each day. If the network is fine and single sites are not, the problem
   is routing and willingness to travel.

Pre-committed responses by bottleneck type, agreed before data arrives:

| If the bottleneck is | Likely lever | What the data must show first |
|---|---|---|
| Consult | Template redesign, protected urgent slots, APP-led palliative consults, cross-site routing | Layer 2 referral-to-consult excess; Layer 0 offered-versus-bookable gap; reason "physician unavailable" or "no slot" |
| Sim | Extended sim hours, same-day consult-and-sim for palliative, second sim shift | Consult-to-sim excess with "no slot", and machine slack downstream |
| Planning | Redistribute dosimetry across sites, centralized planning pool, palliative fast-track | Sim-to-approval excess, rising queue depth, reason "staffing" |
| Machine | Shift starts to a sister site, extend hours, fractionation policy, capital request | Approval-to-start excess with "no slot" and high on-treatment census |
| Coordination | Navigator role, one owner per patient through sim, scheduling rules | Layer 1 in standard while Layer 2 internal-owner intervals are not |
| Leakage | Same-day callback guarantee, first-offered-date target | First-offered dates past standard; referrer check reports patients sent elsewhere |

## 6. What the original design gets wrong if left as is

- Yes/no cannot rank sites, show trends, or give a 90th percentile.
- Self-report drifts optimistic, and daily attention improves the thing being
  measured. Layers 2 and 4 catch both.
- Summing next-available waits across stages overstates lead time, because the sim
  clock cannot start before consult. Stage waits are reported separately; the tracer
  log gives the true end-to-end number.
- Consult availability is physician-specific and machine capacity is class-specific,
  so every persona names a disease site and a machine class.
- Eight personas times four stages times every site, daily for two months, will not
  survive week three. Slot-type consolidation and the step-down cadence are what make
  it survivable.
- With no decision rule written in advance, the result gets debated rather than acted on.

## 7. Mechanics

- One form per layer. REDCap is preferred for scheduled daily reminders and for the
  tracer log; Microsoft Forms works. The `schemas/` files are laid out to be pasted
  into a form builder.
- Each site names one owner who checks completeness every Friday.
- Analysis weekly in R with `analysis/analyze_access.R`: run charts by site, stage,
  and persona; out-of-standard tables; could-versus-did comparison; network-wide
  best-available. Control limits only after four weeks of data.
- Standards, persona definitions, and reason codes are frozen on day one and changed
  only with a dated note. Before-and-after are analyzed separately.
- After week 10, a one-week review. If Layer 1 is stable and agrees with Layer 2, drop
  it to weekly and keep Layers 2 and 3 running until the automated version replaces
  them.

## 8. What is in this folder

```
docs/access-experiment/
  README.md                       this memo
  personas.md                     persona definitions, placeholder standards, classification rule sheet
  schemas/persona_daily.csv       Layer 1 form fields
  schemas/tracer_log.csv          Layer 2 form fields
  schemas/referral_intake.csv     Layer 3 form fields
  schemas/capacity_census.md      Layer 0 one-page census
  analysis/analyze_access.R       weekly analysis script
  analysis/make_sample_data.py    generates random CSVs so the script can be tested before real data exists
  analysis/sample_data/           output of that generator
```

The synthetic data is random. It encodes no belief about the department and must not
be shown as if it did. The R script was written without an R runtime available and
should be run once against the sample data before being trusted.
