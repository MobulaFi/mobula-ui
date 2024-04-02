import {
  blockchainsContent,
  blockchainsIdContent,
} from "mobula-lite/lib/chains/constants";
import { useTheme } from "next-themes";
import { useParams, usePathname } from "next/navigation";
import React, { useContext, useEffect, useMemo, useRef, useState } from "react";
import { AiFillSetting, AiOutlineSwap } from "react-icons/ai";
import { BsThreeDotsVertical, BsTrash3 } from "react-icons/bs";
import { FiExternalLink } from "react-icons/fi";
import { VscAdd, VscArrowUp } from "react-icons/vsc";
import { isAddress } from "viem";
import { useAccount } from "wagmi";
import { MediumFont, SmallFont } from "../../../../../../components/fonts";
import { Menu } from "../../../../../../components/menu";
import { Spinner } from "../../../../../../components/spinner";
import { Tooltip } from "../../../../../../components/tooltip";
import { UserContext } from "../../../../../../contexts/user";
import { explorerTransformer } from "../../../../../../utils/chains";
import { GET } from "../../../../../../utils/fetch";
import {
  addressSlicer,
  getFormattedAmount,
} from "../../../../../../utils/formaters";
import { PortfolioV2Context } from "../../../context-manager";
import { useWebSocketResp } from "../../../hooks";
import { flexGreyBoxStyle, tdStyle, thStyle } from "../../../style";
import { getDate, getHours } from "../../../utils";
import { Privacy } from "../../ui/privacy";
import { TbodySkeleton } from "../../ui/tbody-skeleton";
import {
  PublicTransaction,
  TransactionAsset,
  TransactionResponse,
} from "./model";
import { TransactionAmount } from "./transaction-amount";
import { famousContractsLabel, wordingFromMethodId } from "./utils";

interface ActivityProps {
  isSmallTable?: boolean;
  setIsLoadingFetch?: (isLoading: boolean) => void;
}

export const Activity = ({
  isSmallTable = false,
  setIsLoadingFetch,
}: ActivityProps) => {
  const {
    setActivePortfolio,
    manager,
    activePortfolio,
    isLoading,
    wallet,
    transactions,
    asset,
    setTransactions,
    prevPath,
    setPrevPath,
  } = useContext(PortfolioV2Context);
  const [activeTransaction, setActiveTransaction] = useState<string>();
  const { user } = useContext(UserContext);
  const refreshPortfolio = useWebSocketResp();
  const { address } = useAccount();
  const [actualTxAmount, setActualTxAmount] = useState(25);
  const [isTxLoading, setIsTxLoading] = useState(true);
  const isMounted = useRef(false);
  const params = useParams();
  const explorerAddress = params.address;
  const assetQuery = params.asset;
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
  const wallets = explorerAddress
    ? [explorerAddress]
    : [...(activePortfolio?.wallets || [])] || [];

  const lowerCaseWallets = wallets.map((newWallet) => {
    if (isAddress(newWallet as string))
      return (newWallet as string)?.toLowerCase();
    return newWallet;
  });

  const fetchTransactions = (refresh = false) => {
    if (actualTxAmount > 25) setIsTxLoading(true);
    const txsLimit = assetQuery ? 200 : actualTxAmount;
    const txRequest: any = {
      limit: txsLimit,
      offset: refresh ? 0 : transactions.length,
      wallets: lowerCaseWallets.join(","),
      portfolio_id: portfolioId,
      added_transactions: true,
      cache: true,
      order: "desc",
    };

    if (isSmallTable) txRequest.only_assets = asset?.id;
    if (explorerAddress) delete txRequest.portfolio_id;

    GET(`/api/1/wallet/transactions`, txRequest)
      .then((r) => r.json())
      .then((r: TransactionResponse) => {
        if (r?.data) {
          const transactions =
            "transactions" in r.data ? r.data.transactions : r.data;
          if (setIsLoadingFetch) setIsLoadingFetch(false);
          if (!refresh) {
            try {
              setTransactions((oldTsx) => [...oldTsx, ...transactions]);
            } catch (e) {
              console.log(e);
            }
          } else setTransactions(transactions || []);
          setIsTxLoading(false);
        }
        if (setIsLoadingFetch) setIsLoadingFetch(false);
        setIsTxLoading(false);
      });
  };

  useEffect(() => {
    setPrevPath(pathname);
    if (isMounted.current || !transactions?.length) {
      if (assetQuery && !asset) return;
      if (pathname === prevPath) return;
      setTransactions([]);
      fetchTransactions(true);
    } else isMounted.current = true;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [asset?.id, wallet?.id, actualTxAmount, pathname]);

  useEffect(() => {
    if (assetQuery && !asset) return;
    if (transactions.length !== actualTxAmount && actualTxAmount !== 25)
      fetchTransactions(true);
  }, [actualTxAmount, pathname]);

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

  return (
    <>
      <table className="relative pb-[100px] md:pb-5 overflow-x-scroll scroll w-full caption-bottom">
        {isSmallTable ? null : (
          <thead className="table-header-group md:hidden">
            <tr>
              <th
                className={`${thStyle} border-b border-light-border-primary dark:border-dark-border-primary table-cell md:hidden text-start`}
              >
                Type
              </th>
              <th
                className={`${thStyle} border-b border-light-border-primary dark:border-dark-border-primary text-start`}
              >
                Amount
              </th>
              {isSmallTable ? null : (
                <th
                  className={`${thStyle} border-b border-light-border-primary dark:border-dark-border-primary table-cell md:hidden text-end`}
                >
                  Actor
                </th>
              )}
              <th
                className={`${thStyle} border-b border-light-border-primary dark:border-dark-border-primary table-cell md:hidden text-end`}
              >
                Network
              </th>
            </tr>
          </thead>
        )}
        {transactions?.length > 0 &&
        Object.entries(transactionsByDate)?.length > 0 ? (
          <tbody>
            {Object.entries(transactionsByDate)?.map(
              ([date, transactionsForDate]: [string, PublicTransaction[]]) => (
                <>
                  <tr>
                    <SmallFont
                      extraCss={`px-2.5 ${
                        isSmallTable ? "pt-2" : "pt-[15px] pb-1 font-medium"
                      }`}
                    >
                      {date}
                    </SmallFont>
                  </tr>
                  {transactionsForDate.map((transaction) => {
                    // We check if we're in a swap where we need 2 tokens, or a simple transaction.
                    let txTokens: TransactionAsset[] =
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
                      txTokens as never
                    );

                    const isTransactionOut = isOut(transaction);
                    const externalActor = !isTransactionOut
                      ? transaction.from
                      : transaction.to;
                    const internalActor = !isTransactionOut
                      ? transaction.to
                      : transaction.from;

                    let tokenAmount: number | undefined =
                      transaction.amount || 0;
                    let tokenUsdAmount: number | undefined =
                      transaction.amount_usd || 0;

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
                        <tr
                          className={`${
                            transaction.is_added
                              ? "bg-light-bg-terciary dark:bg-dark-bg-terciary"
                              : ""
                          }  align-top cursor-pointer hover:bg-light-bg-hover hover:dark:bg-dark-bg-hover transition-all duration-200`}
                        >
                          <td
                            className={`${tdStyle} py-[10px] border-b border-light-border-primary dark:border-dark-border-primary max-w-[160px] pr-[5px] ${
                              isActive ? "h-[120px]" : ""
                            } ${
                              transaction.hash !== "0x"
                                ? "cursor-pointer"
                                : "cursor-default"
                            } ${isActive ? "pb-[80px]" : ""}`}
                            onClick={() => {
                              setActiveTransaction(
                                isActive
                                  ? ""
                                  : transaction.hash + transaction.id
                              );
                            }}
                          >
                            <div className="flex items-center">
                              <div className="flex flex-col">
                                <div className="flex bg-light-bg-hover dark:bg-dark-bg-hover rounded-full z-[1] -mb-2.5 w-fit h-fit">
                                  <img
                                    className={`border border-light-border-primary dark:border-dark-border-primary ${
                                      isSmallTable
                                        ? "w-[22px] h-[22px] min-w-[22px] min-h-[22px]"
                                        : "w-[24px] h-[24px] min-w-[24px] min-h-[24px]"
                                    } rounded-full`}
                                    src={txTokens[0]?.logo}
                                    alt={`${txTokens[0]?.name} logo`}
                                  />
                                </div>
                                <div className="flex bg-light-bg-hover dark:bg-dark-bg-hover rounded-full z-[0] ml-2.5">
                                  {txTokens[1] ? (
                                    <img
                                      src={txTokens[1]?.logo}
                                      className={`border border-light-border-primary dark:border-dark-border-primary ${
                                        isSmallTable
                                          ? "w-[22px] h-[22px] min-w-[22px] min-h-[22px]"
                                          : "w-[24px] h-[24px] min-w-[24px] min-h-[24px]"
                                      } rounded-full`}
                                      alt={`${txTokens[1]?.name} logo`}
                                    />
                                  ) : (
                                    <>
                                      {transactionInfos.type === "transfert" ? (
                                        <div
                                          className={`${
                                            isSmallTable
                                              ? "w-[20px] h-[20px] min-w-[20px] min-h-[20px]"
                                              : "w-[24px] h-[24px] min-w-[24px] min-h-[24px]"
                                          } md:w-[20px] md:h-[20px] md:min-w-[20px] md:min-h-[20px]  ${
                                            transactionInfos.wording ===
                                            "Receive"
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
                                          className={`${
                                            isSmallTable
                                              ? "w-[20px] h-[20px] min-w-[20px] min-h-[20px]"
                                              : "w-[24px] h-[24px] min-w-[24px] min-h-[24px]"
                                          } md:w-[20px] md:h-[20px] md:min-w-[20px] md:min-h-[20px] flex items-center justify-center`}
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
                              <div className="flex flex-col ml-2.5 flex-wrap max-w-[200px]">
                                {transactionInfos.type === "execution" ? (
                                  <SmallFont
                                    extraCss={`break-all whitespace-pre-wrap  ${
                                      isSmallTable
                                        ? "font-normal"
                                        : " font-medium"
                                    }`}
                                  >
                                    {transactionInfos.wording}
                                  </SmallFont>
                                ) : (
                                  <div className="flex justify-center">
                                    <SmallFont
                                      extraCss={`break-all whitespace-pre-wrap ${
                                        isSmallTable
                                          ? "font-normal"
                                          : " font-medium"
                                      }`}
                                    >
                                      {`${transactionInfos.wording} ${
                                        txTokens[0]?.symbol
                                      }${
                                        tokenUsdAmount
                                          ? ` at $${getFormattedAmount(
                                              tokenUsdAmount /
                                                (tokenAmount || 0),
                                              2
                                            )}`
                                          : ""
                                      }`}
                                    </SmallFont>
                                    {transactionInfos.type === "internal" ? (
                                      <Tooltip
                                        tooltipText="Transaction involving multiple wallets from this portfolio."
                                        iconCss="mb-0.5"
                                      />
                                    ) : null}
                                  </div>
                                )}
                                {isSmallTable ? null : (
                                  <SmallFont extraCss="text-light-font-60 dark:text-dark-font-60">
                                    {` ${getHours(transaction.timestamp)}`}
                                  </SmallFont>
                                )}
                              </div>
                            </div>
                          </td>
                          <td
                            className={`${tdStyle} py-[10px] border-b border-light-border-primary dark:border-dark-border-primary ${
                              isActive ? "pb-[80px]" : ""
                            }`}
                            onClick={() => {
                              setActiveTransaction(
                                isActive
                                  ? ""
                                  : transaction.hash + transaction.id
                              );
                            }}
                          >
                            {manager.privacy_mode ? (
                              <Privacy extraCss="justify-end" />
                            ) : (
                              <TransactionAmount
                                transaction={transaction}
                                tokens={txTokens}
                              />
                            )}
                          </td>
                          {isSmallTable ? null : (
                            <td
                              className={`${tdStyle} border-b border-light-border-primary dark:border-dark-border-primary table-cell md:hidden text-end ${
                                isActive ? "pb-[80px]" : ""
                              }`}
                              onClick={() => {
                                setActiveTransaction(
                                  isActive
                                    ? ""
                                    : transaction.hash + transaction.id
                                );
                              }}
                            >
                              <div className="flex items-center justify-end">
                                {famousContractsLabel[externalActor] ? (
                                  <img
                                    className="w-[20px] h-[20px] min-w-[20px] rounded-full ml-auto mr-2"
                                    src={
                                      famousContractsLabel[externalActor].logo
                                    }
                                    alt={`${famousContractsLabel[externalActor].name} logo`}
                                  />
                                ) : null}
                                <SmallFont
                                  extraCss={`${
                                    !famousContractsLabel[externalActor]
                                      ? "ml-auto"
                                      : ""
                                  } ${
                                    transactionInfos.type === "internal"
                                      ? "text-light-font-40 dark:text-dark-font-40"
                                      : "text-light-font-100 dark:text-dark-font-100"
                                  } font-normal`}
                                >
                                  {transaction.is_added
                                    ? "--"
                                    : famousContractsLabel[externalActor]
                                        ?.name || addressSlicer(externalActor)}
                                </SmallFont>
                              </div>
                            </td>
                          )}

                          <td
                            className={`${tdStyle} py-[10px] border-b border-light-border-primary dark:border-dark-border-primary table-cell md:hidden ${
                              isActive ? "pb-[80px]" : ""
                            }`}
                          >
                            <div className="flex items-center justify-end">
                              <div className="flex items-center">
                                <img
                                  className="bg-light-bg-hover dark:bg-dark-bg-hover w-[24px] h-[24px] min-w-[24px] 
                            border-2 border-light-border-primary dark:border-dark-border-primary rounded-full"
                                  src={
                                    blockchainsContent[transaction.blockchain]
                                      ?.logo || "/empty/unknown.png"
                                  }
                                  alt={`${
                                    blockchainsContent[transaction.blockchain]
                                      ?.name
                                  } logo`}
                                />
                              </div>
                              {(transaction.blockchain ||
                                (!explorerAddress &&
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
                                              transaction.blockchain
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
                                              transaction.blockchain
                                            ]?.logo
                                          }
                                          alt={`${
                                            blockchainsContent[
                                              transaction.blockchain
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
                                  {!explorerAddress &&
                                    activePortfolio?.user === user?.id &&
                                    transaction.id && (
                                      <div
                                        className="flex items-center text-sm text-[13px] md:text-xs
                                       bg-light-bg-terciary dark:bg-dark-bg-terciary whitespace-nowrap 
                                       mt-2.5 text-light-font-100 dark:text-dark-font-100"
                                        onClick={() => {
                                          handleRemoveTransaction(
                                            transaction.id
                                          );
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
                          </td>
                        </tr>
                        <div
                          className={`${tdStyle} absolute -mt-[75px] w-full flex items-center ${
                            isActive ? "flex" : "hidden"
                          } transition-all duration-200`}
                          onClick={() => {
                            setActiveTransaction(
                              isActive ? "" : transaction.hash + transaction.id
                            );
                          }}
                        >
                          {transaction.is_added ? (
                            <SmallFont extraCss="text-light-font-40 dark:text-dark-font-40 whitespace-nowrap">
                              Transaction added manually, no meta-data.
                            </SmallFont>
                          ) : (
                            <>
                              <div className="flex flex-col">
                                <SmallFont extraCss="text-light-font-40 dark:text-dark-font-40 font-normal">
                                  Fee
                                </SmallFont>
                                <SmallFont>
                                  ${getFormattedAmount(transaction.tx_cost_usd)}
                                </SmallFont>
                              </div>

                              <div className="flex flex-col ml-8 md:hidden">
                                <SmallFont extraCss="text-light-font-40 dark:text-dark-font-40 font-normal">
                                  Transaction Hash
                                </SmallFont>
                                <div className="flex items-center">
                                  <SmallFont>
                                    {addressSlicer(transaction.hash)}
                                  </SmallFont>
                                  <FiExternalLink
                                    className="text-light-font-40 dark:text-dark-font-40 ml-[5px]"
                                    onClick={() =>
                                      window.open(
                                        explorerTransformer(
                                          blockchainsContent[
                                            transaction.blockchain
                                          ]?.name,
                                          transaction.hash,
                                          "tx"
                                        )
                                      )
                                    }
                                  />
                                </div>
                              </div>
                              <div className="flex flex-col ml-8">
                                <SmallFont extraCss="text-light-font-40 dark:text-dark-font-40 font-normal">
                                  Wallet
                                </SmallFont>
                                <SmallFont>
                                  {addressSlicer(internalActor)}
                                </SmallFont>
                              </div>
                              <div className="hidden md:flex flex-col ml-8">
                                <SmallFont extraCss="text-light-font-40 dark:text-dark-font-40 font-normal">
                                  Actor
                                </SmallFont>
                                <SmallFont>
                                  {famousContractsLabel[externalActor]?.name ||
                                    addressSlicer(externalActor)}
                                </SmallFont>
                              </div>
                              <div className="items-center ml-5 hidden md:flex">
                                <img
                                  className="bg-light-bg-hover dark:bg-dark-bg-hover w-[24px] h-[24px] min-w-[24px] md:w-[20px] md:h-[20px] md:min-w-[20px] border-2 border-light-border-primary dark:border-dark-border-primary rounded-full"
                                  src={
                                    blockchainsContent[
                                      String(transaction.blockchain)
                                    ]?.logo || "/icon/unknown.png"
                                  }
                                  alt={`$${
                                    blockchainsContent[
                                      String(transaction.blockchain)
                                    ]?.name
                                  } logo`}
                                />
                                <FiExternalLink
                                  className="text-light-font-40 dark:text-dark-font-40 ml-[5px] text-xl"
                                  onClick={() =>
                                    window.open(
                                      explorerTransformer(
                                        blockchainsContent[
                                          String(transaction.blockchain)
                                        ]?.name,
                                        transaction.hash,
                                        "tx"
                                      ) || ""
                                    )
                                  }
                                />
                                {transaction.id &&
                                activePortfolio?.user === user?.id ? (
                                  <BsTrash3
                                    className="ml-[25px] text-light-font-100 dark:text-dark-font-100 text-lg"
                                    onClick={() =>
                                      handleRemoveTransaction(transaction.id)
                                    }
                                  />
                                ) : null}
                              </div>
                            </>
                          )}
                        </div>
                        <tr
                          className={`border-b border-light-border-primary dark:border-dark-border-primary ${
                            isActive ? "flex" : "hidden"
                          } transition-all duration-200`}
                        />
                      </>
                    );
                  })}
                </>
              )
            )}
          </tbody>
        ) : null}
        {isTxLoading && !transactions?.length ? (
          <tbody>
            {" "}
            {Array.from(Array(10).keys()).map((_, i) => (
              <TbodySkeleton key={i} isActivity />
            ))}{" "}
          </tbody>
        ) : null}
        {transactions.length !== 0 &&
        Object.keys(transactionsByDate).length === 0 ? (
          <div className="flex h-[300px] items-center justify-center flex-col mx-auto w-full">
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
        ) : null}
        {!wallet && !isLoading && !isTxLoading ? (
          <caption className="h-[300px] w-full rounded-r">
            <img
              className="h-[160px] -mb-[50px] mt-[25px] mx-auto"
              src={isWhiteMode ? "/asset/empty-light.png" : "/asset/empty.png"}
              alt="empty state image"
            />
            <div className="flex max-w-[80%] flex-col items-center justify-center m-auto mt-[40px]">
              <MediumFont extraCss="mb-[5px] text-center text-light-font-40 dark:text-dark-font-40">
                No transactions found{" "}
              </MediumFont>
            </div>
          </caption>
        ) : null}
      </table>
      {transactions?.length + 26 > actualTxAmount &&
      transactions?.length > 0 &&
      !isTxLoading ? (
        <div className="flex justify-center mt-4 items-center">
          <div
            className="flex justify-center items-center"
            onClick={() => setActualTxAmount((prev) => prev + 25)}
          >
            <p className="text-light-font-100 dark:text-dark-font-100 text-sm md:text-xs font-medium  cursor-pointer">
              Show More
            </p>
            {isTxLoading ? <Spinner extraCss="h-[20px] w-[20px] ml-2" /> : null}
          </div>

          {/* Vertical separator */}
          <div className="h-[20px] w-[2px] bg-light-border-primary dark:bg-dark-border-primary m-4" />

          <div
            className="flex justify-center   items-center"
            onClick={() => setActualTxAmount((prev) => prev + 1000)}
          >
            <p className="text-light-font-100 dark:text-dark-font-100 text-sm md:text-xs font-medium  cursor-pointer">
              Show All
            </p>
            {isTxLoading ? <Spinner extraCss="h-[20px] w-[20px] ml-2" /> : null}
          </div>
        </div>
      ) : null}
    </>
  );
};
