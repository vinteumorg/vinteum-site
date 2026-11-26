"use client";

import {
  useEffect,
  useRef,
  useState,
  useCallback,
  startTransition,
  type ReactNode,
} from "react";
import Link from "next/link";
import Image from "next/image";
import { useLanguage } from "@/contexts/LanguageContext";
import {
  createDraft,
  donationSelection,
  checkoutPayload,
  validateDraft,
  paymentState,
  publicSupporters,
  safeLink,
  supporterBadge,
  validAvatar,
  displayCurrencies,
  providerAvailable,
  PRESETS,
  type DonationDraft,
  type Currency,
  type Frequency,
  type Provider,
  type PublicSupporter,
} from "./flow";
import { StripeDonationCheckout } from "./StripeDonationCheckout";
import "./donations.css";
import "./donations-payment.css";

type Config = {
  mode: "test" | "live" | "unconfigured";
  stripe?: {
    enabled: boolean;
    publishableKey?: string;
    currencies?: Currency[];
  };
  btcpay?: { enabled: boolean; monthlyEnabled?: boolean };
  currencies?: Currency[];
  presets?: typeof PRESETS;
  limits?: Record<Currency, { min: number; max: number }>;
};
type Checkout = {
  id: string;
  token: string;
  manageToken?: string;
  provider: Provider;
  clientSecret?: string;
  checkoutUrl?: string;
  direct?: boolean;
};
type Screen = "amount" | "details" | "payment" | "direct" | "checkout";
type PaymentMethod = {
  kind: "lightning" | "onchain";
  uri: string;
  address: string | null;
  btcAmount: string | null;
  confirmed: boolean;
};
type BitcoinPayment = {
  status: string;
  expiresAt: string | null;
  methods: PaymentMethod[];
  qr: { lightning: string | null; onchain: string | null };
};
type Translate = (
  key: string,
  vars?: Record<string, string | number>,
) => string;
const steps = ["amount", "details", "payment"] as const;
// Defence in depth: the server already allowlists these, the client re-checks before
// injecting an SVG string or offering a payment request it cannot verify.
const PAYMENT_URI = /^(bitcoin:|lnbcrt|lnbc|lntb|lnsb)/i;
function safeQr(value: unknown) {
  return typeof value === "string" &&
    /^<svg [^>]*viewBox="/.test(value) &&
    !/<script|<foreignObject|href=|javascript:/i.test(value)
    ? value
    : null;
}
function safeBitcoinPayment(value: unknown): BitcoinPayment | null {
  if (!value || typeof value !== "object") return null;
  const data = value as Record<string, unknown>;
  const methods: PaymentMethod[] = [];
  for (const entry of Array.isArray(data.methods) ? data.methods : []) {
    if (!entry || typeof entry !== "object") continue;
    const method = entry as Record<string, unknown>;
    if (method.kind !== "lightning" && method.kind !== "onchain") continue;
    if (typeof method.uri !== "string" || method.uri.length > 2048) continue;
    if (!PAYMENT_URI.test(method.uri)) continue;
    if (methods.some((item) => item.kind === method.kind)) continue;
    methods.push({
      kind: method.kind,
      uri: method.uri,
      address: typeof method.address === "string" ? method.address : null,
      btcAmount: typeof method.btcAmount === "string" ? method.btcAmount : null,
      confirmed: method.confirmed === true,
    });
  }
  if (!methods.length) return null;
  const qr = (data.qr ?? {}) as Record<string, unknown>;
  return {
    status: typeof data.status === "string" ? data.status : "pending",
    expiresAt:
      typeof data.expiresAt === "string" &&
      Number.isFinite(Date.parse(data.expiresAt))
        ? data.expiresAt
        : null,
    methods,
    qr: { lightning: safeQr(qr.lightning), onchain: safeQr(qr.onchain) },
  };
}
function BitcoinPaymentPanel({
  payment,
  amount,
  frequency,
  locale,
  expired,
  checkoutUrl,
  t,
  money,
  onRefresh,
}: {
  payment: BitcoinPayment;
  amount: number;
  frequency: Frequency;
  locale: string;
  expired: boolean;
  checkoutUrl?: string;
  t: Translate;
  money: (value: number) => string;
  onRefresh: () => void;
}) {
  const [rail, setRail] = useState<PaymentMethod["kind"]>(
    payment.methods.some((method) => method.kind === "lightning")
      ? "lightning"
      : "onchain",
  );
  const [copied, setCopied] = useState<"" | "ok" | "fail">("");
  const copyTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  useEffect(
    () => () => {
      if (copyTimer.current) clearTimeout(copyTimer.current);
    },
    [],
  );
  const method =
    payment.methods.find((item) => item.kind === rail) ?? payment.methods[0];
  const qr = payment.qr[method.kind];
  const copy = async () => {
    let result: "ok" | "fail" = "fail";
    try {
      await navigator.clipboard.writeText(method.uri);
      result = "ok";
    } catch {
      try {
        const area = document.createElement("textarea");
        area.value = method.uri;
        area.setAttribute("readonly", "");
        area.style.position = "fixed";
        area.style.opacity = "0";
        document.body.appendChild(area);
        area.select();
        result = document.execCommand?.("copy") ? "ok" : "fail";
        document.body.removeChild(area);
      } catch {
        result = "fail";
      }
    }
    setCopied(result);
    if (copyTimer.current) clearTimeout(copyTimer.current);
    copyTimer.current = setTimeout(() => setCopied(""), 4000);
  };
  const expires = payment.expiresAt
    ? new Intl.DateTimeFormat(locale === "BR" ? "pt-BR" : "en-US", {
        hour: "2-digit",
        minute: "2-digit",
      }).format(new Date(payment.expiresAt))
    : "";
  return (
    <div className="pay-inline">
      <div className="pay-total">
        <span>{t("sum.total")}</span>
        <b>
          {money(amount)}
          {frequency === "monthly" ? (locale === "BR" ? "/mês" : "/mo") : ""}
        </b>
      </div>
      {payment.methods.length > 1 && (
        <div className="pay-rail" role="group" aria-label={t("btc.title")}>
          {payment.methods.map((item) => (
            <button
              key={item.kind}
              type="button"
              aria-pressed={rail === item.kind}
              className={rail === item.kind ? "active" : ""}
              onClick={() => {
                setRail(item.kind);
                setCopied("");
              }}
            >
              {t(item.kind === "lightning" ? "btc.ln" : "btc.chain")}
            </button>
          ))}
        </div>
      )}
      {qr && (
        <div
          className="pay-qr"
          // Only the server-generated, allowlisted QR SVG reaches this node.
          dangerouslySetInnerHTML={{ __html: qr }}
        />
      )}
      {method.btcAmount && (
        <p className="pay-btc">
          {method.btcAmount} BTC
          {method.address && <span className="pay-address">{method.address}</span>}
        </p>
      )}
      <div className="pay-request">
        <code>{method.uri}</code>
        <button
          type="button"
          className="pay-copy"
          onClick={() => void copy()}
          aria-live="polite"
        >
          {copied === "ok" ? t("btc.copied") : t("btc.copy")}
        </button>
      </div>
      {copied === "fail" && (
        <p className="pay-hint" role="status">
          {t("btc.copyFailed")}
        </p>
      )}
      {expired ? (
        <p className="pay-hint" role="status">
          {t("btc.expiredNow")}
        </p>
      ) : (
        expires && (
          <p className="pay-expires">
            {t("btc.expires")} {expires}
          </p>
        )
      )}
      {frequency === "monthly" && (
        <p className="pay-monthly">{t("btc.monthlyNote")}</p>
      )}
      <div className="pay-actions">
        <button className="btn btn-ghost" onClick={onRefresh}>
          {t("ui.refresh")}
        </button>
        {checkoutUrl && (
          <a
            className="pay-fallback"
            href={checkoutUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            {t("btc.fallback")} ↗
          </a>
        )}
      </div>
    </div>
  );
}
function useDonationText(): Translate {
  const { t } = useLanguage();
  return (key, vars) => {
    let text = t(`donations.${key}`);
    for (const [name, value] of Object.entries(vars ?? {}))
      text = text.replaceAll(`{${name}}`, String(value));
    return text;
  };
}
function CheckIcon() {
  return (
    <svg viewBox="0 0 20 20" aria-hidden="true">
      <path d="M4 10.5l4 4 8-9" />
    </svg>
  );
}
function HeroLight() {
  return (
    <div className="hero-light" aria-hidden="true">
      <Image
        src="/assets/backgrounds/hero-home.svg"
        alt=""
        fill
        priority
        sizes="100vw"
      />
      <div className="hero-glow" />
    </div>
  );
}
// Uploaded avatars are served as validated images; data URLs exist only in the local preview.
/* eslint-disable @next/next/no-img-element */
function Avatar({ name, avatar }: { name: string; avatar?: string }) {
  return (
    <span
      className="avatar"
      style={{ background: "linear-gradient(135deg,#91FFAE,#3CAE66)" }}
    >
      {avatar ? (
        <img src={avatar} alt="" />
      ) : (
        name
          .trim()
          .split(/\s+/)
          .slice(0, 2)
          .map((s) => s[0])
          .join("")
          .toUpperCase() || "?"
      )}
    </span>
  );
}
/* eslint-enable @next/next/no-img-element */
export function SupporterCard({
  item,
  preview = false,
}: {
  item: PublicSupporter;
  preview?: boolean;
}) {
  const t = useDonationText();
  const href = safeLink(item.link);
  const badge = supporterBadge(item);
  const body = (
    <>
      <Avatar name={item.name} avatar={item.avatar} />
      {badge && <span className="kind">{t(badge)}</span>}
      <span>
        <b>{item.name}</b>
        {href && <small>{new URL(href).hostname.replace(/^www\./, "")}</small>}
      </span>
    </>
  );
  return href && !preview ? (
    <a
      className="supporter"
      href={href}
      target="_blank"
      rel="noopener noreferrer"
    >
      {body}
    </a>
  ) : (
    <div className="supporter">{body}</div>
  );
}
function useSupporters() {
  const [items, setItems] = useState<PublicSupporter[]>([]);
  const [state, setState] = useState("loading");
  const reload = useCallback(async (signal?: AbortSignal) => {
    try {
      const response = await fetch("/api/donations/supporters", {
        signal,
        cache: "no-store",
      });
      if (!response.ok) throw Error();
      const data = await response.json();
      setItems(publicSupporters(data.supporters));
      setState("ready");
    } catch (error) {
      if (!(error instanceof DOMException && error.name === "AbortError"))
        setState("error");
    }
  }, []);
  useEffect(() => {
    const controller = new AbortController();
    void reload(controller.signal);
    return () => controller.abort();
  }, [reload]);
  return { items, state, reload };
}
function useReveals(root: React.RefObject<HTMLDivElement | null>) {
  useEffect(() => {
    const elements = root.current?.querySelectorAll<HTMLElement>(".reveal");
    if (
      !elements ||
      !("IntersectionObserver" in window) ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    )
      return;
    const observer = new IntersectionObserver(
      (entries) =>
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.removeAttribute("data-pending-reveal");
            observer.unobserve(entry.target);
          }
        }),
      { rootMargin: "0px 0px -40px 0px" },
    );
    elements.forEach((element) => {
      if (element.getBoundingClientRect().top > window.innerHeight) {
        element.setAttribute("data-pending-reveal", "");
        observer.observe(element);
      }
    });
    return () => observer.disconnect();
  }, [root]);
}
function Toggle({
  checked,
  onChange,
  title,
  sub,
}: {
  checked: boolean;
  onChange: (value: boolean) => void;
  title: string;
  sub: string;
}) {
  return (
    <label className="toggle">
      <span>
        <b>{title}</b>
        <small>{sub}</small>
      </span>
      <span className="switch">
        <input
          type="checkbox"
          checked={checked}
          onChange={(event) => onChange(event.target.checked)}
        />
        <span />
      </span>
    </label>
  );
}
function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: ReactNode;
}) {
  return (
    <div className="field">
      <span className="label">{label}</span>
      {children}
      {hint && <small className="hint">{hint}</small>}
    </div>
  );
}

export function DonationsExperience() {
  const { locale } = useLanguage();
  const t = useDonationText();
  const root = useRef<HTMLDivElement>(null);
  useReveals(root);
  const [draft, setDraft] = useState(createDraft);
  const [screen, setScreen] = useState<Screen>("amount");
  const [method, setMethod] = useState<Provider>("stripe");
  const [config, setConfig] = useState<Config | null>(null);
  const [configError, setConfigError] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [checkout, setCheckout] = useState<Checkout | null>(null);
  const [status, setStatus] = useState("pending");
  const [payment, setPayment] = useState<BitcoinPayment | null>(null);
  const [paymentFailed, setPaymentFailed] = useState(false);
  const [managementUrl, setManagementUrl] = useState("");
  const key = useRef("");
  const panel = useRef<HTMLElement>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const {
    currency,
    amount,
    frequency: displayFrequency,
  } = donationSelection(draft, locale, screen === "direct");
  const money = (value: number) =>
    new Intl.NumberFormat(locale === "BR" ? "pt-BR" : "en-US", {
      style: "currency",
      currency,
      maximumFractionDigits: value % 1 ? 2 : 0,
    }).format(value);
  const { items } = useSupporters();
  const set = (patch: Partial<DonationDraft>) => {
    setDraft((current) => ({ ...current, ...patch }));
    key.current = "";
    setError("");
  };
  const navigate = (next: Screen) => {
    setScreen(next);
    setError("");
    requestAnimationFrame(() => {
      panel.current
        ?.querySelector<HTMLElement>("h2,h3")
        ?.focus({ preventScroll: true });
      const bounds = panel.current?.getBoundingClientRect();
      if (bounds && (bounds.top < 80 || bounds.top > window.innerHeight * 0.6))
        panel.current?.scrollIntoView({
          behavior: window.matchMedia("(prefers-reduced-motion: reduce)")
            .matches
            ? "instant"
            : "smooth",
          block: "start",
        });
    });
  };
  const loadConfig = useCallback(async (signal?: AbortSignal) => {
    try {
      const response = await fetch("/api/donations/config", {
        signal,
        cache: "no-store",
      });
      if (!response.ok) throw Error();
      setConfig(await response.json());
      setConfigError(false);
    } catch (error) {
      if (!(error instanceof DOMException && error.name === "AbortError"))
        setConfigError(true);
    }
  }, []);
  useEffect(() => {
    const controller = new AbortController();
    void loadConfig(controller.signal);
    return () => controller.abort();
  }, [loadConfig]);
  useEffect(() => {
    if (
      new URLSearchParams(window.location.search).get("frequency") === "monthly"
    )
      startTransition(() =>
        setDraft((current) => ({ ...current, frequency: "monthly" })),
      );
    try {
      const value = sessionStorage.getItem("vinteum-donation-session");
      if (value) {
        const data = JSON.parse(value);
        if (typeof data.id === "string" && typeof data.token === "string")
          startTransition(() => {
            setCheckout({
              id: data.id,
              token: data.token,
              manageToken: data.manageToken,
              provider: data.provider,
              direct: data.direct,
            });
            setScreen("checkout");
          });
      }
    } catch {
      /* Storage may be unavailable. */
    }
  }, []);
  const refresh = useCallback(
    async (signal?: AbortSignal) => {
      if (!checkout) return;
      try {
        const params = new URLSearchParams({ id: checkout.id });
        const response = await fetch(`/api/donations/status?${params}`, {
          signal,
          cache: "no-store",
          headers: { Authorization: `Bearer ${checkout.token}` },
        });
        if (!response.ok) throw Error();
        const result = await response.json();
        setStatus(
          typeof result.status === "string" ? result.status : "pending",
        );
        if (
          (result.checkoutUrl && !checkout.checkoutUrl) ||
          (result.clientSecret && !checkout.clientSecret)
        )
          setCheckout((current) =>
            current
              ? {
                  ...current,
                  checkoutUrl:
                    safeLink(result.checkoutUrl ?? "") || current.checkoutUrl,
                  clientSecret: result.clientSecret || current.clientSecret,
                }
              : current,
          );
        setManagementUrl(safeLink(result.managementUrl ?? ""));
        setError("");
      } catch (error) {
        if (!(error instanceof DOMException && error.name === "AbortError"))
          setError("ui.error");
      }
    },
    [checkout],
  );
  useEffect(() => {
    if (!checkout) return;
    const controller = new AbortController();
    void refresh(controller.signal);
    const timer = setInterval(() => void refresh(controller.signal), 5000);
    return () => {
      controller.abort();
      clearInterval(timer);
    };
  }, [checkout, refresh]);
  const loadPayment = useCallback(
    async (signal?: AbortSignal) => {
      if (!checkout || checkout.provider !== "btcpay") return;
      try {
        const params = new URLSearchParams({ id: checkout.id });
        const response = await fetch(`/api/donations/payment?${params}`, {
          signal,
          cache: "no-store",
          headers: { Authorization: `Bearer ${checkout.token}` },
        });
        if (!response.ok) throw Error();
        setPayment(safeBitcoinPayment(await response.json()));
        setPaymentFailed(false);
      } catch (error) {
        if (!(error instanceof DOMException && error.name === "AbortError")) {
          setPayment(null);
          setPaymentFailed(true);
        }
      }
    },
    [checkout],
  );
  useEffect(() => {
    if (!checkout || checkout.provider !== "btcpay") return;
    const controller = new AbortController();
    void loadPayment(controller.signal);
    return () => controller.abort();
  }, [checkout, loadPayment]);
  const frequency = (value: Frequency) =>
    set({
      frequency: value,
      recognition: value === "monthly" ? draft.recognition : false,
      ...(screen === "amount" ? { amount: null, custom: "" } : {}),
    });
  const next = () => {
    const problem = validateDraft(
      { ...draft, amount },
      screen,
      locale,
      config?.limits?.[currency],
    );
    if (problem) {
      setError(problem);
      requestAnimationFrame(() =>
        panel.current
          ?.querySelector<HTMLElement>(
            problem === "details.emailError" ? "input[type=email]" : ".input",
          )
          ?.focus(),
      );
      return;
    }
    navigate(screen === "amount" ? "details" : "payment");
  };
  async function pay(direct = false) {
    const problem = validateDraft(
      { ...draft, amount },
      "amount",
      locale,
      config?.limits?.[currency],
    );
    if (problem) {
      setError(problem);
      return;
    }
    const provider = direct ? "btcpay" : method;
    if (
      !providerAvailable(
        config,
        provider,
        currency,
        direct ? "once" : draft.frequency,
      )
    ) {
      setError("ui.unavailable");
      return;
    }
    if (
      !direct &&
      draft.frequency === "monthly" &&
      provider === "btcpay" &&
      !config?.btcpay?.monthlyEnabled
    ) {
      setError("ui.monthlyUnavailable");
      return;
    }
    setBusy(true);
    setError("");
    try {
      if (!key.current) key.current = crypto.randomUUID();
      const response = await fetch("/api/donations/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Idempotency-Key": key.current,
        },
        body: JSON.stringify(
          checkoutPayload({ ...draft, amount }, locale, provider, direct),
        ),
        signal: AbortSignal.timeout(30000),
      });
      if (!response.ok) throw Error();
      const data: Checkout = await response.json();
      if (!data.id || !data.token) throw Error();
      if (data.checkoutUrl && !safeLink(data.checkoutUrl)) throw Error();
      setCheckout({ ...data, provider, direct });
      setStatus("pending");
      setPayment(null);
      setPaymentFailed(false);
      try {
        sessionStorage.setItem(
          "vinteum-donation-session",
          JSON.stringify({
            id: data.id,
            token: data.token,
            manageToken: data.manageToken,
            provider,
            direct,
          }),
        );
      } catch {}
      navigate("checkout");
    } catch {
      setError("ui.error");
    } finally {
      setBusy(false);
    }
  }
  async function upload(file?: File) {
    if (!file) return;
    if (
      !["image/png", "image/jpeg", "image/webp"].includes(file.type) ||
      file.size > 2 * 1024 * 1024
    ) {
      setError("validation.avatar");
      return;
    }
    try {
      const image = await createImageBitmap(file);
      const valid = validAvatar(
        file.type,
        file.size,
        image.width,
        image.height,
      );
      image.close();
      if (!valid) {
        setError("validation.avatar");
        return;
      }
      const reader = new FileReader();
      reader.onload = () => set({ avatar: String(reader.result) });
      reader.onerror = () => setError("validation.avatar");
      reader.readAsDataURL(file);
    } catch {
      setError("validation.avatar");
    }
  }
  const reset = () => {
    try {
      sessionStorage.removeItem("vinteum-donation-session");
    } catch {}
    key.current = "";
    setCheckout(null);
    setStatus("pending");
    setPayment(null);
    setPaymentFailed(false);
    setDraft(createDraft());
    navigate("amount");
  };
  const summary = (
    <div className="summary">
      <div className="line">
        <span>{t("sum.donation")}</span>
        <b>{money(amount)}</b>
      </div>
      <div className="line">
        <span>{t("sum.frequency")}</span>
        <b>{t(`freq.${draft.frequency}`)}</b>
      </div>
      {draft.frequency === "monthly" && (
        <div className="line">
          <span>{t("sum.wall")}</span>
          <b>{t(draft.recognition ? "sum.yes" : "sum.no")}</b>
        </div>
      )}
      <div className="line total">
        <span>{t("sum.total")}</span>
        <b>
          {money(amount)}
          {draft.frequency === "monthly"
            ? locale === "BR"
              ? "/mês"
              : "/mo"
            : ""}
        </b>
      </div>
    </div>
  );
  const amountFields = (
    <div className="field">
      <div className="label-row">
        <span className="label">{t("amount.label")}</span>
        <select
          className="currency"
          aria-label={t("ui.currency")}
          value={currency}
          onChange={(event) =>
            set({
              currency: event.target.value as Currency,
              amount: null,
              custom: "",
            })
          }
        >
          {displayCurrencies(config).map((value) => (
            <option key={value} value={value}>
              {value}
            </option>
          ))}
        </select>
      </div>
      <div className="amounts">
        {(
          config?.presets?.[currency]?.[displayFrequency] ??
          PRESETS[currency][displayFrequency]
        ).map((value) => (
          <button
            type="button"
            key={value}
            aria-pressed={!draft.custom && amount === value}
            className={!draft.custom && amount === value ? "active" : ""}
            onClick={() => set({ amount: value, custom: "" })}
          >
            {money(value)}
          </button>
        ))}
      </div>
      <div className="input-wrap amount-custom">
        <span className="prefix">{currency === "USD" ? "US$" : "R$"}</span>
        <input
          className="input has-prefix"
          inputMode="decimal"
          aria-label={t("amount.other")}
          placeholder={t("amount.other")}
          value={draft.custom}
          onChange={(event) => {
            const custom = event.target.value;
            set({
              custom,
              amount: custom === "" ? null : Number(custom.replace(",", ".")),
            });
          }}
        />
      </div>
      {config?.limits?.[currency] && (
        <p className="hint">
          {t("ui.range", {
            min: money(config.limits[currency].min),
            max: money(config.limits[currency].max),
          })}
        </p>
      )}
    </div>
  );
  const titleParts = t("hero.title").split(/<\/?em>/);
  let body: ReactNode;
  if (screen === "amount")
    body = (
      <>
        <Field label={t("amount.frequency")}>
          <div
            className="segmented"
            role="group"
            aria-label={t("amount.frequency")}
          >
            {(["once", "monthly"] as const).map((value) => (
              <button
                key={value}
                type="button"
                aria-pressed={draft.frequency === value}
                className={draft.frequency === value ? "active" : ""}
                onClick={() => frequency(value)}
              >
                {t(`freq.${value}`)}
              </button>
            ))}
          </div>
          {draft.frequency === "monthly" && (
            <small className="hint">{t("amount.renewNote")}</small>
          )}
        </Field>
        {amountFields}
        {draft.frequency === "once" && (
          <div className="nudge">
            <p>{t("nudge.text")}</p>
            <button type="button" onClick={() => frequency("monthly")}>
              {t("nudge.cta")} →
            </button>
          </div>
        )}
        <div className="panel-foot">
          <div className="nav-row">
            <button className="btn btn-primary" onClick={next}>
              {t("btn.continue")} · {money(amount)}
              {draft.frequency === "monthly"
                ? locale === "BR"
                  ? "/mês"
                  : "/mo"
                : ""}
            </button>
          </div>
        </div>
      </>
    );
  else if (screen === "details")
    body = (
      <>
        <Field label={t("details.you")}>
          <div className="stack">
            <div className="two">
              <input
                className="input"
                aria-label={t("details.first")}
                placeholder={t("details.first")}
                autoComplete="given-name"
                maxLength={100}
                value={draft.firstName}
                onChange={(event) => set({ firstName: event.target.value })}
              />
              <input
                className="input"
                aria-label={t("details.last")}
                placeholder={t("details.last")}
                autoComplete="family-name"
                maxLength={100}
                value={draft.lastName}
                onChange={(event) => set({ lastName: event.target.value })}
              />
            </div>
            <input
              className="input"
              type="email"
              required
              aria-label={t("details.email")}
              placeholder={t("details.email")}
              autoComplete="email"
              maxLength={254}
              value={draft.email}
              aria-invalid={error === "details.emailError"}
              onChange={(event) => set({ email: event.target.value })}
            />
          </div>
        </Field>
        <div className="field">
          <Toggle
            checked={draft.org}
            onChange={(org) => set({ org })}
            title={t("details.org")}
            sub={t("details.orgSub")}
          />
          {draft.org && (
            <div className="reveal-box">
              <input
                className="input"
                aria-label={t("details.orgName")}
                placeholder={t("details.orgName")}
                maxLength={200}
                value={draft.organization}
                onChange={(event) => set({ organization: event.target.value })}
              />
            </div>
          )}
          {draft.frequency === "monthly" ? (
            <Toggle
              checked={draft.recognition}
              onChange={(recognition) => set({ recognition })}
              title={t("details.ack")}
              sub={t("details.ackSub")}
            />
          ) : (
            <div className="wall-hint">
              <span>{t("details.wallMonthly")}</span>
              <button onClick={() => frequency("monthly")}>
                {t("details.wallMonthlyCta")} →
              </button>
            </div>
          )}
          {draft.frequency === "monthly" && draft.recognition && (
            <div className="reveal-box ack">
              <div className="stack">
                <Field label={t("details.publicName")}>
                  <input
                    className="input"
                    maxLength={70}
                    value={draft.publicName}
                    onChange={(event) => set({ publicName: event.target.value })}
                  />
                </Field>
                <Field label={t("details.link")} hint={t("details.linkHint")}>
                  <input
                    className="input"
                    inputMode="url"
                    autoCapitalize="none"
                    spellCheck={false}
                    maxLength={250}
                    value={draft.link}
                    onChange={(event) => set({ link: event.target.value })}
                  />
                </Field>
                <div className="upload">
                  <label>
                    {t("details.avatar")}
                    <input
                      type="file"
                      accept="image/png,image/jpeg,image/webp"
                      onChange={(event) => void upload(event.target.files?.[0])}
                    />
                  </label>
                  {draft.avatar && (
                    <button onClick={() => set({ avatar: "" })}>
                      {t("details.avatarRemove")}
                    </button>
                  )}
                </div>
              </div>
              <div className="ack-preview">
                <small>{t("details.preview")}</small>
                <SupporterCard
                  preview
                  item={{
                    id: "preview",
                    name:
                      draft.publicName.trim() ||
                      (draft.org
                        ? draft.organization
                        : `${draft.firstName} ${draft.lastName}`
                      ).trim() ||
                      t("wallp.person"),
                    kind: draft.org ? "org" : "person",
                    link: draft.link,
                    avatar: draft.avatar,
                    activity: "active",
                  }}
                />
              </div>
            </div>
          )}
          <Toggle
            checked={draft.newsletter}
            onChange={(newsletter) => set({ newsletter })}
            title={t("details.newsletter")}
            sub={t("details.newsletterSub")}
          />
        </div>
        <Field label={t("details.message")}>
          <textarea
            className="input"
            rows={2}
            maxLength={500}
            aria-label={t("details.message")}
            placeholder={t("details.messagePh")}
            value={draft.message}
            onChange={(event) => set({ message: event.target.value })}
          />
        </Field>
        <div className="panel-foot">
          <div className="nav-row">
            <button
              className="btn btn-ghost"
              onClick={() => navigate("amount")}
            >
              {t("btn.back")}
            </button>
            <button className="btn btn-primary" onClick={next}>
              {t("btn.continue")}
            </button>
          </div>
        </div>
      </>
    );
  else if (screen === "payment")
    body = (
      <>
        <span className="label">{t("pay.title")}</span>
        <div className="methods" role="group" aria-label={t("pay.title")}>
          {(["stripe", "btcpay"] as const).map((provider) => (
            <button
              key={provider}
              className={`method ${method === provider ? "active" : ""}`}
              aria-pressed={method === provider}
              onClick={() => {
                if (provider !== method) key.current = "";
                setMethod(provider);
              }}
            >
              <span className="ico" aria-hidden="true">
                {provider === "stripe" ? "▤" : "₿"}
              </span>
              <span>
                <b>{t(provider === "stripe" ? "pay.card" : "pay.btc")}</b>
                <small>
                  {t(provider === "stripe" ? "pay.cardSub" : "pay.btcSub")}
                </small>
              </span>
              <span className="radio" />
            </button>
          ))}
        </div>
        {!providerAvailable(config, method, currency, draft.frequency) && (
          <p className="note" role="status">
            {t("ui.providerUnavailable")}
          </p>
        )}
        {draft.frequency === "monthly" && method === "btcpay" && (
          <p className="note">{t("pay.monthlyBtc")}</p>
        )}
        <div className="panel-foot">
          {summary}
          <div className="nav-row">
            <button
              className="btn btn-ghost"
              disabled={busy}
              onClick={() => navigate("details")}
            >
              {t("btn.back")}
            </button>
            <button
              className="btn btn-primary"
              disabled={
                busy ||
                !providerAvailable(config, method, currency, draft.frequency)
              }
              onClick={() => void pay()}
            >
              {busy
                ? t("ui.loading")
                : t(
                    draft.frequency === "monthly"
                      ? "pay.ctaMonthly"
                      : "pay.cta",
                    { amount: money(amount) },
                  )}
            </button>
          </div>
          <p className="fineprint">{t("pay.disclaimer")}</p>
        </div>
      </>
    );
  else if (screen === "direct")
    body = (
      <>
        <button className="back" onClick={() => navigate("amount")}>
          ← {t("direct.backForm")}
        </button>
        <h3 tabIndex={-1}>{t("direct.title")}</h3>
        <p className="sub">{t("direct.sub")}</p>
        {amountFields}
        <p className="note">
          {t("direct.note")}{" "}
          <a
            href="https://vinteum.org/blog/inside-a-vinteum-deep-dive-how-private-are-bitcoin-transactions-really"
            target="_blank"
            rel="noopener noreferrer"
          >
            {t("direct.deepDive")} ↗
          </a>
        </p>
        {!config?.btcpay?.enabled && (
          <p className="note" role="status">
            {t("ui.providerUnavailable")}
          </p>
        )}
        <div className="panel-foot">
          <div className="nav-row">
            <button
              className="btn btn-primary"
              disabled={
                busy || !providerAvailable(config, "btcpay", currency, "once")
              }
              onClick={() => void pay(true)}
            >
              {busy ? t("ui.loading") : t("ui.openCheckout")}
            </button>
          </div>
        </div>
      </>
    );
  else if (checkout && paymentState(status) === "success")
    body = (
      <>
        <div className="success-icon">
          <CheckIcon />
        </div>
        <h3 tabIndex={-1}>{t("done.title")}</h3>
        <p className="sub">{t("done.sub")}</p>
        {!checkout.direct && <p className="note">{t("ui.pendingReceipt")}</p>}
        {draft.frequency === "monthly" && draft.recognition && (
          <div className="ack-status">
            <b>{t("done.ackTitle")}</b>
            <p>{t("done.ackText")}</p>
            <Link href="/donate/supporters">{t("done.wall")}</Link>
          </div>
        )}
        {checkout.manageToken && (
          <Link
            className="btn btn-ghost"
            href={`/donate/manage#id=${encodeURIComponent(checkout.id)}&token=${encodeURIComponent(checkout.manageToken)}`}
          >
            {t("ui.manage")}
          </Link>
        )}
        {managementUrl && (
          <a
            className="btn btn-ghost"
            href={managementUrl}
            rel="noopener noreferrer"
          >
            {t("ui.manage")}
          </a>
        )}
        <div className="panel-foot">
          <button className="btn btn-ghost btn-block" onClick={reset}>
            {t("done.again")}
          </button>
        </div>
      </>
    );
  else if (checkout)
    body = (
      <>
        <h3 tabIndex={-1}>
          {t(checkout.provider === "stripe" ? "card.title" : "btc.title")}
        </h3>
        <p className="sub">
          {t(checkout.provider === "stripe" ? "card.sub" : "btc.sub")}
        </p>
        <div className="provider-checkout">
          {!checkout.clientSecret && !checkout.checkoutUrl && (
            <p className="note">{t("ui.checking")}</p>
          )}
          {paymentState(status) === "failed" ? (
            <p className="note">
              {t(
                checkout.provider === "btcpay" && status === "expired"
                  ? "btc.expiredNow"
                  : "ui.failedSafe",
              )}
            </p>
          ) : checkout.provider === "stripe" &&
            checkout.clientSecret &&
            config?.stripe?.publishableKey ? (
            <StripeDonationCheckout
              clientSecret={checkout.clientSecret}
              publishableKey={config.stripe.publishableKey}
              onComplete={() => void refresh()}
            />
          ) : checkout.provider === "btcpay" && payment ? (
            <BitcoinPaymentPanel
              key={payment.methods[0].uri}
              payment={payment}
              amount={amount}
              frequency={draft.frequency}
              locale={locale}
              expired={status === "expired"}
              checkoutUrl={checkout.checkoutUrl}
              t={t}
              money={money}
              onRefresh={() => {
                void loadPayment();
                void refresh();
              }}
            />
          ) : checkout.checkoutUrl ? (
            <>
              {checkout.provider === "btcpay" && (
                <p className="note" role="status">
                  {t(paymentFailed ? "btc.unavailable" : "btc.loading")}
                </p>
              )}
              <a
                className="btn btn-primary btn-block"
                href={checkout.checkoutUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                {t("ui.openCheckout")} ↗
              </a>
            </>
          ) : null}
        </div>
        <p className="waiting" role="status">
          <span className="pulse" />
          {t(
            `status.${["pending", "processing", "confirming", "partial", "late", "expired", "cancelled", "failed", "paid"].includes(status) ? status : "pending"}`,
          )}
        </p>
        <div className="panel-foot">
          <div className="nav-row">
            <button className="btn btn-ghost" onClick={() => void refresh()}>
              {t("ui.refresh")}
            </button>
            {paymentState(status) === "failed" && (
              <button
                className="btn btn-primary"
                onClick={() => {
                  try {
                    sessionStorage.removeItem("vinteum-donation-session");
                  } catch {}
                  key.current = "";
                  setCheckout(null);
                  navigate(checkout.direct ? "direct" : "payment");
                }}
              >
                {t("ui.newInvoice")}
              </button>
            )}
          </div>
          <p className="fineprint">{t("pay.disclaimer")}</p>
        </div>
      </>
    );
  return (
    <div className="donations" ref={root}>
      <section className="donate-hero">
        <HeroLight />
        <div className="container donate-grid">
          <div className="hero-copy">
            <h1 className="display reveal">
              {titleParts[0]}
              <em>{titleParts[1]}</em>
              {titleParts[2]}
            </h1>
            <p className="lede reveal">{t("hero.lede")}</p>
            <ul className="trust reveal">
              {[1, 2, 3].map((number) => (
                <li key={number}>
                  <CheckIcon />
                  <span>{t(`hero.t${number}`)}</span>
                </li>
              ))}
            </ul>
            <button
              className="private-link reveal"
              onClick={() => navigate("direct")}
            >
              <span className="bolt" aria-hidden="true">
                ϟ
              </span>
              <span>
                <b>{t("hero.private.title")}</b>
                <small>{t("hero.private.sub")}</small>
              </span>
            </button>
          </div>
          <aside
            className="panel reveal"
            ref={panel}
            aria-label={t("panel.title")}
            style={{ scrollMarginTop: 90 }}
          >
            <div className="step-enter" key={screen}>
              {config?.mode === "test" && (
                <p className="notice" role="status">
                  {t("ui.test")}
                </p>
              )}
              {!checkout &&
                (configError ||
                  config?.mode === "unconfigured" ||
                  (config &&
                    !config.stripe?.enabled &&
                    !config.btcpay?.enabled)) && (
                  <div className="notice" role="status">
                    {t("ui.unavailable")}
                    {configError && (
                      <button onClick={() => void loadConfig()}>
                        {t("ui.retry")}
                      </button>
                    )}
                  </div>
                )}
              {steps.includes(screen as (typeof steps)[number]) && (
                <>
                  <div className="panel-head">
                    <h2 tabIndex={-1}>{t("panel.title")}</h2>
                    <span className="secure">♧ {t("panel.secure")}</span>
                  </div>
                  <ol className="stepper">
                    {steps.map((step, index) => (
                      <li
                        key={step}
                        className={
                          index ===
                          steps.indexOf(screen as (typeof steps)[number])
                            ? "current"
                            : index <
                                steps.indexOf(screen as (typeof steps)[number])
                              ? "done"
                              : ""
                        }
                        aria-current={screen === step ? "step" : undefined}
                      >
                        {index + 1}. {t(`step.${step}`)}
                      </li>
                    ))}
                  </ol>
                </>
              )}
              {body}
              {error && (
                <p className="error" role="alert">
                  {t(error)}
                </p>
              )}
            </div>
          </aside>
        </div>
      </section>
      <section className="section">
        <div className="container">
          <div className="wall-strip reveal">
            {items.length > 0 && (
              <div className="faces">
                {items.slice(0, 6).map((item) => (
                  <Avatar key={item.id} name={item.name} avatar={item.avatar} />
                ))}
              </div>
            )}
            <p>{t("wall.strip")}</p>
            <Link className="link-arrow" href="/donate/supporters">
              {t("wall.see")} →
            </Link>
          </div>
          <div className="major reveal">
            <div>
              <h2>{t("major.title")}</h2>
              <p>{t("major.text")}</p>
              <p className="major-link">
                <Link href="/about#supporters">{t("major.existing")} →</Link>
              </p>
            </div>
            <button
              className="btn btn-primary"
              onClick={() => dialog.current?.showModal()}
            >
              {t("major.cta")} ↗
            </button>
          </div>
        </div>
      </section>
      <section className="section">
        <div className="container faq-wrap">
          <div className="reveal">
            <h2 className="section-title">{t("faq.title")}</h2>
            <p className="section-lede">
              <Link href="/contact">{t("faq.lede")}</Link>
            </p>
          </div>
          <div className="faq reveal">
            {[1, 2, 3, 4, 5].map((number) => (
              <details key={number}>
                <summary>{t(`faq.q${number}`)}</summary>
                <p>{t(`faq.a${number}`)}</p>
              </details>
            ))}
          </div>
        </div>
      </section>
      <MajorGifts dialog={dialog} />
    </div>
  );
}

function MajorGifts({
  dialog,
}: {
  dialog: React.RefObject<HTMLDialogElement | null>;
}) {
  const t = useDonationText();
  const { locale } = useLanguage();
  const [busy, setBusy] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState(false);
  const requestId = useRef("");
  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const values = new FormData(event.currentTarget);
    setBusy(true);
    setError(false);
    try {
      if (!requestId.current) requestId.current = crypto.randomUUID();
      const response = await fetch("/api/donations/major-gifts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Idempotency-Key": requestId.current,
        },
        body: JSON.stringify({
          locale,
          name: values.get("name"),
          email: values.get("email"),
          organization: values.get("organization"),
          message: values.get("message"),
          website: values.get("website"),
        }),
        signal: AbortSignal.timeout(20000),
      });
      if (!response.ok) throw Error();
      setSent(true);
    } catch {
      setError(true);
    } finally {
      setBusy(false);
    }
  }
  return (
    <dialog
      ref={dialog}
      aria-labelledby="major-gifts-title"
      onClick={(event) => {
        if (event.target === dialog.current) dialog.current.close();
      }}
    >
      <div className="modal-card">
        <button
          className="close"
          aria-label={t("modal.close")}
          onClick={() => dialog.current?.close()}
        >
          ×
        </button>
        <h3 id="major-gifts-title">
          {t(sent ? "modal.doneTitle" : "modal.title")}
        </h3>
        <p className="sub">{t(sent ? "modal.doneText" : "modal.sub")}</p>
        {sent ? (
          <button
            className="btn btn-ghost btn-block"
            onClick={() => dialog.current?.close()}
          >
            {t("modal.close")}
          </button>
        ) : (
          <form className="stack" onSubmit={submit}>
            <input
              className="input"
              name="name"
              required
              maxLength={150}
              autoComplete="name"
              aria-label={t("modal.name")}
              placeholder={t("modal.name")}
            />
            <input
              className="input"
              name="email"
              type="email"
              required
              maxLength={254}
              autoComplete="email"
              aria-label={t("modal.email")}
              placeholder={t("modal.email")}
            />
            <input
              className="input"
              name="organization"
              maxLength={200}
              autoComplete="organization"
              aria-label={t("modal.org")}
              placeholder={t("modal.org")}
            />
            <textarea
              className="input"
              name="message"
              required
              rows={3}
              maxLength={5000}
              aria-label={t("modal.msg")}
              placeholder={t("modal.msgPh")}
            />
            <div hidden aria-hidden="true">
              <input name="website" tabIndex={-1} autoComplete="off" />
            </div>
            {error && (
              <p className="error" role="alert">
                {t("ui.error")}
              </p>
            )}
            <button
              className="btn btn-primary btn-block"
              disabled={busy}
              type="submit"
            >
              {t(busy ? "ui.loading" : "modal.send")} →
            </button>
          </form>
        )}
      </div>
    </dialog>
  );
}

export function DonationSupporters() {
  const t = useDonationText();
  const { items, state, reload } = useSupporters();
  const [filter, setFilter] = useState("all");
  const root = useRef<HTMLDivElement>(null);
  useReveals(root);
  const list = items.filter((item) => filter === "all" || item.kind === filter);
  return (
    <div className="donations" ref={root}>
      <section className="page-hero">
        <HeroLight />
        <div className="container">
          <h1 className="display reveal">{t("wallp.title")}</h1>
          <p className="lede reveal">{t("wallp.lede")}</p>
          <p className="institutional reveal">
            <Link href="/about#supporters">
              {t("wallp.institutional")} →
            </Link>
          </p>
          <div className="wall-toolbar reveal">
            <div className="tabs" role="group" aria-label={t("wallp.title")}>
              {[
                ["all", "wallp.all"],
                ["person", "wallp.people"],
                ["org", "wallp.orgs"],
              ].map(([value, label]) => (
                <button
                  key={value}
                  aria-pressed={filter === value}
                  className={filter === value ? "active" : ""}
                  onClick={() => setFilter(value)}
                >
                  {t(label)}
                  <em>
                    {
                      items.filter(
                        (item) => value === "all" || item.kind === value,
                      ).length
                    }
                  </em>
                </button>
              ))}
            </div>
            <span className="count" role="status">
              {list.length === 1
                ? t("wallp.countOne")
                : t("wallp.count", { n: list.length })}
            </span>
          </div>
        </div>
      </section>
      <div className="container">
        <div className="wall">
          {state === "loading" ? (
            <p className="wall-empty" role="status">
              {t("ui.loading")}
            </p>
          ) : state === "error" ? (
            <p className="wall-empty" role="alert">
              {t("ui.wallError")}{" "}
              <button onClick={() => void reload()}>{t("ui.retry")}</button>
            </p>
          ) : list.length ? (
            list.map((item) => <SupporterCard key={item.id} item={item} />)
          ) : (
            <p className="wall-empty">{t("ui.empty")}</p>
          )}
        </div>
        <p className="wall-note">
          {t("wallp.note")} <Link href="/contact">{t("ui.profileHelp")}</Link>
        </p>
        <div className="major reveal supporters-cta">
          <div>
            <h2>{t("wallp.ctaTitle")}</h2>
            <p>{t("wallp.ctaText")}</p>
          </div>
          <Link
            className="btn btn-primary"
            href="/donate?frequency=monthly"
          >
            {t("wallp.cta")} ↗
          </Link>
        </div>
      </div>
    </div>
  );
}
