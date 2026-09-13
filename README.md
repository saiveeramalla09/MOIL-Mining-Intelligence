# MOIL Mining Intelligence

**Explore · Estimate · Predict · Simulate · Act**

An AI-assisted geological exploration and production decision-support platform for manganese mining, built for **Smart India Hackathon 2026 — SIH26009** on behalf of **MOIL Limited / Ministry of Steel, Government of India**. The pilot area is the **Balaghat–Nagpur manganese belt** (Balaghat, Dongri Buzurg, Kandri, Tirodi, Ukwa).

> **Demo mode notice:** satellite, terrain, and public geoscience layers are real; subsurface block models, drillhole assays, and shift-level production telemetry are clearly labelled simulated proxies pending MOIL internal data access. The platform never claims satellite imagery directly detects underground manganese, and never presents a model output as a certified (UNFC/JORC) mineral reserve.

---

## Introduction

Manganese exploration and manganese *production* are normally handled as two separate problems, by two separate teams, using two separate toolchains: geologists work in GIS software to rank exploration targets, while mine planners work in spreadsheets and SCADA dashboards to track shift output. The two rarely talk to each other in the same tool, which means a production shortfall and an unexplored high-grade target can sit side by side without anyone connecting them.

MOIL Mining Intelligence is a single decision-support workspace that carries one continuous thread — **Explore → Estimate → Predict → Simulate → Act** — from "where should we look" all the way to "what should the shift supervisor do this week," with every number traceable back to the evidence or data source behind it.

## What problem it solves

Built directly against SIH26009's mandate — *"Using AI/ML and Space Technology to Identify Manganese Reserves and Overcome Production Shortfalls"* — the platform addresses two linked problems for MOIL:

1. **Exploration bottleneck.** New manganese reserves are hard to locate quickly with conventional field survey alone. The platform fuses multi-source satellite and geological evidence (Sentinel-2 spectral indices, SRTM structural lineaments, GSI Sausar Group lithology, known-occurrence proximity) into a ranked, explainable list of exploration targets, so field crews and drilling budgets go to the right ground first.
2. **Production shortfall control.** Month-end tonnage shortfalls are usually diagnosed *after* the fact. The platform forecasts shortfall risk mid-cycle, decomposes it into causal drivers (equipment downtime, blasting delay, rainfall, logistics), lets a planner test operational levers before committing to them, and outputs ranked, human-approved corrective actions with expected tonnage recovery.

## What makes it different

Compared to a typical GIS exploration tool, a production BI dashboard, or a generic hackathon "AI dashboard," this platform is distinguished by:

- **One continuous workflow instead of disconnected tools.** Selecting an exploration target flows straight into its resource estimate, its production impact, a what-if simulator seeded with that context, and a ranked action list — not five unrelated screens.
- **Explainability is structural, not decorative.** Every score (prospectivity, shortfall risk, resource confidence) ships with a "why this result" breakdown — SHAP-style contribution shares for exploration, causal decomposition for shortfalls — instead of a bare number with no justification.
- **Explicit data honesty, enforced throughout the UI.** Every figure is labelled `REAL / PUBLIC`, `SIMULATED / DEMO`, or `REQUIRES MOIL INTERNAL DATA`. Terminology is deliberately constrained — "prospectivity" and "estimated geological target," never "probability of manganese" or "certified reserve" — so the prototype can't be mistaken for a finished regulatory tool.
- **A real interactive 3D subsurface viewer**, not a static cross-section image: a procedurally generated terrain and conceptual block model that can be rotated, zoomed, and queried down to individual drillhole intervals.
- **A domain-grounded AI assistant that still works without an API key.** The assistant is grounded in the actual MOIL geography (mine coordinates, rail sidings, smelter routes) and Google Maps citations when a key is configured, and degrades gracefully to a purpose-built offline "domain telemetry" engine when it isn't — so the demo never breaks in a room with no internet or no secrets configured.
- **The loop closes on an action, not an insight.** The end state of a session isn't a chart; it's a ranked, engineer-approvable recommendation (`Approve` / `Dismiss`) tied back to the exact scenario that produced it.

## Architecture

Keep this as a four-stage pipeline diagram in the README (it mirrors the in-app **System Architecture** view), plus the two things that cut across all four stages:

```
 01 · Multi-Source Ingestion
     Sentinel-2 MSI · SRTM/ASTER DEM · GSI lithology · shift production logs (proxy) · CHIRPS/IMD weather
                              │
 02 · Spatial Prospectivity
     Band-ratio indices · structural lineament proximity · lithological pay-zones ·
     3D block discretization · Kriging vs. ML regression
                              │
 03 · Production Forecast
     Shift run-rate time series · fleet availability regressors · blasting-delay lag ·
     rainfall bias · SHAP-style causal decomposition
                              │
 04 · Decision & What-If
     Sensitivity sliders · fleet reallocation optimizer · blasting synchronization ·
     ranked, human-approved action plan
```

**Cross-cutting layers:**
- **AI assistant** — a conversational layer available from any workspace, grounded in the current tab/target context, with live Gemini calls when configured and a domain-specific offline fallback otherwise.
- **Data & model transparency** — the Data Sources, Model Center, and SIH26009 compliance-matrix views expose provenance and validation baselines for every number the UI shows, rather than burying them in code.

**Suggested "Tech stack" subsection**, since a README reader will ask what it's built with:
- **Frontend:** React 19 + TypeScript, Vite, Tailwind CSS v4
- **Mapping & 3D:** Leaflet (2D GIS map), Three.js with a custom procedural terrain/texture generator (3D subsurface viewer)
- **Backend:** Express server (`server.ts`) proxying the Google Gemini API (`@google/genai`) for the AI assistant, with Google Maps grounding and an offline domain-fallback engine
- **Data layer:** typed fixture modules per domain (`explorationData`, `resourceData`, `productionData`, `scenarioData`, `recommendationData`, `systemMetadata`) so real data sources can be substituted without touching UI components


## Models used in the platform

**1. Exploration Prospectivity Engine**
Ensemble Random Forest + multi-criteria spatial evidence weighting. Inputs: Sentinel-2 SWIR/VNIR band ratios, SRTM slope/topographic wetness index, distance to structural lineaments, lithological contact proximity, proximity to known occurrences. Output: a 0–1 favorability score + confidence %, explained via SHAP-style contribution shares. Cited validation: AUC-ROC 0.89 against known GSI occurrences (this is a *simulated* benchmark, not a real trained/evaluated model — worth knowing before a judge asks).

**2. Resource & Tonnage Estimation Engine**
3D spatial regression (XGBoost) benchmarked against Ordinary Kriging geostatistics. Inputs: drillhole XYZ + assay intervals, specific gravity, structural boundary constraints. Output: P10/P50/P90 tonnage and grade range. Cited validation: Kriging cross-validation R²=0.81, 22% variance reduction over univariate interpolation.

**3. Production Shortfall Forecasting Engine**
Gradient-boosted time-series regressor (LightGBM-style) with weather as an exogenous regressor. Inputs: shift production actuals, equipment availability %, blasting delay backlog, CHIRPS rainfall forecast. Output: month-end forecast + LOW/MED/HIGH shortfall risk, explained via causal factor decomposition. Cited validation: MAPE 4.2% on simulated test sets.

**4. Scenario & What-If Simulation Engine**
Not ML — constrained rule-based/operational optimization with physical bounds (equipment 60–95%, blasting delay 2–24h, etc.). Deterministic recompute, not a trained model.

**5. Corrective Action Recommendation Engine**
Multi-objective utility ranking (Impact × Confidence × Feasibility ÷ Urgency). Also rule-based, not ML — explicitly "no ungrounded AI generative text," human-in-the-loop approval required.

**6. Conversational layer (separate from the above)**
Google Gemini via `@google/genai` — tries `gemini-3.5-flash` first, falls back to `gemini-3.1-flash-lite`, with an offline hand-written "domain telemetry" responder when no API key or the API fails. This is the only component actually calling a live foundation model; the five modules above are architecturally specified but run on fixture data, not trained weights.

**Important distinction to be ready for:** modules 1–3 are *designed* as ML pipelines with named algorithms and cited metrics, but the repo has no training code, no model artifacts, and no real evaluation — the "validation baselines" (AUC 0.89, R²=0.81, MAPE 4.2%) are illustrative numbers in a fixture file, not measured results. Know this cold, because it's the single most likely thing a technical judge will probe.

## Likely judge questions

**Technical / ML depth**

- "Where's the trained model? Show me the training code or the notebook." — you don't have one; be upfront that this is a prototype UI/UX and architecture demonstration, with the ML pipeline specified but not yet trained on real MOIL data.
- "How did you get an AUC of 0.89 / R² of 0.81 if there's no real drillhole data?" — same answer: these are target/illustrative benchmarks from published literature on similar prospectivity studies, not measured on this dataset.
- "Why Random Forest over a CNN on the satellite imagery directly?" — be ready to justify: tabular/engineered spectral+spatial features are far more label-efficient than raw imagery CNNs when labeled occurrence points are scarce (which is realistic for a real MOIL deployment).
- "How would kriging and the ML regressor actually be reconciled/blended?" — have an answer (e.g., ML residuals kriged, or ensemble weighting by local data density) even if not implemented.
- "What's your explainability method concretely — do you actually compute SHAP values anywhere in the code?" — no, it's static contribution percentages in fixtures; say so and describe how you'd wire in real SHAP once a model is trained.

**Data / feasibility**

- "What real data do you actually have access to right now, vs. what needs MOIL to give you?" — you have a clean answer already (your Data Sources page draws this line explicitly).
- "Sentinel-2/SRTM/CHIRPS are free — what's stopping anyone from building this?" — the differentiator is the integration into one continuous mining decision workflow with MOIL-specific domain logic, not the raw data access.
- "How would you validate a manganese prospectivity model without labeled negative examples?" — good question to have a real answer for (spatial cross-validation, buffered occurrence sampling, etc.) since it's a known hard problem in mineral prospectivity mapping.
- "What happens when MOIL's real drillhole/production data doesn't match your assumed schema?" — point to the typed data-layer abstraction as the answer.

**Product / impact**

- "Who is the actual end user — a geologist, a mine planner, or MOIL management?" — the app currently serves all three loosely; be ready to pick a primary persona.
- "What's the cost/tonnage impact if this were deployed?" — have a rough estimate ready (e.g., "even a 5% reduction in the 3,800t monthly shortfall on this pilot mine = X tonnes/₹Y recovered").
- "Is this compliant with UNFC/JORC reserve reporting?" — no, and the app is careful never to claim it is; explain why that distinction matters legally for MOIL.
- "What happens without an internet connection or API key at demo time?" — you have a strong answer here (the offline fallback engine) — lead with this, it's a genuine strength.

**Scalability / deployment**

- "How would this scale to MOIL's other manganese belts (Balaghat isn't the only one)?" — the fixture-driven data layer is designed for this; explain the swap-in path.
- "Where would this run in production — cloud, on-prem, air-gapped?" — the in-app architecture note mentions "sovereign cloud infrastructure" for National Geospatial Policy compliance; be ready to expand on that.


