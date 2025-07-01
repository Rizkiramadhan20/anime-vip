import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "9anime.org.lv",
      },
      {
        protocol: "https",
        hostname: "ik.imagekit.io",
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
      {
        protocol: "https",
        hostname: "avatars.githubusercontent.com",
      },
      {
        protocol: "https",
        hostname: "cover.komiku.id",
      },
      {
        protocol: "https",
        hostname: "cdn.komiku.id",
      },
      {
        protocol: "https",
        hostname: "anichin.cafe",
      },
      {
        protocol: "https",
        hostname: "otakudesu.cloud",
      },
    ],
    unoptimized: true,
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    formats: ["image/webp", "image/avif"] as ("image/webp" | "image/avif")[],
  },
};

export default nextConfig;
