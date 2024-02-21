export const pricings = [
  {
    type: "BASIC",
    usecase: "Basic personal use",
    price: "FREE",
    pricePerMonth: "",
    pricePerMonthAlt: "Free (forever)",
    url: "https://mobula.io",
    features: ["30,000 calls /mo", "23 endpoints"],
  },
  {
    type: "STARTUP",
    usecase: "Commercial use",
    price: "$49.99",
    pricePerMonth: "/mo",
    pricePerMonthAlt: "$55 / mo",
    url: "https://mobula.io",
    features: ["500,000 calls /mo", "All premium endpoints"],
  },
  {
    type: "GROWTH",
    usecase: "Commercial use",
    price: "$399",
    pricePerMonth: "/mo",
    pricePerMonthAlt: "$450 / mo",
    url: "https://mobula.io",
    features: ["5,000,000 calls /mo", "Websockets", "24/7 support"],
  },
];

export const pricingBoxStyle =
  "flex shadow-xl min-w-[300px] bg-[rgba(23, 27, 43, 0.22)] rounded-2xl backdrop-blur-md border mt-[50px] border-light-border-primary dark:border-dark-border-primary mouse-cursor-gradient-tracking w-[45%] md:mt-5 overflow-hidden rotating-effect md:w-full";