Meta / Rules Dev — Seed

Repo
  https://github.com/preacher65/chatgpt-meta-rules
  Raw base: https://raw.githubusercontent.com/preacher65/chatgpt-meta-rules/main

Purpose
  Single source of truth for baseline rules + prefs.
  Two consumption modes:
    • Custom GPT (Actions) → fetch from GitHub + verify SHA-256 (manifest.json)
    • Projects (no network) → load from local Project Files + verify via CANARY

Layout
  /rules/
    baseline-rules-vX.Y.Z-ASCII.txt   # authoritative baseline
    mini-prefs-vX.Y.Z.txt             # optional short prefs
    candidate-rules-vX.Y.Z.txt        # prerelease, not baseline
    manifest.json                     # for Custom GPTs only
  /friction-logs/
    friction-log-seed-vX.Y.Z.txt
    friction-log-template.txt
  README.md
  seed.txt   # this file

Release checklist
  1) Create new baseline file: rules/baseline-rules-vX.Y.Z-ASCII.txt
     Top lines:
       Baseline Rules vX.Y.Z
       CANARY: <random 32–64 chars>
  2) Update rules/manifest.json:
       latest = "vX.Y.Z"
       files["baseline-vX.Y.Z"].path and sha256 (hash of RAW file)
  3) Commit + push (main), tag: vX.Y.Z
  4) Project use → upload the baseline file to Project Files.
  5) Global prefs → bump EXPECTED_LATEST to vX.Y.Z.

Custom GPT (Actions) — OpenAPI (3.1.0)
  servers:
    - url: https://raw.githubusercontent.com/preacher65/chatgpt-meta-rules/main
  paths:
    /rules/manifest.json:
      get: { operationId: getManifest }
    /rules/get:
      get:
        operationId: getFileByQuery
        parameters:
          - in: query
            name: path
            required: true
            schema: { type: string }
            example: rules/baseline-rules-vX.Y.Z-ASCII.txt

Custom GPT — Instructions (essentials)
  • On start: getManifest → read .latest → getFileByQuery(?path=…) → parse "Baseline Rules v…"
  • Announce: "Baseline vX.Y.Z loaded from GitHub (source: remote)."
  • "refresh baseline" → re-fetch manifest + baseline and re-announce.
  • "status" → Baseline=<version>, Source=remote
  • Do not dump full baseline unless asked.

Project Instructions (no network)
  • On start: scan Project Files for baseline-rules-vMAJOR.MINOR.PATCH-ASCII.txt; pick highest.
  • Read first 2 lines: parse version + CANARY (line starting "CANARY:").
  • Announce: "Baseline vX.Y.Z loaded from Project files (source: local), CANARY=<prefix>."
  • Commands:
      - status → Baseline=<v|none>, Source=local|safe-reduced, CANARY=<token|none>
      - refresh baseline → rescan Project Files and re-announce
      - show header → print first 2 lines
  • Never claim to fetch from the internet.
  • Don’t paste full baseline unless asked.

CANARY generation
  PowerShell (32 hex):  [System.Guid]::NewGuid().ToString("N").Substring(0,32).ToUpper()
  PowerShell (64 hex):  -join ((1..64) | % { "{0:X}" -f (Get-Random -Max 16) })
  Bash/Python (32 hex):
    python - <<'PY'
    import secrets; print(secrets.token_hex(16).upper())
    PY
  Bash/Python (64 hex):
    python - <<'PY'
    import secrets; print(secrets.token_hex(32).upper())
    PY

Smoke tests
  Custom GPT:
    • Start new chat → expect "Baseline vX.Y.Z loaded…"
    • Push new baseline + bump manifest → new chat → expect new version
  Project:
    • status → expect Baseline=<v>, Source=local, CANARY=<…>
    • upload newer baseline file → "refresh baseline" → expect new version

Notes
  • Keep baseline files ASCII and LF-only (repo enforces .gitattributes).
  • Projects: ignore manifest.json (no hashing); rely on CANARY text.
  • Custom GPTs: verify SHA-256 from manifest.json against RAW bytes.
