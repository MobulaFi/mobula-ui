import {
  Button,
  Popover,
  PopoverContent,
  PopoverTrigger,
  useDisclosure,
} from "@chakra-ui/react";
import React, { Dispatch, SetStateAction } from "react";
import { useColors } from "../../../../../lib/chakra/colorMode";
import { pushData } from "../../../../../lib/mixpanel";
import { createSupabaseDOClient } from "../../../../../lib/supabase";
import { CoreSearchBar } from "../../../../../popup/searchbar/core";
import { ComparedEntity, UserHoldings } from "../../models";
import { loadWalletPortfolio } from "../../utils";

export const ComparePopover = ({
  setComparedEntities,
  comparedEntities,
  ...props
}: {
  [key: string]: any;
  setComparedEntities: Dispatch<SetStateAction<ComparedEntity[]>>;
  comparedEntities: ComparedEntity[];
}) => {
  const { onOpen, onClose, isOpen } = useDisclosure();
  const { borders, shadow } = useColors();
  // const alert = useAlert();
  const isMobile =
    (typeof window !== "undefined" ? window.innerWidth : 0) < 768;

  const fetchCompare = (value: {
    content: string;
    type: string;
    label: string;
  }) => {
    onClose();
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
    <Popover isOpen={isOpen} onClose={onClose} onOpen={onOpen}>
      <PopoverTrigger>
        <Button
          variant="outlined_grey"
          ml="auto"
          mr="10px"
          h={["30px"]}
          zIndex="1"
          px="8px"
          onClick={() => {
            onOpen();
            pushData("Portfolio Compare Clicked");
          }}
          {...props}
          //   mb={!isOpen ? props.mb : ""}
        >
          Compare +
        </Button>
      </PopoverTrigger>
      {isOpen ? (
        <PopoverContent
          overflow="auto"
          maxHeight="450px"
          border={borders}
          borderRadius="16px"
          boxShadow={shadow}
        >
          <CoreSearchBar
            showPagesAndArticles={false}
            maxAssetsResult={3}
            maxWalletsResult={isMobile ? 1 : 3}
            callback={fetchCompare}
            setTrigger={onClose}
          />
        </PopoverContent>
      ) : null}
    </Popover>
  );
};
