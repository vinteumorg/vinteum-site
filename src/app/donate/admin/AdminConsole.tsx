"use client";
import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { copy } from "./copy";
import styles from "./admin.module.css";

type Profile = {
  id: string;
  name: string;
  url?: string | null;
  avatarUrl?: string | null;
  state: "pending" | "approved" | "rejected" | "removed";
  activity: "active" | "past";
  createdAt?: string;
};
type Message = {
  id: string;
  name?: string | null;
  email?: string | null;
  message: string;
  status?: string | null;
  frequency?: string | null;
  createdAt?: string | null;
};
type Action = "approve" | "reject" | "remove";
// Only this application's authenticated moderation route may be rendered as an
// image; anything else (absolute, protocol-relative, public avatar route) is dropped.
const AVATAR_PATH =
  /^\/api\/donations\/admin\/profiles\/[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}\/avatar$/i;
function avatarSource(value?: string | null): string | undefined {
  return typeof value === "string" && AVATAR_PATH.test(value) ? value : undefined;
}
function replyAddress(value?: string | null): string | undefined {
  return typeof value === "string" &&
    value.length >= 3 &&
    value.length <= 254 &&
    !/[\s<>"'@]{2}/.test(value) &&
    value.indexOf("@") > 0
    ? value
    : undefined;
}
function stamp(value?: string | null): string {
  const text = typeof value === "string" ? value : "";
  return /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}/.test(text)
    ? text.slice(0, 16).replace("T", " ")
    : "";
}
export function ProfileReview({
  profile,
  busy,
  onAction,
}: {
  profile: Profile;
  busy: boolean;
  onAction: (id: string, action: Action, reason: string) => void;
}) {
  const { locale } = useLanguage();
  const t = copy[locale];
  const avatar = avatarSource(profile.avatarUrl);
  let safeUrl: string | undefined;
  try {
    const url = new URL(profile.url || "");
    if (
      ["https:", "http:"].includes(url.protocol) &&
      !url.username &&
      !url.password
    )
      safeUrl = url.href;
  } catch {}
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const native = event.nativeEvent as SubmitEvent;
    const action = (native.submitter as HTMLButtonElement | null)
      ?.value as Action;
    if (!["approve", "reject", "remove"].includes(action)) return;
    if (action === "remove" && !window.confirm(t.confirmRemove)) return;
    onAction(
      profile.id,
      action,
      String(new FormData(event.currentTarget).get("reason") || ""),
    );
  }
  return (
    <li className={styles.card} data-profile-id={profile.id}>
      {avatar && (
        <div className={styles.avatarBlock}>
          {/* Authenticated moderation bytes must not pass through the public
              image optimizer, which would cache a pending avatar. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            className={styles.avatar}
            src={avatar}
            alt=""
            width={96}
            height={96}
            loading="lazy"
            decoding="async"
          />
          <div className={styles.avatarMeta}>
            <a
              className={styles.avatarLink}
              href={avatar}
              target="_blank"
              rel="noopener noreferrer"
            >
              {t.openAvatar}
            </a>
            <small className={styles.avatarNote}>{t.avatarSent}</small>
          </div>
        </div>
      )}
      <h2>{profile.name}</h2>
      <p>{profile.activity === "active" ? t.active : t.past}</p>
      {safeUrl && (
        <a href={safeUrl} target="_blank" rel="noopener noreferrer nofollow">
          {t.open}
        </a>
      )}
      {(profile.state === "pending" || profile.state === "approved") && (
        <form onSubmit={submit}>
          <label htmlFor={"reason-" + profile.id}>{t.reason}</label>
          <textarea
            id={"reason-" + profile.id}
            name="reason"
            maxLength={500}
            rows={2}
            disabled={busy}
          />
          <small>{t.note}</small>
          <div className={styles.actions}>
            {profile.state === "pending" && (
              <>
                <button name="action" value="approve" disabled={busy}>
                  {t.approve}
                </button>
                <button name="action" value="reject" disabled={busy}>
                  {t.reject}
                </button>
              </>
            )}
            <button name="action" value="remove" disabled={busy}>
              {t.remove}
            </button>
          </div>
        </form>
      )}
    </li>
  );
}

export function MessageList({
  messages,
  nextCursor,
  loaded,
  busy,
  onMore,
}: {
  messages: Message[];
  nextCursor: string | null;
  loaded: boolean;
  busy: boolean;
  onMore: () => void;
}) {
  const { locale } = useLanguage();
  const t = copy[locale];
  if (!loaded) return <p role="status">{t.working}</p>;
  if (!messages.length) return <p>{t.messagesEmpty}</p>;
  return (
    <>
      <p className={styles.policy}>{t.messagesNote}</p>
      <ul className={styles.messages}>
        {messages.map((item) => {
          const reply = replyAddress(item.email);
          return (
            <li key={item.id} className={styles.message}>
              <div className={styles.messageHead}>
                <strong>{item.name || item.email || ""}</strong>
                <span>{stamp(item.createdAt)}</span>
              </div>
              <p className={styles.messageText}>{item.message}</p>
              <div className={styles.messageFoot}>
                <span className={styles.badge}>
                  {item.frequency === "monthly" ? t.monthlyDonation : t.oneTime}
                </span>
                {reply && <a href={"mailto:" + reply}>{t.reply}</a>}
              </div>
            </li>
          );
        })}
      </ul>
      {nextCursor && (
        <button type="button" disabled={busy} onClick={onMore}>
          {t.more}
        </button>
      )}
    </>
  );
}

export default function AdminConsole({
  initialUsername,
}: {
  initialUsername: string | null;
}) {
  const { locale } = useLanguage();
  const t = copy[locale];
  const [username, setUsername] = useState(initialUsername);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<keyof typeof copy.EN | "">("");
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [state, setState] = useState<Profile["state"]>("pending");
  const [refresh, setRefresh] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const [view, setView] = useState<"profiles" | "messages">("profiles");
  const [messages, setMessages] = useState<Message[]>([]);
  const [cursor, setCursor] = useState<string | null>(null);
  const [messagesLoaded, setMessagesLoaded] = useState(false);
  useEffect(() => {
    if (!username) return;
    const controller = new AbortController();
    async function load() {
      try {
        const response = await fetch("/api/donations/admin?state=" + state, {
          credentials: "same-origin",
          cache: "no-store",
          signal: controller.signal,
        });
        if (controller.signal.aborted) return;
        if (response.status === 401) {
          setUsername(null);
          setProfiles([]);
          setMessage("expired");
          return;
        }
        if (!response.ok) {
          setProfiles([]);
          setMessage(response.status === 503 ? "unavailable" : "error");
          return;
        }
        const result = await response.json();
        if (!controller.signal.aborted) {
          setProfiles(result.profiles);
          setLoaded(true);
        }
      } catch {
        if (!controller.signal.aborted) {
          setProfiles([]);
          setMessage("error");
        }
      }
    }
    void load();
    const interval = window.setInterval(() => void load(), 60000);
    return () => {
      controller.abort();
      window.clearInterval(interval);
    };
  }, [username, state, refresh]);
  useEffect(() => {
    if (!username || view !== "messages") return;
    const controller = new AbortController();
    async function load() {
      try {
        const response = await fetch("/api/donations/admin/messages", {
          credentials: "same-origin",
          cache: "no-store",
          signal: controller.signal,
        });
        if (controller.signal.aborted) return;
        if (response.status === 401) {
          setUsername(null);
          setMessages([]);
          setCursor(null);
          setMessage("expired");
          return;
        }
        if (!response.ok) {
          setMessages([]);
          setCursor(null);
          setMessage(response.status === 503 ? "unavailable" : "error");
          return;
        }
        const result = await response.json();
        if (controller.signal.aborted) return;
        setMessages(Array.isArray(result.messages) ? result.messages : []);
        setCursor(typeof result.nextCursor === "string" ? result.nextCursor : null);
        setMessagesLoaded(true);
      } catch {
        if (!controller.signal.aborted) {
          setMessages([]);
          setCursor(null);
          setMessage("error");
        }
      }
    }
    void load();
    return () => controller.abort();
  }, [username, view]);
  async function moreMessages() {
    if (!cursor || busy) return;
    setBusy(true);
    try {
      const response = await fetch(
        "/api/donations/admin/messages?cursor=" + encodeURIComponent(cursor),
        { credentials: "same-origin", cache: "no-store" },
      );
      if (!response.ok) {
        setMessage(response.status === 401 ? "expired" : "error");
        if (response.status === 401) setUsername(null);
        return;
      }
      const result = await response.json();
      setMessages((current) =>
        current.concat(Array.isArray(result.messages) ? result.messages : []),
      );
      setCursor(typeof result.nextCursor === "string" ? result.nextCursor : null);
    } catch {
      setMessage("error");
    } finally {
      setBusy(false);
    }
  }
  async function mutate(path: string, body: Record<string, unknown>) {
    setBusy(true);
    setMessage("");
    try {
      const response = await fetch("/api/donations/admin" + path, {
        method: "POST",
        credentials: "same-origin",
        cache: "no-store",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (response.status === 401) {
        setUsername(null);
        setProfiles([]);
        setMessage("expired");
        return;
      }
      if (!response.ok) {
        setMessage(
          response.status === 503
            ? "unavailable"
            : response.status === 403
              ? "forbidden"
              : "error",
        );
        return;
      }
      setProfiles([]);
      setLoaded(false);
      if (path === "/logout") {
        setUsername(null);
      } else {
        setMessage("saved");
        setRefresh((value) => value + 1);
      }
    } catch {
      setMessage("error");
    } finally {
      setBusy(false);
    }
  }
  async function login(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const body = {
      username: String(data.get("username") || ""),
      password: String(data.get("password") || ""),
    };
    form.reset();
    setBusy(true);
    setMessage("");
    try {
      const response = await fetch("/api/donations/admin/login", {
        method: "POST",
        credentials: "same-origin",
        cache: "no-store",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!response.ok) {
        setMessage(
          response.status === 429
            ? "limited"
            : response.status === 503
              ? "unavailable"
              : response.status === 403
                ? "forbidden"
                : "invalid",
        );
        return;
      }
      const result = await response.json();
      setUsername(result.username);
    } catch {
      setMessage("error");
    } finally {
      body.password = "";
      setBusy(false);
    }
  }
  return (
    <section className={styles.console} aria-labelledby="admin-title">
      <h1 id="admin-title">{t.title}</h1>
      <p>{t.intro}</p>
      {message && (
        <p role="status" aria-live="polite">
          {t[message]}
        </p>
      )}
      {!username ? (
        <form onSubmit={login} className={styles.login}>
          <label htmlFor="admin-user">{t.username}</label>
          <input
            id="admin-user"
            name="username"
            autoComplete="username"
            maxLength={100}
            required
            disabled={busy}
          />
          <label htmlFor="admin-password">{t.password}</label>
          <input
            id="admin-password"
            name="password"
            type="password"
            autoComplete="current-password"
            maxLength={256}
            required
            disabled={busy}
          />
          <button type="submit" disabled={busy}>
            {busy ? t.working : t.login}
          </button>
        </form>
      ) : (
        <>
          <div className={styles.toolbar}>
            <span>
              {t.signedIn} {username}
            </span>
            <button disabled={busy} onClick={() => void mutate("/logout", {})}>
              {t.logout}
            </button>
          </div>
          <div className={styles.tabs} role="tablist" aria-label={t.title}>
            <button
              role="tab"
              type="button"
              aria-selected={view === "profiles"}
              className={view === "profiles" ? styles.tabActive : styles.tab}
              onClick={() => setView("profiles")}
            >
              {t.viewProfiles}
            </button>
            <button
              role="tab"
              type="button"
              aria-selected={view === "messages"}
              className={view === "messages" ? styles.tabActive : styles.tab}
              onClick={() => setView("messages")}
            >
              {t.viewMessages}
            </button>
          </div>
          {view === "profiles" ? (
            <>
          <p className={styles.policy}>{t.policy}</p>
          <div className={styles.toolbar}>
            <label htmlFor="admin-queue">{t.title}</label>
            <select
              id="admin-queue"
              value={state}
              disabled={busy}
              onChange={(event) => {
                setProfiles([]);
                setLoaded(false);
                setMessage("");
                setState(event.target.value as Profile["state"]);
              }}
            >
              {(["pending", "approved", "rejected", "removed"] as const).map(
                (value) => (
                  <option key={value} value={value}>
                    {t[value]}
                  </option>
                ),
              )}
            </select>
            <button
              disabled={busy}
              onClick={() => {
                setProfiles([]);
                setLoaded(false);
                setRefresh((value) => value + 1);
              }}
            >
              {t.refresh}
            </button>
          </div>
          {!loaded && !message && <p role="status">{t.working}</p>}
          {loaded && profiles.length === 0 && <p>{t.empty}</p>}
          <ul className={styles.cards}>
            {profiles.map((profile) => (
              <ProfileReview
                key={profile.id}
                profile={profile}
                busy={busy}
                onAction={(profileId, action, reason) =>
                  void mutate("", { profileId, action, reason })
                }
              />
            ))}
          </ul>
            </>
          ) : (
            <MessageList
              messages={messages}
              nextCursor={cursor}
              loaded={messagesLoaded}
              busy={busy}
              onMore={() => void moreMessages()}
            />
          )}
        </>
      )}
    </section>
  );
}
