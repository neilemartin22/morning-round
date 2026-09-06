# Personas, placeholder standards, and the classification rule sheet

## 1. Why personas at all

A persona standardizes demand so that "next available date" means the same thing
across sites and days. Each persona must exercise a distinct combination of urgency
tier, consult pool, sim type, planning tier, and machine class. Two personas in the
same five cells add survey burden and no information.

## 2. The eight personas

The standards below are placeholders written to make the table concrete. Section
chiefs replace them before day one, and this column is then deleted so nobody quotes
it later. "bd" is business days. Intervals are measured from the previous milestone
unless stated. "End-to-end" is first contact to first fraction unless stated.

| ID | Persona | Urgency | Consult pool | Sim type | Planning tier | Machine class | Placeholder standards |
|---|---|---|---|---|---|---|---|
| P1 | Painful T-spine met, no cord compression, ambulatory, 8 Gy x 1 or 20 Gy x 5 | urgent | palliative_any | standard_ct | simple | any_linac | consult 2 bd; sim same day as consult; plan same day; first fraction within 5 bd of contact |
| P2 | FIGO IIB cervix, definitive chemoRT with HDR brachytherapy, med onc and GYN onc involved | routine, coordination-heavy | GYN | standard_ct (with brachy slots booked at planning) | standard EBRT plus brachy | any_linac plus brachy suite | consult 7 bd; sim 7 bd; plan 5 bd; start 5 bd; brachy slots confirmed before EBRT starts; total package time set by the GYN section |
| P3 | Favorable intermediate-risk prostate, 20 fx moderate hypofractionation, no spacer | routine | GU | standard_ct | standard | any_linac | consult 10 bd; sim 10 bd; plan 5 bd; start 5 bd; end-to-end 4 to 6 weeks |
| P4 | Post-lumpectomy early-stage breast, left side, whole breast 15 to 16 fx, breath-hold, no chemo | routine, surgery-clocked | breast | standard_ct (breath-hold) | standard | any_linac | consult 10 bd; sim 5 bd; plan 5 bd; start 5 bd; **clock from surgery**: start within the breast section's post-surgery window |
| P5 | Locally advanced HPV-positive oropharynx, definitive chemoRT 35 fx, dental clearance needed | routine, outcome-sensitive | head_neck | mask_contrast (PET fusion) | complex | any_linac | consult 5 bd; sim within 10 bd of decision to treat; plan 7 bd; start 3 bd; **clock from diagnosis**: diagnosis-to-start target set by the H&N section (dental extractions alone add roughly two weeks of healing) |
| P6 | Peripheral stage I NSCLC, medically inoperable, SBRT 3 to 5 fx | routine | thoracic | four_d_ct | complex | sbrt_capable | consult 10 bd; sim 5 bd; plan 7 bd; start 5 bd; end-to-end 4 to 5 weeks |
| P7 | Three brain mets, largest 2 cm, good performance status, SRS | semi_urgent | CNS | mask_mri | complex | srs_platform | consult 3 bd; MRI acquisition is a radiology constraint and is recorded separately; sim 3 bd after MRI; plan 5 bd; start 2 bd |
| P8 | Recurrent head and neck in a previously irradiated field, re-irradiation with dose summation and proton evaluation | routine, specialized | head_neck (re-RT) | mask_contrast | complex with dose summation | proton or any_linac | consult 10 bd; proton evaluation decision 10 bd; then as P5 |

P8 is fixed department-wide so the answer is comparable across sites. Most sites will
answer "not offered here" for the proton step. That is the routing data. If the proton
center is out of scope, substitute one fixed alternative for the whole department:
pediatric case needing anesthesia, or MR-linac adaptive case.

Why P2 is cervix and not a second bone met: a semi-urgent hip met hits the same
consult pool, sim type, planning tier, and machine class as P1 and differs only in
urgency. Cervix instead tests multidisciplinary sequencing and a second scheduled
resource (the brachy suite), which is where academic centers actually lose time.

Excluded on purpose: cord compression, SVC syndrome, airway compromise, bleeding.
Emergencies bypass standard scheduling and contaminate the routine signal. Count
them separately with a door-to-beam time if wanted.

## 3. Consolidation into slot types (what each respondent is actually asked)

Each respondent answers once per slot type for their stage. Persona IDs are shown so
the analysis can map back.

Consult (scheduler lead), third-next-available slot:
- palliative_any (P1)
- GYN (P2)
- GU (P3)
- breast (P4)
- head_neck (P5, P8)
- thoracic (P6)
- CNS (P7)

Sites without a physician in a pool answer "not offered here", which is itself data.
Sites with many pools may merge to match their physician mix, with the merge recorded.

Simulation (sim lead), first available:
- standard_ct (P1, P2, P3, P4)
- four_d_ct (P6)
- mask_contrast (P5, P8)
- mask_mri (P7)

Planning (chief dosimetrist), date an approved plan would be ready, plus queue depth:
- simple (P1)
- standard (P2, P3, P4)
- complex (P5, P6, P7, P8)

Machine (chief therapist), first date a new course could start:
- any_linac (P1 to P5)
- sbrt_capable (P6)
- srs_platform (P7)
- brachy_suite (P2), answered by whoever owns the brachy schedule
- proton (P8), answered only at the proton center

Roughly 16 to 18 dates per site per collection day across four people. Ten to fifteen
minutes each.

## 4. Rule sheet for classifying real patients (Layer 2 tracer log)

At consult, the physician or coordinator assigns one class. Take the first rule that
matches; otherwise "other".

1. Emergency (cord compression, SVC, bleeding, airway): do not enter in the tracer log; count separately.
2. Painful bone or spine met, ambulatory, palliative intent: P1.
3. Cervix, definitive, with brachytherapy planned: P2.
4. Prostate, definitive external beam, no nodes, no spacer or fiducial delaying sim: P3.
5. Breast after lumpectomy, whole or partial breast, no regional nodes, no chemo before RT: P4.
6. Head and neck, definitive, mask sim, first course: P5.
7. Lung, SBRT, 3 to 5 fractions: P6.
8. Brain metastases, SRS, 1 to 5 fractions: P7.
9. Re-irradiation in a previously treated field with dose summation: P8.
10. Anything else: other.

The rule sheet is frozen on day one. If a rule changes, note the date and analyze
before and after separately.
