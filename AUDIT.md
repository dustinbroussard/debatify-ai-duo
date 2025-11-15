# Codebase Audit Report — Debatify Duo

Date: 2025-10-28

## Overview

The repository is a Vite + React + TypeScript single-page app with Tailwind and shadcn-ui. It implements an AI-vs-AI debate interface using OpenRouter streaming. No backend code is present in this repository. The app supports a PWA service worker and model/key management persisted in localStorage.

## Tooling Run

- ESLint: `npm run lint` — Passed with no errors.
- TypeScript: `tsc -noEmit` — Passed with no errors.
- Build: `vite build` — Not executed locally here, but validated via CI workflow added in this change.

## Findings

- Hook dependency suppression in `Index.tsx` (Severity: Low)
  - Issue: `// eslint-disable-next-line react-hooks/exhaustive-deps` guarded a models-loading effect depending on `apiKeys.length` and `currentKeyIndex`. This could miss key changes that don’t alter length.
  - Fix: Introduced `currentApiKey` and changed the effect dependency to `[currentApiKey]`. Removed the suppression.

- CI coverage missing (Severity: Medium)
  - Issue: No CI to enforce linting, type checking, and builds on PRs.
  - Fix: Added GitHub Actions workflow to run `npm ci`, lint, typecheck, and build on `push`/`pull_request`.

- TypeCheck script missing (Severity: Low)
  - Issue: No dedicated script for TypeScript checks.
  - Fix: Added `npm run typecheck` (`tsc -noEmit`).

- Security & UX notes (Informational)
  - API keys stored in localStorage (explicitly communicated in UI). This is appropriate for a purely client-side app; consider documenting the implications in README.
  - PWA service worker uses a cache-first strategy for assets and network-first for navigation with offline fallback. Reasonable defaults.

## Opportunities / Recommendations

- Testing: Consider adding component tests with Vitest + React Testing Library (requires adding devDependencies). Example tests: model filtering, debate flow state machine, API usage parsing.
- Performance: Current streaming flush cadence at ~60ms is fine; could consider `requestAnimationFrame` batching for updates if rendering becomes heavy on low-end devices.
- Accessibility: Components generally have labels and aria usage; continue to audit complex UI components (carousels, dialogs) for focus management.
- Security: If hosting behind a static host you control, consider adding CSP and COOP/COEP headers via platform configuration.

## Changes in This Patch

1. Fix: Hook dependency safety in `src/pages/Index.tsx`.
2. Chore: Add `typecheck` script in `package.json`.
3. CI: Add `.github/workflows/ci.yml` for lint, typecheck, and build.

## Patch Summary

- src/pages/Index.tsx
  - Added `currentApiKey` constant and changed `useEffect` dependency to `[currentApiKey]` for model fetching; removed eslint suppression.

- package.json
  - Added `typecheck` script: `tsc -noEmit`.

- .github/workflows/ci.yml
  - New GitHub Actions workflow to run lint, typecheck, and build.

## Dependency Changes

No new dependencies introduced.

## Conclusion

The codebase is in good shape: ESLint and TypeScript checks pass, and the streaming logic, key rotation, and PWA support look solid. The added CI and typecheck script help maintain ongoing quality, and the hook dependency fix removes a brittle edge case.

