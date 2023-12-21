import Head from "next/head";
import React from "react";
import { Container } from "../../components/container";
import { TemplateOdd } from "../../features/landings/template/component/template-odd";
import { TemplateTitle } from "../../features/landings/template/component/template-title";
import { getContributeContents } from "../../features/landings/template/constants";
import { ContentType } from "../../features/landings/template/models";

export default function ContributePage() {
  const contents = getContributeContents();
  return (
    <>
      <Head>
        <title>Contribute to a DAO - build with us - Mobula </title>
        <meta
          name="description"
          content="Earn tokens by contributing to Mobula. Join The Protocol DAO, earn money by securing the crypto space."
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
        <meta name="url" content="https://mobula.fi/contribute" />
        <meta name="keywords" content="Mobula" />
        <meta name="author" content="Mobula" />
        <meta name="copyright" content="Mobula" />
        <meta name="robots" content="index, follow" />
      </Head>
      <Container>
        <TemplateTitle
          title="Contribute to Mobula"
          subtitle="Contribute to the next-gen crypto aggregator. Help us building a better, seamless & open crypto future."
        />
        {contents.map((content: ContentType, idx: number) => (
          <TemplateOdd key={idx} content={content} isOdd={idx % 2 === 0} />
        ))}
      </Container>
    </>
  );
}
