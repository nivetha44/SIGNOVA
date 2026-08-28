# SIGNOVA client

SIGNOVA is a local-first Indian Sign Language learning and translation interface. The client uses MediaPipe Hand Landmarker in the browser for live hand landmarks and a rule-based classifier for the currently supported gesture set.

## Implemented

- Dashboard with local XP, streak, accuracy, session, and practice summaries
- Live camera translation with landmark overlay, confidence, debouncing, and a privacy notice
- Sign learning catalog and practice mode
- Sentence builder with raw/improved output, copy, reset, and local save
- Text-to-sign lookup that marks unsupported words instead of substituting a sign
- Existing authenticated history plus local saved translations
- Light/dark/system theme, larger text controls, responsive layouts, and keyboard-friendly controls

## Run

```bash
npm install
npm run dev
```

The API is optional for local learning, practice, and sign lookup. Set `VITE_API_URL` when using the authenticated server. The backend needs its own `.env` with database and JWT configuration; do not commit secrets.

## Reality and offline limits

The current browser classifier is a rule-based MVP over MediaPipe landmarks. It does not represent a trained 500-sign ISL model. MediaPipe WASM/model assets are loaded from remote CDNs on first use, so live recognition requires network access unless those assets are self-hosted or cached by a future service worker. Sign catalog, sentence building, settings, and local saved translations work without the API. Account sync, server history, analytics, and leaderboards require the backend and database.

This template provides a minimal setup to get React working in Vite with HMR and some Oxlint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the Oxlint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and Oxlint's TypeScript related rules in your project.
