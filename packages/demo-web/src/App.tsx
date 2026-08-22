import { FormEvent, useEffect, useState } from "react";
import {
  DEFAULT_DEMO_POSITIONS,
  getHealth,
  getMarketContext,
  getPortfolioState,
  getRiskLevel,
  type HealthStatus,
  type MarketContext,
  type PortfolioState,
  type RiskAssessment,
} from "@oraculo/market-core";

export function App() {
  const [portfolio, setPortfolio] = useState<PortfolioState | null>(null);
  const [risk, setRisk] = useState<RiskAssessment | null>(null);
  const [contextSymbol, setContextSymbol] = useState("btc");
  const [context, setContext] = useState<MarketContext | null>(null);
  const [health, setHealth] = useState<HealthStatus | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function loadDemo() {
    setLoading(true);
    setError(null);
    try {
      const [p, r] = await Promise.all([
        getPortfolioState(DEFAULT_DEMO_POSITIONS),
        getRiskLevel({ positions: DEFAULT_DEMO_POSITIONS }),
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
    void loadDemo();
  }, []);

  async function onContext(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      setContext(await getMarketContext(contextSymbol));
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
    }
  }

  const gaugePct = risk ? Math.min(100, Math.max(0, risk.score)) : 0;

  return (
    <main className="page">
      <header>
        <p className="eyebrow">Aleph 2026 · Santa Cruz · General + WDK sponsor</p>
        <h1>Casandra</h1>
        <p className="tagline">
          Investment oracle for AI agents — risk verdict gates Tether WDK
          wallet sends. Not hallucinations. Not financial advice.
        </p>
      </header>

      <section className="card hero-risk">
        <div className="hero-top">
          <h2>Risk level</h2>
          <button type="button" onClick={() => void loadDemo()} disabled={loading}>
            Refresh demo
          </button>
        </div>
        {risk && (
          <>
            <div
              className={`gauge gauge-${risk.band}`}
              style={{ ["--gauge" as string]: `${gaugePct}%` }}
              role="img"
              aria-label={`Risk score ${risk.score}, band ${risk.band}`}
            >
              <span className="gauge-score">{risk.score}</span>
              <span className="gauge-band">{risk.band}</span>
            </div>
            <p className="verdict" style={{ marginTop: "1rem", fontWeight: 600, fontSize: "1.05rem" }}>
              {risk.verdict_es}
            </p>
            <p className={`wdk-action action-${risk.action}`}>
              WDK guardrail: <strong>{risk.action}</strong>
              {risk.action === "avoid"
                ? " — block send_token"
                : risk.action === "caution"
                  ? " — dryRun only / smaller size"
                  : " — send allowed after confirm"}
            </p>
            <p className="muted">
              Algorithm <code>{risk.algorithm}</code> · scope {risk.scope}
            </p>
            <ul className="factors">
              {risk.factors.map((f) => (
                <li key={f.name}>
                  <strong>{f.name}</strong> ({f.weight}): {f.value.toFixed(1)} —{" "}
                  {f.note}
                </li>
              ))}
            </ul>
          </>
        )}
      </section>

      <section className="card">
        <h2>Portfolio state</h2>
        {portfolio && (
          <>
            <p>
              Total{" "}
              <strong>
                $
                {portfolio.total_value_usd.toLocaleString("en-US", {
                  maximumFractionDigits: 0,
                })}
              </strong>
              {" · "}
              USDT share{" "}
              <strong>{portfolio.usdt_share_pct.toFixed(1)}%</strong>
            </p>
            <table>
              <thead>
                <tr>
                  <th>Asset</th>
                  <th>Value</th>
                  <th>Weight</th>
                  <th>PnL</th>
                  <th>24h</th>
                </tr>
              </thead>
              <tbody>
                {portfolio.positions.map((p) => (
                  <tr key={p.symbol}>
                    <td>{p.symbol.toUpperCase()}</td>
                    <td>${p.value_usd.toFixed(0)}</td>
                    <td>{p.weight_pct.toFixed(1)}%</td>
                    <td>
                      {p.pnl_pct == null
                        ? "—"
                        : `${p.pnl_pct >= 0 ? "+" : ""}${p.pnl_pct.toFixed(1)}%`}
                    </td>
                    <td>
                      {p.change_24h_pct == null
                        ? "—"
                        : `${p.change_24h_pct >= 0 ? "+" : ""}${p.change_24h_pct.toFixed(2)}%`}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}
      </section>

      <section className="card">
        <h2>Market context</h2>
        <form onSubmit={onContext} className="row">
          <input
            value={contextSymbol}
            onChange={(e) => setContextSymbol(e.target.value)}
            placeholder="btc"
            aria-label="symbol"
          />
          <button type="submit" disabled={loading}>
            Analyze
          </button>
        </form>
        {context && (
          <>
            <p className={`bias bias-${context.bias}`}>
              Bias: <strong>{context.bias}</strong>
            </p>
            <ul>
              {context.bullets.map((b) => (
                <li key={b}>{b}</li>
              ))}
            </ul>
          </>
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
          Same engine as MCP (<code>packages/mcp-server</code>).{" "}
          <strong>Not financial advice.</strong>
        </p>
        <p className="onchain muted">
          On-chain registry (Base Sepolia):{" "}
          {import.meta.env.VITE_CASANDRA_REGISTRY_ADDRESS ? (
            <a
              href={
                import.meta.env.VITE_CASANDRA_REGISTRY_EXPLORER ||
                `https://sepolia.basescan.org/address/${import.meta.env.VITE_CASANDRA_REGISTRY_ADDRESS}`
              }
              target="_blank"
              rel="noreferrer"
            >
              {String(import.meta.env.VITE_CASANDRA_REGISTRY_ADDRESS).slice(0, 10)}…
            </a>
          ) : (
            <span>
              pending deploy — see <code>contracts/README.md</code>
            </span>
          )}
        </p>
      </footer>
    </main>
  );
}
