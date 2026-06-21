const IATA_MAP = {
    // 日本国内の主要エッジ
    "NRT": "東京 / 成田 (NRT)",
    "HND": "東京 / 羽田 (HND)",
    "KIX": "大阪 / 関西 (KIX)",
    "ITM": "大阪 / 伊丹 (ITM)",
    "NGO": "名古屋 / 中部 (NGO)",
    "FUK": "福岡 (FUK)",
    "CTS": "札幌 / 新千歳 (CTS)",
    "OKA": "沖縄 / 那覇 (OKA)",
    "SDJ": "仙台 (SDJ)",
    "KOJ": "鹿児島 (KOJ)",
    
    // アジア主要エッジ
    "ICN": "ソウル / 仁川 (ICN)",
    "GMP": "ソウル / 金浦 (GMP)",
    "HKG": "香港 (HKG)",
    "TPE": "台北 / 桃園 (TPE)",
    "TSA": "台北 / 松山 (TSA)",
    "SIN": "シンガポール (SIN)",
    "BKK": "バンコク (BKK)",
    "PVG": "上海 / 浦東 (PVG)",
    "PEK": "北京 / 首都 (PEK)",
    "SGN": "ホーチミン (SGN)",
    "MNL": "マニラ (MNL)",
    
    // アメリカ・ヨーロッパ主要エッジ
    "LAX": "ロサンゼルス (LAX)",
    "SFO": "サンフランシスコ (SFO)",
    "SEA": "シアトル (SEA)",
    "JFK": "ニューヨーク (JFK)",
    "ORD": "シカゴ (ORD)",
    "LHR": "ロンドン (LHR)",
    "CDG": "パリ (CDG)",
    "FRA": "フランクフルト (FRA)",
    "AMS": "アムステルダム (AMS)"
};

export async function onRequest(context) {
    const { request } = context;
    
    // IPアドレスとクライアント情報
    const ip = request.headers.get("CF-Connecting-IP") || "127.0.0.1";
    const userAgent = request.headers.get("User-Agent") || "Unknown";
    const language = request.headers.get("Accept-Language") || "Unknown";
    
    // Cloudflare 固有情報
    const cf = request.cf || {};
    
    // CF-RAY からデータセンター(IATAコード)を特定
    const cfRay = request.headers.get("cf-ray") || "";
    const rayParts = cfRay.split("-");
    const iataCode = rayParts[rayParts.length - 1]?.toUpperCase() || "";
    const edgeLocation = IATA_MAP[iataCode] || (iataCode ? `${iataCode} (検出コード)` : "Unknown");

    const responseData = {
        ip: ip,
        userAgent: userAgent,
        language: language.split(",")[0],
        country: cf.country || "Unknown",
        city: cf.city || "Unknown",
        region: cf.region || "Unknown",
        asn: cf.asn ? `AS${cf.asn}` : "Unknown",
        asOrganization: cf.asOrganization || "Unknown",
        protocol: cf.httpProtocol || "Unknown",
        tlsVersion: cf.tlsVersion || "Unknown",
        tlsCipher: cf.tlsCipher || "Unknown",
        edgeLocation: edgeLocation,
        rayId: cfRay || "Unknown"
    };

    return new Response(JSON.stringify(responseData), {
        headers: {
            "Content-Type": "application/json;charset=UTF-8",
            "Access-Control-Allow-Origin": "*",
            // 接続情報のキャッシュを完全に防止
            "Cache-Control": "no-store, no-cache, must-revalidate, max-age=0",
            "Pragma": "no-cache"
        }
    });
}
