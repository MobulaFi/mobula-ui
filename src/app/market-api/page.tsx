import Head from "next/head";
import React from "react";
import { Container } from "../../components/container";
import { TemplateOdd } from "../../features/landings/template/component/template-odd";
import { TemplateTitle } from "../../features/landings/template/component/template-title";
import { getMarketDataAPIContents } from "../../features/landings/template/constants";
import { ContentType } from "../../features/landings/template/models";

export default function MarketPage() {
  const contents = getMarketDataAPIContents();
  return (
    <>
      <Head>
        <title>Crypto & DeFi Market Data API | Mobula</title>
        <meta
          name="description"
          content="Get data about any on-chain market metrics for +30,000 cryptocurrencies, such a Bitcoin price and volume, from a public REST API."
        />
        <meta
          property="og:image"
          content="https://mobula.fi/metaimage/Generic/others.png"
        />
        <meta
          name="twitter:image"
          content="https://mobula.fi/metaimage/Generic/others.png"
        />
        <meta
          itemProp="image"
          content="https://mobula.fi/metaimage/Generic/others.png"
        />
        <meta name="url" content="https://mobula.fi/market-api" />
        <meta name="keywords" content="Mobula" />
        <meta name="author" content="Mobula" />
        <meta name="copyright" content="Mobula" />
        <meta name="robots" content="index, follow" />
      </Head>
      <Container>
        <TemplateTitle
          title="The crypto market in your hands"
          subtitle="Discover the Market API. Get price, volume, market cap, liquidity and +10 other on-chain metrics for 30,000 assets."
        />
        {contents.map((content: ContentType, idx: number) => (
          <TemplateOdd key={idx} content={content} isOdd={idx % 2 === 0} />
        ))}
      </Container>
    </>
  );
}
