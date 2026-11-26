import { verifiedConfig } from "./readiness.mjs";
import { statusCredentials } from "./status-credentials.mjs";
import { timingSafeEqual } from "node:crypto";
import { check, tokenHash } from "./core.mjs";
import {
  route,
  response,
  jsonBody,
  boundedBody,
  frontendCheckout,
  publicConfig,
} from "./http.mjs";
import {
  createCheckout,
  getDonation,
  refreshDonation,
  manageDonation,
  listSupporters,
} from "./service.mjs";
import { saveAvatar, decodeAvatar, publicAvatar } from "./images.mjs";
import { submitMajorGift, runJobs } from "./jobs.mjs";
import { stripeWebhook, bitcoinWebhook } from "./webhooks.mjs";
import { rateLimit } from "./db.mjs";
import { paymentGETWith } from "./payment.mjs";
export const configGET = route(
  async () => response(publicConfig(await verifiedConfig())),
  { enabled: false },
);
export const checkoutPOST = route(
  async (request) => {
    const body = await jsonBody(request, 3 * 1024 * 1024);
    const normalized = frontendCheckout(body, request);
    let image;
    if (body.publicRecognition?.avatar) {
      const match =
        /^data:(image\/(?:png|jpeg|webp));base64,([A-Za-z0-9+/]+={0,2})$/.exec(
          body.publicRecognition.avatar,
        );
      check(match, "Invalid avatar encoding");
      image = await decodeAvatar(Buffer.from(match[2], "base64"), match[1]);
    }
    const result = await createCheckout(normalized, { avatarData: image });
    return response(result, result.creationState === "uncertain" ? 202 : 200);
  },
  { write: true, limit: 10 },
);
export const statusGET = route(
  async (request) => {
    const { id, token } = statusCredentials(request);
    const d = await getDonation(id, token);
    await rateLimit(`status:${d.id}`, 20, 60);
    let current = d;
    if (
      d.provider_id &&
      (!d.last_checked_at ||
        Date.now() - new Date(d.last_checked_at).getTime() > 4000)
    )
      current = await refreshDonation(d.id);
    const output = {
      id: d.id,
      status: current.status,
      provider: d.provider,
      frequency: d.frequency,
      recurringStatus: current.recurring_status,
      cancellationScheduled: current.cancellation_scheduled,
      checkoutUrl: d.checkout_url,
      creationState: d.creation_state,
    };
    return response(output);
  },
  { enabled: false, operational: true, limit: 600 },
);
export const paymentGET = route(paymentGETWith(), {
  enabled: false,
  operational: true,
  limit: 120,
});
export const managePOST = route(
  async (request) => response(await manageDonation(await jsonBody(request))),
  { write: true, enabled: false, operational: true, limit: 20 },
);
export const supportersGET = route(
  async () => response({ supporters: await listSupporters() }),
  { enabled: false, operational: true, limit: 120 },
);
export const uploadPOST = route(
  async (request) =>
    response(
      await saveAvatar(
        request.headers.get("x-donation-id"),
        request.headers.get("x-donation-token"),
        await boundedBody(request, 2 * 1024 * 1024),
        request.headers.get("content-type"),
      ),
    ),
  { write: true, enabled: false, operational: true, limit: 10 },
);
export const avatarGET = route(
  async (_request, context) => {
    const { id } = await context.params;
    return new Response(await publicAvatar(id), {
      headers: {
        "Content-Type": "image/webp",
        "Cache-Control": "private, no-store",
        "X-Content-Type-Options": "nosniff",
        "Content-Security-Policy": "default-src 'none'",
      },
    });
  },
  { enabled: false, operational: true, limit: 300 },
);
export const majorGiftPOST = route(
  async (request) => response(await submitMajorGift(await jsonBody(request))),
  { write: true, limit: 3 },
);
export const stripePOST = route(
  async (request) =>
    response(
      await stripeWebhook(
        await boundedBody(request, 1048576),
        request.headers.get("stripe-signature"),
      ),
    ),
  { enabled: false, operational: true, limit: 600 },
);
export const bitcoinPOST = route(
  async (request) =>
    response(
      await bitcoinWebhook(
        await boundedBody(request, 1048576),
        request.headers.get("btcpay-sig"),
      ),
    ),
  { enabled: false, operational: true, limit: 600 },
);
export const jobsPOST = route(
  async (request) => {
    const secret = process.env.DONATIONS_CRON_SECRET;
    check(secret && secret.length >= 32, "Jobs unavailable", 503);
    const supplied = request.headers.get("authorization") || "";
    check(
      timingSafeEqual(
        Buffer.from(tokenHash(supplied)),
        Buffer.from(tokenHash(`Bearer ${secret}`)),
      ),
      "Unauthorized",
      401,
    );
    return response(await runJobs());
  },
  { enabled: false, operational: true, limit: 10 },
);
