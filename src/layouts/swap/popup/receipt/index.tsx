import { explorerTransformer } from "@utils/chains";
import { Button } from "components/button";
import { Skeleton } from "components/skeleton";
import { Spinner } from "components/spinner";
import { blockchainsIdContent } from "mobula-lite/lib/chains/constants";
import { useContext, useEffect, useState } from "react";
import { BiCopy } from "react-icons/bi";
import { BsCheckLg } from "react-icons/bs";
import { FiExternalLink } from "react-icons/fi";
import { useAccount, useNetwork } from "wagmi";
import { SwapContext } from "../..";
import { MediumFont, SmallFont } from "../../../../components/fonts";
import { NextChakraLink } from "../../../../components/link";
import { Modal } from "../../../../components/modal-container";
import { triggerAlert } from "../../../../lib/toastify";
import {
  getFormattedAmount,
  getFormattedDate,
  getFormattedHours,
} from "../../../../utils/formaters";
import { famousContractsLabelFromName, getAmountOut } from "../../utils";
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
    quotes,
    manualQuote,
  } = useContext(SwapContext);
  const [hasCopied, setHasCopied] = useState(false);
  const { chain } = useNetwork();
  const { address } = useAccount();

  // Syntaxic sugar
  let finalGasUsed = 0;

  try {
    finalGasUsed =
      Number(
        ((completedTx?.gasUsed || 0n) * completedTx.effectiveGasPrice) /
          1000000000n
      ) / 1e9;
  } catch (e) {
    // Silent error
  }

  useEffect(() => {
    if (txError) triggerAlert("Error", txError.title);
  }, [txError]);

  return (
    <Modal
      extraCss="max-w-[400px]"
      title={
        txError?.title ||
        (completedTx ? "Successful Transaction!" : "Transaction summary")
      }
      titleCss="mb-4"
      isOpen={showSummary}
      onClose={() => {
        setShowSummary(false);
        setCompletedTx(undefined);
        setTxError(undefined);
      }}
    >
      {(!completedTx || !txError) && (
        <>
          <div
            className="rounded-md py-2.5 px-[15px] flex-col bg-light-bg-terciary
           dark:bg-dark-bg-terciary border border-light-border-primary
            dark:border-dark-border-primary"
          >
            <div className="flex items-center">
              {tokenIn === null ? (
                <Skeleton extraCss="w-[34px] h-[34px] mr-[15px] rounded-full" />
              ) : (
                <img
                  className="rounded-full mr-3 w-[34px] h-[34px]"
                  src={tokenIn?.logo || tokenIn?.image || "/empty/unknown.png"}
                  alt={`${tokenIn?.symbol} logo`}
                />
              )}

              <div>
                <SmallFont extraCss="text-light-font-60 dark:text-dark-font-60">
                  {completedTx ? "Spent" : "Spend"}
                </SmallFont>
                {tokenIn === null ? (
                  <Skeleton extraCss="h-4 lg:h-[15px] md:h-3.5 w-[60px]" />
                ) : (
                  <MediumFont>
                    {`${getFormattedAmount(amountIn)} ${tokenIn?.symbol}`}
                  </MediumFont>
                )}
              </div>
            </div>
            <div className="my-2.5 h-[1px] w-full bg-light-border-primary dark:bg-dark-border-primary" />
            <div className="flex items-center">
              {tokenIn === null ? (
                <Skeleton extraCss="w-[34px] h-[34px] mr-[15px] rounded-full" />
              ) : (
                <img
                  className="rounded-full mr-3 w-[34px] h-[34px]"
                  src={
                    tokenOut?.logo || tokenOut?.image || "/empty/unknown.png"
                  }
                  alt={`${tokenOut?.symbol} logo`}
                />
              )}
              <div>
                <SmallFont extraCss="text-light-font-60 dark:text-dark-font-60">
                  {completedTx ? "Received" : "Receive"}
                </SmallFont>
                {tokenIn === null ? (
                  <Skeleton extraCss="h-4 lg:h-[15px] md:h-3.5 w-[60px] rounded-full" />
                ) : (
                  <MediumFont>
                    {`${
                      completedTx
                        ? getFormattedAmount(
                            getAmountOut(
                              completedTx,
                              address as string,
                              tokenOut && "address" in tokenOut
                                ? tokenOut.address ||
                                    blockchainsIdContent[String(chain?.id || 1)]
                                      .eth?.address
                                : blockchainsIdContent[String(chain?.id || 1)]
                                    .eth?.address,
                              tokenOut?.decimals
                            )
                          )
                        : amountOut
                    } ${tokenOut?.symbol}`}
                  </MediumFont>
                )}
              </div>
            </div>
            <div className="my-2.5 h-[1px] w-full bg-light-border-primary dark:bg-dark-border-primary" />
            {quotes?.length > 0 ? (
              <div className="flex items-center">
                <div className="flex items-center">
                  <img
                    className="rounded-full mr-3 w-[34px] h-[34px]"
                    src={
                      famousContractsLabelFromName[
                        (manualQuote || quotes?.[0])?.protocol
                      ]?.logo
                    }
                  />
                  <div>
                    <SmallFont extraCss="text-light-font-60 dark:text-dark-font-60">
                      Router
                    </SmallFont>
                    {tokenIn === null ? (
                      <Skeleton extraCss="h-4 lg:h-[15px] md:h-3.5 w-[60px] rounded-full" />
                    ) : (
                      <MediumFont>
                        {(manualQuote || quotes?.[0])?.protocol}
                      </MediumFont>
                    )}
                  </div>
                </div>
              </div>
            ) : null}
          </div>

          <Lines
            title="Rate"
            extraCss="mt-5 border-b border-light-border-primary dark:border-dark-border-primary"
          >
            <SmallFont>
              {`1 ${tokenIn?.symbol} = ${
                // Get the
                getFormattedAmount(
                  (completedTx
                    ? getAmountOut(
                        completedTx,
                        address!,
                        tokenOut && "address" in tokenOut
                          ? tokenOut.address ||
                              blockchainsIdContent[String(chain?.id || 1)].eth
                                .address
                          : blockchainsIdContent[String(chain?.id || 1)].eth
                              .address,
                        tokenOut?.decimals
                      )
                    : parseFloat(amountOut)) / parseFloat(amountIn)
                )
              } ${tokenOut?.symbol}`}
            </SmallFont>
          </Lines>
        </>
      )}
      {completedTx ? (
        <>
          <Lines
            title="Gas fee"
            extraCss="mt-2.5 border-b border-light-border-primary dark:border-dark-border-primary"
          >
            <SmallFont>
              {`${getFormattedAmount(finalGasUsed)} ${
                blockchainsIdContent[String(chain?.id || 1)].eth?.symbol
              }`}
            </SmallFont>
          </Lines>
          <Lines
            title="Timestamp"
            extraCss="mt-2.5 border-b border-light-border-primary dark:border-dark-border-primary"
          >
            <SmallFont>
              {`${getFormattedDate(
                new Date(completedTx.timestamp).getTime()
              )} ${getFormattedHours(
                new Date(completedTx.timestamp).getTime()
              )}`}
            </SmallFont>
          </Lines>
          <Lines title="Tx Hash" extraCss="mt-2.5 pb-0">
            <div className="flex items-center">
              <button
                onClick={() => {
                  navigator.clipboard.writeText(completedTx.transactionHash);
                  setHasCopied(true);
                }}
              >
                {hasCopied ? (
                  <BsCheckLg className="text-green dark:text-green mr-[5px]" />
                ) : (
                  <BiCopy className="text-light-font-60 dark:text-dark-font-60 mr-[5px]" />
                )}
              </button>
              <SmallFont>
                {`${completedTx.transactionHash.slice(
                  0,
                  6
                )}...${completedTx.transactionHash.slice(-4)}`}
              </SmallFont>
              <NextChakraLink
                href={explorerTransformer(
                  blockchainsIdContent[String(chain?.id || 1)]?.name,
                  completedTx.hash,
                  "tx"
                )}
                target="_blank"
              >
                <FiExternalLink className="text-light-font-60 dark:text-dark-font-60 ml-[5px]" />
              </NextChakraLink>
            </div>
          </Lines>
        </>
      ) : (
        <>
          <Lines
            title="Max Slippage"
            extraCss={`${
              slippageTokenIn + slippageTokenOut > 0.5
                ? "border-b border-light-border-primary dark:border-dark-border-primary"
                : ""
            } mt-2.5`}
          >
            <div className="flex items-center">
              <SmallFont>{settings.slippage}%</SmallFont>
            </div>
          </Lines>
          {slippageTokenIn > 0.25 && (
            <Lines title={`${tokenIn?.symbol} Fees`} mt="10px">
              <div className="flex items-center">
                <SmallFont>{(slippageTokenIn - 0.25) / 1.1}%</SmallFont>
              </div>
            </Lines>
          )}
          {slippageTokenOut > 0.25 && (
            <Lines title={`${tokenOut?.symbol} Fees`} mt="10px">
              <div className="flex items-center">
                <SmallFont>{(slippageTokenOut - 0.25) / 1.1}%</SmallFont>
              </div>
            </Lines>
          )}
          <Button
            extraCss="flex items-center justify-center mt-2.5 text-light-font-100 dark:text-dark-font-100 h-[40px]
           md:h-[35px] border-darkblue dark:border-darkblue hover:border-blue
            hover:dark:border-blue w-full"
            id={`trade-${buttonStatus.toLowerCase()}`}
            onClick={() => handleButtonClick()}
          >
            {(buttonLoading || isFeesLoading) && (
              <Spinner extraCss="mr-[15px] w-[15px] h-[15px]" />
            )}
            {buttonStatus}
          </Button>
        </>
      )}
    </Modal>
  );
};
