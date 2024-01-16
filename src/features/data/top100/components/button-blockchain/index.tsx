import React, { Dispatch, SetStateAction, useContext } from "react";
import { useAccount } from "wagmi";
import { Button } from "../../../../../components/button";
import { NextImageFallback } from "../../../../../components/image";
import { PopupUpdateContext } from "../../../../../contexts/popup";
import { TableAsset } from "../../../../../interfaces/assets";
import { HoldingsResponse } from "../../../../../interfaces/holdings";
import { triggerAlert } from "../../../../../lib/toastify";
import { generateFilters } from "../../../../../utils/filters";
import { Query, TableButton } from "../../models";

interface ButtonBlockchainProps {
  entry: TableButton;
  active: string;
  setActive: React.Dispatch<React.SetStateAction<string>>;
  setFilters: React.Dispatch<React.SetStateAction<Query[]>>;
  requiresLogin?: boolean;
  setResultsData: Dispatch<
    SetStateAction<{ data: TableAsset[]; count: number }>
  >;
  holdings: HoldingsResponse;
}

export const ButtonBlockchain = ({
  setFilters,
  entry,
  requiresLogin,
  active,
  setActive,
  setResultsData,
  holdings,
}: ButtonBlockchainProps) => {
  const { setConnect } = useContext(PopupUpdateContext);
  const { address } = useAccount();
  const isActive = active === entry.title;

  return (
    <Button
      key={entry.title}
      extraCss={`justify-center max-w-[155px] w-[13%] whitespace-nowrap rounded-md p-2.5 min-w-fit mx-[5px] ${
        isActive
          ? "text-light-font-100 dark:text-dark-font-100 border-blue dark:border-blue"
          : "text-light-font-40 dark:text-dark-font-40 border-0 bg-inherit dark:bg-inherit"
      } `}
      onClick={() => {
        if (!address && requiresLogin) {
          setConnect(true);
          return;
        }
        if (
          entry.title === "My assets" &&
          holdings?.holdings?.multichain?.length > 0
        ) {
          setActive(entry.title);
          setResultsData((prev) => ({
            ...prev,
            data: holdings?.holdings?.multichain as unknown as TableAsset[],
          }));
        } else if (entry.title !== "My assets") {
          setFilters(generateFilters(entry.title));
          setActive(entry.title);
        } else
          triggerAlert("Warning", "You don't have any assets in your wallet");
      }}
    >
      {entry.logo ? (
        <>
          <NextImageFallback
            width={20}
            height={20}
            style={{
              borderRadius: "50%",
            }}
            src={entry.logo}
            alt={`${entry.title} logo`}
            fallbackSrc="/empty/unknown.png"
          />
          <span className="ml-2.5"> {entry.symbol || entry.title}</span>
        </>
      ) : (
        entry.title
      )}
      {entry.logo ? (
        <>
          <NextImageFallback
            width={20}
            height={20}
            style={{
              borderRadius: "50%",
            }}
            fallbackSrc="/empty/unknown.png"
            src={entry.logo}
            alt={`${entry.title} logo`}
          />
          <span className="ml-2.5">{entry.symbol}</span>
        </>
      ) : (
        entry.title
      )}
    </Button>
  );
};
