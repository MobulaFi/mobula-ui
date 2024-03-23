import { Query } from "../interfaces/misc";

export const generateFilters = (entry: string, isRecent?: boolean): Query[] => {
  switch (entry) {
    case "Top 100":
      return [
        {
          action: "or",
          value: [
            'volume.gte.100000,off_chain_volume.gte.100000,contracts.eq."{}",liquidity_market_cap_ratio.gte.0.01,coin.eq.true',
          ],
        },

        ...(isRecent
          ? [
              {
                action: "order",
                value: ["created_at", { ascending: false }],
              },
            ]
          : []),
      ];

    case "all":
      return [
        {
          action: "or",
          value: [
            'liquidity.gte.0,volume.gte.0,market_cap.gte.0,off_chain_volume.gte.0,contracts.eq."{}",coin.eq.true',
          ],
        },

        ...(isRecent
          ? [
              {
                action: "order",
                value: ["created_at", { ascending: false }],
              },
            ]
          : [
              {
                action: "order",
                value: ["trending_score", { ascending: false }],
              },
            ]),
      ];

    case "Ethereum":
      return [
        {
          action: "eq",
          value: ["blockchains[1]", "{Ethereum}"],
        },
        {
          action: "or",
          value: [
            'volume.gte.100000,off_chain_volume.gte.100000,contracts.eq."{}",liquidity_market_cap_ratio.gte.0.01,coin.eq.true',
          ],
        },

        ...(isRecent
          ? [
              {
                action: "order",
                value: ["created_at", { ascending: false }],
              },
            ]
          : [
              {
                action: "order",
                value: ["trending_score", { ascending: false }],
              },
            ]),
      ];
    case "BNB Smart Chain (BEP20)":
      return [
        {
          action: "eq",
          value: ["blockchains[1]", "{BNB Smart Chain (BEP20)}"],
        },
        {
          action: "or",
          value: [
            'volume.gte.100000,off_chain_volume.gte.100000,contracts.eq."{}",liquidity_market_cap_ratio.gte.0.01,coin.eq.true',
          ],
        },

        ...(isRecent
          ? [
              {
                action: "order",
                value: ["created_at", { ascending: false }],
              },
            ]
          : [
              {
                action: "order",
                value: ["trending_score", { ascending: false }],
              },
            ]),
      ];
    case "Avalanche C-Chain":
      return [
        {
          action: "eq",
          value: ["blockchains[1]", "{Avalanche C-Chain}"],
        },
        {
          action: "or",
          value: [
            'volume.gte.100000,off_chain_volume.gte.100000,contracts.eq."{}",liquidity_market_cap_ratio.gte.0.01,coin.eq.true',
          ],
        },

        ...(isRecent
          ? [
              {
                action: "order",
                value: ["created_at", { ascending: false }],
              },
            ]
          : [
              {
                action: "order",
                value: ["trending_score", { ascending: false }],
              },
            ]),
      ];
    case "Polygon":
      return [
        {
          action: "eq",
          value: ["blockchains[1]", "{Polygon}"],
        },
        {
          action: "or",
          value: [
            'volume.gte.100000,off_chain_volume.gte.100000,contracts.eq."{}",liquidity_market_cap_ratio.gte.0.01,coin.eq.true',
          ],
        },

        ...(isRecent
          ? [
              {
                action: "order",
                value: ["created_at", { ascending: false }],
              },
            ]
          : [
              {
                action: "order",
                value: ["trending_score", { ascending: false }],
              },
            ]),
      ];
    case "Cronos":
      return [
        {
          action: "eq",
          value: ["blockchains[1]", "{Cronos}"],
        },
        {
          action: "or",
          value: [
            'volume.gte.100000,off_chain_volume.gte.100000,contracts.eq."{}",liquidity_market_cap_ratio.gte.0.01,coin.eq.true',
          ],
        },

        ...(isRecent
          ? [
              {
                action: "order",
                value: ["created_at", { ascending: false }],
              },
            ]
          : [
              {
                action: "order",
                value: ["trending_score", { ascending: false }],
              },
            ]),
      ];
    case "Arbitrum":
      return [
        {
          action: "eq",
          value: ["blockchains[1]", "{Arbitrum}"],
        },
        {
          action: "or",
          value: [
            'volume.gte.100000,off_chain_volume.gte.100000,contracts.eq."{}",liquidity_market_cap_ratio.gte.0.01,coin.eq.true',
          ],
        },

        ...(isRecent
          ? [
              {
                action: "order",
                value: ["created_at", { ascending: false }],
              },
            ]
          : [
              {
                action: "order",
                value: ["trending_score", { ascending: false }],
              },
            ]),
      ];
    default:
      return [];
  }
};
