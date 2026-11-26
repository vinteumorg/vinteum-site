#!/bin/sh
# Installs the donations jobs timer. Run as root on the app server.
#   install-jobs-timer.sh /path/to/app.env https://www.vinteum.org
set -eu
ENV_FILE=${1:?usage: install-jobs-timer.sh ENV_FILE ORIGIN}
ORIGIN=${2:?usage: install-jobs-timer.sh ENV_FILE ORIGIN}
HERE=$(cd "$(dirname "$0")" && pwd)
[ -r "$ENV_FILE" ] || { echo "cannot read $ENV_FILE" >&2; exit 1; }
grep -q '^DONATIONS_CRON_SECRET=..*' "$ENV_FILE" || { echo "DONATIONS_CRON_SECRET missing in $ENV_FILE" >&2; exit 1; }

install -m 700 "$HERE/run-jobs.sh" /usr/local/bin/vinteum-donations-jobs.sh
printf 'DONATIONS_ENV_FILE=%s\nDONATIONS_ORIGIN=%s\n' "$ENV_FILE" "$ORIGIN" > /etc/vinteum-donations-jobs.env
chmod 600 /etc/vinteum-donations-jobs.env
install -m 644 "$HERE/vinteum-donations-jobs.service" /etc/systemd/system/
install -m 644 "$HERE/vinteum-donations-jobs.timer" /etc/systemd/system/
systemd-analyze verify /etc/systemd/system/vinteum-donations-jobs.service /etc/systemd/system/vinteum-donations-jobs.timer
systemctl daemon-reload
systemctl enable --now vinteum-donations-jobs.timer
systemctl start vinteum-donations-jobs.service
systemctl --no-pager status vinteum-donations-jobs.service | tail -5
systemctl list-timers vinteum-donations-jobs.timer --no-pager | sed -n 2p
