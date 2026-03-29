import { useState } from "react";

const RISK_CATEGORIES = [
  {
    id: "data_privacy",
    label: "Data privacy",
    questions: [
      { id: "pii_handling", text: "Does this AI system process personally identifiable information (PII)?", weight: 3 },
      { id: "data_retention", text: "Is there a documented data retention and deletion policy?", weight: 2 },
      { id: "consent", text: "Have users consented to AI processing of their data?", weight: 3 },
    ]
  },
  {
    id: "model_risk",
    label: "Model risk",
    questions: [
      { id: "hallucination_risk", text: "Can the model produce factually incorrect outputs that could cause harm?", weight: 3 },
      { id: "bias_testing", text: "Has the model been tested for demographic or output bias?", weight: 2 },
      { id: "performance_monitoring", text: "Is model performance monitored in production?", weight: 2 },
      { id: "drift_detection", text: "Is there a mechanism to detect model drift over time?", weight: 2 },
    ]
  },
  {
    id: "human_oversight",
    label: "Human oversight",
    questions: [
      { id: "human_in_loop", text: "Is a human required to review AI outputs before action is taken?", weight: 3 },
      { id: "override_capability", text: "Can human operators override or correct AI decisions?", weight: 3 },
      { id: "audit_trail", text: "Is there a complete audit trail of AI decisions and outcomes?", weight: 2 },
    ]
  },
  {
    id: "transparency",
    label: "Transparency",
    questions: [
      { id: "explainability", text: "Can the system explain the basis for its outputs to end users?", weight: 2 },
      { id: "ai_disclosure", text: "Are users informed they are interacting with an AI system?", weight: 3 },
      { id: "limitations_documented", text: "Are system limitations and known failure modes documented?", weight: 2 },
    ]
  },
  {
    id: "regulatory",
    label: "Regulatory compliance",
    questions: [
      { id: "regulatory_review", text: "Has legal or compliance reviewed this AI use case?", weight: 3 },
      { id: "industry_standards", text: "Does this system comply with relevant industry standards (e.g. SR 11-7, EU AI Act)?", weight: 2 },
      { id: "incident_response", text: "Is there a documented incident response plan for AI failures?", weight: 2 },
    ]
  }
];

const RISK_LEVELS = {
  low: { label: "Low risk", color: "#15803d", bg: "#f0fdf4", border: "#86efac" },
  medium: { label: "Medium risk", color: "#b45309", bg: "#fffbeb", border: "#fcd34d" },
  high: { label: "High risk", color: "#b91c1c", bg: "#fef2f2", border: "#fca5a5" },
  critical: { label: "Critical risk", color: "#7c2d12", bg: "#fff7ed", border: "#fb923c" }
};

function getRiskLevel(score) {
  if (score >= 80) return "low";
  if (score >= 60) return "medium";
  if (score >= 35) return "high";
  return "critical";
}

function computeScore(answers) {
  let total = 0;
  let maxTotal = 0;
  RISK_CATEGORIES.forEach(cat => {
    cat.questions.forEach(q => {
      const answer = answers[q.id];
      maxTotal += q.weight * 2;
      if (answer === "yes") total += q.weight * 2;
      else if (answer === "partial") total += q.weight;
    });
  });
  return maxTotal > 0 ? Math.round((total / maxTotal) * 100) : 0;
}

function computeCategoryScores(answers) {
  return RISK_CATEGORIES.map(cat => {
    let total = 0;
    let maxTotal = 0;
    cat.questions.forEach(q => {
      maxTotal += q.weight * 2;
      const answer = answers[q.id];
      if (answer === "yes") total += q.weight * 2;
      else if (answer === "partial") total += q.weight;
    });
    return {
      id: cat.id,
      label: cat.label,
      score: maxTotal > 0 ? Math.round((total / maxTotal) * 100) : 0,
      unanswered: cat.questions.filter(q => !answers[q.id]).length
    };
  });
}

function getRecommendations(answers) {
  const recs = [];
  RISK_CATEGORIES.forEach(cat => {
    cat.questions.forEach(q => {
      const answer = answers[q.id];
      if (answer === "no" && q.weight >= 3) {
        recs.push({ priority: "high", text: `Address: ${q.text}`, category: cat.label });
      } else if (answer === "partial" && q.weight >= 3) {
        recs.push({ priority: "medium", text: `Strengthen: ${q.text}`, category: cat.label });
      } else if (answer === "no" && q.weight === 2) {
        recs.push({ priority: "medium", text: `Address: ${q.text}`, category: cat.label });
      }
    });
  });
  return recs.sort((a, b) => (a.priority === "high" ? -1 : 1));
}

export default function GovernanceToolkit() {
  const [activeTab, setActiveTab] = useState("assessment");
  const [answers, setAnswers] = useState({});
  const [systemName, setSystemName] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [activeCategory, setActiveCategory] = useState(0);

  const totalQuestions = RISK_CATEGORIES.reduce((sum, cat) => sum + cat.questions.length, 0);
  const answeredQuestions = Object.keys(answers).length;
  const progressPct = Math.round((answeredQuestions / totalQuestions) * 100);

  const score = computeScore(answers);
  const riskLevel = getRiskLevel(score);
  const riskInfo = RISK_LEVELS[riskLevel];
  const categoryScores = computeCategoryScores(answers);
  const recommendations = getRecommendations(answers);

  const styles = {
    container: { fontFamily: "system-ui, sans-serif", maxWidth: 820, margin: "0 auto", padding: "24px 20px", color: "#111827" },
    header: { marginBottom: 24 },
    title: { fontSize: 22, fontWeight: 600, color: "#111827", marginBottom: 4 },
    subtitle: { fontSize: 13, color: "#6b7280" },
    tabs: { display: "flex", gap: 4, marginBottom: 24, borderBottom: "1px solid #e5e7eb", paddingBottom: 0 },
    tab: (active) => ({
      padding: "8px 16px", fontSize: 13, fontWeight: active ? 500 : 400,
      color: active ? "#2563eb" : "#6b7280", background: "none", border: "none",
      borderBottom: active ? "2px solid #2563eb" : "2px solid transparent",
      cursor: "pointer", marginBottom: -1
    }),
    card: { background: "#ffffff", border: "1px solid #e5e7eb", borderRadius: 10, padding: 20, marginBottom: 16 },
    label: { fontSize: 12, fontWeight: 500, color: "#374151", marginBottom: 6, display: "block" },
    input: { width: "100%", padding: "8px 12px", border: "1px solid #d1d5db", borderRadius: 6, fontSize: 13, outline: "none", boxSizing: "border-box" },
    progress: { background: "#f3f4f6", borderRadius: 99, height: 6, marginBottom: 20, overflow: "hidden" },
    progressBar: { background: "#2563eb", height: "100%", borderRadius: 99, transition: "width 0.3s", width: `${progressPct}%` },
    catTabs: { display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 20 },
    catTab: (active) => ({
      padding: "6px 12px", borderRadius: 6, fontSize: 12, fontWeight: active ? 500 : 400,
      background: active ? "#2563eb" : "#f9fafb", color: active ? "#fff" : "#374151",
      border: "1px solid", borderColor: active ? "#2563eb" : "#e5e7eb", cursor: "pointer"
    }),
    question: { marginBottom: 16, padding: 14, background: "#f9fafb", borderRadius: 8, border: "1px solid #f3f4f6" },
    questionText: { fontSize: 13, color: "#374151", marginBottom: 10, lineHeight: 1.5 },
    answerGroup: { display: "flex", gap: 8 },
    answerBtn: (selected, value) => {
      const colors = { yes: "#15803d", partial: "#b45309", no: "#b91c1c" };
      const bgs = { yes: "#f0fdf4", partial: "#fffbeb", no: "#fef2f2" };
      return {
        flex: 1, padding: "6px 10px", borderRadius: 6, fontSize: 12, fontWeight: selected ? 500 : 400,
        cursor: "pointer", border: "1px solid",
        borderColor: selected ? colors[value] : "#e5e7eb",
        background: selected ? bgs[value] : "#fff",
        color: selected ? colors[value] : "#6b7280"
      };
    },
    scoreCard: { background: riskInfo.bg, border: `1px solid ${riskInfo.border}`, borderRadius: 10, padding: 20, marginBottom: 16, textAlign: "center" },
    scoreNum: { fontSize: 48, fontWeight: 700, color: riskInfo.color, lineHeight: 1 },
    riskLabel: { fontSize: 16, fontWeight: 500, color: riskInfo.color, marginTop: 4 },
    catScoreRow: { display: "flex", alignItems: "center", gap: 12, marginBottom: 10 },
    catScoreLabel: { fontSize: 13, color: "#374151", width: 160, flexShrink: 0 },
    catScoreBar: { flex: 1, background: "#f3f4f6", borderRadius: 99, height: 8, overflow: "hidden" },
    recItem: (priority) => ({
      padding: "10px 14px", borderRadius: 8, marginBottom: 8,
      background: priority === "high" ? "#fef2f2" : "#fffbeb",
      border: `1px solid ${priority === "high" ? "#fca5a5" : "#fcd34d"}`,
      fontSize: 12, color: "#374151"
    }),
    btn: { padding: "10px 20px", background: "#2563eb", color: "#fff", border: "none", borderRadius: 8, fontSize: 13, fontWeight: 500, cursor: "pointer" },
    sectionTitle: { fontSize: 15, fontWeight: 500, color: "#111827", marginBottom: 12 },
    badge: (color, bg) => ({ display: "inline-block", padding: "2px 8px", borderRadius: 10, fontSize: 11, fontWeight: 500, color, background: bg, marginLeft: 6 }),
    weightBadge: (w) => ({ display: "inline-block", padding: "1px 6px", borderRadius: 4, fontSize: 10, fontWeight: 500, color: w >= 3 ? "#7c2d12" : "#1e3a5f", background: w >= 3 ? "#fff7ed" : "#eff6ff", marginLeft: 6 })
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div style={styles.title}>AI Governance Toolkit</div>
        <div style={styles.subtitle}>Risk assessment and controls framework for enterprise AI systems</div>
      </div>

      <div style={styles.tabs}>
        {["assessment", "results", "framework"].map(tab => (
          <button key={tab} style={styles.tab(activeTab === tab)} onClick={() => setActiveTab(tab)}>
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {activeTab === "assessment" && (
        <div>
          <div style={styles.card}>
            <label style={styles.label}>AI system name</label>
            <input style={styles.input} placeholder="e.g. Customer Service Chatbot, Loan Underwriting Model"
              value={systemName} onChange={e => setSystemName(e.target.value)} />
          </div>

          <div style={{ marginBottom: 8, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: 12, color: "#6b7280" }}>{answeredQuestions} of {totalQuestions} questions answered</span>
            <span style={{ fontSize: 12, color: "#6b7280" }}>{progressPct}% complete</span>
          </div>
          <div style={styles.progress}><div style={styles.progressBar} /></div>

          <div style={styles.catTabs}>
            {RISK_CATEGORIES.map((cat, i) => (
              <button key={cat.id} style={styles.catTab(activeCategory === i)} onClick={() => setActiveCategory(i)}>
                {cat.label}
              </button>
            ))}
          </div>

          <div style={styles.card}>
            <div style={{ ...styles.sectionTitle, marginBottom: 16 }}>
              {RISK_CATEGORIES[activeCategory].label}
              <span style={styles.badge("#374151", "#f3f4f6")}>
                {RISK_CATEGORIES[activeCategory].questions.filter(q => answers[q.id]).length}/
                {RISK_CATEGORIES[activeCategory].questions.length} answered
              </span>
            </div>
            {RISK_CATEGORIES[activeCategory].questions.map(q => (
              <div key={q.id} style={styles.question}>
                <div style={styles.questionText}>
                  {q.text}
                  <span style={styles.weightBadge(q.weight)}>{q.weight >= 3 ? "critical" : "standard"}</span>
                </div>
                <div style={styles.answerGroup}>
                  {["yes", "partial", "no"].map(value => (
                    <button key={value} style={styles.answerBtn(answers[q.id] === value, value)}
                      onClick={() => setAnswers(prev => ({ ...prev, [q.id]: value }))}>
                      {value === "yes" ? "Yes" : value === "partial" ? "Partial / In progress" : "No"}
                    </button>
                  ))}
                </div>
              </div>
            ))}

            <div style={{ display: "flex", justifyContent: "space-between", marginTop: 16 }}>
              <button style={{ ...styles.btn, background: activeCategory === 0 ? "#e5e7eb" : "#f3f4f6", color: "#374151" }}
                onClick={() => setActiveCategory(Math.max(0, activeCategory - 1))}
                disabled={activeCategory === 0}>
                Previous
              </button>
              {activeCategory < RISK_CATEGORIES.length - 1 ? (
                <button style={styles.btn} onClick={() => setActiveCategory(activeCategory + 1)}>Next</button>
              ) : (
                <button style={styles.btn} onClick={() => { setSubmitted(true); setActiveTab("results"); }}>
                  View results
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {activeTab === "results" && (
        <div>
          {answeredQuestions === 0 ? (
            <div style={styles.card}>
              <div style={{ color: "#6b7280", fontSize: 13 }}>Complete the assessment first to see your risk score.</div>
            </div>
          ) : (
            <>
              <div style={styles.scoreCard}>
                <div style={{ fontSize: 12, fontWeight: 500, color: riskInfo.color, marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                  {systemName || "AI System"} — Governance Score
                </div>
                <div style={styles.scoreNum}>{score}</div>
                <div style={styles.riskLabel}>{riskInfo.label}</div>
                <div style={{ fontSize: 12, color: riskInfo.color, marginTop: 8, opacity: 0.8 }}>
                  {answeredQuestions} of {totalQuestions} controls assessed
                </div>
              </div>

              <div style={styles.card}>
                <div style={styles.sectionTitle}>Score by category</div>
                {categoryScores.map(cat => (
                  <div key={cat.id} style={styles.catScoreRow}>
                    <span style={styles.catScoreLabel}>{cat.label}</span>
                    <div style={styles.catScoreBar}>
                      <div style={{
                        height: "100%", borderRadius: 99, transition: "width 0.3s",
                        width: `${cat.score}%`,
                        background: cat.score >= 80 ? "#15803d" : cat.score >= 60 ? "#b45309" : "#b91c1c"
                      }} />
                    </div>
                    <span style={{ fontSize: 12, fontWeight: 500, color: "#374151", minWidth: 36, textAlign: "right" }}>
                      {cat.score}%
                    </span>
                  </div>
                ))}
              </div>

              {recommendations.length > 0 && (
                <div style={styles.card}>
                  <div style={styles.sectionTitle}>Recommendations</div>
                  {recommendations.map((rec, i) => (
                    <div key={i} style={styles.recItem(rec.priority)}>
                      <span style={{ fontWeight: 500 }}>[{rec.category}]</span> {rec.text}
                      <span style={styles.badge(
                        rec.priority === "high" ? "#b91c1c" : "#b45309",
                        rec.priority === "high" ? "#fef2f2" : "#fffbeb"
                      )}>{rec.priority} priority</span>
                    </div>
                  ))}
                </div>
              )}

              <button style={styles.btn} onClick={() => { setAnswers({}); setSubmitted(false); setActiveTab("assessment"); setActiveCategory(0); }}>
                Start new assessment
              </button>
            </>
          )}
        </div>
      )}

      {activeTab === "framework" && (
        <div>
          <div style={styles.card}>
            <div style={styles.sectionTitle}>Governance framework</div>
            <p style={{ fontSize: 13, color: "#6b7280", lineHeight: 1.7, marginBottom: 16 }}>
              This toolkit implements a five-pillar AI governance framework designed for regulated enterprise environments. Each pillar addresses a distinct risk surface. Controls are weighted by severity — critical controls (weight 3) represent failure modes with direct regulatory or user harm potential.
            </p>
            {RISK_CATEGORIES.map(cat => (
              <div key={cat.id} style={{ marginBottom: 20 }}>
                <div style={{ fontSize: 14, fontWeight: 500, color: "#111827", marginBottom: 8 }}>{cat.label}</div>
                {cat.questions.map(q => (
                  <div key={q.id} style={{ fontSize: 12, color: "#6b7280", marginBottom: 6, paddingLeft: 12, borderLeft: "2px solid #e5e7eb", lineHeight: 1.5 }}>
                    {q.text}
                    <span style={styles.weightBadge(q.weight)}>{q.weight >= 3 ? "critical" : "standard"}</span>
                  </div>
                ))}
              </div>
            ))}
          </div>
          <div style={styles.card}>
            <div style={styles.sectionTitle}>Scoring methodology</div>
            <p style={{ fontSize: 13, color: "#6b7280", lineHeight: 1.7 }}>
              Each control is scored Yes (full credit), Partial / In progress (half credit), or No (zero credit). Controls are weighted 2 (standard) or 3 (critical). The overall score is the weighted sum divided by the maximum possible weighted sum, expressed as a percentage.
            </p>
            <div style={{ marginTop: 12 }}>
              {Object.entries(RISK_LEVELS).map(([key, val]) => (
                <div key={key} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                  <div style={{ width: 12, height: 12, borderRadius: 3, background: val.color }} />
                  <span style={{ fontSize: 12, fontWeight: 500, color: "#374151" }}>{val.label}</span>
                  <span style={{ fontSize: 12, color: "#6b7280" }}>
                    {key === "low" ? "80-100" : key === "medium" ? "60-79" : key === "high" ? "35-59" : "0-34"}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
