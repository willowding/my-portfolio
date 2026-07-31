# Deployment

This site is intended to ship **two builds from one codebase**:

| Target | Default root | Reach |
| --- | --- | --- |
| **Vercel** (mirrors from GitHub) | `/` → `/en` | Global, fast CDN |
| **Aliyun / Tencent Cloud** (manual Node deploy) | `/` → `/zh` | China mainland, no GFW issues |

The choice between `en` and `zh` at `/` is driven by the environment variable
`NEXT_PUBLIC_DEFAULT_LANG`. Vercel sets it to `en`; the China server leaves it
unset (defaults to `zh`).

---

## 1. Vercel (international, English default)

1. Push this repo to GitHub.
2. On Vercel, **Import Project → select the GitHub repo**. Framework is auto-detected as Next.js.
3. Environment variables (Settings → Environment Variables):
   - `NEXT_PUBLIC_DEFAULT_LANG` = `en`
   - *(Vercel also picks these up from `vercel.json`, but the dashboard is authoritative.)*
4. Deploy. Vercel will give a `*.vercel.app` URL.
5. *(Optional)* Add a custom domain in **Settings → Domains**.

`vercel.json` is already wired with:
- `framework: "nextjs"`
- `NEXT_PUBLIC_DEFAULT_LANG=en`
- Caching hints for `/demo/*` and `/schools/*`

---

## 2. Aliyun / Tencent Cloud (China mainland, Chinese default)

### 2.1 One-time host setup

- Buy a lightweight ECS (e.g. 阿里云 ECS 1 vCPU / 2 GB) running **Ubuntu 22.04 LTS**.
- Apply for **ICP 备案** (Aliyun handles this in the console under 备案).
- Point a domain to the ECS public IP via the DNS console.
- Open inbound **port 80 / 443** in the security group.

### 2.2 Install Node + PM2

```bash
# as root
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt-get install -y nodejs
npm i -g pm2
```

### 2.3 Build on the host

```bash
git clone https://github.com/<you>/willowding-portfolio.git /srv/portfolio
cd /srv/portfolio
npm ci
npm run build
```

`npm run build` produces a **standalone** bundle at `.next/standalone/`
(thanks to `output: "standalone"` in `next.config.mjs`). It also produces
`.next/static/` and `public/` — both must ship alongside the standalone folder.

```bash
# Copy static + public assets next to the standalone server
cp -r .next/static .next/standalone/.next/static
cp -r public          .next/standalone/public
```

### 2.4 Start with PM2

```bash
cd /srv/portfolio/.next/standalone
PORT=3000 NODE_ENV=production pm2 start server.js --name portfolio
pm2 save
pm2 startup   # run the printed command to enable boot persistence
```

> The China build intentionally leaves `NEXT_PUBLIC_DEFAULT_LANG` unset, so `/`
> redirects to `/zh`. If you ever need to swap, set the env var before `pm2 start`.

### 2.5 Nginx reverse proxy + free TLS

```bash
apt-get install -y nginx certbot python3-certbot-nginx
```

`/etc/nginx/sites-available/portfolio`:

```nginx
server {
  listen 80;
  server_name your-domain.cn www.your-domain.cn;

  location / {
    proxy_pass         http://127.0.0.1:3000;
    proxy_http_version 1.1;
    proxy_set_header   Host              $host;
    proxy_set_header   X-Real-IP         $remote_addr;
    proxy_set_header   X-Forwarded-For   $proxy_add_x_forwarded_for;
    proxy_set_header   X-Forwarded-Proto $scheme;
  }
}
```

```bash
ln -s /etc/nginx/sites-available/portfolio /etc/nginx/sites-enabled/portfolio
nginx -t && systemctl reload nginx
certbot --nginx -d your-domain.cn -d www.your-domain.cn
```

---

## 3. Rolling back

- Vercel: revert in the dashboard's **Deployments** tab.
- Aliyun: `pm2 stop portfolio && pm2 delete portfolio`, then redeploy the previous tag:
  ```bash
  cd /srv/portfolio && git checkout <previous-tag>
  npm ci && npm run build
  cp -r .next/static .next/standalone/.next/static
  cp -r public          .next/standalone/public
  pm2 restart portfolio
  ```

---

## 4. Why two targets

- **Vercel** has the best free-tier reach outside China and ships `*.vercel.app`
  URLs that never need ICP. It defaults to `/en` for overseas recruiters.
- **Aliyun / Tencent** is the right home for visitors in mainland China (no
  cross-border latency, no blocked assets). It defaults to `/zh`.