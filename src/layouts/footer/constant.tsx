import { useUrl } from "../../hooks/url";

export const getPath = () => {
  const { portfolioUrl } = useUrl();
  const pages = [
    {
      name: "Tools",
      extends: [
        { name: "Swap", url: "/swap" },
        { name: "SwapDesk", url: "/trade" },
        { name: "Watchlist", url: "/watchlist" },
        { name: "Portfolio", url: portfolioUrl },
        { name: "Launchpads Ranking", url: "/launchpad-ranking" },
      ],
    },
    {
      name: "Ecosystem",
      extends: [
        { name: "Add Crypto-Asset ", url: "/list" },
        { name: "Add Blockchain", url: "https://tally.so/r/mBaK0Q" },
        { name: "Contribute", url: "/contribute" },
        { name: "Support", url: "https://discord.gg/2a8hqNzkzN" },
        { name: "Docs", url: "https://docs.mobula.fi/" },
        { name: "Sitemap", url: "https://mobula.fi/sitemap" },
      ],
    },
    {
      name: "Community",
      extends: [
        { name: "We're Hiring!", url: "https://tally.so/r/3jZKO6" },
        { name: "Twitter", url: "https://twitter.com/MobulaFi" },
        { name: "Telegram", url: "https://t.me/MobulaFi" },
        { name: "Discord", url: "https://discord.gg/2a8hqNzkzN " },
        { name: "Forum", url: "/forum" },
        { name: "Help Desk", url: "/forum/help" },
      ],
    },
    {
      name: "Developper",
      extends: [
        { name: "Mobula APIs", url: "/apis" },
        { name: "Widgets", url: "/widget" },
        { name: "Mobula For Builders", url: "/builder" },
        { name: "Mobula Bot", url: "/bot" },
        { name: "API Docs ", url: "https://developer.mobula.fi/" },
      ],
    },
  ];
  return pages;
};