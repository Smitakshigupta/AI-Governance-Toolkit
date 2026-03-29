# Product Requirements Document
## AI Governance Toolkit

**Author:** Smitakshi Gupta, Senior AI Product Manager
**Version:** 1.0
**Status:** Production (internal governance tooling)
**Last Updated:** March 2026

---

## 1. Problem statement

Enterprise AI deployments in regulated industries face governance requirements from internal risk teams, regulatory bodies, and executive leadership simultaneously. Existing approaches fail in one of two directions: informal processes that produce no defensible record, or rigid compliance checklists that treat all controls as equally important and produce no prioritization.

The result is AI systems that are either under-governed (creating regulatory and reputational risk) or governance-burdened in ways that slow product velocity without improving safety.

The core problem: there is no structured, repeatable tool that connects governance controls to risk severity, produces a defensible score, and generates prioritized remediation paths.

---

## 2. Goal

Build a governance assessment tool that gives AI PMs, risk officers, and compliance teams a structured framework for evaluating enterprise AI systems — with weighted controls, scored outputs, and actionable recommendations.

**Success looks like:**
- Teams can complete a governance assessment in under 20 minutes
- Output is a scored risk profile that can be shared directly with executive stakeholders
- Recommendations are prioritized by severity, not listed in arbitrary order
- The framework is repeatable across different AI use cases and teams

---

## 3. User personas

| Persona | Context | Core need |
|---|---|---|
| AI Product Manager | Launching a new AI feature | Identify governance gaps before go-live |
| Chief Risk Officer | Reviewing AI portfolio risk | Executive-level risk summary across systems |
| Compliance Officer | Regulatory audit preparation | Documented controls with evidence of review |
| Engineering Lead | Building AI infrastructure | Understand which governance controls require engineering support |

---

## 4. Framework design

### Five governance pillars

The framework assesses five risk surfaces, selected based on regulatory guidance (SR 11-7, EU AI Act) and operational experience in regulated AI environments.

**Data privacy:** Addresses PII handling, user consent, and data retention. These controls are foundational — violations create direct regulatory liability and user harm.

**Model risk:** Addresses hallucination risk, bias testing, performance monitoring, and drift detection. These controls determine whether the AI system behaves as intended over time.

**Human oversight:** Addresses human-in-the-loop requirements, override capability, and audit trails. These controls determine whether humans can catch and correct AI failures.

**Transparency:** Addresses explainability, AI disclosure to users, and documented limitations. These controls determine whether users and operators understand what the AI system is and is not.

**Regulatory compliance:** Addresses legal review, industry standard compliance, and incident response. These controls determine whether the organization is prepared for regulatory scrutiny.

### Control weighting

**Critical controls (weight 3):** Failure creates direct regulatory, safety, or user harm risk. Examples: AI disclosure to users, human override capability, PII handling.

**Standard controls (weight 2):** Important but not immediately dangerous if absent. Examples: bias testing documentation, drift detection, explainability.

### Scoring

- Yes: full credit (weight x 2)
- Partial / In progress: half credit (weight x 1)
- No: zero credit

Overall score = (sum of earned credits) / (maximum possible credits), expressed as a percentage.

---

## 5. Key product decisions and rationale

### Decision 1: Weighted controls rather than equal-weight checklist
**Why:** Not all governance gaps are equally dangerous. A missing AI disclosure to users (regulatory risk) is categorically different from missing drift detection documentation (operational risk). Equal-weight scoring obscures the most critical gaps and makes the assessment output misleading for prioritization.

### Decision 2: Three-level answer (Yes / Partial / No) rather than binary
**Why:** Many governance controls are in progress or partially implemented. Binary scoring forces teams to either undercount their progress (marking "No" when they have partial coverage) or overcount it (marking "Yes" prematurely). Partial credit reflects operational reality.

### Decision 3: Recommendations sorted by severity, not by pillar
**Why:** A governance assessment is only useful if it drives action. Organizing recommendations by pillar (the natural structure of the framework) buries critical gaps inside longer lists. Sorting by severity surfaces the highest-risk gaps at the top regardless of which pillar they belong to.

### Decision 4: React component rather than Python/Streamlit
**Why:** Governance assessments are shared across non-technical stakeholders — risk officers, compliance teams, executive leadership. A browser-native React app runs without any installation, is embeddable in internal portals, and does not require Python or a running server. Accessibility was the primary driver.

### Decision 5: No backend data persistence in v1
**Why:** Governance assessment data is sensitive. Storing scores and answers in a backend database requires data classification, access controls, and retention policies. v1 runs fully in-browser with no data leaving the client. Export to CSV enables stakeholders to store results in appropriate governed systems.

---

## 6. Metrics for the toolkit itself

| Metric | Target |
|---|---|
| Time to complete full assessment | Under 20 minutes |
| Recommendation accuracy (precision) | Validated by compliance team review |
| Stakeholder adoption | Used for all new AI use case reviews |

---

## 7. Risk register

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| Teams treat score as a compliance pass/fail | Medium | High | Documentation prominently states scores are risk signals, not regulatory certifications |
| Framework becomes stale relative to regulation | Medium | Medium | Quarterly review cycle; versioned PRD |
| Partial answers are over-used to inflate scores | Low | Medium | Recommendations call out partial answers on critical controls |

---

## 8. Open questions at time of v1 launch

- Should we add a "Not applicable" answer for controls that genuinely do not apply to a given AI system type?
- At what score threshold should legal review be automatically triggered?
- Should assessments be time-stamped and versioned to enable longitudinal tracking?

---

## 9. Outcome

Deployed as internal governance tooling for AI use case review at a regulated financial institution. Used to structure pre-launch governance reviews for AI systems serving consumer-facing products. Contributed to significant approved AI infrastructure investment by providing executive leadership with a structured risk framework for AI governance decision-making.

---

*Good governance is not about checking boxes. It is about knowing which boxes matter most and being honest about where the gaps are.*
