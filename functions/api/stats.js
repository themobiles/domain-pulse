export async function onRequest(context) {
    const { request, env } = context;
    const db = env.the_mobiles_online_db;
    
    if (!db) {
        return new Response(JSON.stringify({ error: "Database binding not found" }), {
            status: 500,
            headers: { "Content-Type": "application/json" }
        });
    }

    // 認証チェック (Bearer Token)
    const authHeader = request.headers.get("Authorization") || "";
    const expectedToken = env.STATS_API_KEY;
    
    // 環境変数にキーが設定されていない場合は、セキュリティのためAPIを無効化する
    if (!expectedToken) {
        return new Response(JSON.stringify({ error: "API Key not configured on server" }), {
            status: 500,
            headers: { "Content-Type": "application/json" }
        });
    }

    if (authHeader !== `Bearer ${expectedToken}`) {
        return new Response(JSON.stringify({ error: "Unauthorized" }), {
            status: 401,
            headers: { "Content-Type": "application/json" }
        });
    }

    try {
        // バッチクエリで一括集計を実行
        const results = await db.batch([
            db.prepare("SELECT country, COUNT(*) as count FROM access_stats GROUP BY country ORDER BY count DESC LIMIT 5"),
            db.prepare("SELECT edge_location, COUNT(*) as count FROM access_stats GROUP BY edge_location ORDER BY count DESC LIMIT 5"),
            db.prepare("SELECT isp, COUNT(*) as count FROM access_stats GROUP BY isp ORDER BY count DESC LIMIT 5"),
            db.prepare("SELECT browser, COUNT(*) as count FROM access_stats GROUP BY browser ORDER BY count DESC"),
            db.prepare("SELECT protocol, COUNT(*) as count FROM access_stats GROUP BY protocol ORDER BY count DESC"),
            db.prepare("SELECT AVG(rtt) as avg_rtt FROM access_stats WHERE rtt > 0"),
            db.prepare("SELECT referer, COUNT(*) as count FROM access_stats GROUP BY referer ORDER BY count DESC LIMIT 5"),
            db.prepare("SELECT COUNT(*) as total FROM access_stats")
        ]);

        const statsData = {
            countries: results[0].results,
            edges: results[1].results,
            isps: results[2].results,
            browsers: results[3].results,
            protocols: results[4].results,
            avgRtt: Math.round(results[5].results[0]?.avg_rtt || 0),
            referers: results[6].results,
            totalAccess: results[7].results[0]?.total || 0,
            generatedAt: new Date().toISOString()
        };

        return new Response(JSON.stringify(statsData), {
            headers: {
                "Content-Type": "application/json;charset=UTF-8",
                "Cache-Control": "no-store",
                "Access-Control-Allow-Origin": "*" // GitHub Actions等の外部連携を許可
            }
        });
    } catch (err) {
        return new Response(JSON.stringify({ error: err.message }), {
            status: 500,
            headers: { "Content-Type": "application/json", "Cache-Control": "no-store" }
        });
    }
}
