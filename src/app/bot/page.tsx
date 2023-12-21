import Head from "next/head";
import React from "react";
import { BsChevronDown } from "react-icons/bs";
import { Container } from "../../components/container";
import { LargeFont, MediumFont } from "../../components/fonts";
import { CompareHeaderTable } from "../../features/landings/template/component/compare-header-table";
import { CompareTable } from "../../features/landings/template/component/compare-table";
import { TemplateOdd } from "../../features/landings/template/component/template-odd";
import { TemplateTitle } from "../../features/landings/template/component/template-title";
import {
  getBotContents,
  getContentsTable,
} from "../../features/landings/template/constants";
import { ContentType } from "../../features/landings/template/models";

export default function BotPage() {
  const contents = getBotContents();
  const contentsTable = getContentsTable();
  return (
    <>
      <Head>
        <title>Best Crypto bot for free marketing | Mobula Bot</title>
        <meta
          name="description"
          content="Create the community of your dreams, manage your group in auto-pilot, make it grow passively with on-chain incentives, and more."
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
        <meta name="url" content="https://mobula.fi/bot" />
        <meta name="keywords" content="Mobula" />
        <meta name="author" content="Mobula" />
        <meta name="copyright" content="Mobula" />
        <meta name="robots" content="index, follow" />
      </Head>
      <Container>
        <TemplateTitle
          title="Mobula Bot"
          subtitle="Create the Telegram & Discord community of your dreams, manage your group in auto-pilot, make it grow passively with on-chain incentives, and more."
        />
        {contents.map((content: ContentType, idx: number) => (
          <TemplateOdd key={idx} content={content} isOdd={idx % 2 === 0} />
        ))}
        <div className="flex flex-col items-start md:items-center">
          <LargeFont>Not yet convinced?</LargeFont>
          <div className="flex items-center">
            <LargeFont extraCss="font-normal text-light-font-40 dark:text-dark-font-40">
              Discover the complete features
            </LargeFont>
            <BsChevronDown className="text-lg ml-[5px] text-light-font-40 dark:text-dark-font-40" />
          </div>
        </div>
        <div className="h-[2px] bg-light-border-primary dark:bg-dark-border-primary w-full my-[60px] md:my-[40px]" />
        <p className="text-light-font-100 dark:text-dark-font-100 ml-0 md:ml-[15px] text-4xl md:text-xl mb-3 md:mb-[-40px]">
          Compare
        </p>
        <div className="flex">
          <div className="w-full max-w-[340px] mt-0 md:mt-[54px]">
            <MediumFont extraCss="flex md:hidden text-light-font-40 dark:text-dark-font-40 mb-[35px]">
              Mobula smokes the competition.
            </MediumFont>
            <CompareHeaderTable />
          </div>
          <div className="flex justify-evenly w-full">
            <CompareTable title="Mobula" contents={contentsTable[0]} />
            <CompareTable title="Rose" contents={contentsTable[1]} />
            <CompareTable title="Bobby" contents={contentsTable[2]} />
          </div>
        </div>
      </Container>
    </>
  );
}
