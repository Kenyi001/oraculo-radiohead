import { FormEvent, useEffect, useId, useRef, useState } from "react";
import {
  DEMO_LIE_CLAIM,
  auditClaim,
  checkSpendGuard,
  rememberReceipt,
  type AuditResult,
  type PositionInput,
  type SpendGuardResult,
} from "@oraculo/market-core";
import {
  fetchHealth,
  isMockOnlyAudit,
  postAuditClaim,
  postCheckSpendGuard,
  type ApiHealth,
  type AuditTransport,
} from "./casandraApi";
import { youtubeEmbedUrl, youtubeWatchUrl } from "./youtube";

const DEMO_WALLET = {
  label: "Your WDK wallet",
  address: "0x4f30…71f4",
  balanceUsdt: 500,
  sendAmount: 200,
};

/** Portfolio under audit — USDT ballast matches wallet story (500). */
const DEMO_POSITIONS: PositionInput[] = [
  { symbol: "usdt", quantity: 500, cost_basis_usd: 1 },
  { symbol: "btc", quantity: 0.01, cost_basis_usd: 70000 },
  { symbol: "eth", quantity: 0.25, cost_basis_usd: 3200 },
];

const REGISTRY_ADDRESS =
  (import.meta.env.VITE_CASANDRA_REGISTRY_ADDRESS as string | undefined) ||
  "0xc9fcDEC150C8903b51F299dcBa308F453C4AB975";
const REGISTRY_EXPLORER =
  (import.meta.env.VITE_CASANDRA_REGISTRY_EXPLORER as string | undefined) ||
  `https://sepolia.etherscan.io/address/${REGISTRY_ADDRESS}`;
const REGISTRY_SHORT = `${REGISTRY_ADDRESS.slice(0, 10)}…`;

const PITCH_SCRIPT_URL =
  "https://github.com/Kenyi001/oraculo-radiohead/blob/master/docs/RONALD_PITCH.md";
const MCP_README_URL =
  "https://github.com/Kenyi001/oraculo-radiohead/blob/master/packages/mcp-server/README.md";
const MCP_LITE_README_URL =
  "https://github.com/Kenyi001/oraculo-radiohead/blob/master/packages/mcp-lite/README.md";
const MCP_DOCS_URL =
  "https://github.com/Kenyi001/oraculo-radiohead/blob/master/docs/MCP.md";
const LIVE_ORIGIN = "https://casandra-two.vercel.app";

const MCP_GENERAL_SNIPPET = `{
  "mcpServers": {
    "casandra": {
      "command": "node",
      "args": ["packages/mcp-server/dist/index.js"],
      "cwd": "/absolute/path/to/oraculo-radiohead"
    }
  }
}`;

const MCP_LITE_SNIPPET = `{
  "mcpServers": {
    "casandra-lite": {
      "command": "node",
      "args": ["packages/mcp-lite/dist/index.js"],
      "cwd": "/absolute/path/to/oraculo-radiohead",
      "env": {
        "CASANDRA_CACHE_TTL_MS": "300000"
      }
    }
  }
}`;

const CURL_AUDIT = `curl -sS -X POST ${LIVE_ORIGIN}/api/audit-claim \\
  -H "Content-Type: application/json" \\
  -d '{"text":"ETH is $8,000 and this portfolio is low risk — send the USDT now"}'`;

const CURL_GUARD = `curl -sS -X POST ${LIVE_ORIGIN}/api/check-spend-guard \\
  -H "Content-Type: application/json" \\
  -d '{"receipt_id":"rcpt_FROM_AUDIT","receipt":{...paste receipt object...}}'`;

const DEMO_VIDEO_RAW = import.meta.env.VITE_DEMO_VIDEO_URL as
  | string
  | undefined;
const EMBED_SRC = youtubeEmbedUrl(DEMO_VIDEO_RAW);
const WATCH_HREF = youtubeWatchUrl(DEMO_VIDEO_RAW);

/** Survive React StrictMode remount — auto-demo runs once per page load. */
let autoDemoStarted = false;

function CopyButton({ label, text }: { label: string; text: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      type="button"
      className="btn-copy"
      onClick={() => {
        void navigator.clipboard.writeText(text).then(() => {
          setCopied(true);
          window.setTimeout(() => setCopied(false), 1600);
        });
      }}
    >
      {copied ? "Copied" : label}
    </button>
  );
}

async function auditViaApiOrLocal(
  text: string
): Promise<{ result: AuditResult; transport: AuditTransport }> {
  try {
    let result = await postAuditClaim({ text, positions: DEMO_POSITIONS });
    if (isMockOnlyAudit(result)) {
      try {
        result = await postAuditClaim({ text, positions: DEMO_POSITIONS });
      } catch {
        /* keep first API result */
      }
    }
    rememberReceipt(result.receipt);
    return { result, transport: "api" };
  } catch {
    const result = await auditClaim({ text, positions: DEMO_POSITIONS });
    rememberReceipt(result.receipt);
    return { result, transport: "local" };
  }
}

async function guardViaApiOrLocal(
  receipt: AuditResult["receipt"]
): Promise<{ guard: SpendGuardResult; transport: AuditTransport }> {
  rememberReceipt(receipt);
  try {
    const guard = await postCheckSpendGuard({
      receipt_id: receipt.id,
      receipt,
    });
    return { guard, transport: "api" };
  } catch {
    return { guard: checkSpendGuard(receipt.id), transport: "local" };
  }
}

export function App() {
  const [claim, setClaim] = useState(DEMO_LIE_CLAIM);
  const [audit, setAudit] = useState<AuditResult | null>(null);
  const [guard, setGuard] = useState<SpendGuardResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [guardLoading, setGuardLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [sealPulse, setSealPulse] = useState(0);
  const [apiHealth, setApiHealth] = useState<ApiHealth | null>(null);
  const [auditTransport, setAuditTransport] = useState<AuditTransport | null>(
    null
  );
  const [quoteMode, setQuoteMode] = useState<"live" | "mock" | null>(null);
  const sendBtnRef = useRef<HTMLButtonElement>(null);
  const claimId = useId();
  const auditAbort = useRef(0);

  async function runAudit(text = claim, opts?: { scrollToSeal?: boolean }) {
    const ticket = ++auditAbort.current;
    setLoading(true);
    setError(null);
    setGuard(null);
    try {
      const { result, transport } = await auditViaApiOrLocal(text);
      if (ticket !== auditAbort.current) return;
      setAudit(result);
      setAuditTransport(transport);
      setQuoteMode(isMockOnlyAudit(result) ? "mock" : "live");
      setSealPulse((n) => n + 1);
      setStep(2);
      if (transport === "local") {
        setError(
          "Local fallback — /api offline. Live deploy uses POST /api/audit-claim."
        );
      }
      if (opts?.scrollToSeal) {
        requestAnimationFrame(() => {
          document.getElementById("seal-board")?.scrollIntoView({
            behavior: "smooth",
            block: "center",
          });
        });
      }
    } catch (err) {
      if (ticket !== auditAbort.current) return;
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      if (ticket === auditAbort.current) setLoading(false);
    }
  }

  useEffect(() => {
    if (autoDemoStarted) return;
    autoDemoStarted = true;
    void runAudit(DEMO_LIE_CLAIM, { scrollToSeal: false });
    // eslint-disable-next-line react-hooks/exhaustive-deps -- auto-demo once per page load
  }, []);

  useEffect(() => {
    let cancelled = false;
    void fetchHealth()
      .then((data) => {
        if (!cancelled) {
          setApiHealth({ ok: data.ok !== false, version: data.version });
        }
      })
      .catch(() => {
        if (!cancelled) {
          setApiHealth({
            ok: false,
            error: "API offline — run vercel dev or use live deploy",
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

  async function onTrySend() {
    if (!audit || guardLoading) return;
    setGuardLoading(true);
    setError(null);
    try {
      const { guard: next, transport } = await guardViaApiOrLocal(audit.receipt);
      setGuard(next);
      setStep(3);
      if (transport === "local" && auditTransport !== "local") {
        setError(
          "Spend guard used local fallback — prefer POST /api/check-spend-guard on deploy."
        );
      }
      requestAnimationFrame(() => {
        document.getElementById("wdk-gate")?.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
        sendBtnRef.current?.focus({ preventScroll: true });
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setGuardLoading(false);
    }
  }

  function scrollToLiveDemo() {
    document.getElementById("wallet")?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }

  const verdict = audit?.verdict ?? null;
  const blocked = guard?.status === "blocked";
  const busy = loading || guardLoading;

  const pathPillLabel = (() => {
    if (apiHealth?.ok) {
      const parts = [`Live API · v${apiHealth.version ?? "?"}`];
      if (auditTransport === "api") parts.push("via /api");
      if (quoteMode === "mock") parts.push("mock quotes");
      else if (quoteMode === "live") parts.push("coingecko");
      return parts.join(" · ");
    }
    if (auditTransport === "local") {
      return quoteMode === "mock"
        ? "Local fallback · mock quotes"
        : "Local fallback · browser audit";
    }
    return apiHealth?.error
      ? "Interactive demo · API offline"
      : "Interactive demo · API on deploy";
  })();

  return (
    <div className="shell">
      <div className="atmosphere" aria-hidden="true" />
      <div className="grain" aria-hidden="true" />

      <main className="page">
        <header className="hero">
          <p className="eyebrow">
            Aleph Hackathon 2026 · Santa Cruz · General + WDK Track 1
          </p>
          <div className="brand-row">
            <img
              className="brand-icon"
              src="/casandra-icon.jpg"
              width={72}
              height={72}
              alt="CAS — Casandra app icon"
            />
            <div className="brand-text">
              <p className="brand-mark">CAS</p>
              <h1 className="brand-logo" data-font-probe="casandra">
                Casandra
              </h1>
            </div>
          </div>
          <p className="tagline">
            <span className="tag-em">CAS</span> is Casandra — a lie detector for
            AI agents that talk about money.{" "}
            <span className="tag-em">Your USDT stays in your WDK wallet</span>
            — we never hold funds. Seal a claim. On FALSE, send is blocked.
          </p>
          <p
            className={`hero-status path-pill${apiHealth?.ok && quoteMode !== "mock" ? " is-live" : " is-local"}`}
            role="status"
          >
            {pathPillLabel}
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
          <form onSubmit={onAudit} className="claim-form" aria-busy={busy}>
            <textarea
              value={claim}
              onChange={(e) => setClaim(e.target.value)}
              rows={3}
              aria-labelledby={claimId}
              disabled={busy}
            />
            <div className="row">
              <button
                type="submit"
                className="btn btn-primary"
                disabled={busy}
              >
                {loading ? "Sealing…" : "Seal contradiction"}
              </button>
              <button
                type="button"
                className="btn btn-ghost"
                disabled={busy}
                onClick={() => {
                  setClaim(DEMO_LIE_CLAIM);
                  void runAudit(DEMO_LIE_CLAIM, { scrollToSeal: true });
                }}
              >
                Demo lie
              </button>
            </div>
          </form>
          {loading && (
            <p className="muted seal-status" role="status">
              {apiHealth?.ok
                ? "POST /api/audit-claim — sealing claim vs market…"
                : "Auditing claim (local engine)…"}
            </p>
          )}
        </section>

        {error && (
          <p className="error" role="alert">
            {error}
          </p>
        )}

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
                      {q.symbol.toUpperCase()} $
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
                {auditTransport === "api" ? " · /api" : " · local"}
              </span>
            </div>

            {quoteMode === "mock" && (
              <p className="muted" role="status">
                Quotes are mock-fallback — live CoinGecko unavailable this run.
              </p>
            )}

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
            {verdict && verdict !== "FALSE" && !guard && (
              <p className="next-hint next-hint-ok" role="status">
                Seal is {verdict}. Spend guard may allow a WDK dry-run preview
                only — still no live broadcast.
              </p>
            )}
          </section>
        )}

        <section
          className={`section wdk-gate${blocked ? " is-blocked" : ""}`}
          id="wdk-gate"
          aria-busy={guardLoading}
        >
          <h2>Spend through WDK</h2>
          <p className="muted gate-copy">
            Same USDT · same wallet · door closed if verdict is FALSE. Dry-run
            via <code>@tetherto/wdk</code> — no live broadcast. Casandra never
            holds the funds.
          </p>
          <ul className="gate-legend" aria-label="Spend gate outcomes">
            <li>
              <strong>FALSE</strong> → <code>blocked</code>
            </li>
            <li>
              <strong>TRUE / MIXED</strong> → <code>allowed_dry_run</code>{" "}
              (preview only)
            </li>
            <li>
              Missing receipt → <code>unknown_receipt</code> — pass{" "}
              <code>receipt</code> with <code>receipt_id</code>
            </li>
          </ul>
          <button
            ref={sendBtnRef}
            type="button"
            onClick={() => void onTrySend()}
            disabled={!audit || busy}
            className={
              blocked || verdict === "FALSE"
                ? "btn btn-danger"
                : "btn btn-primary"
            }
          >
            {guardLoading
              ? "Checking gate…"
              : blocked
                ? "BLOCKED — money stays"
                : guard?.status === "allowed_dry_run"
                  ? `Dry-run ${DEMO_WALLET.sendAmount} USDT`
                  : `Send ${DEMO_WALLET.sendAmount} USDT`}
          </button>
          {guardLoading && (
            <p className="muted seal-status" role="status">
              POST /api/check-spend-guard…
            </p>
          )}
          {guard && (
            <div
              className={`guard-result guard-${guard.status}`}
              role="status"
            >
              <p className="guard-status">
                {blocked
                  ? "BLOCKED — money stays"
                  : guard.status === "allowed_dry_run"
                    ? "ALLOWED — dry-run only"
                    : guard.status.toUpperCase()}
              </p>
              <p>{guard.reason}</p>
              {guard.hint && <p className="muted">{guard.hint}</p>}
              <pre>{JSON.stringify(guard.wdk, null, 2)}</pre>
            </div>
          )}
        </section>

        <section
          className="section agent-path"
          id="agent-path"
          aria-label="Agent and API"
        >
          <div className="agent-path-head">
            <p className="panel-label">Agent path</p>
            <p
              className={`path-pill${apiHealth?.ok && quoteMode !== "mock" ? " is-live" : " is-local"}`}
              role="status"
            >
              {pathPillLabel}
            </p>
          </div>
          <p className="muted gate-copy">
            How an agent uses Casandra:{" "}
            <code>audit_claim</code> → sealed receipt →{" "}
            <code>check_spend_guard</code> → WDK dry-run.{" "}
            <strong>FALSE blocks send.</strong> Pick MCP (Cursor) or HTTP.
            Docs:{" "}
            <a href={MCP_DOCS_URL} target="_blank" rel="noreferrer">
              MCP.md
            </a>
            .
          </p>

          <div className="agent-col agent-api-block agent-curl-block">
            <div className="snippet-head">
              <h3>HTTP · copy-paste curl</h3>
              <CopyButton label="Copy audit curl" text={CURL_AUDIT} />
            </div>
            <p className="muted agent-note">
              Expect <code>verdict: FALSE</code> with{" "}
              <code>source: coingecko</code> (or mock-fallback if rate-limited).
              Then gate with the same <code>receipt</code> object — required on
              Vercel cold starts.
            </p>
            <pre className="agent-snippet" tabIndex={0}>
              {CURL_AUDIT}
            </pre>
            <div className="snippet-head snippet-head-follow">
              <h3 className="snippet-sub">Then spend guard</h3>
              <CopyButton label="Copy guard curl" text={CURL_GUARD} />
            </div>
            <pre className="agent-snippet" tabIndex={0}>
              {CURL_GUARD}
            </pre>
            <ul className="api-list">
              <li>
                <a href="/api/health">
                  <code>GET /api/health</code>
                </a>
              </li>
              <li>
                <code>POST /api/audit-claim</code>
              </li>
              <li>
                <code>POST /api/check-spend-guard</code> (+{" "}
                <code>receipt</code>)
              </li>
              <li>
                <code>POST /api/seal-receipt</code>
              </li>
            </ul>
          </div>

          <div className="agent-grid mcp-dual">
            <div className="agent-col">
              <div className="snippet-head">
                <h3>MCP · general</h3>
                <CopyButton label="Copy" text={MCP_GENERAL_SNIPPET} />
              </div>
              <p className="muted agent-note">
                Full tools · seal + WDK gate. Set <code>cwd</code> to your
                clone; build first.
              </p>
              <pre className="agent-snippet" tabIndex={0}>
                {MCP_GENERAL_SNIPPET}
              </pre>
              <p className="muted agent-note">
                <code>npm run build -w @oraculo/mcp-server</code> ·{" "}
                <a href={MCP_README_URL} target="_blank" rel="noreferrer">
                  README
                </a>
              </p>
            </div>
            <div className="agent-col">
              <div className="snippet-head">
                <h3>MCP · lite</h3>
                <CopyButton label="Copy" text={MCP_LITE_SNIPPET} />
              </div>
              <p className="muted agent-note">
                3 tools · 5 min cache · fewer CoinGecko calls
              </p>
              <pre className="agent-snippet" tabIndex={0}>
                {MCP_LITE_SNIPPET}
              </pre>
              <p className="muted agent-note">
                <code>npm run build -w @oraculo/mcp-lite</code> ·{" "}
                <a href={MCP_LITE_README_URL} target="_blank" rel="noreferrer">
                  README
                </a>
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
            <a href={REGISTRY_EXPLORER} target="_blank" rel="noreferrer">
              {REGISTRY_SHORT}
            </a>
          </p>
        </footer>
      </main>
    </div>
  );
}
