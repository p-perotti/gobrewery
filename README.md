# GoBrewery

<p align="center">
  GoBrewery is a management platform for a craft brewery operation, with dashboard, sales, stock, customers, coupons, and reporting features.
</p>

<p align="center">
  <img alt="GitHub top language" src="https://img.shields.io/github/languages/top/p-perotti/gobrewery">
  <img alt="GitHub language count" src="https://img.shields.io/github/languages/count/p-perotti/gobrewery">
  <img alt="Repository size" src="https://img.shields.io/github/repo-size/p-perotti/gobrewery">
  <img alt="GitHub last commit" src="https://img.shields.io/github/last-commit/p-perotti/gobrewery">
  <img alt="GitHub" src="https://img.shields.io/github/license/p-perotti/gobrewery">
  <a href="https://github.com/p-perotti/gobrewery/actions/workflows/deploy-vm-ghcr.yml">
    <img alt="Deploy workflow" src="https://github.com/p-perotti/gobrewery/actions/workflows/deploy-vm-ghcr.yml/badge.svg">
  </a>
  <img alt="API health" src="https://img.shields.io/website?url=https%3A%2F%2Fgobrewery.duckdns.org%2Fapi%2Fhealth&label=api%20health">
</p>

![App Screenshot](https://res.cloudinary.com/p-perotti/image/upload/v1600791986/github/gobrewery/gobrewery-dashboard.png)

## Project Structure

- `server/`: Node.js + Express API
- `web/`: React
- `deploy/`: Docker/VM deployment (including GitHub Actions)

## Tech Stack

- Frontend: [React](https://reactjs.org/), [Redux](https://redux.js.org/), [Redux-Saga](https://redux-saga.js.org/), [Material UI](https://mui.com/), [Formik](https://formik.org/), [Yup](https://www.npmjs.com/package/yup), [Recharts](https://recharts.org/), [pdfmake](http://pdfmake.org/#/)
- Backend: [Node.js](https://nodejs.org/), [Express](https://expressjs.com/), [Sequelize](https://sequelize.org/), [PostgreSQL](https://www.postgresql.org/), [JWT](https://jwt.io/), [Multer](https://github.com/expressjs/multer)
- Infrastructure: [Docker Compose](https://docs.docker.com/compose/), [GitHub Actions](https://github.com/features/actions), [GHCR](https://docs.github.com/en/packages/working-with-a-github-packages-registry/working-with-the-container-registry)

## Quick Start (Local)

### API

```bash
cd server
yarn
yarn dev
```

### Web

```bash
cd web
yarn
yarn start
```

## Build Commands

### API

```bash
cd server
yarn build
yarn start
```

### Web

```bash
cd web
yarn build
```

## Environment Variables

- API env baseline: `server/.env.example`
- Web env baseline: `web/.env.example`
- VM deploy env baselines:
  - `deploy/.env.api.example`
  - `deploy/.env.db.example`

## API Docs

With API running, OpenAPI docs are available at:

- `/docs`
- `/openapi.json`

If accessed through reverse proxy/domain with `/api` prefix:

- `/api/docs`
- `/api/openapi.json`

## Live Access

- App: [https://gobrewery.duckdns.org](https://gobrewery.duckdns.org)
- API docs: [https://gobrewery.duckdns.org/api/docs/](https://gobrewery.duckdns.org/api/docs/)
- OpenAPI JSON: [https://gobrewery.duckdns.org/api/openapi.json](https://gobrewery.duckdns.org/api/openapi.json)
- Health: [https://gobrewery.duckdns.org/api/health](https://gobrewery.duckdns.org/api/health)

## Production Deploy

For VM deployment (Oracle Ubuntu + Docker Compose + GitHub Actions), see:

- `deploy/README.md`

## License

[MIT](LICENSE) © [Patrick Perotti](https://www.linkedin.com/in/patrick-perotti/)
