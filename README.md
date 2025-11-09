# DANER — AI-Powered Data Cleaning Desktop App

> **DANER** is an **AI-driven data-cleaning co-pilot** for analysts and engineers.  
> It’s a *standalone desktop application* that lets you chat with your data, clean files intelligently, and export perfect datasets — all locally, without the cloud.

---

## Features

**Chat-based interface** — Command your data conversationally.
**Multi-modal cleaning** — Handles Tabular, Image, and Audio data.
**Proactive AI assistant** — Auto-suggests cleaning actions (deduplication, imputation, etc.).
**High-performance engine** — Powered by Rust + Polars.
**Custom themes** — Dark, Light, Solarized, and High-Contrast.
**Offline & Secure** — Runs 100% locally, no internet required.

---

## Architecture Overview

| Layer | Technology | Purpose |
|-------|-------------|----------|
| **Frontend** | Svelte + TypeScript | Chat UI, data preview, theme system |
| **Shell** | Tauri (Rust) | Native window, file system, secure IPC |
| **Backend** | Python (FastAPI + Polars + spaCy + Librosa) | Data analysis, cleaning, NLP, audio/image ops |
| **Bridge** | Tauri invoke() + FastAPI | Connects UI ↔ Python sidecar |


