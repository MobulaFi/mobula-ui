import Head from "next/head";
import React from "react";
import { Container } from "../../components/container";
import { TemplateOdd } from "../../features/landings/template/component/template-odd";
import { TemplateTitle } from "../../features/landings/template/component/template-title";
import { getMetaDataAPIContents } from "../../features/landings/template/constants";
import { ContentType } from "../../features/landings/template/models";

export default function MetadataPage() {
  const contents = getMetaDataAPIContents();
  return (
    <>
      <Head>
        <title>Metadata API | Mobula</title>
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
        <meta name="url" content="https://mobula.fi/metadata-api" />
        <meta name="keywords" content="Mobula" />
        <meta name="author" content="Mobula" />
        <meta name="copyright" content="Mobula" />
        <meta name="robots" content="index, follow" />
      </Head>
      <Container>
        <TemplateTitle
          title="Access any meta-data, on-chain."
          subtitle="Discover the Meta Data API. Get metadata like website, twitter, discord, links about any crypto, in a fully decentralized way."
        />
        {contents.map((content: ContentType, idx: number) => (
          <TemplateOdd key={idx} content={content} isOdd={idx % 2 === 0} />
        ))}
      </Container>
    </>
  );
}
