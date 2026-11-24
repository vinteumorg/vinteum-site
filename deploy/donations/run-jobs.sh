#!/bin/sh
# Runs the authorized donations jobs tick: reconciliation plus outbox delivery.
# Values come from the app environment file; the secret never appears in a unit,
# the process list or the logs.
set -eu
ENV_FILE=${DONATIONS_ENV_FILE:-/etc/vinteum-site.env}
ORIGIN=${DONATIONS_ORIGIN:-https://www.vinteum.org}
SECRET=$(sed -n 's/^DONATIONS_CRON_SECRET=//p' "$ENV_FILE")
[ -n "$SECRET" ] || { echo "missing DONATIONS_CRON_SECRET in $ENV_FILE" >&2; exit 78; }
exec curl --silent --show-error --fail-with-body --max-time 120 \
  --request POST \
  --header "Authorization: Bearer $SECRET" \
  --header "Origin: $ORIGIN" \
  --output /dev/null \
  --write-out 'jobs %{http_code}\n' \
  "$ORIGIN/api/donations/jobs"
