import { SmallFont } from "components/fonts";
import { blockchainsIdContent } from "mobula-lite/lib/chains/constants";
import { Dispatch, SetStateAction } from "react";
import { useNetwork } from "wagmi";
import { Button } from "../../../../components/button";
import { NextImageFallback } from "../../../../components/image";
import { Modal, ModalTitle } from "../../../../components/modal-container";
import { Asset } from "../../model";

/**
 * This component is used to display a modal when the user tries to swap a coin -
 * but the network is not the same as the coin's blockchain. We ask the user to
 * decide if he wants to switch the network or not - if not, we use a wrapped
 * version of the coin.
 *
 * @param asset The asset to display
 * @param setAsset The setter for the asset
 */

interface CoinDecisionProps {
  asset: Asset | null;
  setAsset: Dispatch<SetStateAction<Asset | null>>;
  callback: Function;
}

export const CoinDecision = ({
  asset,
  setAsset,
  callback,
}: CoinDecisionProps) => {
  const { chain } = useNetwork();
  const chainName = blockchainsIdContent[String(chain?.id || 1)]?.name;

  return (
    <Modal
      extraCss="max-w-[330px]"
      isOpen={!!asset}
      onClose={() => setAsset(null)}
    >
      <ModalTitle extraCss="mb-2.5">Switch or wrap?</ModalTitle>
      <NextImageFallback
        width={86}
        height={86}
        className="border-2 border-light-border-primary dark:border-dark-border-primary rounded-full mx-auto"
        src={asset?.logo as string}
        fallbackSrc="/empty/unknown.png"
        alt={`${asset?.name} logo`}
      />
      <SmallFont
        extraCss="mt-5 pt-[15px] text-light-font-60 dark:text-dark-font-60 text-center w-[80%] mx-auto 
      border-t border-light-border-primary dark:border-dark-border-primary"
      >
        You are currently on the {chainName} network. Use Wrapped {asset?.name}{" "}
        or switch to {asset?.blockchain}.
      </SmallFont>
      <Button
        extraCss="border-darkblue dark:border-darkblue hover:border-blue hover:dark:border-blue mt-[15px] w-full"
        onClick={async () => {
          setAsset(null);
          const rightIndex = asset?.blockchains.indexOf(chainName);
          if (asset)
            callback({
              ...asset,
              // Note: this check is not needed, but here to make TS happy
              address:
                "contracts" in asset
                  ? asset.contracts[rightIndex as number]
                  : "",
              blockchain: chainName,
              switch: false,
            });
        }}
      >
        {`Use Wrapped ${asset?.name}`}
      </Button>
      <Button
        extraCss="mt-2.5 w-full"
        onClick={() => {
          setAsset(null);
          callback(asset);
        }}
      >
        {`Switch to ${asset?.blockchain}`}
      </Button>
    </Modal>
  );
};
