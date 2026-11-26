export type Currency = "USD" | "BRL";
export type Frequency = "once" | "monthly";
export type Provider = "stripe" | "btcpay";
export type DonationLocale = "EN" | "BR";
export type ProviderConfiguration = {
  mode: "test" | "live" | "unconfigured";
  currencies?: Currency[];
  stripe?: { enabled: boolean; currencies?: Currency[] };
  btcpay?: { enabled: boolean; monthlyEnabled?: boolean };
};
export function displayCurrencies(
  config: ProviderConfiguration | null,
): Currency[] {
  return config?.currencies?.length ? config.currencies : ["USD", "BRL"];
}
export function providerAvailable(
  config: ProviderConfiguration | null,
  provider: Provider,
  currency: Currency,
  frequency: Frequency,
): boolean {
  if (!config || config.mode === "unconfigured" || !config[provider]?.enabled)
    return false;
  if (!config.currencies?.includes(currency)) return false;
  if (provider === "stripe")
    return !!config.stripe?.currencies?.includes(currency);
  return frequency !== "monthly" || config.btcpay?.monthlyEnabled === true;
}
export const PRESETS = {
  USD: { once: [25, 50, 100, 250], monthly: [10, 25, 50, 100] },
  BRL: { once: [50, 100, 250, 500], monthly: [50, 100, 250, 500] },
};
export const DEFAULTS = {
  USD: { once: 50, monthly: 25 },
  BRL: { once: 50, monthly: 100 },
};
export function createDraft() {
  return {
    currency: null as Currency | null,
    frequency: "once" as Frequency,
    amount: null as number | null,
    custom: "",
    firstName: "",
    lastName: "",
    email: "",
    org: false,
    organization: "",
    message: "",
    newsletter: false,
    recognition: false,
    publicName: "",
    link: "",
    avatar: "",
  };
}
export function managementCredentials(search: string) {
  const params = new URLSearchParams(search.replace(/^[#?]/, ""));
  const id = params.get("id") ?? "";
  const token = params.get("token") ?? "";
  return /^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/i.test(
    id,
  ) && /^[A-Za-z0-9_-]{32,100}$/.test(token)
    ? { id, token }
    : null;
}
export type DonationDraft = ReturnType<typeof createDraft>;
export function validAvatar(
  type: string,
  size: number,
  width: number,
  height: number,
) {
  return (
    ["image/png", "image/jpeg", "image/webp"].includes(type) &&
    size > 0 &&
    size <= 2 * 1024 * 1024 &&
    width >= 32 &&
    height >= 32 &&
    width <= 4096 &&
    height <= 4096
  );
}
export type ManagementCredentials = { id: string; token: string };
export function managementPayload(
  credentials: ManagementCredentials,
  action: string,
  profile?: { name: string; url: string; avatarId?: string | null },
) {
  if (action !== "update-public") return { ...credentials, action };
  if (
    !profile?.name.trim() ||
    (profile.url.trim() && !safeLink(profile.url.trim()))
  )
    return null;
  return {
    ...credentials,
    action,
    profile: {
      name: profile.name.trim(),
      url: profile.url.trim() ? safeLink(profile.url.trim()) : "",
      ...(profile.avatarId !== undefined ? { avatarId: profile.avatarId } : {}),
    },
  };
}
export async function uploadRecognitionAvatar(
  credentials: ManagementCredentials,
  image: Blob,
  request: typeof fetch = fetch,
) {
  const response = await request("/api/donations/upload", {
    method: "POST",
    headers: {
      "Content-Type": image.type,
      "x-donation-id": credentials.id,
      "x-donation-token": credentials.token,
    },
    body: image,
    signal: AbortSignal.timeout(20000),
  });
  if (!response.ok) throw new Error("Upload failed");
  const result = await response.json();
  if (typeof result.avatarId !== "string") throw new Error("Invalid upload");
  return result.avatarId as string;
}
/** The wall card already sits under "Our supporters"; only a real distinction
 * (organization, or a past commitment) is worth a badge. */
export function supporterBadge(item: { kind?: string; activity?: string }) {
  if (item.activity === "past") return "ui.past" as const;
  return item.kind === "org" ? ("wallp.org" as const) : null;
}
export function normalizeLink(raw: string) {
  const value = typeof raw === "string" ? raw.trim() : "";
  if (!value) return "";
  // A donor types "x.com/me"; only an explicit non-https scheme is left to fail.
  const candidate = /^[a-z][a-z0-9+.-]*:/i.test(value) || value.startsWith("//")
    ? value
    : "https://" + value;
  return safeLink(candidate);
}
export function safeLink(raw: string) {
  try {
    const u = new URL(raw);
    const host = u.hostname.toLowerCase();
    return u.protocol === "https:" &&
      !u.username &&
      !u.password &&
      !u.port &&
      host.includes(".") &&
      !/^[\d.]+$/.test(host) &&
      !host.includes(":") &&
      !/(^|\.)(localhost|local|internal|test|invalid)$/.test(host)
      ? u.href
      : "";
  } catch {
    return "";
  }
}
export function validateDraft(
  draft: DonationDraft,
  step: string,
  locale: DonationLocale,
  limits?: { min: number; max: number },
) {
  if (step === "amount") {
    const amount =
      draft.amount ??
      DEFAULTS[effectiveCurrency(draft, locale)][draft.frequency];
    if (
      !Number.isFinite(amount) ||
      amount < (limits?.min ?? 1) ||
      amount > (limits?.max ?? 1000000) ||
      Math.abs(Math.round(amount * 100) - amount * 100) > 0.000001
    )
      return "amount.error";
  }
  if (step === "details") {
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(draft.email.trim()))
      return "details.emailError";
    if (draft.org && !draft.organization.trim())
      return "validation.organization";
    if (draft.recognition && draft.frequency === "monthly") {
      if (
        !draft.publicName.trim() &&
        !(
          draft.org
            ? draft.organization
            : `${draft.firstName} ${draft.lastName}`
        ).trim()
      )
        return "validation.publicName";
      if (draft.link.trim() && !normalizeLink(draft.link))
        return "details.linkError";
    }
  }
  return null;
}
export function paymentState(status: string) {
  return status === "paid"
    ? "success"
    : ["expired", "failed", "cancelled"].includes(status)
      ? "failed"
      : "waiting";
}
export type PublicSupporter = {
  id: string;
  name: string;
  kind: "org" | "person";
  link: string;
  avatar: string;
  activity: "active" | "past";
};
export function publicSupporters(items: unknown): PublicSupporter[] {
  if (!Array.isArray(items)) return [];
  return items
    .filter(
      (i) =>
        i &&
        typeof i.id === "string" &&
        typeof i.name === "string" &&
        (!i.status || i.status === "approved"),
    )
    .map((i) => ({
      id: i.id,
      name: i.name,
      kind: i.kind === "org" ? "org" : "person",
      link: normalizeLink(i.link ?? ""),
      avatar:
        typeof i.avatar === "string" &&
        (i.avatar.startsWith("/api/donations/") ||
          i.avatar.startsWith("/uploads/donations/"))
          ? i.avatar
          : "",
      activity: i.activity === "past" ? "past" : "active",
    }));
}
export function effectiveCurrency(
  draft: DonationDraft,
  locale: DonationLocale,
): Currency {
  return draft.currency ?? (locale === "BR" ? "BRL" : "USD");
}
export function donationSelection(
  draft: DonationDraft,
  locale: DonationLocale,
  direct = false,
) {
  const currency = effectiveCurrency(draft, locale);
  const frequency = direct ? "once" : draft.frequency;
  return {
    currency,
    frequency,
    amount: draft.amount ?? DEFAULTS[currency][frequency],
  };
}
export function checkoutPayload(
  draft: DonationDraft,
  locale: DonationLocale,
  provider: Provider,
  direct = false,
) {
  const currency = effectiveCurrency(draft, locale);
  const frequency = direct ? "once" : draft.frequency;
  return {
    provider,
    frequency,
    currency,
    amount: draft.amount ?? DEFAULTS[currency][frequency],
    locale,
    direct,
    newsletterConsent: !direct && draft.newsletter,
    ...(!direct
      ? {
          donor: {
            firstName: draft.firstName,
            lastName: draft.lastName,
            email: draft.email,
            ...(draft.org ? { organization: draft.organization } : {}),
            message: draft.message,
          },
        }
      : {}),
    ...(!direct && frequency === "monthly" && draft.recognition
      ? {
          publicRecognition: {
            consent: true,
            name:
              draft.publicName.trim() ||
              (draft.org
                ? draft.organization
                : `${draft.firstName} ${draft.lastName}`
              ).trim(),
            kind: draft.org ? "org" : "person",
            link: draft.link,
            avatar: draft.avatar,
          },
        }
      : {}),
  };
}
