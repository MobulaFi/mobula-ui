import { Button } from "components/button";
import React, { Dispatch, SetStateAction, useState } from "react";
import { Popover } from "../.../../../../../../components/popover";
import { pushData } from "../../../../../lib/mixpanel";
import { cn } from "../../../../../lib/shadcn/lib/utils";
import { createSupabaseDOClient } from "../../../../../lib/supabase";
import { triggerAlert } from "../../../../../lib/toastify";
import { CoreSearchBar } from "../../../../../popup/searchbar/core";
import { ComparedEntity, UserHoldings } from "../../models";
import { loadWalletPortfolio } from "../../utils";

interface ComparePopoverProps {
  setComparedEntities: Dispatch<SetStateAction<ComparedEntity[]>>;
  comparedEntities: ComparedEntity[];
  extraCss?: string;
  isPortfolio?: boolean;
}

export const ComparePopover = ({
  setComparedEntities,
  comparedEntities,
  extraCss,
  isPortfolio,
}: ComparePopoverProps) => {
  const [showCompare, setShowCompare] = useState(false);
  const isMobile =
    (typeof window !== "undefined" ? window.innerWidth : 0) < 768;

  const fetchCompare = (value: {
    content: string;
    type: string;
    label: string;
  }) => {
    setShowCompare(false);
    const supabase = createSupabaseDOClient();
    const { content, type, label } = value;
    const isAlreadyCompared = comparedEntities.some(
      (entry) => entry.content === content
    );
    if (isAlreadyCompared) {
      triggerAlert("Error", "This token is already compared");
      return;
    }
    if (type === "asset") {
      setComparedEntities((comparedEntities) => [
        ...comparedEntities,
        { content, type: "asset", data: [], label },
      ]);

      supabase
        .from("assets")
        .select("price_history,history(price_history)")
        .ilike("name", content)
        .order("market_cap", { ascending: false })
        .then(({ data }) => {
          if (data && data[0]) {
            setComparedEntities((prev) => {
              const newPrev = [...prev];
              const index = newPrev.findIndex(
                (item) => item.content === content
              );
              newPrev[index].data = (
                data[0].history?.[0]?.price_history || []
              ).concat(data[0].price_history.price);
              return newPrev;
            });
          }
        });
    } else if (type === "wallet") {
      setComparedEntities((prev) => [
        ...prev,
        { content, type: "portfolio", data: [], label },
      ]);

      loadWalletPortfolio(content).then((walletResult: UserHoldings) => {
        if (!walletResult) return;
        setComparedEntities((prev) => {
          const newPrev = [...prev];
          const index = newPrev.findIndex((item) => item.content === content);
          newPrev[index].data = walletResult.estimated_history;
          return newPrev;
        });
      });
    }
  };

  return (
    <Popover
      visibleContent={
        <Button
          extraCss={cn(
            `mr-2.5 ml-auto h-[30px] px-2 flex items-center font-normal justify-center whitespace-nowrap`,
            extraCss
          )}
        >
          Compare +
        </Button>
      }
      hiddenContent={
        <CoreSearchBar
          showPagesAndArticles={false}
          maxAssetsResult={3}
          maxWalletsResult={isMobile ? 1 : 3}
          callback={fetchCompare}
          setTrigger={setShowCompare}
        />
      }
      onToggle={() => {
        setShowCompare((prev) => !prev);
        pushData("Portfolio Compare Clicked");
      }}
      isOpen={showCompare}
      extraCss={`p-0 left-0 ${
        isPortfolio ? "" : "lg:right-0 lg:left-auto"
      } z-[100] mr-2.5 min-w-[300px]`}
      position="start"
    />
  );
};
