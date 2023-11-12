import { Button } from "components/button";
import { Dispatch, SetStateAction, useState } from "react";
import { Popover } from "../.../../../../../../components/popover";
import { pushData } from "../../../../../lib/mixpanel";
import { createSupabaseDOClient } from "../../../../../lib/supabase";
import { CoreSearchBar } from "../../../../../popup/searchbar/core";
import { ComparedEntity, UserHoldings } from "../../models";
import { loadWalletPortfolio } from "../../utils";

interface ComparePopoverProps {
  setComparedEntities: Dispatch<SetStateAction<ComparedEntity[]>>;
  comparedEntities: ComparedEntity[];
  extraCss?: string;
}

export const ComparePopover = ({
  setComparedEntities,
  comparedEntities,
  extraCss,
}: ComparePopoverProps) => {
  const [showCompare, setShowCompare] = useState(false);
  // const alert = useAlert();
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
      // alert.error("This token is already compared");
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
        console.log("result", walletResult);
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
          extraCss={`${extraCss} mr-2.5 ml-auto h-[30px] z-[1] px-2`}
          onClick={() => {
            setShowCompare((prev) => !prev);
            pushData("Portfolio Compare Clicked");
          }}
        >
          Compare +
        </Button>
      }
      hiddenContent={
        showCompare ? (
          <CoreSearchBar
            showPagesAndArticles={false}
            maxAssetsResult={3}
            maxWalletsResult={isMobile ? 1 : 3}
            callback={fetchCompare}
            setTrigger={setShowCompare}
          />
        ) : null
      }
      onToggle={() => {}}
      isOpen={showCompare}
      extraCss="p-0 top-[110%] left-0 z-[100000000]"
    />
  );
};
