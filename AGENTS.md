# Repository Guidelines

## Project Structure & Module Organization
- `server/`: Node.js/Express API. Source in `server/src`, build output in `server/dist`.
- `web/`: React app. Source in `web/src`, static assets in `web/public`, build output in `web/build`.
- Shared metadata at repo root: `README.md`, `LICENSE`.

## Build, Test, and Development Commands
Run commands from the relevant package directory.
- `cd server`
- `yarn dev`: Run the API in watch mode with nodemon.
- `yarn build`: Transpile `server/src` into `server/dist`.
- `yarn start`: Run the built server from `server/dist/server.js`.
- `cd web`
- `yarn start`: Run the React app locally (CRA via `react-app-rewired`).
- `yarn build`: Build the production web bundle.
- `yarn test`: Run React tests in watch mode.

## Coding Style & Naming Conventions
- Indentation: 2 spaces (see `server/.editorconfig`, `web/.editorconfig`).
- Formatting/linting: ESLint + Prettier in both `server/` and `web/`.
- JavaScript files follow standard AirBnB-style ESLint configs.

## Testing Guidelines
- Web tests use React Testing Library via `yarn test` in `web/`.
- No server-side test runner is configured; add tests under `server/src` if introducing one.
- Prefer test file naming like `*.test.js` or `*.spec.js` (CRA defaults).

## Commit & Pull Request Guidelines
- Git history uses short, imperative, lower-case summaries (e.g., “add port environment variable”).
- Keep commits focused; one logical change per commit.
- PRs should include a brief summary, linked issues (if any), and UI screenshots for `web/` changes.

## Security & Configuration Tips
- Environment variables live in `server/.env` and `web/.env.local`.
- Use `server/.env.example` and `web/.env.example` as the baseline for new configs.
