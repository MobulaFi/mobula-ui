import { Collapse } from "components/collapse";
import { blockchainsContent } from "mobula-lite/lib/chains/constants";
import { useRouter } from "next/navigation";
import React, { useContext, useState } from "react";
import { BsChevronDown, BsChevronUp } from "react-icons/bs";
import { VscArrowSwap } from "react-icons/vsc";
import { useAccount } from "wagmi";
import { SmallFont } from "../../../../components/fonts";
import { NextChakraLink } from "../../../../components/link";
import { CommonPageContext } from "../../../../contexts/commun-page";
import { getUrlFromName } from "../../../../utils/formaters";
import { Navigation } from "../../model";

interface MobileProps {
  isFooter?: boolean;
  navigation: Navigation[];
}

export const Mobile = ({ isFooter, navigation }: MobileProps) => {
  const { isConnected } = useAccount();
  const { isMenuMobile, setIsMenuMobile, extended, setExtended } =
    useContext(CommonPageContext);
  const router = useRouter();
  const [showChains, setShowChains] = useState(false);
  const blockchains = Object.entries(blockchainsContent)?.filter(
    (x) => x[1]?.FETCH_BLOCKS
  );
  return (
    <div className="flex flex-col w-full">
      {navigation.map((entry) => {
        if (entry.name !== "Swap")
          return (
            <div
              className="flex py-2.5 flex-col px-[30px] border-b border-light-bg-primary dark:border-dark-bg-primary "
              key={`${entry.url}-${entry.name}`}
              onClick={() => {
                if (entry.url) {
                  router.push(entry.url);
                  if (!isFooter) setIsMenuMobile(!isMenuMobile);
                } else {
                  setExtended({
                    Cyptocurrencies: false,
                    Ecosystem: false,
                    Tools: false,
                    "Mobula DAO": false,
                    [entry.name]: !extended[entry.name],
                  });
                }
              }}
            >
              <div className="flex items-center cursor-pointer">
                <p className="text-base text-light-font-100 dark:text-dark-font-100">
                  {entry.name}
                </p>
                {entry.name !== "Profile" ? (
                  <>
                    {entry.extends && extended[entry.name] ? (
                      <BsChevronUp className="ml-auto text-light-font-100 dark:text-dark-font-100 text-base" />
                    ) : (
                      <BsChevronDown className="ml-auto text-light-font-100 dark:text-dark-font-100 text-base" />
                    )}
                  </>
                ) : null}
              </div>
              <Collapse
                isOpen={extended[entry.name]}
                startingHeight="max-h-[0px]"
                maxH="max-h-[200px]"
              >
                <div className="flex mt-2.5 flex-col text-base cursor-pointer">
                  {entry.extends.map((submenu, i) => (
                    <NextChakraLink
                      href={
                        submenu.name === "Watchlist"
                          ? isConnected
                            ? submenu.url
                            : ""
                          : submenu.url
                      }
                      extraCss={`mb-[3px] w-fit my-1 ${
                        isFooter
                          ? "text-light-font-60 dark:text-dark-font-60"
                          : "text-light-font-100 dark:text-dark-font-100"
                      }`}
                      key={`${submenu.url}-${submenu.name}`}
                      onClick={() => {
                        setIsMenuMobile(false);
                      }}
                    >
                      <div
                        className={`flex items-center ${
                          i !== entry.extends?.length - 1 ? " mb-2.5" : ""
                        }`}
                      >
                        {isFooter ? null : (
                          <div
                            className="flex rounded-md w-6 h-6 bg-light-bg-hover dark:bg-dark-bg-hover
                         items-center justify-center p-1"
                          >
                            {submenu.icon}
                          </div>
                        )}
                        <p className="text-sm ml-2.5">{submenu.name}</p>
                      </div>
                    </NextChakraLink>
                  ))}
                </div>
              </Collapse>
            </div>
          );
        return <></>;
      })}
      <div className="flex pt-2.5 flex-col px-[30px]">
        <div
          className="flex items-center cursor-pointer"
          onClick={() => setShowChains((prev) => !prev)}
        >
          <p className="text-base text-light-font-100 dark:text-dark-font-100">
            Blockchains ({blockchains?.length})
          </p>
          {showChains ? (
            <BsChevronUp className="ml-auto text-light-font-100 dark:text-dark-font-100 text-base" />
          ) : (
            <BsChevronDown className="ml-auto text-light-font-100 dark:text-dark-font-100 text-base" />
          )}
        </div>
        <Collapse
          isOpen={showChains}
          startingHeight="max-h-[0px]"
          maxH="max-h-[400px]"
        >
          <div className="relative overflow-y-scroll mt-3">
            <div className="flex flex-col whitespace-nowrap relative">
              {blockchains?.map((blockchain, i) => (
                <NextChakraLink
                  href={`/chain/${
                    blockchain[1]?.shortName
                      ? getUrlFromName(blockchain[1]?.shortName)
                      : getUrlFromName(blockchain[0])
                  }`}
                >
                  <div
                    className={`flex items-center ${
                      i !== blockchains?.length - 1 ? "mb-4" : ""
                    }`}
                    key={blockchain[0]}
                    onClick={() => {
                      setIsMenuMobile(false);
                    }}
                  >
                    <img
                      src={blockchain[1]?.logo || "/empty/unknown.png"}
                      className="h-[18px] w-[18px] min-w-[18px] rounded-full"
                    />
                    <div className="w-fit ml-2.5">
                      <SmallFont extraCss={`font-poppins text-sm md:text-sm`}>
                        {blockchain[1]?.shortName || blockchain[0]}
                      </SmallFont>
                    </div>
                  </div>
                </NextChakraLink>
              ))}
            </div>{" "}
            <div className="from-light-bg-primary to-[rgba(0,0,0,0)] h-[30px] w-full sticky bottom-[-10px] bg-gradient-to-t dark:from-dark-bg-primary dark:to-[rgba(0,0,0,0)]" />{" "}
          </div>
        </Collapse>
      </div>
      <NextChakraLink href="/swap">
        <div
          className="flex py-2.5 mt-2.5 flex-col px-[30px] border-b border-light-bg-primary dark:border-dark-bg-primary"
          onClick={() => setIsMenuMobile(false)}
        >
          <div className="flex items-center">
            <VscArrowSwap className="text-light-font-100 dark:text-dark-font-100 text-[21px] md:text-sm mr-1.5" />
            <p className="text-base text-light-font-100 dark:text-dark-font-100">
              Swap
            </p>
          </div>
        </div>
      </NextChakraLink>
    </div>
  );
};
