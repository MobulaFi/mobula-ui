import {ChevronDownIcon} from "@chakra-ui/icons";
import {Button, Flex, Image, Input} from "@chakra-ui/react";
import React, {Dispatch, SetStateAction, useContext} from "react";
import {SwapContext} from "../../..";
import {getRightPrecision} from "../../../../../../../utils/helpers/formaters";
import {TextSmall} from "../../../../../../UI/Text";
import {useColors} from "../../../../../utils/color-mode";

export const TokenContainer = ({
  setSelectVisible,
  inputRef,
  position,
}: {
  position: "in" | "out";
  setSelectVisible?: Dispatch<SetStateAction<boolean>>;
  inputRef?: React.MutableRefObject<HTMLInputElement>;
}) => {
  const {tokenIn, tokenOut, setAmountIn, amountIn, amountOut} =
    useContext(SwapContext);
  const {borders, boxBg3, boxBg6, text80} = useColors();
  const token = position === "in" ? tokenIn : tokenOut;
  const amount = position === "in" ? amountIn : amountOut;
  const setAmount = position === "in" ? setAmountIn : undefined;

  return (
    <Flex
      justify="space-between"
      bg={boxBg3}
      borderRadius="8px"
      border={borders}
      p="5px"
      mt={position === "out" ? "10px" : "0px"}
    >
      <Flex w="100%">
        <Flex
          bg={boxBg6}
          h="30px"
          justify="center"
          align="center"
          px="7.5px"
          borderRadius="8px"
        >
          <Image src={token?.logo} boxSize="21px" borderRadius="full" />
          <TextSmall ml="7.5px">{token?.symbol}</TextSmall>
        </Flex>
        {position === "out" ? null : (
          <Button ml="5px" onClick={() => setSelectVisible(true)}>
            <ChevronDownIcon fontSize="20px" color={text80} />
          </Button>
        )}
      </Flex>
      <Flex>
        <Input
          type="number"
          lang="en"
          color={text80}
          _placeholder={{color: text80}}
          border="none"
          placeholder="0.0"
          fontSize="16px"
          textAlign="end"
          pr="5px"
          my="auto"
          ref={inputRef}
          onChange={e => {
            if (!setAmount) return;

            if (
              !Number.isNaN(parseFloat(e.target.value)) ||
              e.target.value === ""
            ) {
              setAmount(e.target.value);
            }
          }}
          value={
            (typeof window !== "undefined" &&
              inputRef?.current === document?.activeElement) ||
            amount === ""
              ? amount
              : getRightPrecision(amount)
          }
        />
      </Flex>
    </Flex>
  );
};
