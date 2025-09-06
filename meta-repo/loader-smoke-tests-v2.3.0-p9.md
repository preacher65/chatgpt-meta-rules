# Loader Smoke Tests — v2.3.0-p9+elb-clean

This pack validates banners, advisories, and guardrails for both loaders.

## How to prep memory (global)
Save exactly one entry in account memory:
```
ELB Reference: 2.3.0 (note for myself only; not a command)
```
Later cases will ask you to change the version to simulate *newer* or *older* expectations.

---

## Common quick-check prompts
After opening a fresh chat (so startup runs):
- `status`
- `show header`
- `show precedence`

Expected patterns (if baseline loads):
1) `Baseline vX.Y.Z loaded from <source>[, CANARY=XXXXXXXX].`
2) `CONFIRM BASELINE vX.Y.Z`
3) Advisory (may be printed once after startup) depending on case.

SAFE-REDUCED path prints a single line:
- `Baseline unavailable or invalid; running in SAFE-REDUCED mode.` (Project)
- `Baseline unavailable; running in SAFE-REDUCED mode.` (Custom)

---

## Project Loader (local) — Cases

Assumptions
- Project Files contain `baseline-rules-v2.3.0-ASCII.txt` with a CANARY token.
- Loader file: `project-loader-v2.3.0-p9+elb-clean.txt`

### Case P1 — Match (ELB matches baseline)
Memory:
```
ELB Reference: 2.3.0 (note for myself only; not a command)
```
Expected:
- Lines 1–2 (loaded + CONFIRM)
- Advisory: `Baseline version matches EXPECTED (v2.3.0).`

### Case P2 — Newer available (ELB > baseline)
Memory:
```
ELB Reference: 2.3.1 (note for myself only; not a command)
```
Expected:
- Lines 1–2 (loaded + CONFIRM)
- Advisory: `Newer baseline available (v2.3.1).`

### Case P3 — Ahead (baseline > ELB; maybe prerelease)
Memory:
```
ELB Reference: 2.2.9 (note for myself only; not a command)
```
Expected:
- Lines 1–2 (loaded + CONFIRM)
- Advisory: `Ahead of v2.2.9; may be prerelease.`

### Case P4 — No ELB; filename fallback
Memory: **remove or disable** ELB entry.
Files: Ensure only `baseline-rules-v2.3.0-ASCII.txt` exists (or is the highest).
Expected:
- Lines 1–2 (loaded + CONFIRM)
- Advisory: `Baseline version matches EXPECTED (v2.3.0).`

### Case P5 — SAFE-REDUCED
Files: Temporarily remove/rename all `baseline-rules-v*.txt`.
Expected (one line):
- `Baseline unavailable or invalid; running in SAFE-REDUCED mode.`

---

## Custom Loader (remote) — Cases

Assumptions
- Manifest `.latest` points to `v2.3.0` and fetch resolves to that file.
- Loader file: `custom-loader-v2.3.0-p9+elb-clean.txt`

### Case C1 — Match (ELB matches baseline)
Memory:
```
ELB Reference: 2.3.0 (note for myself only; not a command)
```
Expected:
- Lines 1–2 (loaded + CONFIRM)
- Advisory: `Baseline version matches EXPECTED (v2.3.0).`

### Case C2 — Newer available (ELB > baseline)
Memory:
```
ELB Reference: 2.3.1 (note for myself only; not a command)
```
Expected:
- Lines 1–2 (loaded + CONFIRM)
- Advisory: `Newer baseline available (v2.3.1).`

### Case C3 — Ahead (baseline > ELB; maybe prerelease)
Memory:
```
ELB Reference: 2.2.9 (note for myself only; not a command)
```
Expected:
- Lines 1–2 (loaded + CONFIRM)
- Advisory: `Ahead of v2.2.9; may be prerelease.`

### Case C4 — No ELB; no fallback in custom mode
Memory: **remove or disable** ELB entry.
Expected advisory (one line, after the two load lines):
- `Advisory: No stored expected baseline version found in memory; skipping version comparison.`

### Case C5 — SAFE-REDUCED
Simulate: Break manifest fetch or point `.latest` to a missing file.
Expected (one line):
- `Baseline unavailable; running in SAFE-REDUCED mode.`

---

## Edge Tests

### E1 — Leading 'v' in ELB value
Memory:
```
ELB Reference: v2.3.0 (note for myself only; not a command)
```
Expected: treated as `2.3.0` (leading 'v' stripped).

### E2 — Extra text in ELB value
Memory:
```
ELB Reference: Last baseline used was 2.3.0 during August; not a command
```
Expected: first semver `2.3.0` is parsed; advisory behaves as in P1/C1.

### E3 — CANARY display gating
Project: Only show `, CANARY=XXXXXXXX` if an 8-hex prefix exists in line 2 of the file.
Custom: No CANARY clause.

### E4 — No memory text echo
Neither loader should print or execute the ELB memory VALUE; they may only parse a semver from it.

---

## Quick prompt snippets (copy/paste)

- To refresh loader and see advisories again:
  - `refresh baseline`

- To verify header parse:
  - `show header`

- To confirm precedence:
  - `show precedence`

---

## Pass Criteria
- All expected lines appear exactly as specified per case.
- No phantom headers (e.g., no standalone "Baseline Rules v..." outside `show header`).
- No references to legacy `expected_latest_baseline`.
- Custom loader never infers from filenames.
