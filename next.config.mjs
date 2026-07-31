/** @type {import('next').NextConfig} */
const nextConfig = {
  trailingSlash: true,
  // `standalone` 让 `next build` 输出一个可在 Node 服务器（PM2 / systemd / Docker）
  // 上跑的最小化 server bundle，适合阿里云 / 腾讯云手动部署。
  // Vercel 会忽略此字段（Vercel 永远使用自己的 serverless 打包方式）。
  output: "standalone",
  images: {
    unoptimized: true,
  },
}

export default nextConfig