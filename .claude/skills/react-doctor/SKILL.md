---
name: react-doctor
description: Run after making React changes to catch issues early. Use when reviewing code, finishing a feature, or fixing bugs in a React project.
allowed-tools: Bash, Read, Grep, Glob
---

# React Doctor

Scans the React codebase for security, performance, correctness, and architecture issues. Outputs a 0-100 score with actionable diagnostics.

## Steps

1. Run the scan:

```bash
npx -y react-doctor@latest . --verbose --diff
```

2. Read the output and identify issues grouped by severity (errors > warnings > info).
3. For each error or warning, locate the file and line using Grep/Read.
4. Fix errors first, then re-run to verify the score improved.
5. Report the before/after score and a summary of changes made.
