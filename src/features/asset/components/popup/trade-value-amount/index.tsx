import {Button, Flex, Input} from "@chakra-ui/react";
import React, {useContext, useRef, useState} from "react";
import {TextSmall} from "../../../../../../UI/Text";
import {useColors} from "../../../../../../common/utils/color-mode";
import {BaseAssetContext} from "../../../context-manager";
import {cancelButtonStyle} from "../../../style";

export const TradeValueAmountPopup = ({
  title,
  state,
  onClose,
  setStateValue,
  setActiveName,
  activeName,
}: {
  onClose?: any;
  title: string;
  state?: boolean;
  setActiveName: any;
  activeName: any;
  setStateValue?: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const {
    setSelectedTradeFilters,
    setMarketMetrics,
    filters,
    setFilters,
    selectedTradeFilters,
    setShouldInstantLoad,
    setShowTradeFilters,
  } = useContext(BaseAssetContext);
  const {text80, boxBg6, borders, hover, bordersActive} = useColors();
  const maxRef = useRef(null);
  const minRef = useRef(null);
  const lastMax = Number(
    activeName[title.toLowerCase()].split(" - ")?.[1] === "Any"
      ? 1000000000000
      : Number(activeName[title.toLowerCase()].split(" - ")?.[1]) || 0,
  );
  const lastMin = Number(activeName[title.toLowerCase()].split(" - ")?.[0]);
  const [max, setMax] = useState(lastMax === 0 ? 1000000000000 : lastMax);
  const [min, setMin] = useState(lastMin || 0);
  console.log(lastMax);

  const handleAddFilter = (init: boolean) => {
    let req: string;
    if (title === "Value") req = "trade_history.value_usd";
    if (title === "token_amount") req = "trade_history.token_amount";
    let filterName: string;
    if (title === "Value") filterName = "value";
    if (title === "token_amount") filterName = "token_amount";
    setShouldInstantLoad(true);
    setMarketMetrics(prev => ({
      ...prev,
      trade_history: [],
    }));

    setActiveName(prev => ({
      ...prev,
      [filterName]: `${selectedTradeFilters[filterName][0]} - ${
        selectedTradeFilters[filterName][1] === 1000000000000
          ? "Any"
          : selectedTradeFilters[filterName][1]
      }`,
    }));

    if (init) {
      return;
    }

    const arr = [1, 2];
    arr.forEach(() => {
      const index = filters.findIndex(entry => entry.value[0] === req);
      if (index !== -1) filters.splice(index, 1);
    });

    const finalFilters = [];

    filters.forEach(f => {
      if (
        f.value[0] === "trade_history.value_usd" &&
        title === "token_amount"
      ) {
        finalFilters.push(f);
      }
      if (f.value[0] === "trade_history.token_amount" && title === "Value") {
        finalFilters.push(f);
      }
    });
    finalFilters.push(
      {
        action: "gte",
        value: [req, Number(selectedTradeFilters[filterName][0]) || 0],
      },
      {
        action: "lte",
        value: [
          req,
          Number(selectedTradeFilters[filterName][1]) || 1_000_000_000_000,
        ],
      },
    );
    setFilters(finalFilters);
    setShowTradeFilters(false);
  };

  return (
    <Flex direction="column">
      <Flex>
        <Flex direction="column">
          <TextSmall mb="10px">
            Min {title === "token_amount" ? "Amount" : title}
          </TextSmall>
          <Input
            border={borders}
            bg={boxBg6}
            type="number"
            h="35px"
            borderRadius="8px"
            color={text80}
            pl="10px"
            ref={minRef}
            placeholder={JSON.stringify(min)}
            _placeholder={{color: text80}}
            isInvalid={
              selectedTradeFilters[title.toLowerCase()]?.[1] <
              minRef?.current?.value
            }
            onChange={e => {
              setSelectedTradeFilters(prevState => ({
                ...prevState,
                [title.toLowerCase()]: [
                  e.target.value,
                  prevState[title.toLowerCase()]
                    ? prevState[title.toLowerCase()][1]
                    : Infinity,
                ],
              }));
              setMin(Number(e.target.value));
            }}
          />
        </Flex>
        <TextSmall mx="15px" mt="37px">
          To
        </TextSmall>
        <Flex direction="column">
          <TextSmall mb="10px">
            Max {title === "token_amount" ? "Amount" : title}
          </TextSmall>
          <Input
            h="35px"
            borderRadius="8px"
            placeholder={max === 1000000000000 ? "Any" : JSON.stringify(max)}
            pl="10px"
            color={text80}
            border={borders}
            errorBorderColor="red"
            _placeholder={{color: text80}}
            isInvalid={
              selectedTradeFilters[title.toLowerCase()]?.[0] >
              maxRef?.current?.value
            }
            bg={boxBg6}
            type="number"
            ref={maxRef}
            onChange={e => {
              setSelectedTradeFilters(prevState => ({
                ...prevState,
                [title.toLowerCase()]: [
                  prevState[title.toLowerCase()]
                    ? prevState[title.toLowerCase()][0]
                    : 0,
                  e.target.value,
                ],
              }));
              setMax(Number(e.target.value));
            }}
          />
        </Flex>
      </Flex>
      <Flex mt="20px">
        <Button
          sx={cancelButtonStyle}
          color={text80}
          bg={boxBg6}
          border={borders}
          _hover={{
            border: bordersActive,
            bg: hover,
          }}
          onClick={() => {
            setSelectedTradeFilters({
              ...selectedTradeFilters,
              [title.toLowerCase()]: [0, 1_000_000_000_000],
            });
            setActiveName(prev => ({
              ...prev,
              [title.toLowerCase()]: `Any${
                title === "token_amount" ? " Amount" : " Value"
              }`,
            }));
            setFilters([]);
            setMin(0);
            setMax(100_000_000_000);
            setShouldInstantLoad(true);
            setStateValue(false);
            if (onClose) onClose();
            setShowTradeFilters(false);
          }}
        >
          Reset
        </Button>
        <Button
          variant="outlined"
          mb="0px"
          color={text80}
          maxW="100px"
          h="30px"
          onClick={() => {
            setStateValue(false);
            handleAddFilter(false);
            if (onClose) onClose();
          }}
        >
          Apply
        </Button>{" "}
      </Flex>
    </Flex>
  );
};
