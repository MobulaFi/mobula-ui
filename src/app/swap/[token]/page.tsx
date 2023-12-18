import React from "react";
import { isAddress } from "viem";
import { BuySell } from "../../../features/misc/swap";
import { fetchContract } from "../../../layouts/swap/utils";
import { createSupabaseDOClient } from "../../../lib/supabase";
import { fromUrlToName } from "../../../utils/formaters";

export const dynamic = "force-static";

async function fetchAsset(params) {
  const { token } = params;
  const supabase = createSupabaseDOClient();
  let data;
  let addressData;
  let symbol;
  let blockchain;

  if (!isAddress(token)) {
    const { data: dataBuffer } = await supabase
      .from("assets")
      .select("contracts,blockchains,name,symbol,logo,id")
      .order("market_cap", { ascending: false })
      .or(
        `symbol.eq.${token.toUpperCase()},name.ilike.${fromUrlToName(token)}`
      );
    data = dataBuffer;
  } else {
    const fetchResults = await Promise.all(fetchContract(token));
    const { data: addressDataBuffer } = fetchResults[fetchResults.length - 1];
    const { symbol: symbolBuffer, blockchain: blockchainBuffer } =
      fetchResults.filter((entry) => entry)[0] || {};

    addressData = addressDataBuffer;
    symbol = symbolBuffer;
    blockchain = blockchainBuffer;
  }

  if (data && data[0] && data[0].contracts[0] && data[0].blockchains[0]) {
    return {
      token: {
        ...data[0],
        blockchain: data[0].blockchains[0],
        address: data[0].contracts[0],
      },
      key: data[0].id,
    };
  }
  if (addressData || (symbol && blockchain)) {
    return {
      token: {
        ...(addressData || {}),
        logo: addressData?.[0]?.logo || "/icon/unknown.png",
        symbol,
        blockchain,
        address: token,
        contracts: addressData?.[0]?.contracts || [token],
        blockchains: addressData?.[0]?.blockchains || [blockchain],
      },
    };
  }
}

export default async function SwapPage({ params }) {
  const data = await fetchAsset(params);
  return (
    <>
      <title>
        Buy & Exchange crypto at best price, no KYC, no account | Mobula{" "}
      </title>
      <meta
        name="description"
        content="Buy crypto-currencies, tokens, coins and NFTs at the best price. DEX comparator, token wrapper analysis, best on-chain price, no commission."
      />
      <meta
        property="og:image"
        content="https://mobula.fi/metaimage/Tools/buysell.png"
      />
      <meta
        name="twitter:image"
        content="https://mobula.fi/metaimage/Tools/buysell.png"
      />
      <meta
        itemProp="image"
        content="https://mobula.fi/metaimage/Tools/buysell.png"
      />
      <meta name="url" content="https://mobula.fi/swap" />
      <meta name="keywords" content="Mobula" />
      <meta name="author" content="Mobula" />
      <meta name="copyright" content="Mobula" />
      <meta name="robots" content="index, follow" />
      <BuySell token={data?.token} />{" "}
    </>
  );
}
