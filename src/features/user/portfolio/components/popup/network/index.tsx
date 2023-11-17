import { CheckIcon } from "@chakra-ui/icons";
import {
  Button,
  Flex,
  Img,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
} from "@chakra-ui/react";
import { blockchainsContent } from "mobula-lite/lib/chains/constants";
import React, { useContext } from "react";
import {
  TextLandingMedium,
  TextSmall,
} from "../../../../../../components/fonts";
import { useColors } from "../../../../../../lib/chakra/colorMode";
import { getFormattedAmount } from "../../../../../../utils/formaters";
import { PortfolioV2Context } from "../../../context-manager";

export const NetworkPopup = () => {
  const {
    setShowNetwork,
    showNetwork,
    activeNetworks,
    setActiveNetworks,
    wallet,
  } = useContext(PortfolioV2Context);
  const { text80, boxBg6, text40, borders, boxBg1 } = useColors();

  const getBlockchainsAmount = () => {
    if (wallet && wallet?.portfolio) {
      const tokens = wallet?.portfolio.map(
        (entry) => entry.cross_chain_balances
      );
      const combinedObject = tokens?.reduce(
        (accumulator, currentObject) => ({ ...accumulator, ...currentObject }),
        {}
      );
      return combinedObject;
    }
    return 0;
  };

  return (
    <Modal
      isOpen={showNetwork}
      onClose={() => {
        setShowNetwork(false);
      }}
    >
      <ModalOverlay />
      <ModalContent
        bg={boxBg1}
        borderRadius="16px"
        border={borders}
        p={["15px", "15px", "15px 20px"]}
        boxShadow="none"
        w={["90vw", "100%"]}
        maxW="400px"
      >
        <ModalHeader p="0px" mb="15px">
          <TextLandingMedium>Active Network</TextLandingMedium>
        </ModalHeader>
        <ModalCloseButton color={text80} />
        <ModalBody p="0px" maxH="420px" overflowY="scroll">
          {Object.values(blockchainsContent).map((blockchain, i) => {
            const isOdds = i % 2 === 0;
            const isBnb = blockchain.name === "BNB Smart Chain (BEP20)";
            const isAvax = blockchain.name === "Avalanche C-Chain";
            const getName = () => {
              if (isBnb) return "BNB Smart Chain";
              if (isAvax) return "Avalanche";
              return blockchain.name;
            };
            const isActiveNetwork = activeNetworks.includes(blockchain.name);

            return (
              <Button
                w="48%"
                mr={isOdds ? "5px" : "0px"}
                h="58px"
                borderRadius="8px"
                bg={isActiveNetwork ? boxBg6 : "none"}
                px="15px"
                mb="5px"
                onClick={() => {
                  if (isActiveNetwork)
                    setActiveNetworks(
                      activeNetworks.filter(
                        (network) => network !== blockchain.name
                      )
                    );
                  else setActiveNetworks([...activeNetworks, blockchain.name]);
                }}
              >
                <Flex align="center" justify="space-between" w="100%">
                  <Flex direction="column" align="flex-start" w="100%">
                    <Flex align="center" justify="flex-start">
                      <Img
                        src={blockchain.logo}
                        boxSize="20px"
                        borderRadius="full"
                      />
                      <TextSmall
                        whiteSpace="pre-wrap"
                        textAlign="start"
                        color={text80}
                        ml="7.5px"
                      >
                        {getName()}
                      </TextSmall>
                    </Flex>
                    <TextSmall color={text40} ml="27.5px">
                      $
                      {getBlockchainsAmount()[blockchain.name]
                        ? getFormattedAmount(
                            getBlockchainsAmount()[blockchain.name]
                          )
                        : 0}
                    </TextSmall>
                  </Flex>
                  {isActiveNetwork ? (
                    <CheckIcon color="blue" ml="10px" />
                  ) : null}
                </Flex>
              </Button>
            );
          })}
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
