import type { ViteDevServer } from "vite";

/** Dev API: market news + market pulse (server-side fetch, no browser CORS). */
export function attachMarketNewsApi(server: ViteDevServer) {
  server.middlewares.use(async (req, res, next) => {
    if (!req.url?.startsWith("/api/market-news") && !req.url?.startsWith("/api/market-pulse")) {
      next();
      return;
    }
    try {
      const url = new URL(req.url, "http://localhost");
      const { getMarketNews, getMarketPulse } = await import("../market-core/src/index.ts");

      if (req.url.startsWith("/api/market-pulse")) {
        const symbol = url.searchParams.get("symbol") ?? "btc";
        const sideParam = url.searchParams.get("side");
        const side =
          sideParam === "buy" || sideParam === "sell" ? sideParam : undefined;
        const lookbackRaw = url.searchParams.get("lookback_hours");
        const lookback_hours = lookbackRaw ? Number(lookbackRaw) : undefined;
        const include_news = url.searchParams.get("include_news") !== "false";

        const data = await getMarketPulse({
          symbol,
          side,
          lookback_hours: Number.isFinite(lookback_hours)
            ? lookback_hours
            : undefined,
          include_news,
        });
        res.setHeader("Content-Type", "application/json; charset=utf-8");
        res.setHeader("Cache-Control", "public, max-age=60");
        res.end(JSON.stringify(data));
        return;
      }

      const symbol = url.searchParams.get("symbol") ?? "btc";
      const data = await getMarketNews(symbol);
      res.setHeader("Content-Type", "application/json; charset=utf-8");
      res.setHeader("Cache-Control", "public, max-age=120");
      res.end(JSON.stringify(data));
    } catch (err) {
      res.statusCode = 502;
      res.setHeader("Content-Type", "application/json; charset=utf-8");
      res.end(
        JSON.stringify({
          error: err instanceof Error ? err.message : String(err),
        })
      );
    }
  });
}
