import {
  blockchainsContent,
  blockchainsIdContent,
} from "mobula-lite/lib/chains/constants";
import React, {
  Dispatch,
  SetStateAction,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { PiTriangleFill } from "react-icons/pi";
import { Chain, useNetwork } from "wagmi";
import { SwapContext } from "../..";
import { ModalContainer } from "../../../../components/modal-container";
import { Skeleton } from "../../../../components/skeleton";
import { PopupUpdateContext } from "../../../../contexts/popup";
import { MultichainAsset } from "../../../../interfaces/holdings";
import {
  getFormattedAmount,
  getTokenPercentage,
} from "../../../../utils/formaters";
import { useLoadToken } from "../../hooks/useLoadToken";
import { useUpdateSearch } from "../../hooks/useUpdateSearch";
import { Asset, Coin } from "../../model";
import { formatAsset } from "../../utils";
import { CoinDecision } from "./coin-decision";
import { Results } from "./model";

interface SelectProps {
  position: "in" | "out";
  visible: boolean;
  setVisible: Dispatch<SetStateAction<boolean>>;
  callback?: (token: (Asset | Coin | MultichainAsset) & Results) => void;
}

export const Select = ({
  visible,
  setVisible,
  position,
  callback,
}: SelectProps) => {
  const swapContext = useContext(SwapContext);
  const {
    chainNeeded,
    setChainNeeded,
    tokenIn,
    tokenOut,
    setTokenInBuffer,
    setTokenOutBuffer,
    setLockToken,
    holdings,
  } = swapContext;
  const [coinDecisionPopup, setCoinDecisionPopoup] = useState<
    (Coin & Results) | null
  >(null);
  const [token, setToken] = useState("");
  const { chain } = useNetwork();
  const chainRef = useRef<Chain>();
  const { loadToken } = useLoadToken();
  const { updateSearch, results, isLoading } = useUpdateSearch(position);
  const { setShowSwitchNetwork } = useContext(PopupUpdateContext);

  useEffect(() => {
    chainRef.current = chain;
  }, [chain]);

  useEffect(() => {
    updateSearch(token, !callback);
  }, [token, position]);

  const isOldToken = (oldToken: (Coin | Asset) & Results) => {
    if (tokenIn?.symbol === oldToken.symbol) {
      return "in";
    }
    if (tokenOut?.symbol === oldToken.symbol) {
      return "out";
    }

    return false;
  };

  const setBufferToken =
    position === "in" ? setTokenInBuffer : setTokenOutBuffer;

  const currentChain = chainNeeded || chain?.id || 1;
  const currentChainName = blockchainsIdContent[currentChain]?.name;
  const connectedChain = blockchainsIdContent[chain?.id as number]?.name;

  const filterArrayIfTwoNameAreSame = () => {
    const filteredArray = results?.filter((result) =>
      holdings?.holdings?.multichain
        ? holdings?.holdings.multichain.filter(
            (entry) =>
              entry.balance > 0 &&
              entry.price &&
              entry.price > 0 &&
              entry.name !== result.name
          )
        : results
    );
    return filteredArray as any;
  };

  const selectAToken = async (selectedToken: (Coin | Asset) & Results) => {
    if (!isOldToken(selectedToken)) {
      const shouldSwitch = selectedToken.blockchain !== connectedChain;

      const finalToken =
        "address" in selectedToken
          ? ({
              logo: selectedToken.logo,
              symbol: selectedToken.symbol,
              address: selectedToken.address,
              blockchain: selectedToken.blockchain,
              blockchains: selectedToken.blockchains,
              contracts: selectedToken.contracts,
            } as Asset)
          : ({
              logo: selectedToken.logo,
              symbol: selectedToken.symbol,
              blockchain: selectedToken.blockchain,
              chainId: blockchainsContent[selectedToken.blockchain].chainId,
              coin: true,
            } as Coin);

      setBufferToken(finalToken);
      setLockToken([position]);

      setVisible(false);

      if (shouldSwitch) {
        setChainNeeded(blockchainsContent[finalToken.blockchain].chainId);
        setShowSwitchNetwork(blockchainsContent[finalToken.blockchain].chainId);
      } else setChainNeeded(undefined);

      await loadToken(position, finalToken, {
        contextBuffer: {
          chainNeeded: shouldSwitch
            ? blockchainsContent[finalToken.blockchain].chainId
            : undefined,
        },
      });
    } else if (isOldToken(selectedToken) === position) {
      setVisible(false);
    } else {
      setLockToken([]);
      setTokenOutBuffer(tokenOut);
      setTokenInBuffer(tokenIn);
      loadToken("out", tokenIn as never);
      loadToken("in", tokenOut as never);
      setVisible(false);
    }
  };

  const filteredTokens = filterArrayIfTwoNameAreSame();

  return (
    <ModalContainer
      extraCss="max-w-[380px]"
      title="Select a Token"
      isOpen={visible}
      onClose={() => setVisible(false)}
    >
      <div className="h-[1px] bg-light-border-primary dark:bg-dark-border-primary mb-2.5 w-full" />
      <input
        className={`w-full rounded text-light-font-80 dark:text-dark-font-80 text-medium border border-light-border-primary
         dark:border-dark-border-primary bg-light-bg-terciary dark:bg-dark-bg-terciary h-[35px] px-2.5 text-sm 
         focus:border-light-font-10 focus:dark:border-dark-font-10 focus:outline-none focus:dark:outline-none
          active:border-light-font-10 active:dark:border-dark-font-10 `}
        placeholder="Search a token name or address"
        onChange={(e) => setToken(e.target.value)}
      />
      <div className="flex flex-col w-full overflow-y-scroll scroll h-auto rounded max-h-[352px] bg-light-bg-terciary dark:bg-dark-bg-terciary mt-2.5 border border-light-border-primary dark:border-dark-border-primary">
        {filteredTokens?.length === 0 && !isLoading ? (
          <div className="min-h-[150px] flex items-center justify-center text-light-font-80 dark:text-dark-font-80 text-md font-medium">
            No results found
          </div>
        ) : null}
        <>
          {isLoading ? (
            Array.from(Array(7).keys()).map((_, i) => (
              <div
                className={`flex border-b border-light-border-primary dark:border-dark-border-primary py-1.5
            cursor-pointer items-center justify-between w-full "bg-light-bg-terciary dark:bg-dark-bg-terciary px-2.5
             hover:bg-light-bg-hover hover:dark:bg-dark-bg-hover transition min-h-[50px]`}
                key={i}
              >
                <div className="flex items-center">
                  <Skeleton extraCss="rounded-full mr-2.5 h-[22px] w-[22px]" />
                  <div>
                    <Skeleton extraCss="rounded mr-2.5 h-[14px] w-[40px] mb-1" />
                    <Skeleton extraCss="rounded mr-2.5 h-[12px] w-[70px]" />
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-end">
                    <Skeleton extraCss="rounded h-[14px] w-[30px]" />
                  </div>
                  <div className="flex items-center justify-end mt-[3px]">
                    {Array.from({ length: 3 }).map((_, i) => {
                      return (
                        <Skeleton
                          extraCss="h-[14px] w-[14px] min-w-[14px] rounded-full ml-1 "
                          key={i}
                        />
                      );
                    })}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <>
              {filteredTokens?.map((searchToken) => {
                const isGainer =
                  "price_change_24h" in searchToken
                    ? searchToken.price_change_24h > 0
                    : false;
                const isLoser =
                  "price_change_24h" in searchToken
                    ? searchToken.price_change_24h < 0
                    : false;
                let color = "text-light-font-40 dark:text-dark-font-40";
                if (isGainer) color = "text-green dark:text-green";
                else if (isLoser) color = "text-red dark:text-red";
                return (
                  <div
                    className={`flex border-b border-light-border-primary dark:border-dark-border-primary py-1.5
                  cursor-pointer items-center justify-between w-full "bg-light-bg-terciary dark:bg-dark-bg-terciary px-2.5
                   hover:bg-light-bg-hover hover:dark:bg-dark-bg-hover transition`}
                    key={searchToken.name}
                    onClick={() => {
                      if (callback) {
                        callback(searchToken);
                        setVisible(false);
                      } else if (
                        searchToken.switch &&
                        "coin" in searchToken &&
                        searchToken.blockchains.includes(connectedChain)
                      )
                        setCoinDecisionPopoup(searchToken);
                      else
                        selectAToken(
                          formatAsset(searchToken, currentChainName)
                        );
                    }}
                  >
                    <div className="flex items-center">
                      <img
                        className="rounded-full mr-2.5 h-[22px]"
                        src={searchToken?.logo || "/empty/unknown.png"}
                      />{" "}
                      <div>
                        <p className="text-sm text-light-font-100 dark:text-dark-font-100 font-medium">
                          {searchToken.symbol}{" "}
                        </p>
                        <p className="text-xs text-light-font-60 dark:text-dark-font-60 font-medium">
                          {searchToken.name}
                        </p>
                      </div>
                    </div>
                    <div>
                      {position === "in" && searchToken?.balance ? (
                        <p className="text-sm text-light-font-100 dark:text-dark-font-100 font-medium text-end">
                          {getFormattedAmount(searchToken.balance)}
                        </p>
                      ) : (
                        <div className="flex items-center justify-end">
                          {isGainer ? (
                            <PiTriangleFill
                              className={`text-[10px] mr-[5px] ${color}`}
                            />
                          ) : null}
                          {isLoser ? (
                            <PiTriangleFill
                              className={`text-[10px] mr-[5px] ${color} rotate-180`}
                            />
                          ) : null}
                          <p className="text-sm text-light-font-100 dark:text-dark-font-100 font-medium text-end">
                            {getTokenPercentage(searchToken?.price_change_24h)}%
                          </p>
                        </div>
                      )}
                      <div className="flex items-center justify-end mt-[3px]">
                        {searchToken?.blockchains
                          ?.filter(
                            (blockchain) => blockchainsContent[blockchain]
                          )
                          .map((blockchain, index) => {
                            if (index < 5)
                              return (
                                <img
                                  className="h-[14px] w-[14px] min-w-[14px] rounded-full ml-1 bg-light-bg-hover dark:bg-dark-bg-hover"
                                  key={blockchain}
                                  src={blockchainsContent[blockchain]?.logo}
                                  alt={`${blockchain} logo`}
                                />
                              );
                            if (index === 5)
                              return (
                                <p className="text-xs font-bold text-light-font-40 dark:text-dark-font-40 ml-1 leading-none">
                                  +
                                  {searchToken?.blockchains
                                    ? (searchToken?.blockchains?.length || 0) -
                                      5
                                    : null}
                                </p>
                              );
                            return null;
                          })}
                      </div>
                    </div>
                  </div>
                );
              })}
            </>
          )}
        </>
        {coinDecisionPopup && (
          <CoinDecision
            asset={coinDecisionPopup}
            setAsset={setCoinDecisionPopoup as never}
            callback={selectAToken}
          />
        )}
      </div>{" "}
    </ModalContainer>
  );
};
