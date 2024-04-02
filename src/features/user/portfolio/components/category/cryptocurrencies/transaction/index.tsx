import {
  blockchainsContent,
  blockchainsIdContent,
} from "mobula-lite/lib/chains/constants";
import { useTheme } from "next-themes";
import { usePathname } from "next/navigation";
import React, { useContext, useEffect, useMemo, useRef, useState } from "react";
import { AiFillSetting, AiOutlineSwap } from "react-icons/ai";
import { BsThreeDotsVertical, BsTrash3 } from "react-icons/bs";
import { FiExternalLink } from "react-icons/fi";
import { VscAdd, VscArrowUp } from "react-icons/vsc";
import { useAccount } from "wagmi";
import { SmallFont } from "../../../../../../../components/fonts";
import { Menu } from "../../../../../../../components/menu";
import { Skeleton } from "../../../../../../../components/skeleton";
import { Tooltip } from "../../../../../../../components/tooltip";
import { UserContext } from "../../../../../../../contexts/user";
import { explorerTransformer } from "../../../../../../../utils/chains";
import { GET } from "../../../../../../../utils/fetch";
import {
  addressSlicer,
  getFormattedAmount,
} from "../../../../../../../utils/formaters";
import { PortfolioV2Context } from "../../../../context-manager";
import { useWebSocketResp } from "../../../../hooks";
import { flexGreyBoxStyle, tdStyle } from "../../../../style";
import { getDate, getHours } from "../../../../utils";
import {
  PublicTransaction,
  TransactionAsset,
  TransactionResponse,
} from "../../activity/model";
import {
  famousContractsLabel,
  wordingFromMethodId,
} from "../../activity/utils";

interface ActivityProps {
  isSmallTable?: boolean;
  asset?: TransactionAsset;
}

export const Transaction = ({ isSmallTable = false, asset }: ActivityProps) => {
  const {
    setActivePortfolio,
    manager,
    isWalletExplorer,
    activePortfolio,
    isLoading,
    wallet,
  } = useContext(PortfolioV2Context);
  const [transactions, setTransactions] = useState<PublicTransaction[]>([]);
  const [activeTransaction, setActiveTransaction] = useState<string>();
  const { user } = useContext(UserContext);
  const refreshPortfolio = useWebSocketResp();
  const { address } = useAccount();
  const [isLoadingFetch, setIsLoadingFetch] = useState(true);

  const isMounted = useRef(false);
  const pathname = usePathname();
  const { theme } = useTheme();
  const isWhiteMode = theme === "light";

  const handleRemoveTransaction = (id: number) => {
    GET("/portfolio/removetx", {
      portfolio_id: activePortfolio?.id,
      tx_id: id,
      account: address as string,
    });
    setActivePortfolio((activePortfolioBuffer) => {
      const finalPortfolio = {
        ...activePortfolioBuffer,
        removed_transactions: [
          ...activePortfolioBuffer.removed_transactions,
          id,
        ],
      };
      refreshPortfolio(finalPortfolio);
      return finalPortfolio;
    });
  };

  const portfolioId = pathname.split("/")[3]
    ? pathname.split("/")[3].split("?")[0]
    : activePortfolio?.id;
  const wallets = isWalletExplorer
    ? [isWalletExplorer]
    : [...(activePortfolio?.wallets || [])] || [];

  const lowerCaseWallets = wallets.map((newWallet) => newWallet?.toLowerCase());

  //   const txsLimit = assetQuery ? 200 : 20;
  const txsLimit = 20;

  const fetchTransactions = (refresh = false) => {
    const txRequest: any = {
      cache: true,
      limit: txsLimit,
      offset: refresh ? 0 : transactions.length,
      wallets: lowerCaseWallets.join(","),
      portfolio_id: portfolioId,
      added_transactions: true,
      order: "desc",
    };

    if (isSmallTable) txRequest.only_assets = asset?.id;
    if (isWalletExplorer) delete txRequest.portfolio_id;

    GET(`/api/1/wallet/transactions`, txRequest)
      .then((r) => r.json())
      .then((r: TransactionResponse) => {
        if (r?.data) {
          const transactions =
            "transactions" in r.data ? r.data.transactions : r.data;
          setIsLoadingFetch(false);
          if (!refresh)
            setTransactions((oldTsx) => [...oldTsx, ...transactions]);
          else setTransactions(transactions);
        }
      });
  };

  useEffect(() => {
    if (isMounted.current || !transactions?.length) {
      fetchTransactions(true);
    } else isMounted.current = true;
  }, [asset, wallet?.id]);

  // We want to make sure we set the "light" token to be:
  // ETH is ETH vs Stable
  // Other is Other vs Stable or ETH
  const ethSymbols = useMemo(
    () =>
      Object.values(blockchainsIdContent)
        .filter((entry) => entry.eth)
        .map((entry) => entry.eth?.symbol),
    []
  );

  const getTypeFromSymbol = (symbol) => {
    if (symbol.includes("USD") || symbol.includes("DAI")) return "Stable";
    if (ethSymbols.includes(symbol)) return "ETH";
    return "Other";
  };

  const getRightOrder = (tokensToSort: TransactionAsset[]) => {
    // When token isn't fetched.
    if (!tokensToSort[1]) return tokensToSort;
    const token0Type = getTypeFromSymbol(tokensToSort[0].symbol);
    const token1Type = getTypeFromSymbol(tokensToSort[1].symbol);

    if (token0Type === "ETH" && token1Type === "Stable") return tokensToSort;
    if (token0Type === "Stable" && token1Type === "ETH")
      return tokensToSort.reverse();
    if (token0Type === "Other" && token1Type === "Stable") return tokensToSort;
    if (token0Type === "Stable" && token1Type === "Other")
      return tokensToSort.reverse();
    if (token0Type === "ETH" && token1Type === "Other")
      return tokensToSort.reverse();

    return tokensToSort;
  };

  const isOut = (newTsx: PublicTransaction) =>
    newTsx.is_out ||
    (newTsx.is_out == null && lowerCaseWallets.includes(newTsx.from));

  const isIn = (newTsx: PublicTransaction) =>
    lowerCaseWallets.includes(newTsx.to);

  const getTransactionInfos = (
    tx: PublicTransaction,
    txTokens?: TransactionAsset[]
  ) => {
    if (tx.type === "swap")
      return txTokens?.[0]?.id === tx?.in?.id
        ? { wording: "Buy", type: "swap", direction: "in" }
        : { wording: "Sell", type: "swap", direction: "out" };

    if (tx.amount) {
      const txOut = isOut(tx);
      const txIn = isIn(tx);

      if (txIn && txOut) return { wording: "Transfer", type: "internal" };

      const burn = tx.to === "0x0000000000000000000000000000000000000000";
      if (burn)
        return {
          wording: "Burn",
          type: "transfert",
          direction: "out",
        };

      const mint = tx.from === "0x0000000000000000000000000000000000000000";

      if (mint)
        return {
          wording: "Mint",
          type: "transfert",
          direction: "in",
        };

      return txOut
        ? { wording: "Send", type: "transfert", direction: "out" }
        : { wording: "Receive", type: "transfert", direction: "in" };
    }

    return (
      {
        wording: wordingFromMethodId[tx.method_id] || "Interaction",
        type: "execution",
      } || {
        wording: "Execute",
        type: "execution",
        direction: "out",
      }
    );
  };

  const groupTransactionsByDate = (txs: PublicTransaction[]) => {
    const groupedTxs: Record<string, PublicTransaction[]> = {};

    txs.forEach((transaction) => {
      const date = getDate(transaction.timestamp);
      if (!groupedTxs[date]) groupedTxs[date] = [];
      groupedTxs[date].push(transaction);
    });

    Object.entries(groupedTxs).forEach(([date, transactionsForDate]) => {
      const txsByHash: Record<
        string,
        { transaction: PublicTransaction; i: number }[]
      > = {};
      for (let i = 0; i < transactionsForDate.length; i += 1) {
        const transaction = transactionsForDate[i];
        if (!txsByHash[transaction.hash]) txsByHash[transaction.hash] = [];
        txsByHash[transaction.hash].push({ transaction, i });
      }

      const indexesToRemove: number[] = [];

      Object.values(txsByHash).forEach((txsFromHash) => {
        // Transfert or Swap (gas + tx token(s))
        if (txsFromHash.length > 1) {
          const transfers = txsFromHash.filter(
            (entry) => entry.transaction.amount
          );
          const {
            transaction: { tx_cost, tx_cost_usd },
            i,
          } = txsFromHash.find((entry) => entry.transaction.tx_cost) || {
            transaction: { tx_cost: "0", tx_cost_usd: 0 },
            i: null,
          };

          const handleNormalCase = () => {
            txsFromHash.forEach((transfer) => {
              groupedTxs[date][transfer.i] = {
                ...transfer.transaction,
                tx_cost,
                tx_cost_usd,
              };
            });

            if (i) indexesToRemove.push(i);
          };

          // Swap or multi-transfert
          const isSwap =
            txsFromHash.find(
              (entry) =>
                famousContractsLabel[entry.transaction.to]?.router ||
                famousContractsLabel[entry.transaction.from]?.router
            ) && transfers.length >= 1;

          if (isSwap) {
            const rankByAmountUsd = (a, b) =>
              a.transaction.amount_usd > b.transaction.amount_usd ? -1 : 1;

            const finalTx =
              txsFromHash
                .filter((entry) => entry.transaction.amount)
                .sort(rankByAmountUsd)?.[0]?.transaction ||
              txsFromHash[0].transaction;
            const isTxOut = isOut(finalTx);

            const otherTx = txsFromHash
              .filter(
                (entry) =>
                  entry.transaction.amount &&
                  isOut(entry.transaction) !== isTxOut
              )
              .sort(rankByAmountUsd)?.[0]?.transaction;

            if (!otherTx) return handleNormalCase();

            finalTx.type = "swap";

            finalTx.out = isTxOut
              ? {
                  ...finalTx.asset,
                  amount: finalTx.amount,
                  amount_usd: finalTx.amount_usd,
                }
              : {
                  ...otherTx.asset,
                  amount: otherTx.amount,
                  amount_usd: otherTx.amount_usd,
                };
            finalTx.in = isTxOut
              ? {
                  ...otherTx.asset,
                  amount: otherTx.amount,
                  amount_usd: otherTx.amount_usd,
                }
              : {
                  ...finalTx.asset,
                  amount: finalTx.amount,
                  amount_usd: finalTx.amount_usd,
                };

            for (let i = 0; i < txsFromHash.length; i += 1) {
              const internalActor = isTxOut ? finalTx.from : finalTx.to;
              const externalActor = isTxOut ? finalTx.to : finalTx.from;

              if (!famousContractsLabel[externalActor]) {
                const externalOtherActor =
                  txsFromHash[i].transaction.to === internalActor
                    ? txsFromHash[i].transaction.from
                    : txsFromHash[i].transaction.to;

                finalTx[isTxOut ? "to" : "from"] = externalOtherActor;
              }
            }

            groupedTxs[date][txsFromHash[0].i] = finalTx;

            indexesToRemove.push(
              ...txsFromHash.filter((_, i) => i !== 0).map((entry) => entry.i)
            );
          } else {
            handleNormalCase();
          }
        }
      });

      groupedTxs[date] = groupedTxs[date].filter(
        (tx, i) =>
          !indexesToRemove?.includes(i) &&
          (tx.amount || manager.show_interaction) &&
          !activePortfolio?.removed_transactions?.includes(tx.id)
      );
    });

    Object.keys(groupedTxs).forEach((date) => {
      if (groupedTxs[date].length === 0) delete groupedTxs[date];
    });

    return groupedTxs;
  };

  const transactionsByDate = useMemo(
    () => groupTransactionsByDate(transactions),
    [transactions]
  );

  const [showTxDetails, setShowTxDetails] = useState<string | null>(null);

  if (isLoadingFetch)
    return (
      <div className="flex flex-col w-full h-[190px]">
        {Array.from({ length: 4 }).map((_, i) => (
          <>
            <div className="flex items-center mb-2 w-full">
              <div className="h-[1px] w-full bg-light-font-10 dark:bg-dark-font-10" />
              <Skeleton extraCss="h-[12px] w-[70px] mx-2 rounded" />
              <div className="h-[1px] w-full bg-light-font-10 dark:bg-dark-font-10" />
            </div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center w-full">
                <div className="flex flex-col">
                  <div className="flex bg-light-bg-hover dark:bg-dark-bg-hover rounded-full z-[1] -mb-2.5 w-fit h-fit">
                    <Skeleton extraCss="w-[20px] h-[20px] min-w-[20px] min-h-[20px] rounded-full" />
                  </div>
                  <div className="flex bg-dark-font-20 dark:bg-light-font-20 rounded-full z-[0] ml-2.5">
                    <Skeleton extraCss="w-[20px] h-[20px] min-w-[20px] min-h-[20px] rounded-full" />
                  </div>
                </div>
                <div className="flex flex-col mx-2.5 flex-wrap w-full">
                  <Skeleton extraCss="w-[100px] h-[13px] rounded" />
                  <Skeleton extraCss="w-[40px] h-[13px] rounded-md mt-1" />
                </div>
              </div>
              <div className="flex items-center justify-end">
                <div className="flex items-center">
                  <Skeleton extraCss="w-[18px] h-[18px] min-w-[18px] min-h-[18px] rounded-full" />
                </div>
                <Skeleton extraCss="ml-2 h-[18px] w-[3px]" />
              </div>
            </div>
          </>
        ))}
      </div>
    );
  return (
    <div className="relative flex flex-col">
      {transactions?.length > 0 &&
      Object.entries(transactionsByDate)?.length > 0 ? (
        <>
          {Object.entries(transactionsByDate).map(
            ([date, transactionsForDate]: [string, PublicTransaction[]]) => (
              <>
                <div className="flex items-center ">
                  <div className="h-[1px] w-full bg-light-font-10 dark:bg-dark-font-10" />
                  <SmallFont extraCss="px-2.5 text-[11px] md:text-[11px] text-light-font-40 dark:text-dark-font-40">
                    {date}
                  </SmallFont>
                  <div className="h-[1px] w-full bg-light-font-10 dark:bg-dark-font-10" />
                </div>
                {transactionsForDate.map((transaction) => {
                  // We check if we're in a swap where we need 2 tokens, or a simple transaction.
                  let txTokens =
                    transaction.type === "swap"
                      ? [transaction.in, transaction.out]
                      : [transaction.asset];

                  if (txTokens.length > 1) txTokens = getRightOrder(txTokens);

                  if (
                    activePortfolio?.removed_transactions?.includes(
                      transaction.id
                    )
                  )
                    return null;

                  const isActive =
                    activeTransaction === transaction.hash + transaction.id;

                  const transactionInfos = getTransactionInfos(
                    transaction,
                    txTokens
                  );

                  const isTransactionOut = isOut(transaction);
                  const externalActor = !isTransactionOut
                    ? transaction.from
                    : transaction.to;
                  const internalActor = !isTransactionOut
                    ? transaction.to
                    : transaction.from;

                  let tokenAmount = transaction.amount;
                  let tokenUsdAmount = transaction.amount_usd;

                  if (transaction.type === "swap") {
                    tokenAmount =
                      txTokens?.[0]?.id === transaction?.in?.id
                        ? transaction?.in?.amount
                        : transaction?.out?.amount;

                    tokenUsdAmount =
                      txTokens?.[0]?.id === transaction?.in?.id
                        ? transaction?.in?.amount_usd
                        : transaction?.out?.amount_usd;
                  }

                  return (
                    <>
                      <div
                        className={`${
                          showTxDetails === transaction.hash
                            ? "h-[90px]"
                            : "h-[28px]"
                        } transition-all duration-800 my-2`}
                      >
                        <div className="flex items-center justify-between ">
                          <div
                            className="flex items-center w-full"
                            onClick={() => {
                              if (transaction.hash === showTxDetails)
                                setShowTxDetails(null);
                              else setShowTxDetails(transaction.hash);
                            }}
                          >
                            <div className="flex flex-col">
                              <div className="flex bg-light-bg-hover dark:bg-dark-bg-hover rounded-full z-[1] -mb-2.5 w-fit h-fit">
                                <img
                                  className={`border border-light-border-primary dark:border-dark-border-primary w-[20px] h-[20px] min-w-[20px] min-h-[20px]
                                 rounded-full`}
                                  src={txTokens[0]?.logo}
                                  alt={`${txTokens[0]?.name} logo`}
                                />
                              </div>
                              <div className="flex bg-dark-font-20 dark:bg-light-font-20 rounded-full z-[0] ml-2.5">
                                {txTokens[1] ? (
                                  <img
                                    src={txTokens[1]?.logo}
                                    className={`border border-light-font-10 dark:border-dark-font-10 w-[20px]
                                   h-[20px] min-w-[20px] min-h-[20px] rounded-full`}
                                    alt={`${txTokens[1]?.name} logo`}
                                  />
                                ) : (
                                  <>
                                    {transactionInfos.type === "transfert" ? (
                                      <div
                                        className={` w-[18px] h-[18px] min-w-[18px] min-h-[18px]" ${
                                          transactionInfos.wording === "Receive"
                                            ? "bg-green dark:bg-green"
                                            : "bg-red dark:bg-red"
                                        } flex justify-center items-center rounded-full`}
                                      >
                                        {transactionInfos.wording ===
                                        "Receive" ? (
                                          <VscAdd className="text-sm" />
                                        ) : (
                                          <VscArrowUp className="text-sm" />
                                        )}
                                      </div>
                                    ) : (
                                      <div
                                        className={`w-[18px] h-[18px] min-w-[18px] min-h-[18px] flex items-center justify-center`}
                                      >
                                        {transactionInfos.type ===
                                        "internal" ? (
                                          <AiOutlineSwap className="text-2xl rounded-full" />
                                        ) : (
                                          <AiFillSetting className="text-2xl rounded-full" />
                                        )}
                                      </div>
                                    )}{" "}
                                  </>
                                )}
                              </div>
                            </div>
                            <div className="flex flex-col mx-2.5 flex-wrap w-full">
                              {transactionInfos.type === "execution" ? (
                                <SmallFont
                                  extraCss={`break-all whitespace-pre-wrap text-start text-[13px] md:text-[13px] font-medium`}
                                >
                                  {transactionInfos.wording}
                                </SmallFont>
                              ) : (
                                <div className="flex justify-start">
                                  <SmallFont
                                    extraCss={`break-all whitespace-pre-wrap text-xs font-medium text-start`}
                                  >
                                    {`${transactionInfos.wording} ${
                                      txTokens[0]?.symbol
                                    }${
                                      tokenUsdAmount
                                        ? ` at $${getFormattedAmount(
                                            tokenUsdAmount / tokenAmount,
                                            2
                                          )}`
                                        : ""
                                    }`}
                                  </SmallFont>
                                  {transactionInfos.type === "internal" ? (
                                    <Tooltip
                                      tooltipText="Transaction involving multiple wallets from this portfolio."
                                      iconCss="mb-0.5"
                                      extraCss="top-[20px] left-1/2 -translate-x-1/2"
                                    />
                                  ) : null}
                                </div>
                              )}
                              <SmallFont extraCss="text-light-font-60 dark:text-dark-font-60 text-xs text-start">
                                {` ${getHours(transaction.timestamp)}`}
                              </SmallFont>
                            </div>
                          </div>
                          <div className="flex items-center justify-end">
                            <div className="flex items-center">
                              <img
                                className="bg-light-bg-hover dark:bg-dark-bg-hover w-[18px] h-[18px] min-w-[18px] 
                            border-2 border-light-border-primary dark:border-dark-border-primary rounded-full"
                                src={
                                  blockchainsContent[
                                    String(transaction.blockchain)
                                  ]?.logo || "/empty/unknown.png"
                                }
                                alt={`${
                                  blockchainsContent[
                                    String(transaction.blockchain)
                                  ]?.name
                                } logo`}
                              />
                            </div>
                            {(transaction.blockchain ||
                              (!isWalletExplorer &&
                                activePortfolio?.user === user?.id)) && (
                              <Menu
                                title={
                                  <BsThreeDotsVertical className="text-light-font-100 dark:text-dark-font-100" />
                                }
                                titleCss="ml-2"
                              >
                                {transaction.blockchain ? (
                                  <div
                                    className="flex items-center text-sm text-[13px] md:text-xs bg-light-bg-terciary dark:bg-dark-bg-terciary"
                                    onClick={() =>
                                      window.open(
                                        explorerTransformer(
                                          blockchainsContent[
                                            String(transaction.blockchain)
                                          ]?.name,
                                          transaction.hash,
                                          "tx"
                                        )
                                      )
                                    }
                                  >
                                    <div
                                      className={`${flexGreyBoxStyle} bg-light-bg-hover dark:bg-dark-bg-hover`}
                                    >
                                      <img
                                        className="w-[15px] h-[15px] min-w-[15px]"
                                        src={
                                          blockchainsContent[
                                            String(transaction.blockchain)
                                          ]?.logo
                                        }
                                        alt={`${
                                          blockchainsContent[
                                            String(transaction.blockchain)
                                          ]?.name
                                        } logo`}
                                      />
                                    </div>
                                    <div className="flex items-center whitespace-nowrap text-light-font-100 dark:text-dark-font-100">
                                      Open explorer
                                      <FiExternalLink className="ml-[7.5px] text-light-font-40 dark:text-dark-font-40" />
                                    </div>
                                  </div>
                                ) : null}
                                {!isWalletExplorer &&
                                  activePortfolio?.user === user?.id &&
                                  transaction.id && (
                                    <div
                                      className={`flex items-center text-sm text-[13px] md:text-xs
                                       bg-light-bg-terciary dark:bg-dark-bg-terciary whitespace-nowrap 
                                       ${
                                         transaction.blockchain ? "mt-2.5" : ""
                                       } text-light-font-100 dark:text-dark-font-100`}
                                      onClick={() => {
                                        handleRemoveTransaction(transaction.id);
                                      }}
                                    >
                                      <div
                                        className={`${flexGreyBoxStyle} flex bg-red dark:bg-red`}
                                      >
                                        <BsTrash3 className="text-light-font-100 dark:text-dark-font-100" />
                                      </div>
                                      Delete transaction
                                    </div>
                                  )}
                              </Menu>
                            )}
                          </div>
                        </div>
                        {showTxDetails === transaction?.hash ? (
                          <div
                            className={`${tdStyle} flex items-center w-full`}
                            onClick={() => {
                              setActiveTransaction(
                                isActive
                                  ? ""
                                  : transaction.hash + transaction.id
                              );
                            }}
                          >
                            {transaction.is_added ? (
                              <SmallFont extraCss="text-light-font-60 dark:text-dark-font-60 whitespace-nowrap font-normal text-[13px]">
                                Transaction added manually, no meta-data.
                              </SmallFont>
                            ) : (
                              <>
                                <div className="flex flex-col items-start">
                                  <SmallFont extraCss="text-light-font-40 dark:text-dark-font-40 font-normal text-xs md:text-xs">
                                    Fee
                                  </SmallFont>
                                  <SmallFont extraCss="font-normal text-xs md:text-xs">
                                    $
                                    {getFormattedAmount(
                                      transaction.tx_cost_usd
                                    )}
                                  </SmallFont>
                                </div>
                                <div className="flex flex-col ml-[3%] md:hidden">
                                  <SmallFont extraCss="text-light-font-40 dark:text-dark-font-40 font-normal text-xs md:text-xs">
                                    Transaction Hash
                                  </SmallFont>
                                  <div className="flex items-center">
                                    <SmallFont extraCss="font-normal text-xs md:text-xs">
                                      {addressSlicer(transaction.hash)}
                                    </SmallFont>
                                    <FiExternalLink
                                      className="text-light-font-40 dark:text-dark-font-40 ml-[5px] text-xs md:text-xs"
                                      onClick={() =>
                                        window.open(
                                          explorerTransformer(
                                            blockchainsContent[
                                              String(transaction.blockchain)
                                            ]?.name,
                                            transaction.hash,
                                            "tx"
                                          )
                                        )
                                      }
                                    />
                                  </div>
                                </div>
                                <div className="flex flex-col ml-[3%] items-start">
                                  <SmallFont extraCss="text-light-font-40 dark:text-dark-font-40 font-normal text-xs md:text-xs">
                                    Wallet
                                  </SmallFont>
                                  <SmallFont extraCss="font-normal text-xs md:text-xs">
                                    {addressSlicer(internalActor)}
                                  </SmallFont>
                                </div>
                                <div className="hidden md:flex flex-col ml-[3%]">
                                  <SmallFont extraCss="text-light-font-40 dark:text-dark-font-40 font-normal text-xs md:text-xs">
                                    Actor
                                  </SmallFont>
                                  <SmallFont extraCss="font-normal text-xs md:text-xs">
                                    {famousContractsLabel[externalActor]
                                      ?.name || addressSlicer(externalActor)}
                                  </SmallFont>
                                </div>
                                <div className="items-center hidden md:flex ml-auto">
                                  <FiExternalLink
                                    className="text-light-font-40 dark:text-dark-font-40 ml-[5px] text-base"
                                    onClick={() =>
                                      window.open(
                                        explorerTransformer(
                                          blockchainsContent[
                                            String(transaction.blockchain)
                                          ]?.name,
                                          transaction.hash,
                                          "tx"
                                        )
                                      )
                                    }
                                  />
                                  {transaction.id &&
                                  activePortfolio?.user === user?.id ? (
                                    <BsTrash3
                                      className="ml-2.5 text-light-font-100 dark:text-dark-font-100 text-sm"
                                      onClick={() =>
                                        handleRemoveTransaction(transaction.id)
                                      }
                                    />
                                  ) : null}
                                </div>
                              </>
                            )}
                          </div>
                        ) : null}
                      </div>
                    </>
                  );
                })}
              </>
            )
          )}
        </>
      ) : null}
      {/* {(isLoading && transactions?.length === 0) ||
      (transactions.length === 0 && !isSmallTable) ? (
        <tbody>
          {" "}
          {Array.from(Array(10).keys()).map((_, i) => (
            <TbodySkeleton key={i} isActivity />
          ))}{" "}
        </tbody>
      ) : null}
      {isSmallTable && isLoading ? (
        <Spinner extraCss="h-[25px] w-[25px]" />
      ) : null}
      {transactions.length !== 0 &&
      Object.keys(transactionsByDate).length === 0 ? (
        <div className="flex h-[300px] w-full items-center justify-center flex-col mx-auto">
          <img
            className="h-[100px] -mb-5 mt-[25px]"
            src={
              isWhiteMode
                ? "/asset/empty-bracket-light.png"
                : "/asset/empty-bracket.png"
            }
            alt="empty bracket image"
          />
          <div className="flex max-w-[80%] flex-col items-center justify-center mb-5 mt-[40px]">
            <MediumFont extraCss="mb-[5px] text-center text-light-font-40 dark:text-dark-font-40">
              No Transactions
            </MediumFont>
            <button onClick={() => fetchTransactions()}>
              <SmallFont>Load More</SmallFont>
            </button>
          </div>
        </div>
      ) : null} */}
      {/* {!wallet && !isLoading ? (
        <div className="flex h-[300px] w-full items-center justify-center flex-col rounded-r border border-light-border-primary dark:border-dark-border-primary bg-light-bg-terciary dark:bg-dark-bg-terciary">
          <img
            className="h-[160px] -mb-[50px] mt-[25px]"
            src={isWhiteMode ? "/asset/empty-light.png" : "/asset/empty.png"}
            alt="empty state image"
          />
          <div className="flex max-w-[80%] flex-col items-center justify-center m-auto mt-[40px]">
            <MediumFont extraCss="mb-[5px] text-center text-light-font-40 dark:text-dark-font-40">
              No transactions found{" "}
            </MediumFont>
          </div>
        </div>
      ) : null} */}
    </div>
  );
};
