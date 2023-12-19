import Head from "next/head";
import React from "react";
import { Container } from "../../components/container";
import { TemplateOdd } from "../../features/landings/template/component/template-odd";
import { TemplateTitle } from "../../features/landings/template/component/template-title";
import { getApisContent } from "../../features/landings/template/constants";
import { ContentType } from "../../features/landings/template/models";

export default function ApiPage() {
  const contents = getApisContent();
  return (
    <>
      <Head>
        <title>
          Mobula API - Website, logo, twitter & chat groups of +30,000 crypto
        </title>

        <meta
          name="description"
          content="Get metadata for +30,000 cryptocurrencies, such a Ethereum official Twitter account and website, from a public REST API or direclty on-chain via smart-contract queries."
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
        <meta
          name="url"
          content="https://developer.mobula.fi/reference/getting-started"
        />
        <meta name="keywords" content="Mobula" />
        <meta name="author" content="Mobula" />
        <meta name="copyright" content="Mobula" />
        <meta name="robots" content="index, follow" />
      </Head>
      <Container>
        <TemplateTitle
          title="Introducing Mobula APIs"
          subtitle="Get free multi-chain real-time data about any crypto asset & wallet & transaction, such as crypto price, crypto marketcap, wallet balance, exchange routes, and more.
          "
        />
        {contents.map((content: ContentType, idx: number) => (
          <TemplateOdd key={idx} content={content} isOdd={idx % 2 === 0} />
        ))}
      </Container>
    </>
  );
}
