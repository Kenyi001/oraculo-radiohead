import { FormEvent, useEffect, useState } from "react";
import {
  DEFAULT_DEMO_POSITIONS,
  checkWdkGuardrail,
  getHealth,
  getMarketContext,
  fetchMarketNews,
  getMarketPulse,
  getPortfolioState,
  getRiskLevel,
  type HealthStatus,
  type MarketContext,
  type MarketNews,
  type MarketPulse,
  type PortfolioState,
  type RiskAssessment,
  type WdkGuardrailResult,
} from "@oraculo/market-core";
import { connectMetaMask, publishRiskViaMetaMask } from "./metamask";

const REGISTRY =
  import.meta.env.VITE_CASANDRA_REGISTRY_ADDRESS?.trim() || "";

function buildNewsReportJson(news: MarketNews) {
  const feedBase = news.sources.find((s) => s.type === "news" && s.id === 1);
  const recomendacionEs =
    news.analysis.invest_recommendation === "caution_ok"
      ? "Exposición con precaución"
      : news.analysis.invest_recommendation === "avoid_increase"
        ? "No aumentar exposición"
        : "Esperar / titulares mixtos";

  return {
    symbol: news.symbol,
    fetched_at: news.fetched_at,
    conclusion: {
      favor: news.analysis.news_favor,
      recomendacion: news.analysis.invest_recommendation,
      recomendacion_es: recomendacionEs,
      action: news.analysis.action,
      verdict_es: news.analysis.verdict_es,
      sentiment_score: news.analysis.sentiment_score,
      reasons: news.analysis.reasons,
      positive_signals: news.analysis.positive_signals,
      negative_signals: news.analysis.negative_signals,
    },
    fuentes: news.sources,
    noticias: news.articles.map((a) => ({
      titulo: a.title,
      enlace: a.url,
      base: {
        nombre: feedBase?.name ?? a.source,
        feed_url: feedBase?.url ?? null,
      },
      fuente: a.source,
      publicado: a.posted_at,
      simbolos: a.related_symbols,
    })),
  };
}

function buildNewsApiFormat(news: MarketNews) {
  const symbol = news.symbol;
  return {
    request: {
      method: "GET",
      url: `/api/market-news?symbol=${encodeURIComponent(symbol)}`,
      headers: { Accept: "application/json" },
    },
    response: {
      status: 200,
      content_type: "application/json; charset=utf-8",
      cache_control: "public, max-age=120",
      body: buildNewsReportJson(news),
    },
  };
}

function buildNewsMcpFormat(news: MarketNews) {
  const symbol = news.symbol;
  const payload = buildNewsReportJson(news);
  return {
    server: "casandra",
    version: "0.2.0",
    tool: "get_market_news",
    description:
      "Casandra: recent crypto headlines + casandra-news-v1 analysis (favor, invest hint, verdict). NOT financial advice.",
    arguments: { symbol },
    result: {
      content: [
        {
          type: "text",
          text: JSON.stringify(payload, null, 2),
        },
      ],
    },
  };
}

export function App() {
  const [portfolio, setPortfolio] = useState<PortfolioState | null>(null);
  const [risk, setRisk] = useState<RiskAssessment | null>(null);
  const [guardrail, setGuardrail] = useState<WdkGuardrailResult | null>(null);
  const [pulse, setPulse] = useState<MarketPulse | null>(null);
  const [contextSymbol, setContextSymbol] = useState("btc");
  const [context, setContext] = useState<MarketContext | null>(null);
  const [newsSymbol, setNewsSymbol] = useState("btc");
  const [news, setNews] = useState<MarketNews | null>(null);
  const [health, setHealth] = useState<HealthStatus | null>(null);
  const [wallet, setWallet] = useState<string | null>(null);
  const [onchainTx, setOnchainTx] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function loadDemo() {
    setLoading(true);
    setError(null);
    try {
      const [p, r, g, pl] = await Promise.all([
        getPortfolioState(DEFAULT_DEMO_POSITIONS),
        getRiskLevel({ positions: DEFAULT_DEMO_POSITIONS }),
        checkWdkGuardrail({ positions: DEFAULT_DEMO_POSITIONS, intended_send: true }),
        getMarketPulse(["btc", "eth", "usdt"]),
      ]);
      setPortfolio(p);
      setRisk(r);
      setGuardrail(g);
      setPulse(pl);
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

  async function onNews(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      setNews(await fetchMarketNews(newsSymbol));
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
    }
  }

  async function onConnectWallet() {
    setError(null);
    try {
      const { address } = await connectMetaMask();
      setWallet(address);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    }
  }

  async function onPublishOnChain() {
    if (!REGISTRY) {
      setError("VITE_CASANDRA_REGISTRY_ADDRESS no configurada. Deploy #10 primero.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      if (!wallet) await onConnectWallet();
      const { txHash } = await publishRiskViaMetaMask(REGISTRY);
      setOnchainTx(txHash);
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
              <span className="gauge-score">{risk.risk_pct}%</span>
              <span className="gauge-band">{risk.band}</span>
            </div>
            <p className="verdict">{risk.verdict_es}</p>
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

      {guardrail && (
        <section className="card">
          <h2>WDK guardrail (check_wdk_guardrail)</h2>
          <p className={`wdk-action action-${guardrail.action}`}>
            allow_wdk_send: <strong>{String(guardrail.allow_wdk_send)}</strong> ·
            action: <strong>{guardrail.action}</strong>
          </p>
          <ul>
            {guardrail.reasons.map((r) => (
              <li key={r}>{r}</li>
            ))}
          </ul>
          <p className="muted">Next steps for agents:</p>
          <ol>
            {guardrail.next_steps.map((s) => (
              <li key={s}>{s}</li>
            ))}
          </ol>
        </section>
      )}

      {pulse && (
        <section className="card">
          <h2>Market pulse</h2>
          <p className={`pulse-favor favor-${pulse.market_favor}`}>
            market_favor: <strong>{pulse.market_favor}</strong> · Fear &amp; Greed{" "}
            <strong>{pulse.fear_greed_index}</strong> ({pulse.fear_greed_label})
          </p>
          <p>{pulse.verdict_es}</p>
          <ul>
            {pulse.reasons.map((r) => (
              <li key={r}>{r}</li>
            ))}
          </ul>
        </section>
      )}

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
        <h2>Market news</h2>
        <form onSubmit={onNews} className="row">
          <input
            value={newsSymbol}
            onChange={(e) => setNewsSymbol(e.target.value)}
            placeholder="btc"
            aria-label="news symbol"
          />
          <button type="submit" disabled={loading}>
            Fetch news
          </button>
        </form>
        {news && (
          <>
            <p className="muted">{news.summary_es}</p>

            <h3 className="subheading">Números actuales del mercado</h3>
            <table>
              <tbody>
                <tr>
                  <th>Precio {news.market_numbers.symbol.toUpperCase()}</th>
                  <td>
                    $
                    {news.market_numbers.price_usd.toLocaleString("en-US", {
                      maximumFractionDigits:
                        news.market_numbers.price_usd < 1 ? 4 : 2,
                    })}
                  </td>
                </tr>
                <tr>
                  <th>Cambio 24h</th>
                  <td>
                    {news.market_numbers.change_24h_pct == null
                      ? "—"
                      : `${news.market_numbers.change_24h_pct >= 0 ? "+" : ""}${news.market_numbers.change_24h_pct.toFixed(2)}%`}
                  </td>
                </tr>
                <tr>
                  <th>BTC 24h (ref.)</th>
                  <td>
                    {news.market_numbers.btc_change_24h_pct == null
                      ? "—"
                      : `${news.market_numbers.btc_change_24h_pct >= 0 ? "+" : ""}${news.market_numbers.btc_change_24h_pct.toFixed(2)}%`}
                  </td>
                </tr>
                <tr>
                  <th>Riesgo Casandra</th>
                  <td>
                    {news.market_numbers.risk_pct}% ({news.market_numbers.risk_band})
                  </td>
                </tr>
                <tr>
                  <th>Fear &amp; Greed</th>
                  <td>
                    {news.market_numbers.fear_greed_index} (
                    {news.market_state.fear_greed_label})
                  </td>
                </tr>
                <tr>
                  <th>Fuente precio</th>
                  <td>{news.market_numbers.price_source}</td>
                </tr>
              </tbody>
            </table>

            <h3 className="subheading">Estado de mercado</h3>
            <p className={`bias bias-${news.market_state.bias}`}>
              Sesgo: <strong>{news.market_state.bias}</strong> · Mercado:{" "}
              <strong>{news.market_state.market_favor}</strong>
            </p>
            <p className="muted">{news.market_state.state_summary_es}</p>

            <div className={`pulse-favor favor-${news.analysis.news_favor}`}>
              Conclusión: <strong>{news.analysis.news_favor.toUpperCase()}</strong>
              {" · "}
              Recomendación:{" "}
              <strong>
                {news.analysis.invest_recommendation === "caution_ok"
                  ? "Exposición con precaución"
                  : news.analysis.invest_recommendation === "avoid_increase"
                    ? "No aumentar exposición"
                    : "Esperar / titulares mixtos"}
              </strong>
              {" · "}
              action: <strong>{news.analysis.action}</strong>
            </div>
            <p className="verdict">{news.analysis.verdict_es}</p>
            <ul>
              {news.analysis.reasons.map((r) => (
                <li key={r}>{r}</li>
              ))}
            </ul>
            <h3 className="subheading">Reporte noticias (JSON)</h3>
            <pre className="json-block" aria-label="reporte noticias json">
              {JSON.stringify(buildNewsReportJson(news), null, 2)}
            </pre>
            <h3 className="subheading">Formato API</h3>
            <p className="muted format-hint">
              REST dev server — <code>GET /api/market-news?symbol={news.symbol}</code>
            </p>
            <pre className="json-block" aria-label="formato api">
              {JSON.stringify(buildNewsApiFormat(news), null, 2)}
            </pre>
            <h3 className="subheading">Formato MCP</h3>
            <p className="muted format-hint">
              Tool <code>get_market_news</code> — respuesta en{" "}
              <code>result.content[].text</code>
            </p>
            <pre className="json-block" aria-label="formato mcp">
              {JSON.stringify(buildNewsMcpFormat(news), null, 2)}
            </pre>
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
        <h2>On-chain (MetaMask · Base Sepolia)</h2>
        <p className="muted">
          Publica el snapshot de riesgo en <code>CasandraRegistry</code> tras{" "}
          <code>getRiskLevel</code>.
        </p>
        <div className="row">
          <button type="button" onClick={() => void onConnectWallet()} disabled={loading}>
            {wallet ? `Connected ${wallet.slice(0, 8)}…` : "Connect MetaMask"}
          </button>
          <button
            type="button"
            onClick={() => void onPublishOnChain()}
            disabled={loading || !REGISTRY}
          >
            Publish risk snapshot
          </button>
        </div>
        {!REGISTRY && (
          <p className="error">
            Registry address missing — set VITE_CASANDRA_REGISTRY_ADDRESS after deploy.
          </p>
        )}
        {onchainTx && (
          <p>
            Published:{" "}
            <a
              href={`https://sepolia.basescan.org/tx/${onchainTx}`}
              target="_blank"
              rel="noreferrer"
            >
              {onchainTx.slice(0, 14)}…
            </a>
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
          Same engine as MCP (<code>packages/mcp-server</code>).{" "}
          <strong>Not financial advice.</strong>
        </p>
        <p className="onchain muted">
          On-chain registry (Base Sepolia):{" "}
          {REGISTRY ? (
            <a
              href={
                import.meta.env.VITE_CASANDRA_REGISTRY_EXPLORER ||
                `https://sepolia.basescan.org/address/${REGISTRY}`
              }
              target="_blank"
              rel="noreferrer"
            >
              {REGISTRY.slice(0, 10)}…
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
