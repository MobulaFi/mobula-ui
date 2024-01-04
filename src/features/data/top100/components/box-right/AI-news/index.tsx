import { useTheme } from "next-themes";
import React, { useEffect } from "react";
import { MediumFont, SmallFont } from "../../../../../../components/fonts";
import { NextChakraLink } from "../../../../../../components/link";
import { createSupabaseDOClient } from "../../../../../../lib/supabase";
import { getDate, getUrlFromName } from "../../../../../../utils/formaters";
import { useTop100 } from "../../../context-manager";
import { INewsGeneral } from "../../../models";

interface AINewsProps {
  showPage: number;
}

const formatNewsSummary = (news: INewsGeneral) => {
  const elements: React.ReactNode[] = [];
  let lastIndex = 0;

  const matches = Array.from(news.summary.matchAll(/\[([^\]]+)\]/g));

  matches.forEach((match) => {
    const [fullMatch, p1] = match;
    const offset = match.index || 0;

    if (offset > lastIndex) {
      elements.push(news.summary.slice(lastIndex, offset));
    }
    const assetData = news.assetsData
      ? news.assetsData[p1]
      : { price_change_24h: 0, name: "" };
    let priceChangeIcon: any | null = null;
    if (assetData?.name !== "ETF The Token") {
      if (assetData?.price_change_24h > 0) {
        priceChangeIcon = (
          <span className="text-[10px] text-green dark:text-green">
            &#9650;
          </span>
        );
      } else if (assetData?.price_change_24h < 0) {
        priceChangeIcon = (
          <span
            className="text-[10px] text-red 
        dark:text-red"
          >
            &#9660;
          </span>
        );
      }
    }
    if (assetData?.name && assetData?.name !== "ETF The Token")
      elements.push(
        <NextChakraLink
          key={offset}
          extraCss="p-0.5 text-sm md:text-xs h-[18px] font-medium"
          href={`https://mobula.fi/asset/${getUrlFromName(assetData.name)}`}
        >
          {p1} {priceChangeIcon}
        </NextChakraLink>
      );
    else if (assetData?.name === "ETF The Token")
      elements.push(<span>ETF</span>);

    lastIndex = offset + fullMatch.length;
  });

  if (lastIndex < news.summary.length) {
    elements.push(news.summary.slice(lastIndex));
  }

  return elements;
};

export const AINews = ({ showPage }: AINewsProps) => {
  const { news, setNews } = useTop100();
  const { resolvedTheme } = useTheme();
  const isDarkMode = resolvedTheme === "dark";

  useEffect(() => {
    if (!news) {
      const supabase = createSupabaseDOClient();
      supabase
        .from("news")
        .select("news_count, summary, created_at,assetsData")
        .order("created_at", { ascending: false })
        .limit(1)
        .single()
        .then((response) => {
          if (response.error) return;
          setNews(response.data as INewsGeneral);
        });
    }
  }, []);

  return (
    <div
      className={`flex w-[200px] flex-col transition-all duration-300 ease-in-out min-w-full`}
      style={{ transform: `translateX(-${showPage * 100}%)` }}
    >
      <div className="flex items-center justify-between w-full pt-2.5 px-[15px] pb-0">
        <div className="flex items-center">
          <MediumFont>News</MediumFont>
          <MediumFont extraCss="text-light-font-40 dark: text-dark-font-40 ml-[7.5px]">
            {news?.created_at ? getDate(Date.parse(news?.created_at)) : ""}
          </MediumFont>
        </div>
      </div>
      <SmallFont extraCss="scroll overflow-y-scroll max-h-[102px] mt-2.5 pt-0 px-[15px] pr-2.5 text-light-font-80 dark:text-dark-font-80">
        {news ? formatNewsSummary(news) : "Loading..."}
      </SmallFont>
      <div className="flex items-center justify-between px-[15px] py-1.5 mt-auto border-t border-light-border-primary dark:border-dark-border-primary">
        <div className="flex items-center">
          <img
            src={
              (isDarkMode
                ? "/mobula/mobula-logo.svg"
                : "/mobula/mobula-logo-light.svg") || "/empty/unknown.png"
            }
            className="mr-[7.5px] rounded-full w-[15px] h-[15px]"
            alt="Mobula AI logo"
          />
          <SmallFont extraCss="mr-[7.5px]">Mobula AI</SmallFont>
        </div>
        <SmallFont extraCss="text-light-font-40 dark:text-dark-font-40">
          Based on +{news?.news_count || "..."} news
        </SmallFont>
      </div>
    </div>
  );
};
