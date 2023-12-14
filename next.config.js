/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["echarts", "zrender"],

  optimizeFonts: false,

  async redirects() {
    return [
      {
        source: "/dex",
        destination: "/swap",
        permanent: true,
      },
      {
        source: "/dex/pro",
        destination: "/trade",
        permanent: true,
      },
      {
        source: "/dex/lite",
        destination: "/swap",
        permanent: true,
      },
      {
        source: "/buy",
        destination: "/swap",
        permanent: true,
      },
      {
        source: "/sell",
        destination: "/swap",
        permanent: true,
      },
    ];
  },
  experimental: {
    serverActions: true,
  },
  images: {
    formats: ["image/avif", "image/webp"],
    domains: ["localhost"],
    dangerouslyAllowSVG: true,
    minimumCacheTTL: 60,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*",
      },
      {
        protocol: "http",
        hostname: "*",
      },
    ],
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};
module.exports = nextConfig;
