import { useRouter } from "next/navigation";
import React, { useContext } from "react";
import { pushData } from "../../../../lib/mixpanel";
import { getFormattedAmount } from "../../../../utils/formaters";
import { SearchbarContext } from "../../context-manager";
import { Title } from "../ui/title";

export const PairResult = ({ setTrigger, firstIndex }) => {
  const { active, setActive, pairs } = useContext(SearchbarContext);
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

  console.log("pairspairs", pairs);

  return (
    <>
      {pairs?.length > 0 && (
        <Title extraCss="mt-[5px]">Pairs ({pairs?.length})</Title>
      )}
      {pairs?.map((result, index) => {
        const pair = result?.pairs?.[0];
        return (
          <div
            className={`flex items-center cursor-pointer transition-all duration-200 justify-between ${
              active ? "bg-light-bg-hover dark:bg-dark-bg-hover" : ""
            } py-[7px] px-[20px] md:px-2.5 hover:bg-light-bg-hover hover:dark:bg-dark-bg-hover `}
            onMouseOver={() => setActive(index)}
            onClick={() => clickEvent(pair)}
          >
            <div className="flex items-center">
              <img
                src={pair?.token0?.logo || "/empty/unknown.png"}
                className="w-[20px] h-[20px] rounded-full mr-[7.5px]"
              />
              <img
                src={pair?.token1?.logo || "/empty/unknown.png"}
                className="w-[20px] h-[20px] rounded-full mr-[7.5px]"
              />
              <p className="text-sm font-medium md:font-normal max-w-[340px] truncate text-light-font-100 dark:text-dark-font-100 mr-2.5">
                {pair?.token0?.symbol} / {pair?.token1?.symbol}
              </p>
            </div>
            <p className="text-sm font-medium md:font-normal max-w-[340px] truncate text-light-font-100 dark:text-dark-font-100">
              <span className="text-light-font-40 dark:text-dark-font-40 mr-1">
                Liquidity:
              </span>{" "}
              {getFormattedAmount(pair?.liquidity || 342_113_234)}
            </p>
          </div>
        );
      })}
    </>
  );
};
