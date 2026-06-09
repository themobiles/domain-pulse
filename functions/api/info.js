export async function onRequest(context) {
    const { request } = context;
    
    // Cloudflareのヘッダーおよび request.cf オブジェクトから接続情報を抽出
    const ip = request.headers.get("CF-Connecting-IP") || "127.0.0.1";
    const userAgent = request.headers.get("User-Agent") || "Unknown";
    const language = request.headers.get("Accept-Language") || "Unknown";
    
    // Cloudflare固有の接続・環境情報
    const cf = request.cf || {};
    
    const responseData = {
        ip: ip,
        userAgent: userAgent,
        language: language.split(",")[0], // 最優先言語のみ抽出
        country: cf.country || "Unknown",
        city: cf.city || "Unknown",
        region: cf.region || "Unknown",
        asn: cf.asn ? `AS${cf.asn}` : "Unknown",
        asOrganization: cf.asOrganization || "Unknown",
        protocol: cf.httpProtocol || "Unknown",
        tlsVersion: cf.tlsVersion || "Unknown"
    };

    return new Response(JSON.stringify(responseData), {
        headers: {
            "Content-Type": "application/json;charset=UTF-8"
        }
    });
}
