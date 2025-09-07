# Meta / Rules Dev — README (v2.3.2-p1)

## What changed since v2.2.7-p3
- **Baseline bump:** Now at v2.3.2 (see baseline-changelog-v2.3.2.txt).
  - Uncertainty Handling: confidence must come from external evidence, not fluency.
  - Proactivity: preserve structured troubleshooting, remove “always actionable” bias.
  - Tone & Style: allow plain speech when surfacing limitations.
- **Loader bump:** Project and Custom loaders updated to v2.3.2-p1.
  - Both standardise on `ELB Reference` memory key instead of `expected_latest_baseline`.
  - Runtime commands expanded: `status`, `refresh baseline`, `show header`, `show mini`, `show precedence`.
- **Changelog alignment:** loader-changelog-v2.3.2-p1.txt and baseline-changelog-v2.3.2.txt cover details.
- **Project instructions:** IT v1.2 and Finance v1.0 now include the v2.3.2-p1 loader and Evidence & Diff Guardrails.

## Baseline
- Active: **v2.3.2** (`baseline-rules-v2.3.2-ASCII.txt`).
- Canonical; outranks all overlays/advisories.

## Loaders
Both loaders *must* emit two lines at startup:
1. Descriptive:  
   - Project: `Baseline vX.Y.Z loaded from Project files (source: local)[, CANARY=<prefix>].`
   - Custom GPT: `Baseline vX.Y.Z loaded from GitHub (source: remote)[, CANARY=<prefix>].`
2. Canonical marker:  
   - `CONFIRM BASELINE vX.Y.Z`

**Project loader (local, no network in spec)**  
- Scans local files for highest `baseline-rules-v*.txt`.
- Parses header; reads optional CANARY.
- Advisories based on `ELB Reference` memory entry.
- Runtime: `status`, `refresh baseline`, `show header`, `show mini`, `show precedence`.
- Never claim remote fetch/checksums.
- Mini overlays are **not** applied when baseline present.

**Custom GPT loader (remote)**  
- Uses repo manifest to fetch baseline; no fallback below manifest `.latest`.
- Advisories based on `ELB Reference` memory entry.
- Runtime: `status`, `refresh baseline`, `show header`, `show mini`, `show precedence`.
- Never silently fall back.
- Outputs concise unless expansion requested.

## Bio & Traits Overlay
- Global Bio and Traits files apply as overlays on top of Baseline rules.
- Precedence: Global Bio/Traits overlay Project baseline unless the Project is sealed.
- Purpose:
  * Bio: user identity, preferences, and system notes (`bio_vX.Y.Z.txt`).
  * Traits: tone, uncertainty handling, proactivity, troubleshooting discipline, context warnings (`traits_vX.Y.Z.txt`).
- Effect: They shape default behaviour but do not override explicit Baseline constraints.

## Global Prefs
- Loader handles expected baseline advisories via `ELB Reference`.
- Mini prefs are advisory only; inert when baseline present.

## Reduced mode (SAFE-REDUCED)
- Loader could not load a baseline. Only Global Prefs (and optional mini) apply.

## Files in this package
- `baseline-rules-v2.3.2-ASCII.txt` — canonical baseline rules.
- `baseline-changelog-v2.3.2.txt` — baseline changelog.
- `project-loader-v2.3.2-p1.txt` — Project loader (local).
- `custom-loader-v2.3.2-p1.txt` — Custom GPT loader (remote).
- `loader-changelog-v2.3.2-p1.txt` — loader changelog.
- `IT-project-instructions-v1.2.txt` — IT domain rules + loader + guardrails.
- `Finance-project-instructions-v1.0.txt` — Finance domain rules + loader + guardrails.
- `bio_v1.0.0.txt` — global Bio (identity, preferences, system notes).
- `traits_v1.0.0.txt` — global Traits (tone, uncertainty, proactivity, context size warnings).

## Baseline Bump Checklist
1. **Update artefacts**
   - Add/update `baseline-rules-vX.Y.Z-ASCII.txt` and its changelog.
   - Update loaders to `vX.Y.Z-p1`.
   - Update `manifest.json` in GitHub for Custom GPTs.

2. **Update account memory**
   - Ensure a memory entry exists with:
     ```
     Title: ELB Reference
     Value: vX.Y.Z
     ```
   - Supersedes prior entries automatically.

3. **Confirm**
   - On loader startup, check for `CONFIRM BASELINE vX.Y.Z`.

4. **Done**
   - Old files optional for history, not required for runtime.
