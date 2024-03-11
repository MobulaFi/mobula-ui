export const pricings = [
  {
    type: "BASIC",
    usecase: "Basic personal use",
    price: "FREE",
    // pricePerMonth: "",
    // pricePerMonthAlt: "Free (forever)",
    url: "https://mobula.io",
    features: ["30,000 calls /mo", "23 endpoints"],
    logo: "/landing/pricing/stake.svg",
  },
  {
    type: "STARTUP",
    usecase: "Commercial use",
    price: "$49",
    // pricePerMonth: "/mo",
    // pricePerMonthAlt: "$55 / mo",
    url: "https://mobula.io",
    features: ["500,000 calls /mo", "All premium endpoints"],
    logo: "/landing/pricing/mass.jpeg",
  },
  {
    type: "GROWTH",
    usecase: "Commercial use",
    price: "$399",
    // pricePerMonth: "/mo",
    // pricePerMonthAlt: "$450 / mo",
    url: "https://mobula.io",
    features: ["5,000,000 calls /mo", "Websockets", "24/7 support"],
    logo: "/landing/pricing/supra.svg",
  },
];

export const pricingBoxStyle =
  "flex shadow-xl min-w-[250px] lg:max-w-[500px] bg-[rgba(23, 27, 43, 0.22)] rounded-2xl backdrop-blur-md border mt-[50px] lg:mt-5 border-light-border-primary dark:border-dark-border-primary mouse-cursor-gradient-tracking w-[45%] overflow-hidden rotating-effect lg:w-full";
