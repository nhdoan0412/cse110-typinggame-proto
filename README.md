# Syntax Runner

Syntax Runner is a CSE 110 prototype for a mobile-friendly code typing game. Players choose a syntax pack, type short code prompts exactly, and unlock movement rewards in a runner-style arena.

## Run Locally

```sh
npm start
```

Open <http://localhost:4173>.

## Prototype Features

- Vanilla HTML, CSS, and JavaScript with no runtime dependencies.
- Expandable syntax packs in `src/packs.js`.
- Strict typing feedback with highlighted correct, current, and incorrect characters.
- Runner arena with keyboard controls and mobile buttons.
- Local best-run persistence with `localStorage`.
- Service worker cache for offline replay after the first visit.
- Lightweight validation test for pack schema.

## Process Notes

This repository is intentionally process-ready: see `docs/process/` for planning artifacts and `docs/adrs/` for architectural decisions. The goal is to support the course requirement that process evidence is captured incrementally in GitHub.
