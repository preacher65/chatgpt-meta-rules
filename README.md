# Meta / Rules Baseline Repository

## Purpose
This repository is the **canonical source of truth** for the ChatGPT baseline ruleset and related preference files.  
It exists to avoid version drift between:
- **Baseline rules** (full instructions)
- **Mini-prefs** and **stub** (lighter defaults for global prefs or mobile contexts)
- **Project loaders** (local file loads)
- **Custom GPT Actions** (remote fetches)

All consumers (Projects, Custom GPTs, global prefs) should point here for consistency.

---

## Contents
- **rules/**  
  - `baseline-rules-vX.Y.Z-ASCII.txt` — versioned baseline rules (ASCII-safe, immutable once released).  
  - `mini-prefs-vX.Y.Z.txt` — shortened prefs for lightweight contexts.  
  - `candidate-rules-vX.Y.Z.txt` — candidate rulesets under QA (not yet baseline).  
  - `manifest.json` — index declaring the current `latest`, `min_supported`, and checksums for each file.

- **friction-logs/**  
  - `friction-log-seed-vX.Y.Z.txt` — carryover summary of issues from the last cycle.  
  - `friction-log-template.txt` — skeleton for recording new issues.  

- **README.md** (this file)

---

## How to use

### 1. Projects (local load)
Projects cannot fetch from the internet.  
To use the baseline here:
1. Download the current `baseline-rules-vX.Y.Z-ASCII.txt` from `/rules/`.
2. Upload it into your Project’s file area.  
3. Optionally, upload `mini-prefs-vX.Y.Z.txt` if you want a lightweight version in global prefs.

### 2. Custom GPTs (remote fetch)
Custom GPTs can use Actions to pull from GitHub.  
Typical fetch sequence:
1. GET `manifest.json` from  
