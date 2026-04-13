# NALA Playwright QA

This suite targets the deployed test site and covers the highest-value automated QA flows:

- persona entitlement rendering
- registered progression and unlock gating
- premium shipping modal loading
- dashboard and hierarchy smoke

## Run

Install dependencies once:

```powershell
npm install
```

Run the full suite:

```powershell
npm run test:qa
```

Run headed:

```powershell
npm run test:qa:headed
```

Open the HTML report:

```powershell
npm run test:qa:report
```

## Test-Site Requirements

These backend files must exist on the live test server for the automated persona flows to work:

- `/api/dev_persona.php`
- `/api/setCurrentLesson.php`

`dev_persona.php` gives Playwright a clean session for:

- `registered`
- `premium`
- `business`
- `admin`

`setCurrentLesson.php` lets the progression test reset lesson position before validating unlock behavior.

## Base URL

Default app URL:

- `https://nala-test.com/repo_deploy`

Override it when needed:

```powershell
$env:NALA_BASE_URL="https://example.com/repo_deploy"
npm run test:qa
```

## Current Known Blocker

At the time this suite was wired in, the deployed test site returned:

- `{"ok":false,"error":"Forbidden"}`

from `/api/dev_persona.php`, which blocks the persona-based tests until that endpoint is deployed or corrected on the server.
