import { useClipboard } from "@chakra-ui/react";
import { blockchainsContent } from "mobula-lite/lib/chains/constants";
import { BlockchainName } from "mobula-lite/lib/model";
import React, { useContext } from "react";
// import {useAlert} from "react-alert";
import { BiCopy } from "react-icons/bi";
import { BsCheckLg } from "react-icons/bs";
import { useNetwork } from "wagmi";
import { SmallFont } from "../../../../components/fonts";
import { addressSlicer } from "../../../../utils/formaters";
import { BaseAssetContext } from "../../context-manager";

interface ContractsProps {
  contract: string;
  blockchain: string;
}

export function Contracts({ contract, blockchain }: ContractsProps) {
  const { onCopy, hasCopied } = useClipboard(contract);
  // const alert = useAlert();
  const { baseAsset } = useContext(BaseAssetContext);
  const { chain } = useNetwork();
  const shortenedName =
    blockchain === "BNB Smart Chain (BEP20)"
      ? "BNB Chain"
      : blockchain.split(" ")[0];

  const AddTokenToMetamask = async () => {
    if (chain) {
      try {
        await (window as any).ethereum.request({
          method: "wallet_watchAsset",
          params: {
            type: "ERC20",
            options: {
              address:
                baseAsset.contracts[
                  baseAsset.blockchains.indexOf(chain?.name as BlockchainName)
                ],
              symbol: baseAsset.symbol,
              decimals:
                baseAsset.decimals[
                  baseAsset.blockchains.indexOf(chain?.name as BlockchainName)
                ],
              image: baseAsset.logo, // A string url of the token logo
            },
          },
        });
      } catch (error) {
        // Empty error
      }
    }
    // else {
    //   alert.error(
    //     `Please switch to a network compatible with ${baseAsset.name}`,
    //   );
    // }
  };

  return (
    <div
      className="flex items-center relative justify-between min-w-[220px] lg:min-w-[181px] md:min-w-[135px] 
    rounded bg-light-bg-terciary dark:bg-dark-bg-terciary border border-light-border-primary dark:border-dark-border-primary 
    px-2.5 w-full h-[32px] hover:bg-light-bg-hover hover:dark:bg-dark-bg-hover transition-all duration-250"
    >
      <div className="flex w-full items-center">
        {blockchain ? (
          <img
            className="w-[17px] h-[17px] min-w-[17px] mr-[7px] rounded-full"
            alt={`${blockchain} logo`}
            src={
              blockchainsContent[blockchain]?.logo ||
              `/logo/${blockchain.toLowerCase().split(" ")[0]}.png`
            }
          />
        ) : null}
        <SmallFont extraCss="text-light-font-60 dark:text-dark-font-60">
          {shortenedName}
        </SmallFont>
      </div>
      <div className="flex justify-end ml-5 w-full">
        <SmallFont
          extraCss="mr-2.5 text-start ml-[9px]"
          onClick={() => {
            window.open(
              `${blockchainsContent[blockchain]?.explorer}/address/${contract}`,
              "_blank"
            );
            window.focus();
          }}
        >
          {addressSlicer(contract)}
        </SmallFont>
        <button className="flex items-center text-xs" onClick={onCopy}>
          {hasCopied ? (
            <BsCheckLg className="text-green dark:text-green" />
          ) : (
            <BiCopy className="text-light-font-60 dark:text-dark-font-60" />
          )}
        </button>
        <img
          className="cursor-pointer ml-[7.5px] mt-0.5 min-w-[17px] w-[17px] h-[17px]"
          onClick={AddTokenToMetamask}
          src="/logo/metamask.png"
          alt="metamask logo"
        />
      </div>
    </div>
  );
}
