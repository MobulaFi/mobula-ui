import { isValidAddress } from "@utils/general";
import { blockchainsContent } from "mobula-lite/lib/chains/constants";
import { useRouter } from "next/navigation";
import React, { MutableRefObject, useContext, useEffect, useRef } from "react";
import { AiOutlineClose } from "react-icons/ai";
import { FiSearch } from "react-icons/fi";
import { createPublicClient, http } from "viem";
import { mainnet } from "viem/chains";
import { normalize } from "viem/ens";
import { readContract } from "wagmi/actions";
import { Spinner } from "../../components/spinner";
import { createSupabaseDOClient } from "../../lib/supabase";
import { addressSlicer, getUrlFromName } from "../../utils/formaters";
import { ForumResults } from "./components/result-article";
import { AssetsResults } from "./components/result-asset";
import { EnsResults } from "./components/result-ens";
import { NoResult } from "./components/result-none";
import { NotListed } from "./components/result-not-listed";
import { PageResults } from "./components/result-page";
import { PairResult } from "./components/result-pair";
import { UnknownResult } from "./components/result-unknown";
import { WalletResult } from "./components/result-wallet";
import { Title } from "./components/ui/title";
import { SearchbarContext } from "./context-manager";
import {
  getDataFromInputValue,
  getPagesFromInputValue,
  handleMixpanel,
} from "./utils";

interface CoreSearchBarProps {
  showPagesAndArticles?: boolean;
  trigger?: boolean;
  setTrigger?: React.Dispatch<React.SetStateAction<boolean>>;
  maxAssetsResult?: number;
  maxWalletsResult?: number;
  callback?: (value: { content: string; type: string; label: string }) => void;
}

export const CoreSearchBar = ({
  showPagesAndArticles = true,
  maxAssetsResult = 5,
  maxWalletsResult = 3,
  trigger = true,
  setTrigger = () => {},
  callback,
}: CoreSearchBarProps) => {
  const router = useRouter();
  const supabase = createSupabaseDOClient();
  const inputRef = useRef<HTMLInputElement>(null);
  const [isSmartContract, setIsSmartContract] = React.useState(null);
  const timerRef = useRef<MutableRefObject<HTMLInputElement>>(null);
  const {
    token,
    setToken,
    results,
    setResults,
    active,
    setActive,
    setIsFocus,
    users,
    setUsers,
    userWithAddress,
    setUserWithAddress,
    pages,
    articles,
    setPages,
    ens,
    setEns,
    setPairs,
    pairs,
  } = useContext(SearchbarContext);
  const isUserRegistered: boolean = userWithAddress?.address !== undefined;
  const isUnknownUser: boolean =
    token &&
    !isUserRegistered &&
    (results?.length || 0) === 0 &&
    !pairs?.length;

  const showResults =
    (results?.length || 0) +
      (users?.length || 0) +
      (pages?.length || 0) +
      (pairs?.length || 0) +
      (articles?.length || 0) ||
    ens?.address ||
    token?.includes(".eth") ||
    userWithAddress?.address !== undefined;

  const fetchAssets = async (token: string) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_ENDPOINT}/api/1/search?input=${token}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: process.env.NEXT_PUBLIC_PRICE_KEY as string,
          },
        }
      );
      const data = await response.json();

      if (data.data && inputRef.current?.value === token) {
        const globalResult = data.data?.filter(
          (entry, i) => !entry?.reserve0 && !entry?.reserve1
        );
        globalResult.sort((entryA, entryB) => {
          const liquidityA =
            entryA.pairs.length > 0 ? parseInt(entryA.pairs[0].liquidity) : 0;
          const liquidityB =
            entryB.pairs.length > 0 ? parseInt(entryB.pairs[0].liquidity) : 0;

          if (liquidityA < liquidityB) return 1;
          else if (liquidityA > liquidityB) return -1;
          else return 0;
        });
        const pairAddressResult = data.data.filter(
          (entry) => entry?.reserve0 || entry?.reserve1
        );
        setResults(globalResult);
        setPairs(pairAddressResult);
      }
    } catch (error) {
      console.error("Error fetching assets:", error);
    }
  };

  useEffect(() => {
    if (token !== "") {
      fetchAssets(token);
    }
  }, [token]);

  useEffect(() => {
    if (isValidAddress(token)) {
      try {
        Object.values(blockchainsContent).forEach((blockchain) => {
          const getContract = async () => {
            const abi = [
              {
                inputs: [],
                name: "name",
                outputs: [
                  {
                    internalType: "string",
                    name: "",
                    type: "string",
                  },
                ],
                stateMutability: "view",
                type: "function",
              },
            ];

            readContract({
              address: token as `0x${string}`,
              abi,
              functionName: "name",
            }).then((name) => {
              setIsSmartContract({ name, blockchain });
            });
          };
          getContract();
        });
      } catch (error) {
        console.error("Error fetching smart contract:", error);
      }
    }
  }, [token]);

  useEffect(() => {
    getPagesFromInputValue(setPages, token);
    getDataFromInputValue(
      token,
      supabase,
      setUsers,
      setUserWithAddress,
      maxWalletsResult
    );
  }, []);

  useEffect(() => {
    if (trigger) {
      setIsFocus(false);
      setToken("");
      inputRef.current?.focus();
    }
  }, [setIsFocus, setToken, trigger]);

  useEffect(() => {
    setActive(
      Math.min(
        active,
        Math.max(
          (users?.length || 0) +
            (results?.length || 0) +
            (pages?.length || 0) +
            (pairs?.length || 0) +
            (articles?.length || 0) -
            1,
          0
        )
      )
    );
  }, [results, users, pages, articles, setActive, active]);

  useEffect(() => {
    if (token === "") setPairs([]);
  }, [token]);

  let fullResults: React.ReactNode;

  const getContentToRender = () => {
    if (showResults) {
      fullResults = (
        <>
          <AssetsResults
            firstIndex={0}
            setTrigger={setTrigger}
            callback={callback}
          />
          {results?.filter((entry) => entry?.pairs || entry?.token0)?.length >
            0 || pairs?.length > 0 ? (
            <PairResult
              firstIndex={results?.filter((entry) => entry.pairs)?.length || 0}
              setTrigger={setTrigger}
            />
          ) : null}
          <WalletResult
            firstIndex={
              results?.filter((entry) => entry.pairs)?.length +
                results?.filter((entry) => entry.id)?.length +
                pairs?.length || 0
            }
            setTrigger={setTrigger}
            callback={callback}
          />
          {token?.includes(".eth") && !ens?.address ? (
            <div className="flex flex-col">
              <Title extraCss="mt-[5px]">ENS (1)</Title>
              <div className="flex items-center">
                <p className="px-5 text-base text-light-font-100 dark:text-dark-font-100">
                  Loading ENS domain...
                </p>
                <Spinner extraCss="w-[15px] h-[15px]" />
              </div>
            </div>
          ) : (
            <EnsResults
              firstIndex={0}
              setTrigger={setTrigger}
              callback={callback}
              setToken={setToken}
            />
          )}
          {showPagesAndArticles ? (
            <>
              <PageResults
                firstIndex={
                  (pages?.length || 0) +
                  (results?.filter((entry) => entry.pairs)?.length +
                    results?.filter((entry) => entry.id)?.length +
                    +pairs?.length || 0)
                }
                setTrigger={setTrigger}
              />
              <ForumResults
                firstIndex={
                  (pages?.length || 0) +
                  (results?.length || 0) +
                  (articles?.length || 0)
                }
                setTrigger={setTrigger}
              />
            </>
          ) : null}
        </>
      );
    } else if (
      isUnknownUser &&
      isSmartContract === null &&
      !pairs?.length &&
      isValidAddress(token)
    ) {
      fullResults = (
        <UnknownResult
          setTrigger={setTrigger}
          isUnknownUser={isUnknownUser}
          callback={callback}
        />
      );
    } else if (isSmartContract !== null && isValidAddress(token)) {
      fullResults = (
        <NotListed
          setTrigger={setTrigger}
          unknownSC={isSmartContract}
          setUnknownSC={setIsSmartContract}
        />
      );
    } else fullResults = <NoResult setTrigger={setTrigger} />;

    return fullResults;
  };

  const render = getContentToRender();

  const completeResults = isUnknownUser
    ? [`/wallet/${token}`]
    : [
        ...(results?.filter((entry) => entry.id) || [])?.map(
          (entry) => `/asset/${getUrlFromName(entry.name)}`
        ),
        ...(users || [])?.map((entry) => `/wallet/${entry.address}`),
      ];

  const getEns = async (ensQuery: string) => {
    if (!ensQuery.includes(".eth")) return;
    const publicClient = createPublicClient({
      chain: mainnet,
      transport: http(mainnet.rpcUrls[0]),
    });
    const ensAddress = await publicClient.getEnsAddress({
      name: normalize(ensQuery),
    });

    if (ensAddress)
      setEns({
        name: ensQuery,
        address: ensAddress,
      });
  };

  useEffect(() => {
    handleMixpanel(timerRef as any, token, results);
  }, [token, results]);

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      if (callback) {
        const content = completeResults[active]
          .split("/")
          [completeResults[active].split("/").length - 1].split("-")
          .join(" ");
        callback({
          content,
          type: isValidAddress(content) ? "wallet" : "asset",
          label: isValidAddress(content)
            ? addressSlicer(content)
            : content.split("-").join(" "),
        });
      } else {
        setTrigger(false);
        router.push(completeResults[active]);
        if (inputRef.current) inputRef.current.value = "";
      }
    } else if (
      e.key === "ArrowDown" &&
      active <
        (results?.length || 0) +
          (users?.length || 0) +
          (pages?.length || 0) +
          (pairs?.length || 0) +
          (articles?.length || 0) -
          1
    )
      setActive(active + 1);
    else if (e.key === "ArrowUp" && active > 0) setActive(active - 1);
  };

  return (
    <div className="bg-light-bg-secondary dark:bg-dark-bg-secondary rounded-xl">
      <div
        className="flex w-full items-center p-[15px] md:py-[5px] md:px-2.5 border-b border-t sm:border-t-0 border-light-border-primary
       dark:border-dark-border-primary transition-all duration-300 rounded-t-2xl"
      >
        <FiSearch className="text-xl text-light-font-100 dark:text-dark-font-100" />
        <div className="ml-2.5 h-[24px] w-[2px] md:w-[1px] bg-light-font-60 dark:bg-dark-font-60" />
        <input
          className="text-light-font-100 dark:text-dark-font-100 border-none bg-light-bg-secondary dark:bg-dark-bg-secondary w-full "
          onChange={(e) => {
            setToken(e.target.value.split("/").join(""));
            getPagesFromInputValue(setPages, e.target.value);
            getEns(e.target.value);
            getDataFromInputValue(
              e.target.value,
              supabase,
              setUsers,
              setUserWithAddress
            );
          }}
          onKeyDown={handleKeyDown}
          ref={inputRef}
          id="search"
          placeholder={token || "Search for asset, wallet, pair or page."}
        />
        <button
          className="pl-2.5 hidden md:flex"
          onClick={() => setTrigger(false)}
        >
          <AiOutlineClose className="text-light-font-100 dark:text-dark-font-100 text-sm mr-2.5" />
        </button>
      </div>
      <div className="transition-all duration-300 flex flex-col max-h-[60vh] sm:max-h-calc-full-56 overflow-y-scroll scroll">
        <div className="flex flex-col py-2.5 w-full">{render}</div>
      </div>
    </div>
  );
};
