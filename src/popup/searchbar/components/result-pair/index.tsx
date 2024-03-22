import { blockchainsContent } from "mobula-lite/lib/chains/constants";
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
    router.push(`/pair/${result.address}`);
  };
  const notListedTokens = results?.filter((entry) => !entry.id);
  const resultsWithPair = results?.filter(
    (entry) => (entry?.pairs?.length || 0) > 0 && entry.id
  );

  const formatPairsResultFromAddress = () => {
    if (!pairs?.length) return;
    let formatedPairs = [];
    pairs.forEach((pair) => {
      const templatePair = {
        pairs: [
          {
            token0: pair.token0,
            token1: pair.token1,
            address: pair.address,
            liquidity: pair.liquidity,
          },
        ],
        name: pair.token0?.name,
        symbol: pair.token0?.symbol,
      };
      formatedPairs.push(templatePair);
    });
    return formatedPairs || [];
  };
  const searchPairAddress = formatPairsResultFromAddress();
  const finalPairs = [
    ...resultsWithPair,
    ...notListedTokens,
    ...(searchPairAddress || []),
  ];

  return (
    <div
      className={`${
        finalPairs?.filter((_, i) => i < 5)?.length > 0
          ? "mt-2.5"
          : "mt-0 hidden"
      }`}
    >
      {finalPairs?.filter((_, i) => i < 5)?.length > 0 && (
        <Title extraCss="mt-[5px]">
          Pairs ({finalPairs?.filter((_, i) => i < 5)?.length})
        </Title>
      )}
      {finalPairs
        ?.filter((_, i) => i < 5)
        .map((result, index) => {
          let pair = result?.pairs?.[0];
          const isSearchedPair = !pair;
          if (isSearchedPair) pair = result;
          return (
            <div
              className={`flex items-center cursor-pointer transition-all duration-200 justify-between ${
                active === index + firstIndex
                  ? "bg-light-bg-hover dark:bg-dark-bg-hover"
                  : ""
              } py-[7px] px-[20px] md:px-2.5 hover:bg-light-bg-hover hover:dark:bg-dark-bg-hover`}
              onMouseOver={() => setActive(index + firstIndex)}
              onClick={() => clickEvent(pair)}
            >
              <div className="flex items-center">
                <div className="flex items-center relative">
                  {(
                    isSearchedPair
                      ? result?.[result?.baseToken]?.logo
                      : pair?.[pair?.baseToken]?.logo
                  ) ? (
                    <img
                      src={
                        isSearchedPair
                          ? result?.[result?.baseToken]?.logo
                          : pair?.[pair?.baseToken]?.logo
                      }
                      className="w-[20px] h-[20px] rounded-full mr-[7.5px]"
                    />
                  ) : (
                    <AddressAvatar
                      address={
                        isSearchedPair
                          ? result?.[result?.baseToken]?.addres
                          : (pair?.address as string)
                      }
                      extraCss="w-[20px] h-[20px] rounded-full mr-[7.5px]"
                    />
                  )}
                  <img
                    src={
                      isSearchedPair
                        ? blockchainsContent[result?.blockchain]?.logo
                        : blockchainsContent[pair?.blockchain]?.logo
                    }
                    className="w-[16px] h-[16px] rounded-full mr-[7.5px] absolute -bottom-1 -right-2.5 bg-light-bg-hover dark:bg-dark-bg-hover"
                  />
                </div>
                <p className="text-sm ml-2.5 font-medium md:font-normal max-w-[340px] truncate text-light-font-100 dark:text-dark-font-100 mr-2.5">
                  {isSearchedPair
                    ? result?.[result?.baseToken]?.symbol
                    : pair?.[pair?.baseToken]?.symbol}{" "}
                  /{" "}
                  {isSearchedPair
                    ? result?.[result?.quoteToken]?.symbol
                    : pair?.[pair?.quoteToken]?.symbol}
                </p>
                <p className="text-sm max-w-[100px] truncate text-light-font-60 dark:text-dark-font-60 mr-2.5">
                  {isSearchedPair
                    ? result?.[result?.baseToken]?.name
                    : result?.name || ""}
                </p>
              </div>
              <p className="text-sm font-medium md:font-normal max-w-[340px] truncate text-light-font-100 dark:text-dark-font-100">
                <span className="text-light-font-40 dark:text-dark-font-40 mr-1">
                  Liquidity:
                </span>{" "}
                $
                {getFormattedAmount(pair?.liquidity, 0, {
                  canUseHTML: true,
                })}
              </p>
            </div>
          );
        })}
    </div>
  );
};
