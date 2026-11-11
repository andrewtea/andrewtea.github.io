// Guest counter for andrewtea.dev's "who's online" box.
// Each open page sends POST /online?id=<random browser id> every minute while visible,
// and ?leave=1 when it closes. A guest counts as online if seen in the last two minutes.
import { DurableObject } from "cloudflare:workers";

const WINDOW_MS = 2 * 60 * 1000;
const SITE = "https://andrewtea.dev";

export class Presence extends DurableObject {
  constructor(ctx, env) {
    super(ctx, env);
    ctx.storage.sql.exec("CREATE TABLE IF NOT EXISTS seen (id TEXT PRIMARY KEY, at INTEGER NOT NULL)");
  }

  ping(id, leave) {
    const sql = this.ctx.storage.sql;
    const now = Date.now();
    sql.exec("DELETE FROM seen WHERE at < ?", now - WINDOW_MS);
    if (leave) sql.exec("DELETE FROM seen WHERE id = ?", id);
    else sql.exec("INSERT INTO seen (id, at) VALUES (?, ?) ON CONFLICT(id) DO UPDATE SET at = excluded.at", id, now);
    return sql.exec("SELECT COUNT(*) AS n FROM seen").one().n;
  }
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const id = url.searchParams.get("id") ?? "";
    if (url.pathname !== "/online" || request.method !== "POST" || !/^[0-9a-f-]{36}$/.test(id)) {
      return new Response("not found", { status: 404 });
    }
    const guests = await env.PRESENCE.getByName("site").ping(id, url.searchParams.has("leave"));
    return Response.json({ guests }, {
      headers: { "access-control-allow-origin": SITE, "cache-control": "no-store" },
    });
  },
};
