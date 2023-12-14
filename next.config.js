const { withSentryConfig } = require("@sentry/nextjs");

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
      {
        source: "http://docs.mobula.fi/:path*",
        destination: "http://docs.mobula.io/:path*",
        permanent: true,
      },
      {
        source: "https://docs.mobula.fi/:path*",
        destination: "https://docs.mobula.io/:path*",
        permanent: true,
      },
      {
        source: "http://developer.mobula.fi/:path*",
        destination: "http://docs.mobula.io/:path*",
        permanent: true,
      },
      {
        source: "https://developer.mobula.fi/:path*",
        destination: "https://docs.mobula.io/:path*",
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
      // {
      //   protocol: "https",
      //   hostname: "assets.coingecko.com",
      //   port: "",
      //   pathname: "/**",
      // },
      // {
      //   protocol: "https",
      //   hostname: "ipfs.io",
      //   port: "",
      //   pathname: "/**",
      // },

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

// Injected content via Sentry wizard below

const sentryNextConfig = withSentryConfig(
  nextConfig,
  {
    // For all available options, see:
    // https://github.com/getsentry/sentry-webpack-plugin#options

    // Suppresses source map uploading logs during build
    silent: true,
  },
  {
    // For all available options, see:
    // https://docs.sentry.io/platforms/javascript/guides/nextjs/manual-setup/

    // Upload a larger set of source maps for prettier stack traces (increases build time)
    widenClientFileUpload: true,

    // Transpiles SDK to be compatible with IE11 (increases bundle size)
    transpileClientSDK: true,

    // Routes browser requests to Sentry through a Next.js rewrite to circumvent ad-blockers (increases server load)
    //tunnelRoute: "/monitoring",

    // Hides source maps from generated client bundles
    hideSourceMaps: true,

    // Automatically tree-shake Sentry logger statements to reduce bundle size
    disableLogger: true,
  }
);

module.exports = sentryNextConfig;
