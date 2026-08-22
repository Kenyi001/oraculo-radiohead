import { FormEvent, useEffect, useState } from "react";
import {
  DEFAULT_DEMO_POSITIONS,
  getHealth,
  getMarketPulse,
  getPortfolioState,
  getRiskLevel,
  type HealthStatus,
  type MarketPulse,
  type PortfolioState,
  type RiskAssessment,
} from "@oraculo/market-core";

export function App() {
  const [portfolio, setPortfolio] = useState<PortfolioState | null>(null);
  const [risk, setRisk] = useState<RiskAssessment | null>(null);
  const [pulse, setPulse] = useState<MarketPulse | null>(null);
  const [pulseSymbol, setPulseSymbol] = useState("eth");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [health, setHealth] = useState<HealthStatus | null>(null);

  async function loadDemo() {
    setLoading(true);
    setError(null);
    try {
      const [p, r, pul] = await Promise.all([
        getPortfolioState(DEFAULT_DEMO_POSITIONS),
        getRiskLevel({ positions: DEFAULT_DEMO_POSITIONS }),
        getMarketPulse({ symbol: pulseSymbol, side: "buy", include_news: true }),
      ]);
      setPortfolio(p);
      setRisk(r);
      setPulse(pul);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadDemo();
    // eslint-disable-next-line react-hooks/exhaustive-deps -- initial load only
  }, []);

  async function onPulse(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      setPulse(
        await getMarketPulse({
          symbol: pulseSymbol,
          side: "buy",
          include_news: true,
        })
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
    }
  }

  const gaugePct = risk ? Math.min(100, Math.max(0, risk.score)) : 0;
  const hint = pulse?.verdict ?? risk?.action;

  return (
    <main className="page">
      <header>
        <p className="eyebrow">Aleph 2026 · Santa Cruz · General + WDK sponsor</p>
        <h1>Casandra</h1>
        <p className="tagline">
          One call → Evidence Pack (price, risk, news, why). The agent decides —
          we don&apos;t invent numbers or move money for you. Not predictions. Not
          financial advice.
        </p>
      </header>

      <section className="card hero-pulse">
        <div className="hero-top">
          <h2>Market Pulse — Evidence Pack</h2>
          <button type="button" onClick={() => void loadDemo()} disabled={loading}>
            Refresh
          </button>
        </div>
        <form onSubmit={onPulse} className="row">
          <input
            value={pulseSymbol}
            onChange={(e) => setPulseSymbol(e.target.value)}
            placeholder="eth"
            aria-label="symbol"
          />
          <button type="submit" disabled={loading}>
            Pulse
          </button>
        </form>

        {pulse && (
          <>
            <p className={`decision-hint action-${pulse.verdict}`}>
              Agent decision hint: <strong>{pulse.verdict}</strong>
              {" · "}
              favor <strong>{pulse.market_favor}</strong>
              {" · "}
              confidence {(pulse.confidence * 100).toFixed(0)}%
            </p>
            <p className="muted tip">
              Hint is context for the agent — not a trade order and not a send
              command. WDK execution is optional after the agent decides.
            </p>

            <h3 className="subhead">Why</h3>
            <dl className="why-grid">
              <div>
                <dt>Market</dt>
                <dd>{pulse.why.market}</dd>
              </div>
              <div>
                <dt>News</dt>
                <dd>{pulse.why.news}</dd>
              </div>
              <div>
                <dt>Sentiment</dt>
                <dd>{pulse.why.sentiment}</dd>
              </div>
              <div>
                <dt>Alignment</dt>
                <dd>{pulse.why.alignment}</dd>
              </div>
            </dl>

            <h3 className="subhead">Reasons</h3>
            <ul className="reasons">
              {pulse.reasons.map((r) => (
                <li key={r}>{r}</li>
              ))}
            </ul>

            <h3 className="subhead">Meters</h3>
            <ul className="meters">
              <li>
                Price ${pulse.meters.price_usd.toLocaleString("en-US", {
                  maximumFractionDigits: 2,
                })}{" "}
                · 24h{" "}
                {pulse.meters.change_24h_pct == null
                  ? "n/a"
                  : `${pulse.meters.change_24h_pct >= 0 ? "+" : ""}${pulse.meters.change_24h_pct.toFixed(2)}%`}
              </li>
              <li>
                Fear&amp;Greed {pulse.meters.fear_greed_value} (
                {pulse.meters.fear_greed_label})
              </li>
              <li>
                News score {pulse.meters.news_score.toFixed(2)} · bias{" "}
                {pulse.meters.news_bias}
              </li>
            </ul>

            {pulse.headlines.length > 0 && (
              <>
                <h3 className="subhead">Headlines</h3>
                <ul className="headlines">
                  {pulse.headlines.slice(0, 5).map((h) => (
                    <li key={h.url || h.title}>
                      {h.url ? (
                        <a href={h.url} target="_blank" rel="noreferrer">
                          {h.title}
                        </a>
                      ) : (
                        h.title
                      )}
                      {h.source ? (
                        <span className="muted"> · {h.source}</span>
                      ) : null}
                    </li>
                  ))}
                </ul>
              </>
            )}

            <p className="muted">
              <code>{pulse.algorithm}</code> · consume_only=
              {String(pulse.consume_only)} · {pulse.fetched_at}
            </p>
          </>
        )}
      </section>

      <section className="card">
        <div className="hero-top">
          <h2>Risk level (supporting)</h2>
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
            <p className="verdict">{risk.verdict_es}</p>
            {hint && (
              <p className={`decision-hint action-${hint}`}>
                Context signal: <strong>{hint}</strong>
              </p>
            )}
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
        <h2>health</h2>
        <button type="button" onClick={() => setHealth(getHealth())}>
          Check
        </button>
        {health && <pre>{JSON.stringify(health, null, 2)}</pre>}
      </section>

      {error && <p className="error">{error}</p>}

      <footer>
        <p>
          Same evidence engine as MCP <code>get_market_pulse</code>.{" "}
          <strong>Not financial advice.</strong> The agent decides.
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
