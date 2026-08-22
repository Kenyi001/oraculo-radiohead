import type { ViteDevServer } from "vite";

/** Dev API: full market news report (RSS + prices + pulse + analysis). */
export function attachMarketNewsApi(server: ViteDevServer) {
  server.middlewares.use(async (req, res, next) => {
    if (!req.url?.startsWith("/api/market-news")) {
      next();
      return;
    }
    try {
      const url = new URL(req.url, "http://localhost");
      const symbol = url.searchParams.get("symbol") ?? "btc";
      const { getMarketNews } = await import("../market-core/src/index.ts");
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
