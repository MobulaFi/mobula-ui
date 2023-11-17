import { blockchainsContent } from "mobula-lite/lib/chains/constants";
import React, { useContext, useState } from "react";
import {
  AiFillCaretDown,
  AiOutlineDoubleLeft,
  AiOutlineDoubleRight,
} from "react-icons/ai";
import { BsCheckLg } from "react-icons/bs";
import { useNetwork } from "wagmi";
import { Button } from "../../../../components/button";
import { PopupUpdateContext } from "../../../../contexts/popup";

interface ChainsChangerProps {
  isMobileVersion?: boolean;
  showChainPopover?: boolean;
  setShowChainPopover?: React.Dispatch<React.SetStateAction<boolean>>;
  setShowInfoPopover?: React.Dispatch<React.SetStateAction<boolean>>;
  showInfoPopover?: boolean;
}

export const ChainsChanger = ({
  isMobileVersion,
  showChainPopover,
  setShowChainPopover,
  setShowInfoPopover,
  showInfoPopover,
}: ChainsChangerProps) => {
  const { chain } = useNetwork();

  const getNameReducted = (name) => {
    if (name === "Avalanche C-Chain") return "Avalanche";
    if (name === "BNB Smart Chain (BEP20)") return "BNB";
    return name;
  };
  const { setShowSwitchNetwork, setConnect } = useContext(PopupUpdateContext);
  const [showXBlockchains, setShowXBlockchains] = useState([1, 8]);

  const orderBlockchainsByNewest = () => {
    const newArray = [...Object.entries(blockchainsContent)];
    [newArray[2], newArray[21]] = [newArray[21], newArray[2]];
    [newArray[1], newArray[25]] = [newArray[25], newArray[1]];
    [newArray[6], newArray[26]] = [newArray[26], newArray[6]];
    [newArray[9], newArray[22]] = [newArray[22], newArray[9]];
    [newArray[12], newArray[26]] = [newArray[26], newArray[12]];
    [newArray[8], newArray[23]] = [newArray[23], newArray[8]];
    [newArray[10], newArray[20]] = [newArray[20], newArray[10]];
    [newArray[11], newArray[25]] = [newArray[25], newArray[11]];

    const transformArrayToObject = (entriesArray) =>
      entriesArray.reduce((acc, [key, value]) => {
        acc[key] = value;
        return acc;
      }, {});

    const arrayOrdered = transformArrayToObject(newArray);
    return arrayOrdered;
  };

  const newChainsOrder = orderBlockchainsByNewest();

  const moveSelectedToIndexZero = (blockchainsContents, selectedName) => {
    const index = blockchainsContents.findIndex(
      (item) => item.name === selectedName
    );
    if (index !== -1) {
      const newArray = [...blockchainsContents];
      const selectedObject = newArray.splice(index, 1)[0];
      newArray.unshift(selectedObject);
      return newArray;
    }
    return blockchainsContents;
  };

  const reorderedBlockchainsContent = moveSelectedToIndexZero(
    Object.values(newChainsOrder),
    blockchainsContent[chain?.name || 0]?.name
  );

  const showNextButton =
    showXBlockchains[1] <= Object.values(blockchainsContent).length;

  return (
    <div className={`flex ${isMobileVersion ? "" : "lg:hidden"}`}>
      <div className="flex relative w-fit">
        <Button
          extraCss="mr-2.5"
          onClick={() => {
            if (!setShowChainPopover || !setShowInfoPopover) return;
            setShowChainPopover((prev) => !prev);
            if (showChainPopover) setShowXBlockchains([1, 7]);
            if (showInfoPopover) {
              setShowInfoPopover(false);
            }
          }}
        >
          <img
            className="w-[19px] h-[19px] min-w-[19px] rounded-full"
            src={blockchainsContent[chain?.name || "Ethereum"]?.logo}
            alt={`${chain?.name} logo`}
          />
          <AiFillCaretDown
            className={`text-light-font-100 dark:text-dark-font-100 ${
              showChainPopover ? "rotate-180" : ""
            } mt-[0.8px] ml-1.5 text-[11px]`}
          />
        </Button>
        {showChainPopover ? (
          <div
            className={`w-[420px] lg:w-[340px] bg-light-bg-terciary dark:bg-dark-bg-terciary p-2.5 rounded-lg
           border border-light-border-primary dark:border-dark-border-primary absolute z-20 ${
             isMobileVersion ? "right-0" : "left-0"
           } top-[45px] sm:top-[-220px]`}
          >
            <div className="flex flex-wrap">
              {reorderedBlockchainsContent.map((entry, i) => {
                const isOdds = i % 2 === 0;
                const isLasts =
                  Object.values(blockchainsContent).length - 1 === i ||
                  i === showXBlockchains[1] - 1;
                let isSelected = false;
                if (chain)
                  isSelected =
                    blockchainsContent[chain?.name]?.name === entry.name;
                if (
                  i + 1 <= showXBlockchains[1] &&
                  i + 1 >= showXBlockchains[0]
                ) {
                  return (
                    <button
                      key={entry.name}
                      className={`h-[40px] w-[185px] lg:w-[145px] ${
                        isOdds ? "mr-2.5" : ""
                      } ${
                        isSelected
                          ? "bg-light-bg-hover dark:bg-dark-bg-hover"
                          : ""
                      }
                     text-light-font-100 dark:text-dark-font-100 hover:bg-light-bg-hover hover:dark:bg-dark-bg-hover rounded-lg ${
                       isLasts ? "" : "mb-2.5"
                     }
                     text-sm md:text-xs transition-all duration-250`}
                      onClick={() => {
                        if (!chain) {
                          setConnect(true);
                          return;
                        }
                        setShowSwitchNetwork(
                          newChainsOrder?.[entry.name].chainId
                        );
                      }}
                    >
                      <div className="flex items-center w-full h-full px-2.5 font-medium">
                        <img
                          src={
                            blockchainsContent[entry.name || "Ethereum"]?.logo
                          }
                          className="mr-[7.5px] rounded-full w-[22px] h-[22px] min-w-[22px]"
                          alt={`${entry.name} logo`}
                        />

                        {getNameReducted(entry.name)}
                        {isSelected ? (
                          <BsCheckLg className="ml-auto text-light-font-100 dark:text-dark-font-100" />
                        ) : null}
                      </div>
                    </button>
                  );
                }
                return null;
              })}
              {showXBlockchains[1] >= 8 ? (
                <button
                  className={`h-[40px] w-[185px] lg:w-[145px]
                     text-light-font-100 dark:text-dark-font-100 hover:bg-light-bg-hover hover:dark:bg-dark-bg-hover rounded-lg
                     text-sm md:text-xs transition-all duration-250 ${
                       showXBlockchains[1] === 8
                         ? "opacity-50 cursor-not-allowed"
                         : ""
                     }`}
                  onClick={() =>
                    setShowXBlockchains((prev) => [prev[0] - 8, prev[1] - 8])
                  }
                  disabled={showXBlockchains[1] === 8}
                >
                  <div className="flex items-center w-full h-full px-2.5">
                    <AiOutlineDoubleLeft className="text-light-font-80 dark:text-dark-font-80 mr-2.5 text-lg font-medium" />
                    Previous
                  </div>
                </button>
              ) : null}
              <button
                className={`h-[40px] w-[185px] lg:w-[145px]
                     text-light-font-100 dark:text-dark-font-100 hover:bg-light-bg-hover hover:dark:bg-dark-bg-hover rounded-lg
                     text-sm md:text-xs transition-all duration-250 ${
                       showNextButton ? "" : "opacity-50 cursor-not-allowed"
                     }`}
                onClick={() => {
                  if (showXBlockchains[1] >= 7 && showNextButton)
                    setShowXBlockchains((prev) => [prev[1] + 1, prev[1] + 8]);
                }}
                disabled={!showNextButton}
              >
                <div className="flex items-center w-full h-full px-2.5">
                  <AiOutlineDoubleRight className="text-light-font-80 dark:text-dark-font-80 mr-2.5 text-lg font-medium" />
                  Next
                  {showNextButton
                    ? ` (${
                        Object.values(blockchainsContent).length -
                        showXBlockchains[1]
                      })`
                    : null}
                </div>
              </button>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
};
