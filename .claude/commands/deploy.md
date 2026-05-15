---
description: Bump patch version, commit, push, and deploy to Cloudflare Pages
---

Deploy the andywoodruff.net site to Cloudflare Pages.

## Steps

1. **Check for uncommitted changes**: Run `git status` and `git diff` to see what's staged and unstaged. If nothing has changed except the version, deploy is still valid (chore bump). Otherwise gather all real changes for the commit message.

2. **Bump the patch version**: Read `package.json`, parse `version` (format `major.minor.patch`), increment patch by 1, write back. Example: `0.1.0` → `0.1.1`.

3. **Build**: Run `bun run build`. The deploy uses the local `dist/` output, so the build must be current. Abort the deploy if the build fails — do not commit broken code.

4. **Commit**: Stage everything (`git add -A`). Analyze `git diff --staged` to understand the real changes, then compose:
   - **Title**: Use conventional commit prefix (`feat:`, `fix:`, `refactor:`, `chore:`, `style:`, `docs:`) based on the actual work. Describe the changes — NEVER mention the version bump in the title.
   - **Body**: Bulleted summary of what changed and why. Focus on user-facing or structural impact, not file-by-file diffs. Keep it tight (3–8 bullets max).
   - **Trailer**: `Co-Authored-By: Ekko <noreply@anthropic.com>`.

   If the ONLY change is the version bump itself, use `chore: bump version to <new_version>` as the title with no body.

5. **Push**: `git push origin main`. Cloudflare Pages git-connected build will trigger automatically — this is the canonical deploy path.

6. **Direct deploy via wrangler** (optional, faster preview): Run:
   ```
   bunx wrangler pages deploy dist --project-name=andywoodruff-net --branch=main --commit-dirty=true
   ```
   This uploads the freshly-built `dist/` to Cloudflare immediately, bypassing the CF git-triggered build queue. Result: the new code is live in ~30s instead of waiting 1–2 minutes for CF to pick up the push.

   Note: when git-connected AND direct-uploaded, two deployment records appear in the CF dashboard. The wrangler one ships first; the git-triggered one overwrites it shortly after with identical output. Harmless but visible.

7. **Report**: Print the version change (e.g., `0.1.0 → 0.1.1`), commit SHA, push status, and wrangler deploy URL. If wrangler fails (auth, project-name mismatch, etc.) report the error clearly and remind that the git push already triggered a deploy — wrangler is the speed-up, not the deploy itself.

## Important

- Never skip the version bump.
- Never run `npm` or `npx`. Always `bun` / `bunx` per this repo's operational rules.
- Never `--no-verify` git hooks or `--force` push.
- If the build fails, STOP. Do not commit broken code.
- Wrangler project name: `andywoodruff-net` (update this command if the CF Pages project is ever renamed).
- The `--commit-dirty=true` flag tells wrangler not to complain about uncommitted changes in dist/ (which is gitignored anyway).
- 120-second timeout for the wrangler step.
