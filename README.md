# React + Vite

## Multiverse game-development guides

See [AGENTS.md](AGENTS.md) and the [Multiverse development guide](docs/development/GAMEDEV_GUIDE.md)
for the project-specific use of the pinned gamedev skills, engine entry points,
and verification criteria. The selected guides are included in this repository.

```bash
npm run check:gamedev-guides
npm run test:gamedev
```

The guidance integrity check and focused display/input/storage regressions also run
through the existing production `prebuild` checks. The `Gamedev display browser`
workflow checks the actual settings, Canvas layout and held controls in Chromium
on relevant pull requests. To run the compiled fixtures with an available Playwright
installation:

```bash
npm run build:gamedev:fixture
PLAYWRIGHT_FIXTURE_DIR=.tmp/gamedev-display npm run test:gamedev:browser
PLAYWRIGHT_FIXTURE_DIR=.tmp/gamedev-display npm run test:gamedev:storage-browser
PLAYWRIGHT_FIXTURE_DIR=.tmp/gamedev-display npm run test:gamedev:input-browser
```

This template provides a minimal setup to get React working in Vite with HMR and some Oxlint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the Oxlint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and Oxlint's TypeScript related rules in your project.

