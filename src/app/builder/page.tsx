import Head from "next/head";
import React from "react";
import { Container } from "../../components/container";
import { TemplateOdd } from "../../features/landings/template/component/template-odd";
import { TemplateTitle } from "../../features/landings/template/component/template-title";
import { getBuilderContents } from "../../features/landings/template/constants";
import { ContentType } from "../../features/landings/template/models";

export default function BuilderPage() {
  const contents = getBuilderContents();
  return (
    <>
      <Head>
        <title>Best tools & resources for builders | Mobula</title>
        <meta
          name="description"
          content="Grow your community passively, integrate customizable widgets, get exposure on Mobula."
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
        <meta name="url" content="https://mobula.fi/builder" />
        <meta name="keywords" content="Mobula" />
        <meta name="author" content="Mobula" />
        <meta name="copyright" content="Mobula" />
        <meta name="robots" content="index, follow" />
      </Head>
      <Container>
        <TemplateTitle
          title="Mobula for Builders"
          subtitle="Grow your community passively, integrate customizable widgets, get exposure on Mobula."
        />
        {contents.map((content: ContentType, idx: number) => (
          <TemplateOdd key={idx} content={content} isOdd={idx % 2 === 0} />
        ))}
      </Container>
    </>
  );
}
