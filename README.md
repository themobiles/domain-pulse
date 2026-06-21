# Domain Pulse | Connection Info Tool

[👉 日本語のREADMEはこちら (Japanese README)](./README.ja.md)

A premium, modern placeholder website template that informs visitors your domain is active/online, combined with a lightweight serverless "Connection Info" tool (Client IP, ISP/ASN, location, browser, protocol, and TLS version). 

Built specifically to run serverless on **Cloudflare Pages & Functions**—entirely free and zero-dependency.

---

## 🚀 Features

- **Minimalist Modern Design**: A clean, typography-first Swiss aesthetic featuring the `Inter` font, precise layout spacing, and subtle micro-animations (e.g. status ping, loading shimmer). No heavy gradients or complex glassmorphism overlays.
- **Client-Side Localization**: Automatically detects browser language and displays the UI in **English** or **Japanese**.
- **Dynamic Domain Detection**: No hardcoded domains. The script automatically parses the current domain (`window.location.hostname`) to render titles, headers, and copyright dynamically.
- **Connection Details (Serverless API)**: Parses visitor connection data on Cloudflare Edge:
  - Client IP (IPv4 / IPv6)
  - Internet Service Provider (ISP) / Autonomous System (ASN)
  - Location (City, Region, Country)
  - User Agent (Browser & OS)
- **Advanced Diagnostics (For Network Enthusiasts)**:
  - **Edge Server Decoding**: Resolves Cloudflare's edge datacenter IATA airport code (from `CF-RAY` header, e.g. `NRT`, `HND`) to a human-readable city name (e.g., `Tokyo / Haneda (HND)`).
  - **TLS Cipher Suite**: Displays the cipher suite negotiation result (e.g. `AEAD-AES256-GCM-SHA384`).
  - **TLS Version & Protocol**: Shows the negotiated HTTP protocol (e.g. `HTTP/3 (QUIC)`) and TLS version.
  - **RTT Measurement**: Measures and displays client-to-edge round-trip time in milliseconds.
  - **IPv6 Full Expansion**: If connected via IPv6, provides an option to fully expand the zero-compressed (`::`) IP address into all 8 padded hexadecimal blocks (e.g. `240d:000f:0942:6500:2529:6aa9:28f3:b254`).
  - **Parallel IPv4 Fetching**: When connected via IPv6, the frontend concurrently queries `ipv4.icanhazip.com` to fetch the client's public IPv4 address.
  - **DNSSEC Validation**: Checks if the domain has DNSSEC enabled and verified by the resolver (AD-flag check) via Cloudflare's DNS over HTTPS (DoH) API.
  - **Alt-Svc Tracing**: Shows the Alternative Services header returned by the server to guide H3 upgrade migration.
  - **HTTP Multiplexing Analysis**: Inspects resource timings to verify if multiplexed concurrency is working over a single connection stream.

---

## 📂 Directory Structure

```text
domain-pulse/
├── functions/
│   └── api/
│       └── info.js        # Serverless API (Cloudflare Functions)
├── index.html             # Frontend (HTML / Vanilla JS / i18n)
├── index.css              # Stylesheet (CSS Custom Properties & Animations)
├── LICENSE                # MIT License
├── README.md              # Project Documentation (English)
├── README.ja.md           # Project Documentation (Japanese)
└── .gitignore             # Git exclusion rules
```

---

## ☁️ Quick Deploy (Cloudflare Pages)

You can host this site for free with automatic SSL and Git-integrated deployments.

### 1. Create a Cloudflare Pages Project
1. Log in to your **Cloudflare Dashboard**.
2. Navigate to **Workers & Pages** > **Overview** > **Create**.
3. Select the **Pages** tab and click **Connect to Git**.
4. Authorize your GitHub account and select your repository (`domain-pulse`).
5. Configure the build settings (leave them at defaults):
   - **Framework preset**: `None` (or `Static HTML`)
   - **Build command**: (Leave empty)
   - **Build output directory**: `.` (Root directory)
6. Click **Save and Deploy**.

### 2. Configure Custom Domain
1. Once deployed, click on the **Custom domains** tab in your Pages dashboard.
2. Click **Set up a custom domain** and enter your domain (e.g., `yourdomain.com`).
3. Follow the instructions to configure your CNAME/DNS records (if your domain uses Cloudflare DNS, this is automated).
4. Do the same to add `www.yourdomain.com` if desired.

---

## 🛠️ Local Development & Testing

To test both the frontend and the Cloudflare Functions API locally:

1. **Start the local Pages development server**:
   ```bash
   npx wrangler pages dev .
   ```
   *(Accept any prompts to install the Wrangler tool if running for the first time)*

2. **Access local server**:
   - Open your browser to `http://localhost:8788`.
   - The UI will automatically run in local demo mode, serving mock JSON data since the Cloudflare Edge API headers aren't present locally.
   - The API itself can be inspected at `http://localhost:8788/api/info`.

---

## 🔒 Security Best Practices

- **Zero Keys**: This project does not use any private API keys. Do not commit any password or token files to this repository.
- **Cache Control & Privacy**: The `/api/info` endpoint explicitly sets `Cache-Control: no-store, no-cache, must-revalidate` to prevent caching of dynamic network details, ensuring visitor privacy on shared networks.
- **CORS Limitations**: The API is restricted to the same origin to prevent unauthorized external websites from fetching connection details.
- **Git Exclusions**: The `.gitignore` file is configured to exclude wrangler caches (`.wrangler/`) and local environment variables (`.dev.vars`). Always verify these are not added to your commits.

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](./LICENSE) file for details.
