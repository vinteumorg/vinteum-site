import qrcode from "qrcode-generator";

/** QR codes render only a Bitcoin payment request; nothing else is ever encoded. */
const PAYMENT_URI =
  /^(bitcoin:[a-zA-HJ-NP-Z0-9?=&%._~+:/-]+|lnbcrt[0-9a-z]+|lnbc[0-9a-z]+|lntb[0-9a-z]+|lnsb[0-9a-z]+)$/;
const MAX_PAYLOAD = 650;
const MAX_SVG = 40000;
const BORDER = 2;

/** BOLT11 is bech32, so the all-uppercase form is the QR convention; BIP21 stays verbatim. */
export function paymentQrPayload(uri) {
  if (typeof uri !== "string") return null;
  const value = uri.trim();
  if (!value || value.length > MAX_PAYLOAD) return null;
  if (!PAYMENT_URI.test(value)) return null;
  return /^ln/i.test(value) ? value.toUpperCase() : value;
}

/** One symbol as a single-path SVG, horizontal runs merged so the markup stays
 * small. The encoder is dependency-free (qrcode-generator, MIT).
 */
export function qrSvg(payload, border = BORDER) {
  const symbol = qrcode(0, "M");
  symbol.addData(payload);
  symbol.make();
  const count = symbol.getModuleCount();
  const size = count + border * 2;
  const runs = [];
  for (let y = 0; y < count; y++) {
    let x = 0;
    while (x < count) {
      if (!symbol.isDark(y, x)) {
        x += 1;
        continue;
      }
      let end = x + 1;
      while (end < count && symbol.isDark(y, end)) end += 1;
      runs.push(`M${x + border},${y + border}h${end - x}v1h-${end - x}z`);
      x = end;
    }
  }
  if (!runs.length) return null;
  return (
    '<svg xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Bitcoin payment QR code" ' +
    `focusable="false" viewBox="0 0 ${size} ${size}" shape-rendering="crispEdges">` +
    '<rect width="100%" height="100%" fill="#ffffff"/>' +
    `<path d="${runs.join("")}" fill="#000000"/></svg>`
  );
}

export async function paymentQr(uri) {
  const payload = paymentQrPayload(uri);
  if (!payload) return null;
  try {
    const svg = qrSvg(payload);
    if (typeof svg !== "string" || svg.length > MAX_SVG) return null;
    if (/<script|<image|<foreignObject|<style|href|javascript:|url\(/i.test(svg))
      return null;
    return svg;
  } catch {
    return null;
  }
}
