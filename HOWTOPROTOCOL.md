# This is the guidance how to update the Protocols info in portfolio page

### How to add or remove protocols

Please check the constants file which is located in `src/constants/index.tsx`
You can see the definition of POOLS constant

```bash
export const POOLS = [
  ...
]
```

You can add or remove the protocols in this constant then "Protocols tab" in portfolio page will show the updated info.

### Fields

```bash
- name: Protocol name. ex: "Uniswap", "Balancer", "Curve"
- chainid: ID of the chain. ex: "1(Ethereum mainnet)", "43114(Avalanche)"
- logo: Logo image url
- pools: Array of pool info
  -- name: Pool name
  -- address: pool address
```

### Notes

- It fetches the LP token balance of listed in constant `POOLS`
- Currently, it's working with only the LP pool contracts
- We have the capability to develop additional DeFi protocols using the indexed data from mobula-apis
