# analyze_access.R
# Weekly analysis for the access experiment. Reads the three CSV exports whose columns
# match ../schemas/*.csv, plus standards.csv, and writes tables and plots to an output
# folder.
#
# Usage from a terminal:
#   Rscript analyze_access.R                       # uses sample_data/ and writes to output/
#   Rscript analyze_access.R path/to/data path/to/output
#
# Requires: dplyr, tidyr, readr, ggplot2. Install once with
#   install.packages(c("dplyr", "tidyr", "readr", "ggplot2"))
#
# Written without an R runtime available. Run it once against sample_data/ before
# trusting it on real data.

suppressPackageStartupMessages({
  library(dplyr); library(tidyr); library(readr); library(ggplot2)
})
`%||%` <- function(a, b) if (is.null(a) || length(a) == 0) b else a

args <- commandArgs(trailingOnly = TRUE)
script_dir <- tryCatch({
  f <- grep("^--file=", commandArgs(), value = TRUE)
  if (length(f)) dirname(sub("^--file=", "", f[1])) else "."
}, error = function(e) ".")
data_dir <- if (length(args) >= 1) args[1] else file.path(script_dir, "sample_data")
out_dir  <- if (length(args) >= 2) args[2] else file.path(script_dir, "output")
dir.create(out_dir, showWarnings = FALSE, recursive = TRUE)

# Colors: MGB primary and secondary palette (user preference). Site identity is also
# carried by facet labels and direct labels, so nothing depends on color alone.
brand <- c("#01828E", "#003A96", "#CF7F00", "#5C068C", "#0077C8", "#CE0037")
ink <- "#000000"; muted <- "#808080"; pale <- "#B1E4E3"
theme_set(theme_minimal(base_size = 12) +
  theme(panel.grid.minor = element_blank(),
        panel.grid.major = element_line(color = "#E6E6E6"),
        strip.text = element_text(face = "bold", color = ink),
        plot.title.position = "plot",
        plot.background = element_rect(fill = "white", color = NA)))

# ---------- helpers ----------
# Business days in the interval (a, b]. Negative if b < a.
bdays_between <- function(a, b) {
  mapply(function(x, y) {
    if (is.na(x) || is.na(y)) return(NA_real_)
    if (y < x) return(-bdays_between(y, x))
    if (y == x) return(0)
    d <- seq(x + 1, y, by = "day")
    sum(!(format(d, "%u") %in% c("6", "7")))
  }, a, b)
}
read_csv_q <- function(f) read_csv(f, show_col_types = FALSE, guess_max = 10000)
week_of <- function(d, origin) as.integer(floor(as.numeric(d - origin) / 7)) + 1

# ---------- inputs ----------
standards <- read_csv_q(file.path(script_dir, "standards.csv"))
persona   <- read_csv_q(file.path(data_dir, "persona_daily.csv")) %>%
  mutate(across(c(response_date, next_available_date), as.Date))
tracer    <- read_csv_q(file.path(data_dir, "tracer_log.csv")) %>%
  mutate(across(ends_with("_date"), as.Date))
intake    <- read_csv_q(file.path(data_dir, "referral_intake.csv")) %>%
  mutate(across(ends_with("_date"), as.Date))

study_start  <- min(c(tracer$referral_date, intake$contact_date), na.rm = TRUE)
survey_start <- min(persona$response_date, na.rm = TRUE)
cat("Study start:", format(study_start), " Survey start:", format(survey_start), "\n")

# Standard per (stage, slot_type): the strictest of the personas mapped to that slot.
std_long <- standards %>%
  pivot_longer(starts_with("slot_"), names_to = "stage", values_to = "slot_type",
               names_prefix = "slot_") %>%
  mutate(standard_bd = case_when(
    stage == "consult"  ~ std_consult_bd,
    stage == "sim"      ~ std_sim_bd,
    stage == "planning" ~ std_plan_bd,
    stage == "machine"  ~ std_start_bd)) %>%
  select(persona_id, stage, slot_type, standard_bd)
std_slot <- std_long %>% group_by(stage, slot_type) %>%
  summarise(standard_bd = min(standard_bd), .groups = "drop")
# brachy_suite has no persona row of its own; treat it like P2's machine standard.
std_slot <- bind_rows(std_slot,
  tibble(stage = "machine", slot_type = "brachy_suite",
         standard_bd = standards$std_start_bd[standards$persona_id == "P2"]))

stage_order <- c("consult", "sim", "planning", "machine")

# ---------- Layer 1: persona sensing ----------
p1 <- persona %>%
  mutate(wait_bd = bdays_between(response_date, next_available_date),
         stage = factor(stage, stage_order)) %>%
  left_join(std_slot, by = c("stage", "slot_type")) %>%
  mutate(excess_bd = wait_bd - standard_bd,
         over = excess_bd > 0 | under_standard_process == "no",
         week = week_of(response_date, survey_start))

l1_summary <- p1 %>%
  group_by(site, stage, slot_type) %>%
  summarise(n_days = n(), median_wait = median(wait_bd, na.rm = TRUE),
            p90_wait = quantile(wait_bd, 0.9, na.rm = TRUE),
            standard_bd = first(standard_bd),
            frac_over = mean(over, na.rm = TRUE),
            top_reason = names(which.max(table(reason_code[over & !is.na(reason_code)])))[1] %||% NA,
            .groups = "drop") %>% arrange(site, stage, desc(frac_over))
write_csv(l1_summary, file.path(out_dir, "L1_out_of_standard_by_site_stage_slot.csv"))

# Completion rate per site per week, the kill-switch number.
expected_per_day <- p1 %>% distinct(site, stage, slot_type) %>% count(site, name = "expected")
l1_completion <- p1 %>% count(site, week, response_date) %>%
  group_by(site, week) %>% summarise(days = n(), answered = sum(n), .groups = "drop") %>%
  left_join(expected_per_day, by = "site") %>%
  mutate(completion = answered / (days * expected))
write_csv(l1_completion, file.path(out_dir, "L1_completion_by_site_week.csv"))

# Run chart: wait in business days, one line per slot type, faceted site x stage.
g <- ggplot(p1, aes(response_date, wait_bd, group = slot_type)) +
  geom_line(color = muted, linewidth = 0.5, alpha = 0.7) +
  geom_point(aes(color = over), size = 1.6) +
  geom_hline(aes(yintercept = standard_bd), data = distinct(p1, site, stage, slot_type, standard_bd),
             color = pale, linewidth = 1) +
  scale_color_manual(values = c(`FALSE` = brand[1], `TRUE` = brand[6]),
                     labels = c("in standard", "out of standard"), name = NULL) +
  facet_grid(site ~ stage) +
  labs(title = "Layer 1: reported next-available wait, business days",
       subtitle = "Each line is one slot type. Pale band is the strictest persona standard for that slot.",
       x = NULL, y = "business days") +
  theme(legend.position = "top")
ggsave(file.path(out_dir, "L1_run_chart.png"), g, width = 12, height = 2.2 * n_distinct(p1$site) + 1, dpi = 150, bg = "white")

# Network access: best next-available across all sites per persona per day.
network <- p1 %>%
  separate_rows(persona_ids, sep = ";") %>% rename(persona_id = persona_ids) %>%
  group_by(persona_id, stage, response_date) %>%
  summarise(best_site_wait = min(wait_bd, na.rm = TRUE), worst_site_wait = max(wait_bd, na.rm = TRUE),
            .groups = "drop") %>%
  left_join(std_long %>% distinct(persona_id, stage, standard_bd), by = c("persona_id", "stage")) %>%
  mutate(network_over = best_site_wait > standard_bd)
network_summary <- network %>% group_by(persona_id, stage) %>%
  summarise(frac_days_network_over = mean(network_over, na.rm = TRUE),
            median_best = median(best_site_wait), median_worst = median(worst_site_wait), .groups = "drop")
write_csv(network_summary, file.path(out_dir, "L1_network_access_by_persona_stage.csv"))

# ---------- Layer 2: tracer log ----------
interval_names <- c("referral_to_consult", "consult_to_sim", "sim_to_plan", "plan_to_start")
t2 <- tracer %>%
  mutate(referral_to_consult = bdays_between(referral_date, consult_date),
         consult_to_sim      = bdays_between(consult_date, sim_date),
         sim_to_plan         = bdays_between(sim_date, plan_approved_date),
         plan_to_start       = bdays_between(plan_approved_date, first_fraction_date),
         end_to_end          = bdays_between(referral_date, first_fraction_date),
         phase = if_else(referral_date < survey_start, "baseline (pre-survey)", "survey period"))

t2_long <- t2 %>%
  select(site, patient_key, persona_class, phase, all_of(interval_names), delay_stage, delay_owner) %>%
  pivot_longer(all_of(interval_names), names_to = "interval", values_to = "days") %>%
  filter(!is.na(days)) %>%
  mutate(stage = factor(recode(interval, referral_to_consult = "consult", consult_to_sim = "sim",
                               sim_to_plan = "planning", plan_to_start = "machine"), stage_order),
         # A delay owned by the patient or an outside party is not the department's wait.
         internal = !(coalesce(delay_stage, "") == interval & coalesce(delay_owner, "internal") != "internal")) %>%
  left_join(standards %>% select(persona_id, std_consult_bd, std_sim_bd, std_plan_bd, std_start_bd),
            by = c("persona_class" = "persona_id")) %>%
  mutate(standard_bd = case_when(
    stage == "consult"  ~ std_consult_bd, stage == "sim" ~ std_sim_bd,
    stage == "planning" ~ std_plan_bd,    stage == "machine" ~ std_start_bd),
    excess_bd = pmax(days - standard_bd, 0))

# Bottleneck table: the department's own wait, per site and stage, weighted by patients.
bottleneck <- t2_long %>% filter(internal, !is.na(standard_bd)) %>%
  group_by(site, stage) %>%
  summarise(n_patients = n(), median_days = median(days), p90_days = quantile(days, 0.9),
            frac_over = mean(days > standard_bd), total_excess_bd = sum(excess_bd),
            .groups = "drop") %>%
  group_by(site) %>% mutate(bottleneck_candidate = total_excess_bd == max(total_excess_bd)) %>% ungroup()
write_csv(bottleneck, file.path(out_dir, "L2_bottleneck_by_site_stage.csv"))

# Same, split by baseline vs survey period, to see the Hawthorne effect.
by_phase <- t2_long %>% filter(internal, !is.na(standard_bd)) %>%
  group_by(site, stage, phase) %>%
  summarise(n = n(), median_days = median(days), frac_over = mean(days > standard_bd), .groups = "drop")
write_csv(by_phase, file.path(out_dir, "L2_by_phase.csv"))

# End-to-end lead time per persona and site, real patients.
e2e <- t2 %>% filter(!is.na(end_to_end)) %>% group_by(site, persona_class) %>%
  summarise(n = n(), median_e2e = median(end_to_end), p90_e2e = quantile(end_to_end, 0.9), .groups = "drop")
write_csv(e2e, file.path(out_dir, "L2_end_to_end_by_site_persona.csv"))

g <- ggplot(t2_long %>% filter(internal), aes(stage, days)) +
  geom_boxplot(fill = pale, color = ink, outlier.color = muted, width = 0.6) +
  facet_wrap(~ site) +
  labs(title = "Layer 2: real-patient wait by stage, department-owned delays only",
       subtitle = "Business days from the previous milestone. Patient- and outside-owned delays removed.",
       x = NULL, y = "business days")
ggsave(file.path(out_dir, "L2_stage_wait_boxplot.png"), g, width = 10, height = 6, dpi = 150, bg = "white")

# Delay owner mix: who owns the longest out-of-standard interval.
owner_mix <- t2 %>% filter(!is.na(delay_owner)) %>% count(site, delay_stage, delay_owner) %>%
  group_by(site, delay_stage) %>% mutate(share = n / sum(n)) %>% ungroup()
write_csv(owner_mix, file.path(out_dir, "L2_delay_owner_mix.csv"))

# ---------- Could versus did ----------
could <- p1 %>% group_by(site, stage) %>% summarise(could_median = median(wait_bd, na.rm = TRUE), .groups = "drop")
did   <- t2_long %>% filter(internal, phase == "survey period") %>% group_by(site, stage) %>%
  summarise(did_median = median(days), did_n = n(), .groups = "drop")
could_vs_did <- full_join(could, did, by = c("site", "stage")) %>%
  mutate(gap_bd = did_median - could_median,
         reading = case_when(
           is.na(gap_bd) ~ "insufficient data",
           gap_bd > 3    ~ "did >> could: coordination, not capacity",
           gap_bd < -3   ~ "could >> did: survey pessimistic or personas atypical",
           TRUE          ~ "consistent"))
write_csv(could_vs_did, file.path(out_dir, "could_vs_did.csv"))

g <- ggplot(could_vs_did %>% filter(!is.na(gap_bd)), aes(stage, gap_bd, fill = site)) +
  geom_col(position = position_dodge(width = 0.8), width = 0.7) +
  geom_hline(yintercept = 0, color = ink) +
  scale_fill_manual(values = brand, name = "site") +
  labs(title = "Could versus did: real-patient wait minus reported next-available wait",
       subtitle = "Positive means patients waited longer than leaders said was available.",
       x = NULL, y = "business days") +
  theme(legend.position = "top")
ggsave(file.path(out_dir, "could_vs_did.png"), g, width = 9, height = 5, dpi = 150, bg = "white")

# ---------- Layer 3: intake ----------
i3 <- intake %>% mutate(offered_wait_bd = bdays_between(contact_date, first_offered_consult_date))
intake_summary <- i3 %>% group_by(site, urgency_flag) %>%
  summarise(n = n(), median_offered = median(offered_wait_bd, na.rm = TRUE),
            p90_offered = quantile(offered_wait_bd, 0.9, na.rm = TRUE),
            declined_wait = sum(disposition == "declined_wait"),
            declined_other = sum(disposition %in% c("declined_location", "declined_preference")),
            lost = sum(disposition == "lost_to_follow_up"), .groups = "drop")
write_csv(intake_summary, file.path(out_dir, "L3_intake_by_site_urgency.csv"))

g <- ggplot(i3 %>% filter(!is.na(offered_wait_bd)), aes(offered_wait_bd)) +
  geom_histogram(binwidth = 1, fill = brand[1], color = "white") +
  facet_grid(urgency_flag ~ site, scales = "free_y") +
  labs(title = "Layer 3: first consult date actually offered, business days from contact",
       x = "business days", y = "referrals")
ggsave(file.path(out_dir, "L3_first_offered_hist.png"), g, width = 11, height = 6, dpi = 150, bg = "white")

# ---------- Console summary ----------
cat("\nBottleneck candidate per site (largest department-owned excess over standard):\n")
print(bottleneck %>% filter(bottleneck_candidate) %>%
        select(site, stage, n_patients, median_days, p90_days, frac_over, total_excess_bd), n = 50)
cat("\nCould versus did:\n"); print(could_vs_did, n = 50)
cat("\nReferrals declined due to wait, by site:\n")
print(intake_summary %>% group_by(site) %>% summarise(declined_wait = sum(declined_wait), n = sum(n)))
cat("\nOutputs written to", out_dir, "\n")
