export const possibilities = {
  Utility: [
    [
      { name: "Token not related to the product", code: "U1A" },
      { name: "No product at all, even in the roadmap", code: "U1B" },
    ],
    [
      { name: "Product in the roadmap but nothing shipped", code: "U2A" },
      {
        name: "Product shipped but extremely unstable (unusable)",
        code: "U2B",
      },
      {
        name: "Product shipped, but clone of something else (fake product)",
        code: "U2C",
      },
    ],
    [
      {
        name: "Product shipped and has more than 1k users or generates more than 10k ARR but token not related to product",
        code: "U3A",
      },
      {
        name: "Product shipped and metrics lower than 1k users or 10k ARR but token linked to the product a little bit (<10% of generated profit used for Buy&Burn or reward holders, or minimal features blocked)",
        code: "U3B",
      },
    ],
    [
      {
        name: "Product shipped and has more than 10k users or generates more than 100k ARR but token not related to the product",
        code: "U4A",
      },
      {
        name: "Product shipped and has more than 1k users or generates more than 10k ARR but token linked to the product a little bit (<10% of generated profit used for Buy&Burn or reward holders, or minimal features blocked)",
        code: "U4B",
      },
      {
        name: "Product shipped and has less than 1000 users or 10k ARR but token linked to the product consequently (>10% of generated profit used for Buy&Burn or reward holders, or important features blocked)",
        code: "U4C",
      },
    ],
    [
      {
        name: "Product shipped and has more than 10k users or generates more than 100k ARR but token linked to product a little bit (<10% of generated profit used for Buy&Burn or reward holders, or minimal features blocked)",
        code: "U5A",
      },
      {
        name: "Product shipped and has more than 1k users or generates more than 10k ARR but token linked to the product consistently (>10% of generated profit used for Buy&Burn or reward holders, or important features blocked)",
        code: "U5B",
      },
    ],
  ],
  Social: [
    [
      {
        name: "No social medias (none: no Twitter, no Telegram, nothing)",
        code: "S1A",
      },
      {
        name: "Less than 5 interactions per post on Twitter and less than 10 messages per day on Telegram",
        code: "S1B",
      },
    ],
    [
      {
        name: "Less than 500 twitter followers and less than 500 Telegram members",
        code: "S2A",
      },
      {
        name: "500-5k twitter followers with less than 1% interactions",
        code: "S2B",
      },
      {
        name: "500-5k Telegram members with less than 5% online",
        code: "S2C",
      },
    ],
    [
      {
        name: "500-5k twitter followers with 1-5% interactions",
        code: "S3A",
      },
      {
        name: "500-5k Telegram members with 5-10% online",
        code: "S3B",
      },
      {
        name: "+10k Telegram members with less than 1% online",
        code: "S3C",
      },
    ],
    [
      {
        name: "500-5k twitter followers with 5-10% interactions",
        code: "S4A",
      },
      {
        name: "500-5k Telegram members with 10-20% online",
        code: "S4B",
      },
      {
        name: "5k-10k twitter followers with 1-5% interactions",
        code: "S4C",
      },
      {
        name: "5k-10k Telegram members with 5-10% online",
        code: "S4D",
      },
      {
        name: "+10k followers with less than 1% interactions",
        code: "S4D",
      },
    ],
    [
      {
        name: "500-5k twitter followers with than 5-10% interactions",
        code: "S5A",
      },
      {
        name: "5k-10k Telegram members with 10-20% online",
        code: "S5B",
      },
      {
        name: "+10k Telegram members with 5-10% online",
        code: "S5C",
      },
      {
        name: "+20k twitter followers with 1-5% interactions",
        code: "S5D",
      },
    ],
  ],
  Trust: [
    [
      {
        name: "No informations at all about the team & centralized features on the token, centralized & unlocked LPs, or token relying on a utility.",
        code: "T1A",
      },
    ],
    [
      {
        name: "Non-doxxed/KYC'd team with safe track record & centralized features on the token, centralized & unlocked LPs, or token relying on a utility.",
        code: "T2A",
      },
    ],
    [
      {
        name: "No informations at all about the team but no centralized features on the token, decentralized or locked LPs, and token not relying on a utility.",
        code: "T3A",
      },
      {
        name: "Doxxed/KYC'd team with no track record & centralized features on the token, centralized & unlocked LPs, or token relying on a utility.",
        code: "T3B",
      },
    ],
    [
      {
        name: "Non-doxxed/KYC'd team with safe track record, no centralized features on the token, decentralized or locked LPs, and token not relying on a utility.",
        code: "T4A",
      },
      {
        name: "Doxxed/KYC'd team with successful track record & centralized features on the token, centralized & unlocked LPs, or token relying on a utility.",
        code: "T4B",
      },
    ],
    [
      {
        name: "Doxxed/KYC'd team with successful track record, no centralized features on the token, decentralized or locked LPs, and token not relying on a utility.",
        code: "T5A",
      },
    ],
  ],
  Reject: [
    [
      {
        name: "Incorrect off-chain informations (wrong website link, typo)",
        code: "RA",
      },
      {
        name: "Lack of informations (no logo, no name, no symbol or no website)",
        code: "RB",
      },
    ],
  ],
};
