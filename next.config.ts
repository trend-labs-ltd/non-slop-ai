import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      // MinIO, local dev mirror of prod R2 (see docker-compose.yml, .env.example).
      {
        protocol: "http",
        hostname: "localhost",
        port: "9002",
        pathname: "/nonslop-dev/**",
      },
      // TODO: add the prod Cloudflare R2 custom domain here once it's
      // provisioned (see listmonk-newsletter-infra notes on media storage).
    ],
  },
};

export default nextConfig;
