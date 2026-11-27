import { test } from "node:test";
import assert from "node:assert/strict";

process.env.NEWSLETTER_CONFIRM_SECRET = "a".repeat(48);

const { signConfirmation, verifyConfirmation } = await import(
    "../src/lib/newsletter/confirm-token.ts"
);
const { allowHit, resetRateLimit } = await import("../src/lib/rate-limit.ts");

const member = { memberId: "6b09630305e6ab38afd11c3b", email: "person@example.com" };
const newsletters = ["6a441fc292d52a06b5b2ac07"];

test("a signed confirmation round-trips", () => {
    const token = signConfirmation({ ...member, newsletters });
    const data = verifyConfirmation(token);
    assert.ok(data);
    assert.equal(data.memberId, member.memberId);
    assert.equal(data.email, member.email);
    assert.deepEqual(data.newsletters, newsletters);
    assert.ok(data.expiresAt > Date.now());
});

test("a tampered token is rejected", () => {
    const token = signConfirmation({ ...member, newsletters });
    const [payload, signature] = token.split(".");
    const forged = Buffer.from(
        JSON.stringify({ ...member, newsletters, expiresAt: Date.now() + 1000 })
    ).toString("base64url");

    assert.equal(verifyConfirmation(`${forged}.${signature}`), null);
    assert.equal(verifyConfirmation(`${payload}.${signature.slice(0, -2)}xx`), null);
    assert.equal(verifyConfirmation(""), null);
    assert.equal(verifyConfirmation("not-a-token"), null);
});

test("a token signed with another secret is rejected", async () => {
    const token = signConfirmation({ ...member, newsletters });
    process.env.NEWSLETTER_CONFIRM_SECRET = "b".repeat(48);
    assert.equal(verifyConfirmation(token), null);
    process.env.NEWSLETTER_CONFIRM_SECRET = "a".repeat(48);
});

test("newsletter ids must look like Ghost ids", () => {
    const token = signConfirmation({ ...member, newsletters: ["not-an-id"] });
    assert.equal(verifyConfirmation(token), null);
});

test("rate limit counts inside the window and recovers after it", async () => {
    resetRateLimit();
    assert.equal(allowHit("k", 2, 50), true);
    assert.equal(allowHit("k", 2, 50), true);
    assert.equal(allowHit("k", 2, 50), false);
    await new Promise((resolve) => setTimeout(resolve, 80));
    assert.equal(allowHit("k", 2, 50), true);
});
