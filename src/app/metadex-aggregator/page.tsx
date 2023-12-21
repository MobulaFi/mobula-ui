import Head from "next/head";
import React from "react";
import { Container } from "../../components/container";
import { TemplateOdd } from "../../features/landings/template/component/template-odd";
import { TemplateTitle } from "../../features/landings/template/component/template-title";
import { getMetaDexContents } from "../../features/landings/template/constants";
import { ContentType } from "../../features/landings/template/models";

export default function MetadexPage() {
  const contents = getMetaDexContents();
  return (
    <>
      <Head>
        <title>Meta DEX Aggregator | Mobula</title>
        <meta
          name="description"
          content="+17 DEX Aggregators fetched, +25 blockchains supported for any trade & exchange, transparent quotes."
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
        <meta name="url" content="https://mobula.fi/metadex-aggregator" />
        <meta name="keywords" content="Mobula" />
        <meta name="author" content="Mobula" />
        <meta name="copyright" content="Mobula" />
        <meta name="robots" content="index, follow" />
      </Head>
      <Container>
        <TemplateTitle
          title="Offer crypto exchange, at the best price"
          subtitle="Discover the Meta DEX Aggregator API. +17 DEX Aggregators fetched, +25 blockchains supported for any trade & exchange."
        />
        {contents.map((content: ContentType, idx: number) => (
          <TemplateOdd key={idx} content={content} isOdd={idx % 2 === 0} />
        ))}
      </Container>
    </>
  );
}
