# Running Average API

**Ayurtech:** R280926724P  **Deal name:** AYU0926PEND01

A small Node.js REST server exposing a single endpoint, `POST /average`. Each call sends one number and gets back the average of **all** numbers received so far (state is held in memory and resets when the server restarts).

## Prerequisites

- Node.js **18 or newer** (uses built-in `fetch`) and npm
- Git

## Setup

```bash
git clone <REPO_URL>
cd running-average-api
npm install
```

`npm install` also enables the Git hooks automatically (via the `prepare` script, which runs `husky`).

## Run the server

```bash
npm start
```

The server listens on `http://localhost:3000` (override with `PORT=4000 npm start`).

## Call the API

**Option 1 – command-line client** (in a second terminal; the server must be running):

```bash
npm run client -- 10 20 60
# sent 10 -> average so far: 10
# sent 20 -> average so far: 15
# sent 60 -> average so far: 30
```

Use `API_URL=http://localhost:4000 npm run client -- 5` if the server runs elsewhere.

**Option 2 – curl:**

```bash
curl -X POST http://localhost:3000/average \
  -H "Content-Type: application/json" \
  -d '{"number": 10}'
# {"average":10}
```

### API contract

| | |
|---|---|
| Endpoint | `POST /average` |
| Request body | `{"number": <number>}` (a bare JSON number such as `10` is also accepted) |
| Success | `200` `{"average": <number>}` |
| Invalid input (missing, non-numeric, NaN/Infinity, malformed JSON) | `400` `{"error": "<message>"}` |

Invalid requests do not affect the stored average.

## Tests

```bash
npm test
```

Runs Jest with coverage: unit tests for the averaging logic, HTTP tests for the endpoint (Supertest), and a test of the client against a live in-process server. It also runs automatically as a pre-commit hook.

## Git hooks and commit convention

Hooks are managed by [Husky](https://typicode.github.io/husky/) and installed by `npm install`:

| Hook | Action |
|---|---|
| `pre-commit` | runs `npm test`; the commit is blocked if tests fail |
| `commit-msg` | runs [commitlint](https://commitlint.js.org/) with `@commitlint/config-conventional`; non-conforming messages are rejected |

Commit messages must follow [Conventional Commits](https://www.conventionalcommits.org/): `type(optional-scope): description`

```bash
git commit -m "feat: add median endpoint"      # accepted
git commit -m "added median endpoint"          # rejected by the hook
```

Allowed types: `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `build`, `ci`, `chore`, `revert`.

## Project layout

```
src/runningAverage.js   core averaging logic (JSDoc'd)
src/app.js              Express app factory with POST /average
src/server.js           process entry point
client/client.js        CLI client
test/                   Jest tests
.husky/                 Git hooks
commitlint.config.js    Conventional Commits rules
```

## Dependencies (all declared in package.json)

- Runtime: `express`
- Dev: `jest`, `supertest`, `husky`, `@commitlint/cli`, `@commitlint/config-conventional`
