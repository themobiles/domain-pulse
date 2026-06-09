# Domain Pulse | Connection Info Tool

[👉 日本語のREADMEはこちら (Japanese README)](./README.ja.md)

A premium, modern placeholder website template that informs visitors your domain is active/online, combined with a lightweight serverless "Connection Info" tool (Client IP, ISP/ASN, location, browser, protocol, and TLS version). 

Built specifically to run serverless on **Cloudflare Pages & Functions**—entirely free and zero-dependency.

---

## 🚀 Features

- **Premium Design**: Dark mode aesthetic, glassmorphism layout, fluid glowing background animations, and custom typography.
- **Client-Side Localization**: Automatically detects browser language and displays the UI in **English** or **Japanese**.
- **Dynamic Domain Detection**: No hardcoded domains. The script automatically parses the current domain (`window.location.hostname`) to render titles, headers, and copyright.
- **Connection Details (Serverless API)**: Parses visitor connection data on Cloudflare Edge:
  - Client IP (IPv4 / IPv6)
  - Internet Service Provider (ISP) / Autonomous System (ASN)
  - Location (City, Region, Country)
  - User Agent (Browser & OS)
  - Connection Protocol (HTTP/2, HTTP/3, etc.)
  - Encryption (TLS 1.3, etc.)
- **Security-First OSS Design**:
  - **XSS Protection**: Content rendering utilizes `textContent` exclusively to prevent scripting injection.
  - **No Open CORS**: Removed open access CORS headers to restrict API calls to the same origin only.
  - **No API Keys Required**: Relies solely on Cloudflare's built-in `request.cf` object. No credentials to leak.

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
- **Git Exclusions**: The `.gitignore` file is configured to exclude wrangler caches (`.wrangler/`) and local environment variables (`.dev.vars`). Always verify these are not added to your commits.

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](./LICENSE) file for details.
