import { explorerTransformer } from "@utils/chains";
import { blockchainsContent } from "mobula-lite/lib/chains/constants";
import { BlockchainName } from "mobula-lite/lib/model";
import { useContext, useState } from "react";
import { BiCopy } from "react-icons/bi";
import { BsCheckLg } from "react-icons/bs";
import { useNetwork } from "wagmi";
import { SmallFont } from "../../../../components/fonts";
import { NextImageFallback } from "../../../../components/image";
import { NextChakraLink } from "../../../../components/link";
import { triggerAlert } from "../../../../lib/toastify";
import { addressSlicer } from "../../../../utils/formaters";
import { BaseAssetContext } from "../../context-manager";

interface ContractsProps {
  contract: string;
  blockchain: BlockchainName;
  title?: string;
}

export function Contracts({ contract, blockchain, title }: ContractsProps) {
  const [hasCopied, setHasCopied] = useState(false);
  const { baseAsset } = useContext(BaseAssetContext);
  const { chain } = useNetwork();

  const getShortenedName = (name: string) => {
    if (!title) {
      if (name === "BNB Smart Chain (BEP20)") return "BNB Chain";
      else return name.split(" ")[0];
    } else return name;
  };

  const shortenedName = getShortenedName(title || blockchain);

  const onCopy = () => {
    navigator.clipboard.writeText(contract);
    setHasCopied(true);
    setTimeout(() => setHasCopied(false), 2000);
  };

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
    } else {
      triggerAlert(
        "Error",
        `Please switch to a network compatible with ${baseAsset.name}`
      );
    }
  };

  return (
    <div
      className="flex items-center relative justify-between min-w-[260px] lg:min-w-[181px] md:min-w-[135px] 
    rounded-md bg-light-bg-terciary dark:bg-dark-bg-terciary border border-light-border-primary dark:border-dark-border-primary 
    w-full px-2.5 h-[32px] hover:bg-light-bg-hover hover:dark:bg-dark-bg-hover transition-all duration-200 overflow-visible"
    >
      <div className="flex items-center">
        {blockchain && !title ? (
          <NextImageFallback
            width={17}
            height={17}
            style={{
              minWidth: "17px",
              marginRight: "7px",
              borderRadius: "50%",
            }}
            alt={`${blockchain} logo`}
            src={
              blockchainsContent[blockchain]?.logo ||
              `/logo/${blockchain.toLowerCase().split(" ")[0]}.png` ||
              "/empty/unknown.png"
            }
            fallbackSrc="/empty/unknown.png"
          />
        ) : null}
        <SmallFont extraCss="text-light-font-60 dark:text-dark-font-60 whitespace-nowrap">
          {shortenedName}
        </SmallFont>
      </div>
      <div className="flex justify-end ml-5">
        <NextChakraLink
          href={explorerTransformer(blockchain, contract, "address")}
          target="_blank"
          rel="norefer"
          className="mr-2.5 text-start ml-[9px]"
        >
          <SmallFont>{addressSlicer(contract)}</SmallFont>
        </NextChakraLink>
        <button className="flex items-center text-xs" onClick={onCopy}>
          {hasCopied ? (
            <BsCheckLg className="text-green dark:text-green" />
          ) : (
            <BiCopy className="text-light-font-60 dark:text-dark-font-60" />
          )}
        </button>
        {!title ? (
          <NextImageFallback
            width={17}
            height={17}
            style={{
              cursor: "pointer",
              marginLeft: "7.5px",
              marginTop: "2px",
              minWidth: "17px",
            }}
            onClick={AddTokenToMetamask}
            src="/logo/metamask.png"
            alt="metamask logo"
            fallbackSrc="/empty/unknown.png"
          />
        ) : null}
      </div>
    </div>
  );
}
