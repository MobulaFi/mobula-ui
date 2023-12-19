import Head from "next/head";
import React from "react";
import { Container } from "../../components/container";
import { TemplateOdd } from "../../features/landings/template/component/template-odd";
import { TemplateTitle } from "../../features/landings/template/component/template-title";
import { getWalletExplorerAPIContents } from "../../features/landings/template/constants";
import { ContentType } from "../../features/landings/template/models";

export default function ExplorerPage() {
  const contents = getWalletExplorerAPIContents();
  return (
    <>
      <Head>
        <title>
          Mobula API - Wallet balance, transactions, historical net worth of any
          crypto wallet
        </title>
        <meta
          name="description"
          content="Get data about any crypto wallet on +10 blockchains, including wallet balances, transactions, historical net worth for any crypto asset or general USD net worth."
        />
        {/* TODO:metaname */}
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
        <meta name="url" content="https://mobula.fi/explorer-api" />
        <meta name="keywords" content="Mobula" />
        <meta name="author" content="Mobula" />
        <meta name="copyright" content="Mobula" />
        <meta name="robots" content="index, follow" />
      </Head>
      <Container>
        <TemplateTitle
          title="Get complete information of any crypto user"
          subtitle="Discover the Wallet Explorer API. Get information about any crypto, token and NFT. Get balance, ROI, transaction history..."
        />
        {contents.map((content: ContentType, idx: number) => (
          <TemplateOdd key={idx} content={content} isOdd={idx % 2 === 0} />
        ))}
      </Container>
    </>
  );
}
