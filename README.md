# Vinteum Site

Vinteum's public website, built with [Next.js](https://nextjs.org), React, TypeScript, and Tailwind CSS.

Production repository:

```text
https://github.com/vinteumorg/vinteum-site
```

Production branch:

```text
main
```

## Tech stack

- Next.js App Router
- React
- TypeScript
- Tailwind CSS
- pnpm
- systemd for the Linux VM service
- GitHub webhook-based autodeploy for pushes to `main`

## Requirements

- Node.js compatible with the Next.js version in `package.json`
- pnpm

Install dependencies:

```bash
pnpm install
```

## Local development

Create a local environment file if needed:

```bash
cp .env.local.example .env.local
```

Run the development server:

```bash
pnpm dev
```

Open:

```text
http://localhost:3000
```

## Common commands

```bash
pnpm dev      # start local development server
pnpm build    # create a production build
pnpm start    # start the production server
pnpm lint     # run eslint
```

## Environment variables

Environment variables are read from `.env.local` in local/server environments. This file is intentionally ignored by git.

Important production-only variable:

```text
GITHUB_WEBHOOK_SECRET=<strong random secret>
```

This secret is used by the deploy webhook to verify GitHub's `X-Hub-Signature-256` header.

Generate a new secret with:

```bash
openssl rand -hex 32
```

Do not commit secrets to the repository.

## Production deployment

The production app runs on the Linux VM under systemd as:

```text
vinteum-site.service
```

The app path on the server is:

```text
/home/exedev/vinteum-site
```

Restart the production service with:

```bash
sudo systemctl restart vinteum-site.service
```

Check service status with:

```bash
systemctl status vinteum-site.service --no-pager -l
```

## Autodeploy from GitHub

This repo includes a GitHub webhook endpoint:

```text
GET  /api/deploy
POST /api/deploy
```

Health check:

```bash
curl https://www.vinteum.org/api/deploy
```

Expected response:

```json
{ "ok": true, "route": "deploy" }
```

### GitHub webhook settings

Configure the webhook in GitHub repository settings:

```text
Payload URL: https://www.vinteum.org/api/deploy
Content type: application/json
Secret: value of GITHUB_WEBHOOK_SECRET from the server .env.local
Events: Just the push event
Active: yes

`application/json` is preferred. The deploy route also accepts GitHub's
`application/x-www-form-urlencoded` payload format for compatibility.
```

The endpoint also works behind the apex redirect:

```text
https://vinteum.org/api/deploy -> https://www.vinteum.org/api/deploy
```

Using the `www` URL directly avoids relying on webhook redirect behavior.

### Deploy behavior

The webhook only deploys when all of these are true:

```text
GitHub event: push
ref: refs/heads/main
deleted: false
valid X-Hub-Signature-256 signature
```

For valid deploy events, the API route starts the deploy script asynchronously and returns quickly to GitHub.

Deploy script:

```text
scripts/deploy-main.sh
```

The script:

1. uses a `flock` lock to prevent overlapping deploys
2. works in `/home/exedev/vinteum-site`
3. fetches `origin main`
4. resets hard to `origin/main`
5. installs dependencies with a frozen lockfile
6. builds the app
7. restarts `vinteum-site.service`
8. logs output to `/home/exedev/vinteum-deploy.log`

Equivalent commands:

```bash
git fetch origin main
git reset --hard origin/main
pnpm install --frozen-lockfile
pnpm build
sudo systemctl restart vinteum-site.service
```

Watch deploy logs:

```bash
tail -f /home/exedev/vinteum-deploy.log
```

## Testing the webhook locally

Health check:

```bash
curl http://localhost:8000/api/deploy
```

Test a signed GitHub-style ping without triggering a deploy:

```bash
node - <<'NODE'
const crypto = require('crypto');
const fs = require('fs');

const env = fs.readFileSync('.env.local', 'utf8');
const secret = env.match(/^GITHUB_WEBHOOK_SECRET=(.+)$/m)[1].trim();
const payload = JSON.stringify({ zen: 'Keep it logically awesome.' });
const signature = 'sha256=' + crypto.createHmac('sha256', secret).update(payload).digest('hex');

fetch('http://localhost:8000/api/deploy', {
  method: 'POST',
  headers: {
    'content-type': 'application/json',
    'x-github-event': 'ping',
    'x-hub-signature-256': signature,
  },
  body: payload,
})
  .then(async (res) => {
    console.log(res.status, await res.text());
  })
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
NODE
```

Do not test a signed `push` event unless you intentionally want to trigger a real deployment.

## Repository migration notes

The current `origin` remote is:

```text
https://github.com/vinteumorg/vinteum-site.git
```

The previous remote is kept locally, when available, as:

```text
old-origin
```

A backup branch was created before rebasing local site changes onto the new upstream:

```text
backup/pre-upstream-rebase-20260630225524
```

## Contributing

Use small, focused commits. Before pushing changes to `main`, run:

```bash
pnpm build
```

Pushing to `main` triggers production deployment through the GitHub webhook.
