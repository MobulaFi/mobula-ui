import {
  Button,
  Image,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
} from "@chakra-ui/react";
import { SmallFont } from "components/fonts";
import { useColors } from "lib/chakra/colorMode";
import { blockchainsIdContent } from "mobula-lite/lib/chains/constants";
import { Dispatch, SetStateAction } from "react";
import { useNetwork } from "wagmi";
import { Asset, Coin } from "../../model";
import { Results } from "./model";

/**
 * This component is used to display a modal when the user tries to swap a coin -
 * but the network is not the same as the coin's blockchain. We ask the user to
 * decide if he wants to switch the network or not - if not, we use a wrapped
 * version of the coin.
 *
 * @param asset The asset to display
 * @param setAsset The setter for the asset
 */

export const CoinDecision = ({
  asset,
  setAsset,
  callback,
}: {
  asset: ((Coin | Asset) & Results) | null;
  setAsset: Dispatch<SetStateAction<((Coin | Asset) & Results) | null>>;
  callback: (asset: (Coin | Asset) & Results) => void;
}) => {
  const { chain } = useNetwork();
  const { boxBg3, borders, borders2x, text80, text60, boxBg6 } = useColors();
  const chainName = blockchainsIdContent[chain?.id || 1]?.name;

  return (
    <Modal motionPreset="none" isOpen={!!asset} onClose={() => setAsset(null)}>
      <ModalOverlay />
      <ModalContent
        bg={boxBg3}
        boxShadow="none"
        borderRadius="16px"
        border={borders}
        w={["90%", "100%"]}
        maxW="330px"
        p="20px"
      >
        <ModalHeader p="0px" mb="20px" color={text80} textAlign="center">
          Switch or wrap?
        </ModalHeader>
        <ModalCloseButton color={text80} />
        <ModalBody p="0px">
          <Image
            src={asset?.logo}
            boxSize="86px"
            borderRadius="full"
            border={borders2x}
            mx="auto"
          />
          <SmallFont
            mt="20px"
            pt="15px"
            borderTop={borders}
            color={text60}
            textAlign="center"
            w="80%"
            mx="auto"
          >
            You are currently on the {chainName} network. Use Wrapped{" "}
            {asset?.name} or switch to {asset?.blockchain}.
          </SmallFont>
          <Button
            variant="outlined"
            fontWeight="400"
            color={text80}
            mt="15px"
            fontSize={["12px", "12px", "13px", "14px"]}
            onClick={async () => {
              setAsset(null);
              const rightIndex = asset?.blockchains.indexOf(chainName);
              callback({
                ...asset,
                // Note: this check is not needed, but here to make TS happy
                address:
                  "contracts" in asset ? asset.contracts[rightIndex] : "",
                blockchain: chainName,
                switch: false,
              });
            }}
          >
            {`Use Wrapped ${asset.name}`}
          </Button>
          <Button
            variant="outlined"
            border="none"
            bg={boxBg6}
            fontWeight="400"
            mt="10px"
            color={text80}
            _hover={{ border: "none" }}
            fontSize={["12px", "12px", "13px", "14px"]}
            onClick={() => {
              setAsset(null);
              callback(asset);
            }}
          >
            {`Switch to ${asset.blockchain}`}
          </Button>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
