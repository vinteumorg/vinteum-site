import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const css = readFileSync(
  new URL("../src/app/components/donate/donations.css", import.meta.url),
  "utf8",
);
const management = readFileSync(
  new URL("../src/app/components/donate/DonationManagement.tsx", import.meta.url),
  "utf8",
);

function declarations(selector) {
  const escaped = selector.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const match = css.match(new RegExp(`${escaped}\\s*\\{([^}]+)\\}`));
  assert.ok(match, `Missing scoped spacing rule: ${selector}`);
  return Object.fromEntries(
    match[1].trim().split(";").filter(Boolean).map((entry) => {
      const [property, value] = entry.split(":");
      return [property.trim(), value.trim()];
    }),
  );
}

test("management fields have real vertical spacing, not margins on inline labels", () => {
  // Keep implicit label associations; only management gets the layout correction.
  assert.equal((management.match(/<label className="field">/g) ?? []).length, 2);
  const field = declarations(".donations .management-wrap .stack > .field");
  assert.equal(field.display, "grid", "field labels must establish block-level groups");
  assert.equal(field.gap, "8px", "labels stay close to their own controls");
  assert.equal(
    declarations(".donations .management-wrap .stack > .field > .label")["margin-bottom"],
    "0",
    "do not add the shared label margin on top of the grid gap",
  );
  assert.equal(
    declarations(".donations .field + .field")["margin-top"],
    "24px",
    "reuse the existing donation field-group rhythm",
  );
  assert.equal(
    declarations(".donations .management-wrap .stack > .field + .upload")["margin-top"],
    "24px",
    "avatar controls need the same separation as the text fields",
  );
});
