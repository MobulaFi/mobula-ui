import { useUrl } from "../../hooks/url";

export const getPath = () => {
  const { portfolioUrl } = useUrl();
  const pages = [
    {
      name: "Tools",
      extends: [
        { name: "Swap", url: "/swap" },
        // { name: "SwapDesk", url: "/trade" },
        { name: "Watchlist", url: "/watchlist" },
        { name: "Portfolio", url: portfolioUrl },
        // { name: "Launchpads Ranking", url: "/launchpad-ranking" },
      ],
    },
    {
      name: "Ecosystem",
      extends: [
        { name: "List a token ", url: "/list" },
        { name: "Add a Chain", url: "https://tally.so/r/mBaK0Q" },
        { name: "Protocol DAO", url: "/dao/protocol/overview" },
        { name: "Contribute", url: "/contribute" },
        { name: "Support", url: "https://discord.gg/2a8hqNzkzN" },
        { name: "Blog", url: "https://blog.mobula.io/" },
        { name: "Docs", url: "https://docs.mobula.fi/" },
        { name: "Sitemap", url: "/sitemap" },
        // { name: "Sitemap", url: "https://mobula.fi/sitemap" },
      ],
    },
    {
      name: "Community",
      extends: [
        { name: "We're Hiring!", url: "https://tally.so/r/3jZKO6" },
        { name: "Twitter", url: "https://x.com/mobulaio" },
        { name: "Telegram", url: "https://t.me/MobulaFi" },
        { name: "Discord", url: "https://discord.gg/2a8hqNzkzN " },
        {
          name: "Open-source",
          url: "https://github.com/MobulaFi/mobula-ui",
        },
        // { name: "Forum", url: "/forum" },
        // { name: "Help Desk", url: "/forum/help" },
      ],
    },
    {
      name: "Developer",
      extends: [
        // { name: "Widgets", url: "/widget" },
        { name: "Mobula For Builders", url: "/builder" },
        { name: "Mobula Bot", url: "/bot" },
        { name: "Mobula APIs", url: "/apis" },
        { name: "Metadata API", url: "/metadata-api" },
        { name: "Explorer API", url: "/explorer-api" },
        { name: "Metadex Aggregator", url: "/metadex-aggregator" },
        { name: "Market API", url: "/market-api" },
        { name: "API Docs ", url: "https://developer.mobula.fi/" },
      ],
    },
  ];
  return pages;
};
