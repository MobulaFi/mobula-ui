import React, { useEffect, useState } from "react";
import { NextChakraLink } from "../../../../components/link";
import { createSupabaseDOClient } from "../../../../lib/supabase";
import {
  getFormattedAmount,
  getTokenPercentage,
  getUrlFromName,
} from "../../../../utils/formaters";
import { TrendsType } from "../../models";
import { Lines } from "../ui/lines";
import { Percentage } from "../ui/percentage";

export const NoResult = ({ setTrigger }) => {
  const supabase = createSupabaseDOClient();
  const [trends, setTrends] = useState<TrendsType[]>([]);
  const [history, setHistory] = useState<any>();

  useEffect(() => {
    supabase
      .from("assets")
      .select("name,price_change_24h,logo,id,trending_score")
      .order("trending_score", { ascending: false })
      .limit(3)
      .then((r) => {
        if (r.data) setTrends(r.data);
      });
  }, []);

  useEffect(() => {
    const ls = localStorage.getItem("token-history");
    if (ls!) {
      setHistory(JSON.parse(ls).reverse());
    }
  }, []);

  const handleClick = () => setTrigger(false);

  return (
    <>
      <img
        className="my-[20px] w-[88px] h-[88px] mx-auto"
        src="/icon/searchbar.png"
        alt="searchbar logo"
      />
      <p className="text-xl lg:text-lg md:text-sm font-bold text-light-font-100 dark:text-dark-font-100 mx-auto">
        No results found
      </p>
      <p className="text-sm text-normal text-light-font-40 dark:text-dark-font-40 mt-[5px] mx-auto">
        Try adjusting your search
      </p>
      <p className="text-sm text-normal text-light-font-40 dark:text-dark-font-40 mb-2.5 mx-auto">
        or{" "}
        <span className="ml-[5px] font-medium">
          <NextChakraLink
            extraCss="text-light-font-100 dark:text-dark-font-100 text-medium"
            href="/list"
          >
            list an asset
          </NextChakraLink>
        </span>
      </p>
      <div className="flex px-[20px] justify-between mt-[20px] py-3 border-b border-light-border-primary dark:border-dark-border-primary">
        <p className="text-base font-medium text-light-font-100 dark:text-dark-font-100">
          {history ? "History" : "Trendings"}
        </p>
        {history ? null : (
          <NextChakraLink
            extraCss="text-light-font-100 dark:text-dark-font-100 text-normal"
            href="/trendings"
          >
            more {" >"}
          </NextChakraLink>
        )}
      </div>
      <div className="h-[1px] bg-light-border-primary dark:border-dark-border-primary w-full mb-2.5" />
      {history
        ? history?.map((entry, i) => {
            if (i < 5) {
              return (
                <NextChakraLink
                  key={entry}
                  href={`/asset/${getUrlFromName(entry?.name)}`}
                  onClick={handleClick}
                >
                  <Lines token={entry} active={false}>
                    <Percentage
                      noImage
                      value={
                        getFormattedAmount(entry.price, 0, {
                          canUseHTML: true,
                        }) as number
                      }
                    />
                  </Lines>
                </NextChakraLink>
              );
            }
            return null;
          })
        : trends?.map((entry) => (
            <NextChakraLink
              key={entry.id}
              href={`/asset/${getUrlFromName(entry?.name)}`}
              onClick={handleClick}
            >
              <Lines token={entry} active={false}>
                <Percentage
                  isPercentage
                  value={getTokenPercentage(entry.price_change_24h)}
                />
              </Lines>
            </NextChakraLink>
          ))}
    </>
  );
};
