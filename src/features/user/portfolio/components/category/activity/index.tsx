import { ExternalLinkIcon } from "@chakra-ui/icons";
import {
  Button,
  Flex,
  Icon,
  Image,
  Img,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  useColorMode,
} from "@chakra-ui/react";
import { blockchainsIdContent } from "mobula-lite/lib/chains/constants";
import { useRouter } from "next/navigation";
import { useContext, useEffect, useMemo, useRef, useState } from "react";
import { AiFillSetting, AiOutlineSwap } from "react-icons/ai";
import { BsThreeDotsVertical, BsTrash3 } from "react-icons/bs";
import { VscAdd, VscArrowUp } from "react-icons/vsc";
import { useAccount } from "wagmi";
import { InfoPopup } from "../../../../../../common/components/popup-hover";
import { LoadMore } from "../../../../../../common/ui/load-more-table";
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

export const Activity = () => {
  const {
    setActivePortfolio,
    manager,
    isWalletExplorer,
    activePortfolio,
    isLoading,
    wallet,
    transactions,
    setTransactions,
    asset,
  } = useContext(PortfolioV2Context);
  const [activeTransaction, setActiveTransaction] = useState<string>();
  const router = useRouter();
  const { user } = useContext(UserContext);
  const { colorMode } = useColorMode();
  const isWhiteMode = colorMode === "light";
  const refreshPortfolio = useWebSocketResp();
  const { boxBg6, borders, hover, boxBg1, text80, borders2x, text40, text60 } =
    useColors();
  const { address } = useAccount();
  const [isLoadingFetch, setIsLoadingFetch] = useState(false);
  const isMounted = useRef(false);

  const handleRemoveTransaction = (id: number) => {
    GET("/portfolio/removetx", {
      portfolio_id: activePortfolio?.id,
      tx_id: id,
      account: address,
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

  const portfolioId = router.asPath.split("/")[3]
    ? router.asPath.split("/")[3].split("?")[0]
    : activePortfolio?.id;
  const wallets = isWalletExplorer
    ? [isWalletExplorer]
    : [...(activePortfolio?.wallets || [])] || [];

  const lowerCaseWallets = wallets.map((newWallet) => newWallet?.toLowerCase());

  const txsLimit = router?.query.asset ? 200 : 20;

  const fetchTransactions = (refresh = false) => {
    setIsLoadingFetch(true);
    const txRequest: any = {
      should_fetch: false,
      limit: txsLimit,
      offset: refresh ? 0 : transactions.length,
      wallets: lowerCaseWallets.join(","),
      portfolio_id: portfolioId,
      added_transactions: true,
    };

    if (asset) txRequest.only_assets = asset.id;

    if (isWalletExplorer) delete txRequest.portfolio_id;

    GET(
      `${process.env.NEXT_PUBLIC_PORTFOLIO_ENDPOINT}/portfolio/rawtxs`,
      txRequest,
      true
    )
      .then((r) => r.json())
      .then((r: TransactionResponse) => {
        if (r) {
          setIsLoadingFetch(false);
          if (!refresh)
            setTransactions((oldTsx) => [...oldTsx, ...r.data.transactions]);
          else setTransactions(r.data.transactions);
        }
      });
  };

  useEffect(() => {
    if (isMounted.current || !transactions?.length) {
      if (router.query?.asset && !asset) return;
      setTransactions([]);
      fetchTransactions(true);
    } else isMounted.current = true;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [asset?.id, wallet?.id]);

  // We want to make sure we set the "light" token to be:
  // ETH is ETH vs Stable
  // Other is Other vs Stable or ETH
  const ethSymbols = useMemo(
    () => Object.values(blockchainsIdContent).map((entry) => entry.eth.symbol),
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
      return txTokens?.[0]?.id === tx.in.id
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
          console.log("txsFromHash", txsFromHash);
          const transfers = txsFromHash.filter(
            (entry) => entry.transaction.amount
          );
          const {
            // eslint-disable-next-line @typescript-eslint/naming-convention
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

            console.log("isTxOut", isTxOut, finalTx);
            console.log(
              txsFromHash.map((e) => ({
                ...e.transaction,
                isOut: isOut(e.transaction),
              }))
            );

            const otherTx = txsFromHash
              .filter(
                (entry) =>
                  entry.transaction.amount &&
                  isOut(entry.transaction) !== isTxOut
              )
              .sort(rankByAmountUsd)?.[0]?.transaction;

            console.log(
              "otherTx",
              otherTx,
              finalTx,
              txsFromHash
                .filter(
                  (entry) =>
                    entry.transaction.amount &&
                    isOut(entry.transaction) !== isTxOut
                )
                .sort(rankByAmountUsd)
            );

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
          !indexesToRemove.includes(i) &&
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [transactions]
  );

  return (
    <TableContainer position="relative" pb={["20px", "20px", "100px"]}>
      <Table variant="simple" overflowX="scroll" className="scroll">
        {transactions.length && transactions.length % txsLimit === 0 ? (
          <LoadMore
            callback={() => fetchTransactions()}
            isLoading={isLoadingFetch}
          />
        ) : null}

        <Thead display={["none", "none", "table-header-group"]}>
          <Tr>
            <Th
              {...thStyle}
              color={text80}
              borderBottom={borders}
              display={["none", "none", "table-cell"]}
            >
              Type
            </Th>
            <Th {...thStyle} borderBottom={borders} color={text80} />
            <Th
              display={["none", "none", "table-cell"]}
              {...thStyle}
              borderBottom={borders}
              color={text80}
              isNumeric
            >
              Actor
            </Th>
            <Th
              display={["none", "none", "table-cell"]}
              {...thStyle}
              borderBottom={borders}
              color={text80}
              isNumeric
            >
              Network
            </Th>
          </Tr>
        </Thead>
        {transactions.length > 0 && wallet && !isLoading ? (
          <Tbody>
            {Object.entries(transactionsByDate).map(
              ([date, transactionsForDate]: [string, PublicTransaction[]]) => (
                <>
                  <Tr>
                    <TextSmall px="10px" pt="15px" fontWeight="600">
                      {date}
                    </TextSmall>
                  </Tr>

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

                    const finalBorders = isActive ? "none" : borders;
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

                    const generalSettings = {
                      ...tdStyle,
                      onClick: () => {
                        setActiveTransaction(
                          isActive ? "" : transaction.hash + transaction.id
                        );
                      },
                      cursor: transaction.hash !== "0x" ? "pointer" : "default",
                    };

                    let tokenAmount = transaction.amount;
                    let tokenUsdAmount = transaction.amount_usd;

                    if (transaction.type === "swap") {
                      tokenAmount =
                        txTokens?.[0]?.id === transaction.in.id
                          ? transaction.in.amount
                          : transaction.out.amount;

                      tokenUsdAmount =
                        txTokens?.[0]?.id === transaction.in.id
                          ? transaction.in.amount_usd
                          : transaction.out.amount_usd;
                    }

                    return (
                      <>
                        <Tr
                          verticalAlign="top"
                          bg={transaction.is_added ? boxBg6 : ""}
                        >
                          <Td
                            {...generalSettings}
                            borderBottom={finalBorders}
                            maxW="160px"
                            pr="5px"
                            h={isActive && "120px"}
                          >
                            <Flex align="center">
                              <Flex direction="column">
                                <Flex
                                  bg={hover}
                                  borderRadius="full"
                                  zIndex={1}
                                  mb="-10px"
                                  boxSize="fit-content"
                                >
                                  <Img
                                    src={txTokens[0]?.logo}
                                    border={borders}
                                    boxSize={["20px", "20px", "24px"]}
                                    minH={["20px", "20px", "24px"]}
                                    minW={["20px", "20px", "24px"]}
                                    borderRadius="full"
                                  />
                                </Flex>
                                <Flex
                                  bg={hover}
                                  borderRadius="full"
                                  ml="10px"
                                  zIndex={0}
                                >
                                  {txTokens[1] ? (
                                    <Img
                                      src={txTokens[1]?.logo}
                                      border={borders}
                                      boxSize={["20px", "20px", "24px"]}
                                      minH={["20px", "20px", "24px"]}
                                      minW={["20px", "20px", "24px"]}
                                      borderRadius="full"
                                    />
                                  ) : (
                                    <>
                                      {transactionInfos.type === "transfert" ? (
                                        <Flex
                                          background={
                                            transactionInfos.wording ===
                                            "Receive"
                                              ? "green"
                                              : "red"
                                          }
                                          boxSize={["20px", "20px", "24px"]}
                                          borderRadius="full"
                                          align="center"
                                          justify="center"
                                        >
                                          {transactionInfos.wording ===
                                          "Receive" ? (
                                            <Icon as={VscAdd} boxSize="14px" />
                                          ) : (
                                            <Icon
                                              as={VscArrowUp}
                                              boxSize="14px"
                                            />
                                          )}
                                        </Flex>
                                      ) : (
                                        <Flex
                                          width={["20px", "20px", "24px"]}
                                          height={["20px", "20px", "24px"]}
                                          alignItems="center"
                                          justifyContent="center"
                                        >
                                          <Icon
                                            color={text80}
                                            as={
                                              transactionInfos.type ===
                                              "internal"
                                                ? AiOutlineSwap
                                                : AiFillSetting
                                            }
                                            boxSize="14px"
                                            borderRadius="full"
                                          />
                                        </Flex>
                                      )}{" "}
                                    </>
                                  )}
                                </Flex>
                              </Flex>
                              <Flex
                                direction="column"
                                ml="10px"
                                wrap="wrap"
                                maxW="200px"
                              >
                                {transactionInfos.type === "execution" ? (
                                  <TextSmall
                                    fontWeight="600"
                                    whiteSpace="pre-wrap"
                                    wordBreakMode="break-all"
                                  >
                                    {transactionInfos.wording}
                                  </TextSmall>
                                ) : (
                                  <Flex justify="center">
                                    <TextSmall
                                      fontWeight="600"
                                      whiteSpace="pre-wrap"
                                      wordBreakMode="break-all"
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
                                    </TextSmall>
                                    {transactionInfos.type === "internal" ? (
                                      <InfoPopup
                                        info="Transaction involving multiple wallets from this portfolio."
                                        mt="0px"
                                        mb="2px"
                                        noClose
                                      />
                                    ) : null}
                                  </Flex>
                                )}

                                <TextSmall color={text60}>
                                  {` ${getHours(transaction.timestamp)}`}
                                </TextSmall>
                              </Flex>
                            </Flex>
                          </Td>
                          <Td
                            {...generalSettings}
                            borderBottom={finalBorders}
                            pl="0px"
                          >
                            {manager.privacy_mode ? (
                              <Privacy justify="flex-end" />
                            ) : (
                              <TransactionAmount
                                transaction={transaction}
                                tokens={txTokens}
                              />
                            )}
                          </Td>

                          <Td
                            {...generalSettings}
                            borderBottom={finalBorders}
                            isNumeric
                            display={["none", "none", "table-cell"]}
                          >
                            <Flex align="center">
                              {famousContractsLabel[externalActor] ? (
                                <Image
                                  src={famousContractsLabel[externalActor].logo}
                                  boxSize="24px"
                                  borderRadius="full"
                                  ml="auto"
                                  mr="5px"
                                />
                              ) : null}
                              <TextSmall
                                ml={
                                  !famousContractsLabel[externalActor]
                                    ? "auto"
                                    : ""
                                }
                                color={
                                  transactionInfos.type === "internal"
                                    ? text40
                                    : text80
                                }
                              >
                                {transaction.is_added
                                  ? "--"
                                  : famousContractsLabel[externalActor]?.name ||
                                    addressSlicer(externalActor)}
                              </TextSmall>
                            </Flex>
                          </Td>

                          <Td
                            display={["none", "none", "table-cell"]}
                            {...tdStyle}
                            borderBottom={finalBorders}
                          >
                            <Flex align="center" justify="flex-end">
                              <Flex align="center">
                                <Img
                                  bg={hover}
                                  boxSize="24px"
                                  border={borders2x}
                                  borderRadius="full"
                                  src={
                                    blockchainsIdContent[transaction.chain_id]
                                      ?.logo || "/icon/unknown.png"
                                  }
                                />
                              </Flex>
                              {(transaction.chain_id ||
                                (!isWalletExplorer &&
                                  activePortfolio?.user === user?.id)) && (
                                <Menu>
                                  <MenuButton ml="10px" as={Button}>
                                    <Icon
                                      as={BsThreeDotsVertical}
                                      color={text80}
                                    />
                                  </MenuButton>
                                  <MenuList
                                    bg={boxBg1}
                                    border={borders}
                                    borderRadius="8px"
                                    color={text80}
                                    boxShadow="1px 2px 13px 3px rgba(0,0,0,0.1)"
                                  >
                                    {transaction.chain_id ? (
                                      <MenuItem
                                        bg={boxBg1}
                                        fontSize={[
                                          "12px",
                                          "12px",
                                          "13px",
                                          "14px",
                                        ]}
                                        onClick={() =>
                                          window.open(
                                            `${
                                              blockchainsIdContent[
                                                transaction.chain_id
                                              ]?.explorer
                                            }/tx/${transaction.hash}`
                                          )
                                        }
                                      >
                                        <Flex {...flexGreyBoxStyle} bg={hover}>
                                          <Image
                                            boxSize="15px"
                                            src={
                                              blockchainsIdContent[
                                                transaction.chain_id
                                              ]?.logo
                                            }
                                          />
                                        </Flex>
                                        <Flex align="center">
                                          Open explorer
                                          <ExternalLinkIcon
                                            ml="7.5px"
                                            color={text40}
                                          />
                                        </Flex>
                                      </MenuItem>
                                    ) : null}
                                    {!isWalletExplorer &&
                                      activePortfolio?.user === user?.id &&
                                      transaction.id && (
                                        <MenuItem
                                          bg={boxBg1}
                                          fontSize={[
                                            "12px",
                                            "12px",
                                            "13px",
                                            "14px",
                                          ]}
                                          onClick={() => {
                                            handleRemoveTransaction(
                                              transaction.id
                                            );
                                          }}
                                        >
                                          <Flex {...flexGreyBoxStyle} bg="red">
                                            <Icon
                                              as={BsTrash3}
                                              color={text80}
                                            />
                                          </Flex>
                                          Delete transaction
                                        </MenuItem>
                                      )}
                                  </MenuList>
                                </Menu>
                              )}
                            </Flex>
                          </Td>
                        </Tr>
                        {isActive ? (
                          <>
                            <Flex
                              {...generalSettings}
                              position="absolute"
                              mt="-65px"
                            >
                              {transaction.is_added ? (
                                <TextSmall color={text40}>
                                  Transaction added manually, no meta-data.
                                </TextSmall>
                              ) : (
                                <>
                                  <Flex direction="column">
                                    <TextSmall color={text40}>Fee</TextSmall>
                                    <TextSmall>{`$${getFormattedAmount(
                                      transaction.tx_cost_usd
                                    )}`}</TextSmall>
                                  </Flex>

                                  <Flex
                                    direction="column"
                                    ml="20px"
                                    display={["none", "none", "flex"]}
                                  >
                                    <TextSmall color={text40}>
                                      Transaction Hash
                                    </TextSmall>
                                    <TextSmall>
                                      {addressSlicer(transaction.hash)}
                                      <ExternalLinkIcon
                                        onClick={() =>
                                          window.open(
                                            `${
                                              blockchainsIdContent[
                                                transaction.chain_id
                                              ]?.explorer
                                            }/tx/${transaction.hash}`
                                          )
                                        }
                                        ml="5px"
                                        color={text40}
                                      />
                                    </TextSmall>
                                  </Flex>

                                  <Flex direction="column" ml="20px">
                                    <TextSmall color={text40}>Wallet</TextSmall>
                                    <TextSmall>
                                      {addressSlicer(internalActor)}
                                    </TextSmall>
                                  </Flex>
                                  <Flex
                                    direction="column"
                                    ml="20px"
                                    display={["flex", "flex", "none"]}
                                  >
                                    <TextSmall color={text40}>Actor</TextSmall>
                                    <TextSmall>
                                      {famousContractsLabel[externalActor]
                                        ?.name || addressSlicer(externalActor)}
                                    </TextSmall>
                                  </Flex>
                                  <Flex
                                    align="center"
                                    ml="20px"
                                    display={["flex", "flex", "none"]}
                                  >
                                    <Img
                                      bg={hover}
                                      boxSize="24px"
                                      border={borders2x}
                                      borderRadius="full"
                                      src={
                                        blockchainsIdContent[
                                          transaction.chain_id
                                        ]?.logo || "/icon/unknown.png"
                                      }
                                    />
                                    <ExternalLinkIcon
                                      onClick={() =>
                                        window.open(
                                          `${
                                            blockchainsIdContent[
                                              transaction.chain_id
                                            ]?.explorer
                                          }/tx/${transaction.hash}`
                                        )
                                      }
                                      ml="5px"
                                      color={text40}
                                    />
                                    {transaction.id &&
                                    activePortfolio?.user === user?.id ? (
                                      <Icon
                                        ml="25px"
                                        as={BsTrash3}
                                        color={text80}
                                        onClick={() => {
                                          handleRemoveTransaction(
                                            transaction.id
                                          );
                                        }}
                                      />
                                    ) : null}
                                  </Flex>
                                </>
                              )}
                            </Flex>
                            <Tr borderBottom={borders} />
                          </>
                        ) : null}
                      </>
                    );
                  })}
                </>
              )
            )}
          </Tbody>
        ) : null}
        {isLoading || transactions.length === 0 ? (
          <Tbody>
            {" "}
            {Array.from(Array(10).keys()).map(() => (
              <TbodySkeleton isActivity />
            ))}{" "}
          </Tbody>
        ) : null}
        {transactions.length !== 0 &&
        Object.keys(transactionsByDate).length === 0 ? (
          <Flex
            h="300px"
            w="100%"
            align="center"
            justify="center"
            direction="column"
            mx="auto"
          >
            <Image
              src={
                isWhiteMode
                  ? "/asset/empty-bracket-light.png"
                  : "/asset/empty-bracket.png"
              }
              h="100px"
              mb="-20px"
              mt="25px"
            />
            <Flex
              maxW="80%"
              direction="column"
              mt="40px"
              align="center"
              justify="center"
              mb="20px"
            >
              <TextLandingSmall mb="5px" textAlign="center" color={text40}>
                No Transactions
              </TextLandingSmall>
              <Button onClick={() => fetchTransactions()}>
                <TextSmall color={text80}>Load More</TextSmall>
              </Button>
            </Flex>
          </Flex>
        ) : null}
      </Table>
      {!wallet && !isLoading ? (
        <Flex
          h="300px"
          w="100%"
          bg={boxBg1}
          borderRadius=" 0 0 8px 8px"
          align="center"
          justify="center"
          border={borders}
          direction="column"
        >
          <Image
            src={isWhiteMode ? "/asset/empty-light.png" : "/asset/empty.png"}
            h="160px"
            mb="-50px"
            mt="25px"
          />
          <Flex
            maxW="80%"
            direction="column"
            m="auto"
            mt="40px"
            align="center"
            justify="center"
          >
            <TextLandingSmall mb="5px" textAlign="center" color={text40}>
              No transactions found{" "}
            </TextLandingSmall>
          </Flex>
        </Flex>
      ) : null}
    </TableContainer>
  );
};
