import {
  Flex,
  Image,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
} from "@chakra-ui/react";
import {blockchainsContent} from "mobula-lite/lib/chains/constants";
import {BlockchainParams} from "mobula-lite/lib/model";
import React, {useContext} from "react";
import {useNetwork} from "wagmi";
import {SwapContext} from "../../../../..";
import {ColorsContext} from "../../../../../../../../../pages/iframe/swap";
import {TextLandingMedium, TextSmall} from "../../../../../../../../UI/Text";
import {PopupUpdateContext} from "../../../../../../../context-manager/popup";
import {useColors} from "../../../../../../../utils/color-mode";

export const BlockchainSelector = ({
  showBlockchainSelector,
  setShowBlockchainSelector,
  isFrom,
  ...props
}: {
  setShowBlockchainSelector: React.Dispatch<React.SetStateAction<boolean>>;
  showBlockchainSelector: boolean;
  isFrom: boolean;
}) => {
  const {tokenIn, setChainNeeded, chainNeeded} = useContext(SwapContext);
  const {chain} = useNetwork();
  const {bgMain, fontMain, bgBox, borderColor} = useContext(ColorsContext);
  const {borders, text80, boxBg3} = useColors();
  const {setShowSwitchNetwork} = useContext(PopupUpdateContext);

  let blockchains = [];

  if (isFrom)
    blockchains =
      tokenIn && "blockchains" in tokenIn
        ? tokenIn.blockchains
        : [tokenIn?.blockchain];

  return (
    <Modal
      isOpen={showBlockchainSelector}
      onClose={() => setShowBlockchainSelector(false)}
    >
      <ModalOverlay />
      <ModalContent
        bg={bgMain || boxBg3}
        w={["90vw", "350px"]}
        borderRadius="16px"
        border={borderColor ? `1px solid ${borderColor}` : borders}
        boxShadow="none"
        p="15px 20px 20px 20px"
      >
        <ModalHeader p="0px" mb="5px">
          <TextLandingMedium color={fontMain || text80} fontWeight="400">
            Select a chain
          </TextLandingMedium>
        </ModalHeader>
        <ModalCloseButton color={text80} />
        <ModalBody p="0px">
          <Flex wrap="wrap" direction="column" {...props}>
            <Flex wrap="wrap">
              {blockchains.map(entry => {
                const blockchain: BlockchainParams = blockchainsContent[entry];
                if (blockchain === undefined) return null;
                return (
                  <Flex
                    align="center"
                    mr="10px"
                    mt="10px"
                    p="5px 7.5px"
                    h="30px"
                    borderRadius="8px"
                    w="fit-content"
                    bg={bgBox || boxBg3}
                    border={borderColor ? `1px solid ${borderColor}` : borders}
                    cursor={isFrom ? "pointer" : "not-allowed"}
                    _hover={{
                      border: "1px solid var(--chakra-colors-borders-1)",
                    }}
                    transition="all 250ms ease-in-out"
                    onClick={async () => {
                      setShowBlockchainSelector(prev => !prev);
                      if (chain?.id !== blockchain.chainId) {
                        setShowSwitchNetwork(blockchain.chainId);
                      } else if (chainNeeded) {
                        setChainNeeded(undefined);
                      }
                    }}
                    key={entry.id}
                  >
                    <Image
                      transition="all 200ms ease-in-out"
                      src={blockchain.logo}
                      boxSize={["14px", "14px", "17px"]}
                      borderRadius="full"
                    />
                    <TextSmall
                      ml="7.55px"
                      color={fontMain || text80}
                      transition="all 200ms ease-in-out"
                      opacity={isFrom ? "1" : "0.2"}
                    >
                      {entry}
                    </TextSmall>
                  </Flex>
                );
              })}
            </Flex>
          </Flex>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
