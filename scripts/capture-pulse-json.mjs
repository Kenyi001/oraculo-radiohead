import { getMarketPulse } from "../packages/market-core/dist/index.js";

const symbols = ["btc", "eth"];

for (const symbol of symbols) {
  const pulse = await getMarketPulse({ symbol, side: "buy", include_news: true });
  console.log(`\n=== ${symbol.toUpperCase()} ===\n`);
  console.log(JSON.stringify(pulse, null, 2));
}
