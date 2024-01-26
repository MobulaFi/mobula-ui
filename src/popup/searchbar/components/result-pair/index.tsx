import { useRouter } from "next/navigation";
import React, { useContext } from "react";
import { famousContractsLabelFromName } from "../../../../layouts/swap/utils";
import { pushData } from "../../../../lib/mixpanel";
import { getFormattedAmount } from "../../../../utils/formaters";
import { SearchbarContext } from "../../context-manager";
import { Title } from "../ui/title";

export const PairResult = ({ callback, setTrigger, firstIndex }) => {
  const { results, active, setActive, pairs } = useContext(SearchbarContext);
  const router = useRouter();
  const clickEvent = (result) => {
    setTrigger(false);
    pushData("Searchbar", { type: "pairs", name: result.token0.address });
    router.push(`/pair/${result.token0.address}`);
  };
  return (
    <>
      {pairs?.length > 0 && (
        <Title extraCss="mt-[5px]">Pairs ({pairs?.length})</Title>
      )}
      {pairs?.map((result, index) => (
        <div
          className={`flex items-center cursor-pointer transition-all duration-200 justify-between ${
            active ? "bg-light-bg-hover dark:bg-dark-bg-hover" : ""
          } py-[7px] px-[20px] md:px-2.5 hover:bg-light-bg-hover hover:dark:bg-dark-bg-hover `}
          onMouseOver={() => setActive(firstIndex)}
        >
          <div className="flex items-center">
            {result?.protocol ? (
              <img
                src={
                  famousContractsLabelFromName[result.protocol]?.logo ||
                  "/empty/unknown.png"
                }
                className="w-[20px] h-[20px] rounded-full mr-[7.5px]"
              />
            ) : (
              <>
                <img
                  src={result?.token0?.logo || "/empty/unknown.png"}
                  className="w-[20px] h-[20px] rounded-full mr-[7.5px]"
                />
                <img
                  src={result?.token1?.logo || "/empty/unknown.png"}
                  className="w-[20px] h-[20px] rounded-full mr-[7.5px]"
                />
              </>
            )}

            <p className="text-sm font-medium md:font-normal max-w-[340px] truncate text-light-font-100 dark:text-dark-font-100 mr-2.5">
              {result?.token0?.symbol} / {result?.token1?.symbol}
            </p>
          </div>
          <p className="text-sm font-medium md:font-normal max-w-[340px] truncate text-light-font-100 dark:text-dark-font-100 mr-2.5">
            <span className="text-light-font-60 dark:text-dark-font-60">
              Liquidity:
            </span>{" "}
            {getFormattedAmount(result?.liquidity || 342_113_234)}
          </p>
        </div>
      ))}
    </>
  );
};
