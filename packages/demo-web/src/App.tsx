import { FormEvent, useEffect, useId, useRef, useState } from "react";
import {
  DEMO_LIE_CLAIM,
  auditClaim,
  checkSpendGuard,
  rememberReceipt,
  type AuditResult,
  type SpendGuardResult,
} from "@oraculo/market-core";
import { youtubeEmbedUrl, youtubeWatchUrl } from "./youtube";

const DEMO_WALLET = {
  label: "Your WDK wallet",
  address: "0x4f30…71f4",
  balanceUsdt: 500,
  sendAmount: 200,
};

const PITCH_SCRIPT_URL =
  "https://github.com/Kenyi001/oraculo-radiohead/blob/master/docs/RONALD_PITCH.md";
const MCP_README_URL =
  "https://github.com/Kenyi001/oraculo-radiohead/blob/master/packages/mcp-server/README.md";

const DEMO_VIDEO_RAW = import.meta.env.VITE_DEMO_VIDEO_URL as
  | string
  | undefined;
const EMBED_SRC = youtubeEmbedUrl(DEMO_VIDEO_RAW);
const WATCH_HREF = youtubeWatchUrl(DEMO_VIDEO_RAW);

type ApiHealth = { ok?: boolean; version?: string; error?: string };

export function App() {
  const [claim, setClaim] = useState(DEMO_LIE_CLAIM);
  const [audit, setAudit] = useState<AuditResult | null>(null);
  const [guard, setGuard] = useState<SpendGuardResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [sealPulse, setSealPulse] = useState(0);
  const [apiHealth, setApiHealth] = useState<ApiHealth | null>(null);
  const sendBtnRef = useRef<HTMLButtonElement>(null);
  const bootstrapped = useRef(false);
  const claimId = useId();

  async function runAudit(text = claim, opts?: { scrollToSeal?: boolean }) {
    setLoading(true);
    setError(null);
    setGuard(null);
    try {
      const result = await auditClaim({ text });
      rememberReceipt(result.receipt);
      setAudit(result);
      setSealPulse((n) => n + 1);
      setStep(2);
      if (opts?.scrollToSeal) {
        requestAnimationFrame(() => {
          document.getElementById("seal-board")?.scrollIntoView({
            behavior: "smooth",
            block: "center",
          });
        });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (bootstrapped.current) return;
    bootstrapped.current = true;
    void runAudit(DEMO_LIE_CLAIM, { scrollToSeal: false });
    // eslint-disable-next-line react-hooks/exhaustive-deps -- auto-demo once on mount
  }, []);

  useEffect(() => {
    let cancelled = false;
    void fetch("/api/health")
      .then(async (res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return (await res.json()) as ApiHealth;
      })
      .then((data) => {
        if (!cancelled) setApiHealth({ ok: data.ok !== false, version: data.version });
      })
      .catch(() => {
        if (!cancelled) {
          setApiHealth({
            ok: false,
            error: "API offline in local Vite — live deploy serves /api/*",
          });
        }
      });
    return () => {
      cancelled = true;
    };
  }, []);

  function onAudit(e: FormEvent) {
    e.preventDefault();
    void runAudit(claim, { scrollToSeal: true });
  }

  function onTrySend() {
    if (!audit) return;
    rememberReceipt(audit.receipt);
    setGuard(checkSpendGuard(audit.receipt.id));
    setStep(3);
    requestAnimationFrame(() => {
      document.getElementById("wdk-gate")?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
      sendBtnRef.current?.focus({ preventScroll: true });
    });
  }

  function scrollToLiveDemo() {
    document.getElementById("wallet")?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }

  const verdict = audit?.verdict ?? null;
  const blocked = guard?.status === "blocked";

  return (
    <div className="shell">
      <div className="atmosphere" aria-hidden="true" />
      <div className="grain" aria-hidden="true" />

      <main className="page">
        <header className="hero">
          <p className="eyebrow">
            Aleph Hackathon 2026 · Santa Cruz · General + WDK Track 1
          </p>
          <h1>Casandra</h1>
          <p className="tagline">
            Lie detector for agents that talk about money.{" "}
            <span className="tag-em">Your USDT stays in your WDK wallet</span>
            — Casandra never holds funds. Seal a claim. On FALSE, send is
            blocked.
          </p>
        </header>

        <section
          className="pitch-video"
          id="pitch-video"
          aria-label="Pitch video"
        >
          <div className="video-frame">
            <div className="video-frame-bar">
              <span className="video-label">Pitch · ≤3 min</span>
              {WATCH_HREF && (
                <a
                  className="video-open"
                  href={WATCH_HREF}
                  target="_blank"
                  rel="noreferrer"
                >
                  Open on YouTube
                </a>
              )}
            </div>
            {EMBED_SRC ? (
              <div className="video-embed">
                <iframe
                  src={EMBED_SRC}
                  title="Casandra pitch demo"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            ) : (
              <div className="video-pending">
                <p className="video-pending-title">Pitch video pending</p>
                <p className="muted">
                  Ronald records next — script ready. Meanwhile run the live
                  loop below.
                </p>
                <div className="row">
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={scrollToLiveDemo}
                  >
                    Watch live demo
                  </button>
                  <a
                    className="btn btn-ghost"
                    href={PITCH_SCRIPT_URL}
                    target="_blank"
                    rel="noreferrer"
                  >
                    Pitch script
                  </a>
                </div>
              </div>
            )}
          </div>
        </section>

        <nav className="story-rail" aria-label="Demo story">
          <ol>
            <li className={step >= 1 ? "active" : ""} data-n="01">
              Your money
            </li>
            <li className={step >= 2 ? "active" : ""} data-n="02">
              Seal the claim
            </li>
            <li className={step >= 3 ? "active" : ""} data-n="03">
              Try to spend
            </li>
          </ol>
          <div className="rail-track" aria-hidden="true">
            <span
              className="rail-fill"
              style={{ width: `${((step - 1) / 2) * 100}%` }}
            />
          </div>
        </nav>

        <section
          className="wallet-ledger"
          id="wallet"
          aria-label="Your WDK wallet"
        >
          <div className="wallet-top">
            <div>
              <p className="wallet-eyebrow">{DEMO_WALLET.label}</p>
              <p className="wallet-addr">{DEMO_WALLET.address}</p>
            </div>
            <p className="wallet-note">Self-custody · not Casandra</p>
          </div>
          <div className="wallet-balance-row">
            <div>
              <p className="balance-label">USDT available</p>
              <p className="balance-value">
                {DEMO_WALLET.balanceUsdt.toFixed(2)}
                <span> USDT</span>
              </p>
            </div>
            <div className="send-intent">
              <p className="balance-label">Agent wants to send</p>
              <p className="send-amount">{DEMO_WALLET.sendAmount} USDT</p>
            </div>
          </div>
          {blocked && (
            <p className="wallet-locked" role="status">
              Balance unchanged — send blocked by sealed FALSE receipt.
            </p>
          )}
        </section>

        <section className="section agent-section">
          <p className="panel-label" id={claimId}>
            What the agent said
          </p>
          <form onSubmit={onAudit} className="claim-form">
            <textarea
              value={claim}
              onChange={(e) => setClaim(e.target.value)}
              rows={3}
              aria-labelledby={claimId}
            />
            <div className="row">
              <button
                type="submit"
                className="btn btn-primary"
                disabled={loading}
              >
                {loading ? "Sealing…" : "Seal contradiction"}
              </button>
              <button
                type="button"
                className="btn btn-ghost"
                disabled={loading}
                onClick={() => {
                  setClaim(DEMO_LIE_CLAIM);
                  void runAudit(DEMO_LIE_CLAIM, { scrollToSeal: true });
                }}
              >
                Demo lie
              </button>
            </div>
          </form>
        </section>

        {audit && (
          <section
            className="section seal-board"
            id="seal-board"
            key={sealPulse}
          >
            <div className="split">
              <div className="panel claim-panel">
                <p className="panel-label">The claim</p>
                <p className="panel-body">{audit.receipt.claim_text}</p>
              </div>
              <div className="panel world-panel">
                <p className="panel-label">The world</p>
                <ul className="world-list">
                  {audit.receipt.world_snapshot.quotes.map((q) => (
                    <li key={q.symbol}>
                      {q.symbol.toUpperCase()} live $
                      {q.price_usd.toLocaleString("en-US", {
                        maximumFractionDigits: q.price_usd < 1 ? 4 : 2,
                      })}{" "}
                      <span className="muted">({q.source})</span>
                    </li>
                  ))}
                  {audit.receipt.world_snapshot.risk && (
                    <li>
                      Risk {audit.receipt.world_snapshot.risk.band} ·{" "}
                      {audit.receipt.world_snapshot.risk.score}/100
                    </li>
                  )}
                  {audit.receipt.world_snapshot.quotes.length === 0 &&
                    !audit.receipt.world_snapshot.risk && (
                      <li className="muted">No price/risk facts extracted</li>
                    )}
                </ul>
              </div>
            </div>

            <div
              className={`seal seal-${verdict?.toLowerCase()} seal-land`}
              role="status"
              aria-label={`Verdict ${verdict}`}
            >
              <span className="seal-mark">{verdict}</span>
              <span className="seal-sub">
                {audit.receipt.algorithm} · sealed
              </span>
            </div>

            <h3>Contradictions</h3>
            {audit.contradictions.length === 0 ? (
              <p className="muted">
                No contradictions — claim matches the world.
              </p>
            ) : (
              <ul className="contradictions">
                {audit.contradictions.map((c, i) => (
                  <li key={`${c.kind}-${i}`} className={`sev-${c.severity}`}>
                    <strong>{c.kind}</strong> · {c.claim}
                    <br />
                    <span className="world-line">→ {c.world}</span>
                  </li>
                ))}
              </ul>
            )}

            <p className="receipt-meta muted">
              Receipt <code>{audit.receipt.id}</code>
              <br />
              Hash <code>{audit.receipt.hash_bytes32}</code>
            </p>

            {verdict === "FALSE" && !guard && (
              <p className="next-hint" role="status">
                Seal is FALSE. Next: try to send — the door should stay shut.
              </p>
            )}
          </section>
        )}

        <section
          className={`section wdk-gate${blocked ? " is-blocked" : ""}`}
          id="wdk-gate"
        >
          <h2>Spend through WDK</h2>
          <p className="muted gate-copy">
            Same USDT · same wallet · door closed if verdict is FALSE. Dry-run
            via <code>@tetherto/wdk</code> — no live broadcast. Casandra never
            holds the funds.
          </p>
          <button
            ref={sendBtnRef}
            type="button"
            onClick={onTrySend}
            disabled={!audit || loading}
            className={
              verdict === "FALSE" ? "btn btn-danger" : "btn btn-primary"
            }
          >
            Send {DEMO_WALLET.sendAmount} USDT
          </button>
          {guard && (
            <div
              className={`guard-result guard-${guard.status}`}
              role="status"
            >
              <p className="guard-status">
                {blocked ? "BLOCKED — money stays" : guard.status.toUpperCase()}
              </p>
              <p>{guard.reason}</p>
              <pre>{JSON.stringify(guard.wdk, null, 2)}</pre>
            </div>
          )}
        </section>

        {error && <p className="error">{error}</p>}

        <section className="section agent-path" id="agent-path" aria-label="Agent and API">
          <div className="agent-path-head">
            <p className="panel-label">Agent path</p>
            <p
              className={`path-pill${apiHealth?.ok ? " is-live" : " is-local"}`}
              role="status"
            >
              {apiHealth?.ok
                ? `Live API · v${apiHealth.version ?? "?"}`
                : "Interactive demo · API on deploy"}
            </p>
          </div>
          <p className="muted gate-copy">
            Same loop judges sell:{" "}
            <code>audit_claim</code> → <code>seal_receipt</code> →{" "}
            <code>check_spend_guard</code> → WDK dry-run. Wire it in Cursor via
            MCP, or hit the HTTP twin on this host.
          </p>
          <div className="agent-grid">
            <div className="agent-col">
              <h3>MCP (Cursor)</h3>
              <pre className="agent-snippet" tabIndex={0}>{`{
  "mcpServers": {
    "casandra": {
      "command": "node",
      "args": [
        "…/packages/mcp-server/dist/index.js"
      ]
    }
  }
}`}</pre>
              <p className="muted agent-note">
                Build first: <code>npm run build -w @oraculo/mcp-server</code>.{" "}
                <a href={MCP_README_URL} target="_blank" rel="noreferrer">
                  Full setup
                </a>
              </p>
            </div>
            <div className="agent-col">
              <h3>HTTP API</h3>
              <ul className="api-list">
                <li>
                  <code>POST /api/audit-claim</code>
                </li>
                <li>
                  <code>POST /api/seal-receipt</code>
                </li>
                <li>
                  <code>POST /api/check-spend-guard</code>
                </li>
                <li>
                  <a href="/api/health">
                    <code>GET /api/health</code>
                  </a>
                </li>
              </ul>
              <p className="muted agent-note">
                Pass <code>receipt</code> with <code>receipt_id</code> on spend
                guard so serverless stays consistent. Dry-run only — no custody.
              </p>
            </div>
          </div>
        </section>

        <footer>
          <p>
            Casandra does not hold funds. It seals claims (
            <code>audit_claim</code>) and gates WDK spend (
            <code>check_spend_guard</code>). Not financial advice.
          </p>
          <p className="onchain muted">
            On-chain registry (Ethereum Sepolia):{" "}
            <a
              href="https://sepolia.etherscan.io/address/0xc9fcDEC150C8903b51F299dcBa308F453C4AB975"
              target="_blank"
              rel="noreferrer"
            >
              0xc9fcDEC1…
            </a>
          </p>
        </footer>
      </main>
    </div>
  );
}
