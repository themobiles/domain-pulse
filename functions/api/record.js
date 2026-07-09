export async function onRequestPost(context) {
    const { request, env } = context;
    const db = env.the_mobiles_online_db;
    if (!db) {
        return new Response(JSON.stringify({ success: false, error: "Database binding not found" }), {
            status: 500,
            headers: { "Content-Type": "application/json" }
        });
    }
    
    try {
        const data = await request.json();
        
        // データのバリデーションと簡易パース
        const country = String(data.country || 'Unknown').slice(0, 100);
        const edgeLocation = String(data.edgeLocation || 'Unknown').slice(0, 150);
        const isp = String(data.isp || 'Unknown').slice(0, 200);
        const protocol = String(data.protocol || 'Unknown').slice(0, 50);
        const rtt = parseInt(data.rtt) || 0;
        
        // User-Agentを簡易ブラウザ名に分類 (Safari, Chrome, Firefox, Edge, Other)
        const ua = String(data.userAgent || 'Unknown');
        let browser = 'Other';
        if (ua.includes('Edg/')) browser = 'Edge';
        else if (ua.includes('Chrome/')) browser = 'Chrome';
        else if (ua.includes('Safari/') && !ua.includes('Chrome/')) browser = 'Safari';
        else if (ua.includes('Firefox/')) browser = 'Firefox';
        
        // リファラからホスト名を抽出 (例: www.google.com)
        let referer = 'なし';
        const rawReferer = String(data.referer || 'なし');
        if (rawReferer !== 'なし' && rawReferer.startsWith('http')) {
            try {
                const url = new URL(rawReferer);
                referer = url.hostname;
            } catch (e) {
                referer = '不正なURL';
            }
        }

        // D1にインサート
        await db.prepare(`
            INSERT INTO access_stats (country, edge_location, isp, protocol, rtt, browser, referer)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        `).bind(country, edgeLocation, isp, protocol, rtt, browser, referer).run();

        return new Response(JSON.stringify({ success: true }), {
            headers: {
                "Content-Type": "application/json",
                "Cache-Control": "no-store"
            }
        });
    } catch (err) {
        return new Response(JSON.stringify({ success: false, error: err.message }), {
            status: 400,
            headers: {
                "Content-Type": "application/json",
                "Cache-Control": "no-store"
            }
        });
    }
}
