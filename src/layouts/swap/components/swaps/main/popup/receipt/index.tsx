import { CheckIcon, CopyIcon, ExternalLinkIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  Flex,
  Image,
  Link,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Skeleton,
  Spinner,
} from "@chakra-ui/react";
import { blockchainsIdContent } from "mobula-lite/lib/chains/constants";
import { useContext, useState } from "react";
import { useAccount, useNetwork } from "wagmi";
// eslint-disable-next-line import/no-cycle
import {
  getFormattedAmount,
  getFormattedDate,
  getFormattedHours,
} from "@utils/formaters";
import { TextLandingSmall, TextSmall } from "components/fonts";
import { NextChakraLink } from "components/link";
import { useColors } from "lib/chakra/colorMode";
import { SwapContext } from "../../../../..";
import { getAmountOut } from "../../../../../utils";
import { Lines } from "./lines";

export const TransactionReceipt = () => {
  const {
    tokenIn,
    tokenOut,
    amountOut,
    amountIn,
    completedTx,
    settings,
    handleButtonClick,
    isFeesLoading,
    buttonLoading,
    buttonStatus,
    showSummary,
    setShowSummary,
    setCompletedTx,
    txError,
    setTxError,
    slippageTokenIn,
    slippageTokenOut,
  } = useContext(SwapContext);
  const [hasCopied, setHasCopied] = useState(false);
  const { chain } = useNetwork();
  const { address } = useAccount();
  const { text10, borders, text80, boxBg3, boxBg6, text60 } = useColors();

  // Syntaxic sugar
  let finalGasUsed = 0;

  try {
    finalGasUsed =
      Number(
        ((completedTx.gasUsed || 0n) * completedTx.effectiveGasPrice) /
          1000000000n
      ) / 1e9;
  } catch (e) {
    // Silent error
  }

  return (
    <Modal
      isOpen={showSummary}
      onClose={() => {
        setShowSummary(false);
        setCompletedTx(undefined);
        setTxError(undefined);
      }}
    >
      <ModalOverlay />
      <ModalContent
        bg={boxBg3}
        boxShadow="none"
        borderRadius="16px"
        w={["90%", "90%", "100%"]}
        maxW="400px"
        border={borders}
      >
        <ModalHeader
          fontWeight="500"
          pb="0px"
          color={text80}
          fontSize={["16px", "16px", "18px", "20px"]}
        >
          {txError?.title ||
            (completedTx ? "Successful Transaction!" : "Transaction summary")}
        </ModalHeader>
        <ModalCloseButton color={text80} />
        <ModalBody p={["10px 20px 20px 20px", "15px 20px 20px 20px", "20px"]}>
          {txError && (
            <TextLandingSmall color={text80} mb="10px">
              {txError?.hint}
              <NextChakraLink
                ml="5px"
                href="https://discord.gg/2a8hqNzkzN"
                target="_blank"
                color={text80}
              >
                Help: Discord
              </NextChakraLink>
            </TextLandingSmall>
          )}{" "}
          {(!completedTx || !txError) && (
            <>
              <Flex
                borderRadius="8px"
                p="10px 15px"
                direction="column"
                bg={boxBg6}
                border={borders}
              >
                <Flex align="center">
                  <Skeleton
                    isLoaded={tokenIn !== null}
                    boxSize="34px"
                    mr="15px"
                    borderRadius="full"
                  >
                    <Image
                      src={tokenIn?.logo}
                      alt={`${tokenIn?.symbol} logo`}
                      boxSize="34px"
                      borderRadius="full"
                      fallbackSrc="/icon/unknown.png"
                    />
                  </Skeleton>
                  <Box>
                    <TextSmall color={text80}>
                      {completedTx ? "Spent" : "Spend"}
                    </TextSmall>
                    <Skeleton isLoaded={tokenIn !== null} h="fit-content">
                      <TextLandingSmall color={text80}>
                        {`${getFormattedAmount(amountIn)} ${tokenIn?.symbol}`}
                      </TextLandingSmall>
                    </Skeleton>
                  </Box>
                </Flex>
                <Flex my="10px" h="1px" w="100%" bg={text10} />
                <Flex align="center">
                  <Skeleton
                    isLoaded={tokenIn !== null}
                    boxSize="34px"
                    mr="15px"
                    borderRadius="full"
                  >
                    <Image
                      src={tokenOut?.logo}
                      alt={`${tokenOut?.symbol} logo`}
                      boxSize="34px"
                      borderRadius="full"
                      fallbackSrc="/icon/unknown.png"
                    />
                  </Skeleton>
                  <Box>
                    <TextSmall color={text80}>
                      {completedTx ? "Received" : "Receive"}
                    </TextSmall>
                    <Skeleton
                      borderRadius="full"
                      isLoaded={tokenIn !== null}
                      h="fit-content"
                    >
                      <TextLandingSmall color={text80}>
                        {`${
                          completedTx
                            ? getFormattedAmount(
                                getAmountOut(
                                  completedTx,
                                  address,
                                  "address" in tokenOut
                                    ? tokenOut.address
                                    : blockchainsIdContent[chain?.id || 1].eth
                                        .address,
                                  tokenOut?.decimals
                                )
                              )
                            : amountOut
                        } ${tokenOut?.symbol}`}
                      </TextLandingSmall>
                    </Skeleton>
                  </Box>
                </Flex>
              </Flex>

              <Lines title="Rate" mt="20px" borderBottom={borders}>
                <TextLandingSmall color={text80}>
                  {`1 ${tokenIn?.symbol} = ${
                    // Get the
                    getFormattedAmount(
                      (completedTx
                        ? getAmountOut(
                            completedTx,
                            address!,
                            "address" in tokenOut
                              ? tokenOut.address
                              : blockchainsIdContent[chain?.id || 1].eth
                                  .address,
                            tokenOut?.decimals
                          )
                        : parseFloat(amountOut)) / parseFloat(amountIn)
                    )
                  } ${tokenOut?.symbol}`}
                </TextLandingSmall>
              </Lines>
            </>
          )}
          {completedTx ? (
            <>
              {" "}
              <Lines title="Gas fee" mt="10px" borderBottom={borders}>
                <TextLandingSmall color={text80}>
                  {`${getFormattedAmount(finalGasUsed)} ${
                    blockchainsIdContent[chain?.id || 1].eth.symbol
                  }`}
                </TextLandingSmall>
              </Lines>
              <Lines title="Timestamp" mt="10px">
                <TextLandingSmall color={text80}>
                  {`${getFormattedDate(
                    new Date(completedTx.timestamp).getTime()
                  )} ${getFormattedHours(
                    new Date(completedTx.timestamp).getTime()
                  )}`}
                </TextLandingSmall>
              </Lines>
              <Lines title="Tx Hash" mt="0px" pb="0px">
                <Flex align="center">
                  <Button
                    onClick={() => {
                      navigator.clipboard.writeText(
                        completedTx.transactionHash
                      );
                      setHasCopied(true);
                    }}
                  >
                    {hasCopied ? (
                      <CheckIcon mr="5px" color="green" />
                    ) : (
                      <CopyIcon mr="5px" color={text60} />
                    )}
                  </Button>
                  <TextLandingSmall color={text80}>
                    {`${completedTx.transactionHash.slice(
                      0,
                      6
                    )}...${completedTx.transactionHash.slice(-4)}`}
                  </TextLandingSmall>
                  <Link
                    href={`${
                      blockchainsIdContent[chain?.id || 1].explorer
                    }/tx/${completedTx.transactionHash}`}
                    target="_blank"
                  >
                    <ExternalLinkIcon ml="5px" color={text60} />
                  </Link>
                </Flex>
              </Lines>
            </>
          ) : (
            <>
              <Lines
                title="Max Slippage"
                mt="10px"
                borderBottom={
                  slippageTokenIn + slippageTokenOut > 0.5 && { borders }
                }
              >
                <Flex align="center">
                  <TextLandingSmall color={text80}>
                    {settings.slippage}%
                  </TextLandingSmall>
                </Flex>
              </Lines>
              {slippageTokenIn > 0.25 && (
                <Lines title={`${tokenIn?.symbol} Fees`} mt="10px">
                  <Flex align="center">
                    <TextLandingSmall color={text80}>
                      {(slippageTokenIn - 0.25) / 1.1}%
                    </TextLandingSmall>
                  </Flex>
                </Lines>
              )}
              {slippageTokenOut > 0.25 && (
                <Lines title={`${tokenOut?.symbol} Fees`} mt="10px">
                  <Flex align="center">
                    <TextLandingSmall color={text80}>
                      {(slippageTokenOut - 0.25) / 1.1}%
                    </TextLandingSmall>
                  </Flex>
                </Lines>
              )}
              <Button
                mt="20px"
                color={text80}
                fontWeight="400"
                variant="outlined"
                h={["35px", "35px", "40px"]}
                fontSize={["12px", "12px", "14px"]}
                id={`trade-${buttonStatus.toLowerCase()}`}
                onClick={() => handleButtonClick()}
              >
                {(buttonLoading || isFeesLoading) && (
                  <Spinner width="15px" height="15px" mr={15} />
                )}{" "}
                {buttonStatus}
              </Button>
            </>
          )}
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
