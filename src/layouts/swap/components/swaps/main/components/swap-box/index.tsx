import {
  Box,
  Button,
  Flex,
  Input,
  PlacementWithLogical,
  ResponsiveValue,
  Skeleton,
  Text,
} from "@chakra-ui/react";
import { useContext, useRef, useState } from "react";
import { useFeeData, useNetwork } from "wagmi";
import { SwapContext } from "../../../../..";
// eslint-disable-next-line import/no-cycle
import { ColorsContext } from "../../../../../../../../../pages/iframe/swap/index";
import {
  getFormattedAmount,
  getRightPrecision,
} from "../../../../../../../../../utils/helpers/formaters";
import { TextSmall } from "../../../../../../../../UI/Text";
import { InfoPopup } from "../../../../../../../components/popup-hover";
import { pushData } from "../../../../../../../data/utils";
import { useColors } from "../../../../../../../utils/color-mode";
import { ISwapContext } from "../../../../../model";
import { Select } from "../../../../../popup/select";
import { cleanNumber } from "../../../../../utils";
import { BlockchainSelector } from "../../popup/blockchain-selector";
import { BlockchainChanger } from "../blockchain-changer";
import { SelectedToken } from "../selected-token";
import { FlexBoxs } from "../ui";

export const SwapBox = ({
  position,
  isDex,
}: {
  position: "in" | "out";
  isDex?: boolean;
}) => {
  const {
    tokenIn,
    tokenOut,
    buttonStatus,
    amountIn,
    amountOut,
    setAmountIn,
    tx,
    settings,
    chainNeeded,
  } = useContext<ISwapContext>(SwapContext);
  const [select, setSelect]: [string | boolean, any] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const { text40, borders, text80, boxBg6, hover } = useColors();
  const [showBlockchainSelector, setShowBlockchainSelector] =
    useState<boolean>(false);
  const { bgBox, fontSecondary, fontMain, borderColor } =
    useContext(ColorsContext);
  const { chain } = useNetwork();
  const { data: gasData } = useFeeData({
    chainId: chainNeeded || chain?.id || 1,
  });

  // Syntax sugar
  const isFrom = position === "in";
  const amount = isFrom ? amountIn : amountOut;
  const setAmount = isFrom ? setAmountIn : undefined;
  const gasCost = tx?.gasLimit
    ? cleanNumber(tx.gasLimit, 9) *
      cleanNumber(gasData?.gasPrice, 9) *
      settings.gasPriceRatio
    : 0;

  const renderSelectedToken = () => {
    if (tokenOut && !isFrom) {
      return <SelectedToken isTokenIn={false} />;
    }
    if (!isFrom) {
      return <SelectedToken isDefault />;
    }

    return null;
  };

  return (
    <FlexBoxs
      direction="column"
      bg={bgBox || boxBg6}
      border={borderColor || borders}
      position="relative"
      h={[
        isDex ? "130px" : "105px",
        isDex ? "130px" : "105px",
        isDex ? "130px" : "115px",
      ]}
      borderRadius={isDex ? "12px" : "12px"}
      p="15px"
      mb={position === "in" ? "5px" : "0px"}
      mt={position === "out" ? "5px" : "0px"}
    >
      <BlockchainSelector
        showBlockchainSelector={showBlockchainSelector}
        setShowBlockchainSelector={setShowBlockchainSelector}
        isFrom={isFrom}
      />
      <Flex align="flex-start" justify="space-between" w="100%">
        {isFrom ? (
          <Flex align="center">
            <TextSmall
              mr="10px"
              color={fontSecondary || text40}
              whiteSpace="nowrap"
              fontWeight="500"
              mt="-2px"
            >
              Chain:
            </TextSmall>
            <BlockchainChanger
              setShowBlockchainSelector={setShowBlockchainSelector}
            />
          </Flex>
        ) : (
          <Flex align="center">
            <TextSmall
              mr="10px"
              fontWeight="500"
              color={fontSecondary || text40}
              mt="-2px"
            >
              Chain:
            </TextSmall>
            <BlockchainChanger
              setShowBlockchainSelector={setShowBlockchainSelector}
              selector={false}
            />
          </Flex>
        )}
        {tokenIn && tokenIn.balance !== null && isFrom && (
          <Flex
            align="flex-end"
            direction="column"
            ml="10px"
            wrap="wrap"
            justify="flex-end"
          >
            <Text
              color={fontSecondary || text40}
              fontSize="12px"
              fontWeight="400"
            >
              Balance: {getFormattedAmount(tokenIn?.balance)}
            </Text>
            <Flex>
              <Button
                onClick={() => {
                  pushData("Trade Interact", {
                    type: "Max Balance",
                  });
                  setAmount!(
                    tokenIn && "coin" in tokenIn
                      ? String(
                          Math.max(parseFloat(tokenIn.balance!) - gasCost, 0)
                        )
                      : tokenIn.balance!
                  );
                }}
                fontSize="12px"
                color={fontMain || text80}
                ml="10px"
                fontWeight="500"
              >
                MAX
              </Button>
              <InfoPopup
                info="Inputs your maximum holdings minus gas fees, which could go to 0 if you have a low balance."
                position={
                  "bottom" as PlacementWithLogical & ResponsiveValue<any>
                }
                noClose
                mb="5px"
              />
            </Flex>
          </Flex>
        )}
      </Flex>
      <Flex align="center" w="100%">
        {((buttonStatus !== "Loading best price..." || isFrom) &&
          !Number.isNaN(parseFloat(amount)) &&
          !Number.isNaN(getRightPrecision(amount))) ||
        amount === "" ? (
          <Input
            placeholder="0"
            ref={inputRef}
            type="number"
            lang="en"
            color={fontMain || text80}
            _placeholder={{ color: fontMain || text80 }}
            fontSize="16px"
            onChange={(e) => {
              if (
                (!Number.isNaN(parseFloat(e.target.value)) ||
                  e.target.value === "") &&
                isFrom
              ) {
                setAmount!(e.target.value);
              }
            }}
            value={
              typeof window !== "undefined" &&
              inputRef.current === document?.activeElement
                ? amount
                : getRightPrecision(amount)
            }
          />
        ) : (
          <Box w="100%">
            <Skeleton w="70px" h="22px" startColor={boxBg6} endColor={hover} />
          </Box>
        )}
        <Button
          onClick={() => {
            if (isFrom && select !== "tokenIn") setSelect("tokenIn");
            else if (isFrom) setSelect("");
            if (!isFrom && select !== "tokenOut") setSelect("tokenOut");
            else if (!isFrom) setSelect("");
          }}
        >
          {/* IN */}
          {tokenIn && isFrom ? (
            <SelectedToken isTokenIn />
          ) : (
            isFrom && <SelectedToken isDefault />
          )}
          {/* OUT */}
          {renderSelectedToken()}
        </Button>
      </Flex>
      {select && (
        <Select visible={!!select} setVisible={setSelect} position={position} />
      )}
    </FlexBoxs>
  );
};
