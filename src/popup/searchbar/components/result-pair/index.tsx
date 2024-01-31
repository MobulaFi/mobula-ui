import { useRouter } from "next/navigation";
import React, { useContext } from "react";
import { AddressAvatar } from "../../../../components/avatar";
import { pushData } from "../../../../lib/mixpanel";
import { getFormattedAmount } from "../../../../utils/formaters";
import { SearchbarContext } from "../../context-manager";
import { Title } from "../ui/title";

export const PairResult = ({ setTrigger, firstIndex }) => {
  const { active, setActive, pairs, results } = useContext(SearchbarContext);
  const router = useRouter();
  const clickEvent = (result) => {
    setTrigger(false);
    pushData("Searchbar", {
      type: "pairs",
      soloPair: result.token0.address,
      pair: result.address,
    });
    if (result?.token0) router.push(`/pair/${result.token0.address}`);
    else router.push(`/pair/${result.address}`);
  };

  const isBaseToken = (result, pair) => result?.symbol === pair?.token0?.symbol;
  const isQuoteToken = (result, pair) =>
    result?.symbol === pair?.token1?.symbol;

  return (
    <div className={`${results.length > 0 ? "mt-2.5" : "mt-0"}`}>
      {pairs?.length > 0 && (
        <Title extraCss="mt-[5px]">Pairs ({pairs?.length})</Title>
      )}
      {pairs?.map((result, index) => {
        const pair = result?.pairs?.[0];
        return (
          <div
            className={`flex items-center cursor-pointer transition-all duration-200 justify-between ${
              active === index + firstIndex
                ? "bg-light-bg-hover dark:bg-dark-bg-hover"
                : ""
            } py-[7px] px-[20px] md:px-2.5 hover:bg-light-bg-hover hover:dark:bg-dark-bg-hover `}
            onMouseOver={() => setActive(index + firstIndex)}
            onClick={() => clickEvent(pair)}
          >
            <div className="flex items-center">
              {(isBaseToken(result, pair) && pair?.token0?.logo) ||
              (!isBaseToken(result, pair) && pair?.token1?.logo) ? (
                <img
                  src={
                    isBaseToken(result, pair)
                      ? pair?.token0?.logo
                      : pair?.token1?.logo
                  }
                  className="w-[20px] h-[20px] rounded-full mr-[7.5px]"
                />
              ) : (
                <AddressAvatar
                  address={pair?.address as string}
                  extraCss="w-[20px] h-[20px] rounded-full mr-[7.5px]"
                />
              )}
              {(isQuoteToken(result, pair) && pair?.token0?.logo) ||
              (!isQuoteToken(result, pair) && pair?.token1?.logo) ? (
                <img
                  src={
                    isQuoteToken(result, pair)
                      ? pair?.token0?.logo || "/empty/unknown.png"
                      : pair?.token1?.logo || "/empty/unknown.png"
                  }
                  className="w-[20px] h-[20px] rounded-full mr-[7.5px]"
                />
              ) : (
                <AddressAvatar
                  address={pair?.address as string}
                  extraCss="w-[20px] h-[20px] rounded-full mr-[7.5px]"
                />
              )}
              <p className="text-sm font-medium md:font-normal max-w-[340px] truncate text-light-font-100 dark:text-dark-font-100 mr-2.5">
                {isBaseToken(result, pair)
                  ? pair?.token0?.symbol?.toUpperCase()
                  : pair?.token1?.symbol?.toUpperCase()}{" "}
                /{" "}
                {isQuoteToken(result, pair)
                  ? pair?.token0?.symbol?.toUpperCase()
                  : pair?.token1?.symbol?.toUpperCase()}
              </p>
            </div>
            <p className="text-sm font-medium md:font-normal max-w-[340px] truncate text-light-font-100 dark:text-dark-font-100">
              <span className="text-light-font-40 dark:text-dark-font-40 mr-1">
                Liquidity:
              </span>{" "}
              ${getFormattedAmount(pair?.liquidity || 342_113_234)}
            </p>
          </div>
        );
      })}
    </div>
  );
};
