import { check } from "./core.mjs";
import { statusCredentials } from "./status-credentials.mjs";
import { response } from "./http.mjs";
import { getDonation } from "./service.mjs";
import { btcpayPayment, btcpayPlanPayment } from "./providers.mjs";
import { paymentQr } from "./payment-qr.mjs";

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/** Inline payment data exists for one-off invoices and for monthly plan checkouts once
 * the server has proceeded them. Monthly never renders the native provider page.
 */
export async function paymentDetails(
  d,
  { request, qr = paymentQr, serialized } = {},
) {
  check(
    d?.provider === "btcpay" && ["once", "monthly"].includes(d?.frequency),
    "Payment details unavailable",
    404,
  );
  const data =
    d.frequency === "monthly"
      ? await btcpayPlanPayment(d, {
          ...(request ? { request } : {}),
          serialized,
        })
      : await btcpayPayment(d, request ? { request } : {});
  const uri = (kind) =>
    data.methods.find((method) => method.kind === kind)?.uri ?? null;
  const lightning = uri("lightning");
  const onchain = uri("onchain");
  return {
    id: d.id,
    status: data.status,
    expiresAt: data.expiresAt,
    methods: data.methods,
    qr: {
      lightning: lightning ? await qr(lightning) : null,
      onchain: onchain ? await qr(onchain) : null,
    },
  };
}

export function paymentGETWith({
  lookup = getDonation,
  details = paymentDetails,
} = {}) {
  return async (request) => {
    const { id, token } = statusCredentials(request);
    check(typeof id === "string" && UUID.test(id), "Not found", 404);
    const d = await lookup(id, token);
    return response(await details(d));
  };
}
