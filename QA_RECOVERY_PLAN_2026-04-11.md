# QA Recovery Plan - 2026-04-11

This file records the current split between backend / QA-harness work handled now and the frontend-specific follow-up that remains for Mel.

## Source Of Truth

- Frontend source of truth: `repo_deploy/`
- Backend source of truth: `api/`
- Archive/reference only, not active working directories:
  - `server_mirror/`
  - `api_mar_24_2026_extracted/`
  - zip exports and one-off extracted snapshots in the workspace root

## Handled In This Pass

- Progression backend now respects role caps when updating `current_lesson`.
- Progression endpoints now heal capped users whose raw DB progress drifted past the effective visible cap.
- Stripe webhook now normalizes purchase plan / mode more defensively.
- Stripe webhook now attempts entitlement reconciliation by user email when `user_id` metadata is missing.
- Hierarchy rendering now exposes stable QA selectors:
  - `data-module-id`
  - `data-module-title`
  - `data-lesson-no`
  - `data-lesson-title`
  - `data-quiz-id`
  - `data-resource-id`
  - `data-testid`
- Purchase modal CSS was moved out of `js/_febe.js` into `buy/wc-purchase-modal.css`.

## Remaining For Mel

These are intentionally left as frontend/UI ownership items:

- Move remaining purchase modal UI markup out of `js/_febe.js` into a dedicated frontend component/module.
- Make the EN / ES language toggle more explicitly accessible and easier for automated QA to target.
- Improve upgrade / purchase CTA clarity in the dashboard and marketing flow.
- Fix registered dashboard accessibility violations.
- Revisit mobile interaction stability and nav behavior.
- Decide whether registered users should visually unlock the next lesson immediately client-side or only after a fresh session refresh, then implement the chosen UI behavior consistently.

## Next QA Pass After This Work

Run another QA pass after deployment with emphasis on:

- Registered progression from intro through the registered cap.
- Premium purchase entitlement grant.
- Business-in-a-Box add-on grant for an already-premium user.
- Session refresh after Stripe return.
- Exact lesson targeting using `data-lesson-no` / `data-lesson-title`, not broad regex matching.
- EN / ES lesson parity checks after the selector rewrite.

## QA Harness Guidance

- Prefer exact selectors over fuzzy text matches.
- Use `data-lesson-no` or full exact lesson title for lesson audit coverage.
- Distinguish product bugs from timing bugs by waiting for:
  - authenticated session loaded
  - hierarchy loaded
  - lesson/player ready
  - lesson completion response
  - post-purchase entitlement refresh
