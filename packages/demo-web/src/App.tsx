import { FormEvent, useEffect, useState } from "react";
import {
  DEMO_LIE_CLAIM,
  auditClaim,
  checkSpendGuard,
  getHealth,
  getPortfolioState,
  getRiskLevel,
  rememberReceipt,
  type AuditResult,
  type HealthStatus,
  type PortfolioState,
  type RiskAssessment,
  type SpendGuardResult,
} from "@oraculo/market-core";

export function App() {
  const [claim, setClaim] = useState(DEMO_LIE_CLAIM);
  const [audit, setAudit] = useState<AuditResult | null>(null);
  const [guard, setGuard] = useState<SpendGuardResult | null>(null);
  const [portfolio, setPortfolio] = useState<PortfolioState | null>(null);
  const [risk, setRisk] = useState<RiskAssessment | null>(null);
  const [health, setHealth] = useState<HealthStatus | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function runAudit(text = claim) {
    setLoading(true);
    setError(null);
    setGuard(null);
    try {
      const result = await auditClaim({ text });
      rememberReceipt(result.receipt);
      setAudit(result);
      const [p, r] = await Promise.all([
        getPortfolioState([]),
        getRiskLevel({ positions: [] }),
      ]);
      setPortfolio(p);
      setRisk(r);
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
  }

  const verdict = audit?.verdict ?? null;

  return (
    <main className="page">
      <header>
        <p className="eyebrow">
          Aleph Hackathon 2026 · Santa Cruz · General + WDK Track 1
        </p>
        <h1>Casandra</h1>
        <p className="tagline">
          A lie detector for AI agents that talk about money. They can speak.
          They cannot seal a lie — and they cannot spend USDT on one.
        </p>
      </header>

      <section className="card hero-audit">
        <h2>Audit a claim</h2>
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
            <br />
            {audit.receipt.fetched_at}
          </p>
        </section>
      )}

      <section className="card wdk-gate">
        <h2>WDK spend gate</h2>
        <p className="muted">
          Core loop: sealed FALSE → USDT does not move. Uses{" "}
          <code>@tetherto/wdk</code> dry-run (no live broadcast).
        </p>
        <button
          type="button"
          onClick={onTrySend}
          disabled={!audit || loading}
          className={verdict === "FALSE" ? "danger" : undefined}
        >
          Try send USDT
        </button>
        {guard && (
          <div
            className={`guard-result guard-${guard.status}`}
            role="status"
          >
            <p className="guard-status">{guard.status.toUpperCase()}</p>
            <p>{guard.reason}</p>
            <pre>{JSON.stringify(guard.wdk, null, 2)}</pre>
          </div>
        )}
      </section>

      <section className="card sources">
        <h2>Evidence sources</h2>
        <p className="muted">
          Same quotes + risk engine the audit uses — supporting, not the product.
        </p>
        {portfolio && (
          <p>
            Portfolio $
            {portfolio.total_value_usd.toLocaleString("en-US", {
              maximumFractionDigits: 0,
            })}{" "}
            · USDT share {portfolio.usdt_share_pct.toFixed(1)}%
            {risk && (
              <>
                {" "}
                · risk {risk.band} ({risk.score})
              </>
            )}
          </p>
        )}
      </section>

      <section className="card">
        <h2>health</h2>
        <button type="button" onClick={() => setHealth(getHealth())}>
          Check
        </button>
        {health && <pre>{JSON.stringify(health, null, 2)}</pre>}
      </section>

      {error && <p className="error">{error}</p>}

      <footer>
        <p>
          Same engine as MCP (<code>audit_claim</code>,{" "}
          <code>check_spend_guard</code>). <strong>Not financial advice.</strong>
        </p>
        <p className="onchain muted">
          On-chain registry (Ethereum Sepolia):{" "}
          {import.meta.env.VITE_CASANDRA_REGISTRY_ADDRESS ? (
            <a
              href={
                import.meta.env.VITE_CASANDRA_REGISTRY_EXPLORER ||
                `https://sepolia.etherscan.io/address/${import.meta.env.VITE_CASANDRA_REGISTRY_ADDRESS}`
              }
              target="_blank"
              rel="noreferrer"
            >
              {String(import.meta.env.VITE_CASANDRA_REGISTRY_ADDRESS).slice(0, 10)}
              …
            </a>
          ) : (
            <a
              href="https://sepolia.etherscan.io/address/0xc9fcDEC150C8903b51F299dcBa308F453C4AB975"
              target="_blank"
              rel="noreferrer"
            >
              0xc9fcDEC1…
            </a>
          )}
        </p>
      </footer>
    </main>
  );
}
