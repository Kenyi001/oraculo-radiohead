import { FormEvent, useState } from "react";
import {
  getHealth,
  getMarketSummary,
  getPrice,
  type HealthStatus,
  type MarketSummary,
  type PriceQuote,
} from "@oraculo/market-core";

export function App() {
  const [symbol, setSymbol] = useState("btc");
  const [symbols, setSymbols] = useState("btc,eth,usdt");
  const [quote, setQuote] = useState<PriceQuote | null>(null);
  const [summary, setSummary] = useState<MarketSummary | null>(null);
  const [health, setHealth] = useState<HealthStatus | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onPrice(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      setQuote(await getPrice(symbol));
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
    }
  }

  async function onSummary(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const list = symbols
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
      setSummary(await getMarketSummary(list));
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
    }
  }

  async function onHealth() {
    setHealth(getHealth());
  }

  return (
    <main className="page">
      <header>
        <p className="eyebrow">Aleph Hackathon 2026 · Santa Cruz</p>
        <h1>Oraculo</h1>
        <p className="tagline">
          Market Oracle MCP — real market state for AI agents, not hallucinations.
        </p>
      </header>

      <section className="card">
        <h2>get_price</h2>
        <form onSubmit={onPrice} className="row">
          <input
            value={symbol}
            onChange={(e) => setSymbol(e.target.value)}
            placeholder="btc"
            aria-label="symbol"
          />
          <button type="submit" disabled={loading}>
            Fetch
          </button>
        </form>
        {quote && <pre>{JSON.stringify(quote, null, 2)}</pre>}
      </section>

      <section className="card">
        <h2>get_market_summary</h2>
        <form onSubmit={onSummary} className="row">
          <input
            value={symbols}
            onChange={(e) => setSymbols(e.target.value)}
            placeholder="btc,eth,usdt"
            aria-label="symbols"
          />
          <button type="submit" disabled={loading}>
            Summarize
          </button>
        </form>
        {summary && (
          <>
            <p className={`bias bias-${summary.bias}`}>
              Bias: <strong>{summary.bias}</strong>
            </p>
            <ul>
              {summary.bullets.map((b) => (
                <li key={b}>{b}</li>
              ))}
            </ul>
            <pre>{JSON.stringify(summary.quotes, null, 2)}</pre>
          </>
        )}
      </section>

      <section className="card">
        <h2>health</h2>
        <button type="button" onClick={onHealth}>
          Check
        </button>
        {health && <pre>{JSON.stringify(health, null, 2)}</pre>}
      </section>

      {error && <p className="error">{error}</p>}

      <footer>
        <p>
          Same logic as the MCP tools. Wire Cursor/Claude to{" "}
          <code>packages/mcp-server</code>. Not financial advice.
        </p>
      </footer>
    </main>
  );
}
