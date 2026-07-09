import os
import sys
import requests
import matplotlib.pyplot as plt

def main():
    api_key = os.environ.get("STATS_API_KEY")
    if not api_key:
        print("Error: STATS_API_KEY environment variable not set")
        sys.exit(1)
        
    # 本番APIから統計JSONデータを取得
    url = "https://the-mobiles.online/api/stats"
    headers = {"Authorization": f"Bearer {api_key}"}
    
    try:
        response = requests.get(url, headers=headers, timeout=15)
        response.raise_for_status()
        data = response.json()
    except Exception as e:
        print(f"Error fetching stats from API: {e}")
        sys.exit(1)
        
    total_access = data.get("totalAccess", 0)
    print(f"Loaded statistics. Total access records: {total_access}")
    
    if total_access == 0:
        print("No statistics records found. Skipping chart generation.")
        return

    # ディレクトリ作成
    os.makedirs("charts", exist_ok=True)
    
    # グラフ描画 (ダークテーマ)
    plt.style.use('dark_background')
    fig, axs = plt.subplots(2, 2, figsize=(14, 10))
    fig.suptitle(f"the-mobiles.online Access Statistics\n(Total Accesses: {total_access} | Generated: {data.get('generatedAt')[:10]})", fontsize=16, color="#f0f4ff", fontweight="bold")
    
    # 配色設定 (シアン、パープル、マゼンタなどのモダンな色合い)
    colors = ["#00d4aa", "#7c7cff", "#ff7cbe", "#ffbe7c", "#be7cff"]

    # 1. 国別シェア (円グラフ)
    countries = data.get("countries", [])
    if countries:
        labels = [c["country"] for c in countries]
        sizes = [c["count"] for c in countries]
        axs[0, 0].pie(sizes, labels=labels, autopct='%1.1f%%', colors=colors, startangle=140, textprops={'color': '#f0f4ff'})
    axs[0, 0].set_title("Top Countries", color="#00d4aa", fontweight="bold")

    # 2. エッジサーバー (横棒グラフ)
    edges = data.get("edges", [])
    if edges:
        # 表示名をスッキリさせるために " / " の前だけを抽出
        labels = [e["edge_location"].split(" / ")[0] for e in edges]
        sizes = [e["count"] for e in edges]
        axs[0, 1].barh(labels[::-1], sizes[::-1], color="#7c7cff")
    axs[0, 1].set_title("Top Edge Server Locations", color="#00d4aa", fontweight="bold")
    axs[0, 1].xaxis.grid(True, linestyle='--', alpha=0.3)

    # 3. プロバイダ (ISP) (横棒グラフ)
    isps = data.get("isps", [])
    if isps:
        # 長すぎるISP名をカット
        labels = [i["isp"].split(" (")[0][:18] for i in isps]
        sizes = [i["count"] for i in isps]
        axs[1, 0].barh(labels[::-1], sizes[::-1], color="#ff7cbe")
    axs[1, 0].set_title("Top ISPs", color="#00d4aa", fontweight="bold")
    axs[1, 0].xaxis.grid(True, linestyle='--', alpha=0.3)

    # 4. ブラウザシェア (ドーナツグラフ)
    browsers = data.get("browsers", [])
    if browsers:
        labels = [b["browser"] for b in browsers]
        sizes = [b["count"] for b in browsers]
        axs[1, 1].pie(sizes, labels=labels, autopct='%1.1f%%', colors=colors, startangle=90, pctdistance=0.85, textprops={'color': '#f0f4ff'})
        # 真ん中を背景と同色の円でくり抜いてドーナツ型にする
        centre_circle = plt.Circle((0,0), 0.70, fc='#090c10')
        axs[1, 1].add_artist(centre_circle)
    axs[1, 1].set_title("Browser Share", color="#00d4aa", fontweight="bold")
    
    # グラフの余白等を自動調整
    plt.tight_layout(rect=[0, 0.03, 1, 0.95])
    
    # 画像ファイルとして保存 (サイトの背景色 #090c10 と調和させる)
    output_path = "charts/stats.png"
    plt.savefig(output_path, dpi=150, facecolor="#090c10", edgecolor='none')
    plt.close()
    print(f"Successfully generated access statistics chart at: {output_path}")

if __name__ == "__main__":
    main()
