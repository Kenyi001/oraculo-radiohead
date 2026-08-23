import { FormEvent, useEffect, useState } from "react";
import {
  DEMO_LIE_CLAIM,
  auditClaim,
  checkSpendGuard,
  rememberReceipt,
  type AuditResult,
  type SpendGuardResult,
} from "@oraculo/market-core";

const DEMO_WALLET = {
  label: "Your WDK wallet",
  address: "0x4f30…71f4",
  balanceUsdt: 500,
  sendAmount: 200,
};

export function App() {
  const [claim, setClaim] = useState(DEMO_LIE_CLAIM);
  const [audit, setAudit] = useState<AuditResult | null>(null);
  const [guard, setGuard] = useState<SpendGuardResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [step, setStep] = useState<1 | 2 | 3>(1);

  async function runAudit(text = claim) {
    setLoading(true);
    setError(null);
    setGuard(null);
    try {
      const result = await auditClaim({ text });
      rememberReceipt(result.receipt);
      setAudit(result);
      setStep(2);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void runAudit(DEMO_LIE_CLAIM);
  }, []);

  function onAudit(e: FormEvent) {
    e.preventDefault();
    void runAudit(claim);
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
    });
  }

  const verdict = audit?.verdict ?? null;
  const blocked = guard?.status === "blocked";

  return (
    <main className="page">
      <header>
        <p className="eyebrow">
          Aleph Hackathon 2026 · Santa Cruz · General + WDK Track 1
        </p>
        <h1>Casandra</h1>
        <p className="tagline">
          Your USDT stays in <em>your</em> WDK wallet. Casandra only opens or
          closes the door — and it never opens on a lie.
        </p>
      </header>

      <ol className="story-steps" aria-label="Demo story">
        <li className={step >= 1 ? "active" : ""}>1 · Your money</li>
        <li className={step >= 2 ? "active" : ""}>2 · Seal the claim</li>
        <li className={step >= 3 ? "active" : ""}>3 · Try to spend</li>
      </ol>

      <section className="wallet-strip" aria-label="Your WDK wallet">
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

      <section className="card agent-bubble">
        <p className="panel-label">What the agent said</p>
        <form onSubmit={onAudit} className="claim-form">
          <textarea
            value={claim}
            onChange={(e) => setClaim(e.target.value)}
            rows={3}
            aria-label="agent claim"
          />
          <div className="row">
            <button type="submit" disabled={loading}>
              {loading ? "Sealing…" : "Seal contradiction"}
            </button>
            <button
              type="button"
              className="ghost"
              disabled={loading}
              onClick={() => {
                setClaim(DEMO_LIE_CLAIM);
                void runAudit(DEMO_LIE_CLAIM);
              }}
            >
              Demo lie
            </button>
          </div>
        </form>
      </section>

      {audit && (
        <section className="card split-board">
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
            className={`seal seal-${verdict?.toLowerCase()}`}
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
            <p className="muted">No contradictions — claim matches the world.</p>
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
        </section>
      )}

      <section className="card wdk-gate" id="wdk-gate">
        <h2>Spend through WDK</h2>
        <p className="muted gate-copy">
          Same USDT · same wallet · door closed if verdict is FALSE. Dry-run via{" "}
          <code>@tetherto/wdk</code> — no live broadcast. Casandra never holds
          the funds.
        </p>
        <button
          type="button"
          onClick={onTrySend}
          disabled={!audit || loading}
          className={verdict === "FALSE" ? "danger" : undefined}
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
  );
}
