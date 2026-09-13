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

