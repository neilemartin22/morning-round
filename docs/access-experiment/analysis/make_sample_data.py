#!/usr/bin/env python3
"""Generate random CSVs matching the three data schemas so analyze_access.R can be
tested before any real data exists.

The output is random. It encodes no belief about the department and must never be
shown as if it did. Run: python3 make_sample_data.py  (writes into sample_data/)
"""
import csv, random, datetime as dt, os, pathlib

random.seed(20260906)
OUT = pathlib.Path(__file__).parent / "sample_data"
OUT.mkdir(exist_ok=True)

SITES = ["MAIN", "NORTH", "WEST", "SOUTH"]
START = dt.date(2026, 10, 5)            # a Monday; Layer 2 and 3 start here
SURVEY_START = START + dt.timedelta(days=14)   # Layer 1 starts week 3
END = START + dt.timedelta(days=70)     # ten weeks

def bdays(d0, n):
    """Add n business days to date d0."""
    d = d0
    step = 1 if n >= 0 else -1
    while n != 0:
        d += dt.timedelta(days=step)
        if d.weekday() < 5:
            n -= step
    return d

def business_days_between(a, b):
    return sum(1 for i in range((b - a).days) if (a + dt.timedelta(days=i + 1)).weekday() < 5)

def each_business_day(a, b):
    d = a
    while d <= b:
        if d.weekday() < 5:
            yield d
        d += dt.timedelta(days=1)

STANDARDS = {}
with open(pathlib.Path(__file__).parent / "standards.csv") as f:
    for r in csv.DictReader(f):
        STANDARDS[r["persona_id"]] = r

SLOT_TYPES = {
    "consult": ["palliative_any", "GYN", "GU", "breast", "head_neck", "thoracic", "CNS"],
    "sim": ["standard_ct", "four_d_ct", "mask_contrast", "mask_mri"],
    "planning": ["simple", "standard", "complex"],
    "machine": ["any_linac", "sbrt_capable", "srs_platform", "brachy_suite", "proton"],
}
ROLE = {"consult": "scheduler_lead", "sim": "sim_lead", "planning": "chief_dosimetrist", "machine": "chief_therapist"}
REASONS = ["no_slot", "physician_unavailable", "staffing", "equipment_down", "waiting_upstream", "waiting_outside_input", "other"]

def personas_for(stage, slot):
    key = {"consult": "slot_consult", "sim": "slot_sim", "planning": "slot_planning", "machine": "slot_machine"}[stage]
    return [p for p, r in STANDARDS.items() if r[key] == slot]

# Per-site random "typical wait" multipliers so sites differ; purely random.
site_factor = {s: random.uniform(0.6, 1.8) for s in SITES}
stage_factor = {st: random.uniform(0.7, 1.6) for st in SLOT_TYPES}

# ---------- Layer 1: persona_daily ----------
rows = []
for d in each_business_day(SURVEY_START, END):
    week = (d - SURVEY_START).days // 7
    collect = week < 2 or d.weekday() in (0, 2, 4)   # daily for 2 weeks, then M/W/F
    if not collect:
        continue
    for site in SITES:
        for stage, slots in SLOT_TYPES.items():
            for slot in slots:
                if slot == "proton" and site != "MAIN":
                    continue
                if slot in ("CNS", "brachy_suite", "srs_platform") and site == "SOUTH":
                    continue  # not offered there
                if random.random() < 0.08:
                    continue  # missing response
                ps = personas_for(stage, slot)
                std_key = {"consult": "std_consult_bd", "sim": "std_sim_bd", "planning": "std_plan_bd", "machine": "std_start_bd"}[stage]
                std = min(int(STANDARDS[p][std_key]) for p in ps) if ps else 5
                mean_wait = max(0.5, std * site_factor[site] * stage_factor[stage] * random.uniform(0.5, 1.3))
                wait = max(0, int(random.gauss(mean_wait, mean_wait * 0.4)))
                over = wait > std
                rows.append({
                    "response_date": d.isoformat(), "site": site, "stage": stage,
                    "respondent_role": ROLE[stage], "slot_type": slot, "persona_ids": ";".join(ps),
                    "next_available_date": bdays(d, wait).isoformat(),
                    "under_standard_process": "no" if (over and random.random() < 0.5) else "yes",
                    "reason_code": random.choice(REASONS) if over else "",
                    "queue_depth": random.randint(3, 30) if stage == "planning" else "",
                    "comment": "",
                })
with open(OUT / "persona_daily.csv", "w", newline="") as f:
    w = csv.DictWriter(f, fieldnames=list(rows[0].keys())); w.writeheader(); w.writerows(rows)

# ---------- Layer 2: tracer_log ----------
DISEASE = {"P1": "palliative", "P2": "GYN", "P3": "GU", "P4": "breast", "P5": "head_neck", "P6": "thoracic", "P7": "CNS", "P8": "head_neck"}
URG = {"P1": "urgent", "P7": "semi_urgent"}
rows = []
n = 0
for site in SITES:
    for d in each_business_day(START, END):
        for _ in range(random.choice([0, 1, 1, 2, 2, 3])):
            n += 1
            pc = random.choices(list(STANDARDS) + ["other"], weights=[3, 1, 4, 5, 2, 2, 2, 1, 8])[0]
            s = STANDARDS.get(pc, STANDARDS["P3"])
            stds = [int(s["std_consult_bd"]), int(s["std_sim_bd"]), int(s["std_plan_bd"]), int(s["std_start_bd"])]
            f = site_factor[site]
            waits = [max(0, int(random.gauss(max(0.5, x * f * random.uniform(0.6, 1.4)), 1.5))) for x in stds]
            consult = bdays(d, waits[0]); sim = bdays(consult, waits[1]); plan = bdays(sim, waits[2]); start = bdays(plan, waits[3])
            excess = [w - x for w, x in zip(waits, stds)]
            worst = max(range(4), key=lambda i: excess[i])
            delayed = excess[worst] > 0
            status = "treated" if start <= END else "in_pathway"
            if random.random() < 0.05:
                status = random.choice(["not_treated_medical", "not_treated_patient_choice", "transferred_other_site"])
            rows.append({
                "site": site, "patient_key": f"T{n:04d}", "persona_class": pc,
                "disease_site": DISEASE.get(pc, random.choice(["GI", "heme", "other"])),
                "urgency_tier": URG.get(pc, "routine"),
                "referral_date": d.isoformat(),
                "consult_date": consult.isoformat() if consult <= END else "",
                "decision_date": consult.isoformat() if consult <= END else "",
                "sim_date": sim.isoformat() if sim <= END and status not in ("not_treated_medical", "not_treated_patient_choice") else "",
                "plan_approved_date": plan.isoformat() if plan <= END and status == "treated" else "",
                "first_fraction_date": start.isoformat() if status == "treated" else "",
                "status": status,
                "delay_stage": ["referral_to_consult", "consult_to_sim", "sim_to_plan", "plan_to_start"][worst] if delayed else "",
                "delay_owner": random.choices(["internal", "patient", "outside_input"], weights=[5, 2, 3])[0] if delayed else "",
                "delay_reason_code": random.choice(REASONS + ["patient_choice", "medical"]) if delayed else "",
                "notes": "",
            })
with open(OUT / "tracer_log.csv", "w", newline="") as f:
    w = csv.DictWriter(f, fieldnames=list(rows[0].keys())); w.writeheader(); w.writerows(rows)

# ---------- Layer 3: referral_intake ----------
rows = []
for site in SITES:
    for d in each_business_day(START, END):
        for _ in range(random.choice([1, 2, 2, 3, 4])):
            urg = random.choices(["emergency", "urgent", "routine"], weights=[1, 3, 12])[0]
            offered_wait = max(0, int(random.gauss(2 if urg != "routine" else 8 * site_factor[site], 3)))
            disp = random.choices(
                ["scheduled", "declined_wait", "declined_location", "declined_preference", "redirected_other_site", "lost_to_follow_up", "pending"],
                weights=[80, 2 if offered_wait > 10 else 0.3, 3, 3, 4, 3, 4])[0]
            offered = bdays(d, offered_wait)
            rows.append({
                "site": site, "contact_date": d.isoformat(),
                "contact_channel": random.choice(["phone", "fax", "e_referral", "in_basket"]),
                "source": random.choice(["internal_mgb", "external_physician", "self_referral", "inpatient"]),
                "disease_site": random.choice(["GU", "breast", "thoracic", "head_neck", "CNS", "GI", "GYN", "palliative", "other"]),
                "urgency_flag": urg,
                "first_offered_consult_date": offered.isoformat(),
                "accepted_consult_date": bdays(offered, random.choice([0, 0, 0, 2, 5])).isoformat() if disp == "scheduled" else "",
                "disposition": disp,
                "callback_business_days": random.choice(["", "", "0", "1", "2"]),
                "notes": "",
            })
with open(OUT / "referral_intake.csv", "w", newline="") as f:
    w = csv.DictWriter(f, fieldnames=list(rows[0].keys())); w.writeheader(); w.writerows(rows)

print("wrote", [p.name for p in OUT.iterdir()])
