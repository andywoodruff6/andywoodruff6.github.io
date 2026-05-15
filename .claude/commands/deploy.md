---
description: Bump patch version, commit, push — Cloudflare Pages auto-deploys from main
---

Deploy the andywoodruff.net site. Cloudflare Pages is git-connected; pushing to `main` triggers the build and deploy automatically.

## Steps

1. **Check for uncommitted changes**: Run `git status` and `git diff` to see what's staged and unstaged. Gather all real changes for the commit message.

2. **Bump the patch version**: Read `package.json`, parse `version` (format `major.minor.patch`), increment patch by 1, write back. Example: `0.1.0` → `0.1.1`.

3. **Build**: Run `bun run build`. Abort the deploy if the build fails — never commit broken code.

4. **Commit**: Stage everything (`git add -A`). Analyze `git diff --staged` to understand the real changes, then compose:
   - **Title**: Use conventional commit prefix (`feat:`, `fix:`, `refactor:`, `chore:`, `style:`, `docs:`) based on the actual work. Describe the changes — NEVER mention the version bump in the title.
   - **Body**: Bulleted summary of what changed and why. Focus on user-facing or structural impact, not file-by-file diffs. Keep it tight (3–8 bullets max).
   - **Trailer**: `Co-Authored-By: Ekko <noreply@anthropic.com>`.

   If the ONLY change is the version bump itself, use `chore: bump version to <new_version>` as the title with no body.

5. **Push**: `git push origin main`. Cloudflare Pages picks up the push and runs the build + deploy automatically (~1–2 min to live).

6. **Report**: Print the version change (e.g., `0.1.0 → 0.1.1`), commit SHA, and push confirmation. Note that CF Pages will deploy from the push — check the CF dashboard if verification is needed.

## Important

- Never skip the version bump.
- Never run `npm` or `npx`. Always `bun` / `bunx` per this repo's operational rules.
- Never `--no-verify` git hooks or `--force` push.
- If the build fails, STOP. Do not commit broken code.
