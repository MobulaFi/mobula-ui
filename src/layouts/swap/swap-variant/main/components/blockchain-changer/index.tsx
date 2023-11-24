import {
  blockchainsContent,
  blockchainsIdContent,
} from "mobula-lite/lib/chains/constants";
import React, { Dispatch, SetStateAction, useContext } from "react";
import { BsChevronDown } from "react-icons/bs";
import { useNetwork } from "wagmi";
import { SwapContext } from "../../../..";
import { SmallFont } from "../../../../../../components/fonts";

interface BlockchainChangerProps {
  setShowBlockchainSelector: Dispatch<SetStateAction<boolean>>;
  selector?: boolean;
}

export const BlockchainChanger = ({
  setShowBlockchainSelector,
  selector = true,
}: BlockchainChangerProps) => {
  const { tokenOut, chainNeeded } = useContext(SwapContext);
  const { chain } = useNetwork();

  if (tokenOut) {
    const blockchain =
      "blockchain" in tokenOut
        ? tokenOut.blockchain
        : blockchainsIdContent[chainNeeded || chain?.id || 1]?.name;
    const isBnbChain: boolean = blockchain === "BNB Smart Chain (BEP20)";
    return (
      <button onClick={() => setShowBlockchainSelector((prev) => !prev)}>
        <div className="flex items-center">
          <img
            className="rounded-full w-[15px] h-[15px] md:w-[13px] md:h-[13px]"
            src={blockchainsContent[blockchain].logo}
            alt={`${blockchain} logo`}
          />
          <SmallFont extraCss="mx-[5px]">
            {isBnbChain ? "BNB Chain" : blockchain}
          </SmallFont>
          {selector && (
            <BsChevronDown className="text-light-font-100 dark:text-dark-font-100 text-[17px] md:text-[15px] mr-2.5" />
          )}
        </div>
      </button>
    );
  }
  return null;
};