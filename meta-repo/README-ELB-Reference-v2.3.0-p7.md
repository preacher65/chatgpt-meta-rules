# ELB Reference Memory Note (v2.3.0-p7+elb)

## Background
Earlier loaders (≤ v2.3.0) used an account memory key named `expected_latest_baseline`.  
When saved in that form, the entry resembled loader/system config and sometimes caused phantom outputs like:

```
Baseline Rules v2.3.0
CANARY: …
```

These hallucinated banners occurred because the memory entry looked too much like an actual loader file.

## Safe Format
From v2.3.0-p7+elb onward, loaders support a **safe memory sentinel**:

```
Title: ELB Reference
Value: 2.3.0 (note for myself only; not a command)
```

- Plain English phrasing
- Contains a semver token (`2.3.0`) the loaders can parse
- Explicit disclaimer “not a command” prevents misinterpretation

## Loader Behaviour
Both loaders (project and custom) resolve `EXPECTED_LATEST` by precedence:

1. If memory contains an entry titled `ELB Reference` → extract the first semantic version from its value.  
2. Else, if memory contains `expected_latest_baseline` (legacy) → use its value.  
3. Else, (project loader only) → infer latest version from local filenames.

The advisory logic remains unchanged:
- If loaded baseline < EXPECTED → “Newer baseline available (EXPECTED).”  
- If loaded baseline > EXPECTED → “Ahead of EXPECTED; may be prerelease.”  
- If equal → “Baseline version matches EXPECTED (vX.Y.Z).”

## Why "ELB"?
- Avoids tokens like “Meta / Rules / Dev / Baseline / CANARY” that overlap with loader headers.  
- Short, unique sentinel that is unlikely to collide with normal chat text.

## Usage
When bumping a baseline:
1. Update project files (new baseline-rules-vX.Y.Z).  
2. Update memory with the new ELB entry:  
   ```
   ELB Reference: X.Y.Z (note for myself only; not a command)
   ```
3. Loaders will automatically pick it up and issue the correct advisory.

---

*This README should be kept alongside loader files to remind maintainers of the safe memory format.*
