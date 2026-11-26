"use client";

import { startTransition, useEffect, useState, useRef } from "react";
import Link from "next/link";
import { useLanguage } from "@/contexts/LanguageContext";
import {
  managementCredentials,
  managementPayload,
  safeLink,
  validAvatar,
  uploadRecognitionAvatar,
} from "./flow";
import { SupporterCard } from "./DonationsExperience";
import "./donations.css";

/** Secrets are read once from the fragment and removed before interaction. */
export function DonationManagement() {
  const { t: translate } = useLanguage();
  const t = (key: string) => translate(`donations.${key}`);
  const [credentials, setCredentials] = useState<{
    id: string;
    token: string;
  } | null>(null);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [name, setName] = useState("");
  const [url, setUrl] = useState("");
  const [removeConfirmed, setRemoveConfirmed] = useState(false);
  const [cancelConfirmed, setCancelConfirmed] = useState(false);
  const [removed, setRemoved] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState("");
  const [removeAvatar, setRemoveAvatar] = useState(false);
  const uploadedId = useRef<string | undefined>(undefined);
  useEffect(() => {
    const readCredentials = () => {
      const value = managementCredentials(window.location.hash);
      // Reject query credentials; they can leak into access logs/referrers.
      window.history.replaceState(null, "", window.location.pathname);
      startTransition(() => setCredentials(value));
    };
    readCredentials();
    window.addEventListener("hashchange", readCredentials);
    return () => window.removeEventListener("hashchange", readCredentials);
  }, []);
  useEffect(
    () => () => {
      if (preview) URL.revokeObjectURL(preview);
    },
    [preview],
  );

  async function selectAvatar(candidate?: File) {
    if (!candidate) return;
    try {
      const image = await createImageBitmap(candidate);
      const valid = validAvatar(
        candidate.type,
        candidate.size,
        image.width,
        image.height,
      );
      image.close();
      if (!valid) throw Error();
      setFile(candidate);
      setPreview(URL.createObjectURL(candidate));
      setRemoveAvatar(false);
      uploadedId.current = undefined;
      setMessage("");
    } catch {
      setMessage("validation.avatar");
    }
  }
  async function act(action: string) {
    if (!credentials || busy) return;
    if (
      (action === "remove-public" && !removeConfirmed) ||
      (action === "cancel" && !cancelConfirmed)
    )
      return;
    if (action === "update-public" && !name.trim()) {
      setMessage("validation.publicName");
      return;
    }
    const payload = managementPayload(credentials, action, {
      name,
      url,
      ...(removeAvatar ? { avatarId: null } : {}),
    });
    if (!payload) {
      setMessage("details.linkError");
      return;
    }
    setBusy(true);
    setMessage("");
    try {
      if (action === "update-public" && file) {
        uploadedId.current ??= await uploadRecognitionAvatar(credentials, file);
        if ("profile" in payload && payload.profile)
          payload.profile.avatarId = uploadedId.current;
      }
      const response = await fetch("/api/donations/manage", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        signal: AbortSignal.timeout(30000),
      });
      if (!response.ok) throw Error();
      const result = await response.json();
      if (action === "portal") {
        const target = safeLink(result.url ?? "");
        if (!target) throw Error();
        window.location.assign(target);
      } else {
        if (action === "remove-public") {
          setRemoved(true);
          setRemoveConfirmed(false);
        }
        if (action === "cancel") setCancelConfirmed(false);
        setMessage(
          action === "cancel"
            ? "manage.cancelRequested"
            : action === "remove-public"
              ? "manage.removeRequested"
              : "manage.updateRequested",
        );
      }
    } catch {
      setMessage("ui.error");
    } finally {
      setBusy(false);
    }
  }
  return (
    <div className="donations">
      <section className="page-hero">
        <div className="container">
          <h1 className="display">{t("manage.title")}</h1>
          <p className="lede">{t("manage.lede")}</p>
        </div>
      </section>
      <div className="container management-wrap">
        <div className="panel" aria-busy={busy}>
          <h2>{t("manage.title")}</h2>
          {!credentials ? (
            <p className="note">
              {t("manage.linkRequired")}{" "}
              <Link href="/contact">{t("major.cta")}</Link>
            </p>
          ) : (
            <>
              <p className="note">{t("manage.providerNote")}</p>
              <div className="nav-row">
                <button
                  className="btn btn-primary"
                  disabled={busy}
                  onClick={() => void act("portal")}
                >
                  {t("ui.manage")}
                </button>
              </div>
              <hr />
              <h3>{t("manage.profile")}</h3>
              {removed ? (
                <p className="note">{t("manage.removed")}</p>
              ) : (
                <>
                  <form
                    className="stack"
                    onSubmit={(event) => {
                      event.preventDefault();
                      void act("update-public");
                    }}
                  >
                    <label className="field">
                      <span className="label">{t("details.publicName")}</span>
                      <input
                        className="input"
                        required
                        maxLength={70}
                        value={name}
                        onChange={(event) => setName(event.target.value)}
                      />
                    </label>
                    <label className="field">
                      <span className="label">{t("details.link")}</span>
                      <input
                        className="input"
                        type="url"
                        maxLength={250}
                        value={url}
                        onChange={(event) => setUrl(event.target.value)}
                      />
                    </label>
                    <div className="upload">
                      <label>
                        {t("details.avatar")}
                        <input
                          type="file"
                          accept="image/png,image/jpeg,image/webp"
                          disabled={busy}
                          onChange={(event) =>
                            void selectAvatar(event.target.files?.[0])
                          }
                        />
                      </label>
                      <button
                        type="button"
                        disabled={busy}
                        onClick={() => {
                          setFile(null);
                          setPreview("");
                          setRemoveAvatar(true);
                          uploadedId.current = undefined;
                        }}
                      >
                        {t("details.avatarRemove")}
                      </button>
                    </div>
                    <p className="hint">
                      {t(
                        removeAvatar
                          ? "manage.avatarRemoval"
                          : "validation.avatar",
                      )}
                    </p>
                    <div className="ack-preview">
                      <small>{t("details.preview")}</small>
                      <SupporterCard
                        preview
                        item={{
                          id: "preview",
                          name: name || t("wallp.person"),
                          kind: "person",
                          link: url,
                          avatar: preview,
                          activity: "active",
                        }}
                      />
                    </div>
                    <button
                      className="btn btn-ghost"
                      disabled={busy}
                      type="submit"
                    >
                      {t("manage.update")}
                    </button>
                  </form>
                  <p className="hint">{t("manage.review")}</p>
                  <hr />
                  <label className="management-confirm">
                    <input
                      type="checkbox"
                      checked={removeConfirmed}
                      onChange={(event) =>
                        setRemoveConfirmed(event.target.checked)
                      }
                    />
                    <span>{t("manage.confirmRemove")}</span>
                  </label>
                  <div className="nav-row">
                    <button
                      className="btn btn-ghost"
                      disabled={busy || !removeConfirmed}
                      onClick={() => void act("remove-public")}
                    >
                      {t("manage.remove")}
                    </button>
                  </div>
                </>
              )}
              <hr />
              <label className="management-confirm">
                <input
                  type="checkbox"
                  checked={cancelConfirmed}
                  onChange={(event) => setCancelConfirmed(event.target.checked)}
                />
                <span>{t("manage.confirmCancel")}</span>
              </label>
              <div className="nav-row">
                <button
                  className="btn btn-ghost"
                  disabled={busy || !cancelConfirmed}
                  onClick={() => void act("cancel")}
                >
                  {t("manage.cancel")}
                </button>
              </div>
            </>
          )}
          {busy && (
            <p className="note" role="status">
              {t("ui.loading")}
            </p>
          )}
          {message && (
            <p className="note" role="status">
              {t(message)}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
