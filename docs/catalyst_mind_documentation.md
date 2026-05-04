# Catalyst Mind AI: Technical Documentation

## Executive Summary
**Catalyst Mind AI** is a closed-loop platform designed to accelerate the discovery of novel catalysts and bio-molecules. Discovering a new catalyst traditionally takes 5–10 years and costs millions. Catalyst Mind AI dramatically reduces this timeline by mathematically prioritizing the most informative wet-lab experiments, filtering out physically impossible molecules, and continually learning from lab feedback.

This platform specifically addresses **Theme 4** of the AI for Bharat Hackathon (AI Platform for Molecular Discovery in Chemical Catalysis & Synthetic Biology).

---

## Core Architecture & Key Modules

### 1. Physics-Informed Neural Network (PINN) Scoring Engine
Instead of pure black-box deep learning, Catalyst Mind AI scores every candidate molecule using an engine that embeds quantum mechanical constraints (DFT-level approximations). 
- **Features evaluated**: Reactivity, Stability, Selectivity, Toxicity, and Yield.
- **Why it matters**: This eliminates candidates that look promising computationally but are thermodynamically impossible.

### 2. Synthesizability Graph Scorer
A high-performing catalyst is useless if it cannot be synthesized. 
- The platform evaluates a candidate's structural complexity via retrosynthetic analysis. 
- It assesses the required synthesis steps and matches intermediate pathways against available commercial precursor databases (e.g., Sigma-Aldrich).

### 3. Bayesian Active Learning
The system doesn't just rank the "best" candidates—it ranks the **most informative** ones. 
- Every prediction generates an **Uncertainty Score**. 
- The Active Learning module identifies candidates with both *high predicted activity* and *high uncertainty*. 
- **Impact**: By running these specific experiments first, researchers mathematically converge on the optimal catalyst with the fewest possible wet-lab runs.

### 4. Closed-Loop Experimental Feedback
Catalyst Mind AI is not a one-shot predictor. 
- Lab technicians enter experimental results (measured activity, selectivity, yield) directly into the platform's UI.
- The AI retrains its internal models based on the divergence between predictions and actual results.
- The entire candidate pool is re-ranked in real-time.

### 5. Workflow Visualization (3D & Graphing)
- **Interactive 3D Molecular Viewer**: Allows researchers to inspect candidate structures visually via `3dmol.js`.
- **Scatter Performance Plots**: Identifies Pareto-optimal frontiers across selectivity and activity.
- **Energy Sketch Pathways**: Maps out the thermodynamic journey of the selected catalyst reaction.

---

## Deployment & Vercel Compatibility

To ensure the platform is robust enough for hackathon demonstrations on cloud providers like Vercel, specific engineering choices were made:

### Serverless Read-Only Fallbacks
Vercel serverless environments enforce a read-only filesystem, which breaks standard local SQLite writes (`dev.db`). Catalyst Mind handles this gracefully:
- The database is seeded automatically during the `npm run build` phase.
- Write operations (such as logging an experiment or discovering new molecules) are wrapped in specialized `try/catch` handlers.
- If an `EROFS` (Read-only filesystem) error occurs, the API mimics a successful database write and responds with deterministic mock data. This allows the UI state to update without crashing the demo.

### Technology Stack
- **Framework**: Next.js 15 (App Router) + React 19
- **Database**: Prisma ORM with SQLite
- **Styling**: Tailwind CSS, base UI, Tremor
- **Visualization**: 3Dmol.js (WebGL)

---

## Target Audience
- **Pharma R&D teams**: Faster lead compound discovery.
- **Green Chemistry**: Identifying optimal catalysts for carbon capture.
- **Government Labs (CSIR/ICAR)**: Agrochemical and fertilizer catalyst development.
