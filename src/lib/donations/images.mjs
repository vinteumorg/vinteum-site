import sharp from "sharp";
import { randomUUID } from "node:crypto";
import { check } from "./core.mjs";
import { pool, transaction } from "./db.mjs";
import { getDonation } from "./service.mjs";
export async function decodeAvatar(bytes, mime) {
  check(
    Buffer.isBuffer(bytes) &&
      bytes.length > 0 &&
      bytes.length <= 2 * 1024 * 1024,
    "Image too large",
    413,
  );
  const expected =
    mime === "image/png"
      ? "png"
      : mime === "image/jpeg"
        ? "jpeg"
        : mime === "image/webp"
          ? "webp"
          : null;
  check(expected, "Only PNG, JPEG and WebP images are supported");
  const magic = bytes.subarray(0, 8);
  check(
    expected === "png"
      ? magic.equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]))
      : expected === "jpeg"
        ? bytes[0] === 255 && bytes[1] === 216 && bytes[2] === 255
        : bytes.toString("ascii", 0, 4) === "RIFF" &&
          bytes.toString("ascii", 8, 12) === "WEBP",
    "Image type mismatch",
  );
  let metadata;
  try {
    metadata = await sharp(bytes, {
      limitInputPixels: 16000000,
      animated: false,
      failOn: "error",
    }).metadata();
  } catch {
    check(false, "Invalid image");
  }
  check(
    metadata.format === expected &&
      metadata.width >= 1 &&
      metadata.height >= 1 &&
      metadata.width <= 4096 &&
      metadata.height <= 4096 &&
      (!metadata.pages || metadata.pages === 1),
    "Invalid image dimensions",
  );
  try {
    return await sharp(bytes, { limitInputPixels: 16000000, failOn: "error" })
      .rotate()
      .resize(256, 256, { fit: "cover", withoutEnlargement: true })
      .webp({ quality: 80 })
      .toBuffer();
  } catch {
    check(false, "Image decoding failed");
  }
}
export async function saveAvatar(id, token, bytes, mime) {
  await getDonation(id, token, true);
  const data = await decodeAvatar(bytes, mime);
  return transaction(async (db) => {
    const d = (
      await db.query("SELECT * FROM donations WHERE id=$1 FOR UPDATE", [id])
    ).rows[0];
    check(
      d.public_consent && d.frequency === "monthly",
      "Recognition not authorized",
      403,
    );
    check(
      (
        await db.query("SELECT id FROM donation_avatars WHERE donation_id=$1", [
          id,
        ])
      ).rowCount < 5,
      "Upload limit reached",
      429,
    );
    const avatarId = randomUUID();
    await db.query(
      "INSERT INTO donation_avatars(id,donation_id,data) VALUES($1,$2,$3)",
      [avatarId, id, data],
    );
    return { avatarId };
  });
}
export async function publicAvatar(id) {
  check(/^[a-f0-9-]{36}$/i.test(id), "Not found", 404);
  const r = await pool().query(
    "SELECT a.data FROM donation_avatars a JOIN donation_profiles p ON p.avatar_id=a.id JOIN donations d ON d.id=p.donation_id WHERE a.id=$1 AND p.state='approved' AND d.public_consent AND d.paid_at IS NOT NULL",
    [id],
  );
  check(r.rowCount, "Not found", 404);
  return r.rows[0].data;
}
