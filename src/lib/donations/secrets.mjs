import {
  createCipheriv,
  createDecipheriv,
  createHash,
  randomBytes,
} from "node:crypto";
import { check } from "./core.mjs";
function key() {
  const secret = process.env.DONATIONS_TOKEN_SECRET;
  check(
    typeof secret === "string" && secret.length >= 32,
    "Capability encryption unavailable",
    503,
  );
  return createHash("sha256").update(secret).digest();
}
export function seal(value) {
  const iv = randomBytes(12),
    cipher = createCipheriv("aes-256-gcm", key(), iv);
  const encrypted = Buffer.concat([
    cipher.update(JSON.stringify(value), "utf8"),
    cipher.final(),
  ]);
  return Buffer.concat([iv, cipher.getAuthTag(), encrypted]).toString(
    "base64url",
  );
}
export function unseal(value) {
  check(typeof value === "string", "Recovery unavailable", 409);
  const data = Buffer.from(value, "base64url"),
    cipher = createDecipheriv("aes-256-gcm", key(), data.subarray(0, 12));
  cipher.setAuthTag(data.subarray(12, 28));
  return JSON.parse(
    Buffer.concat([cipher.update(data.subarray(28)), cipher.final()]).toString(
      "utf8",
    ),
  );
}
