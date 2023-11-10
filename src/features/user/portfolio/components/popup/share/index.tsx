import { CheckIcon } from "@chakra-ui/icons";
import {
  Button,
  Flex,
  Icon,
  Image,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useColorMode,
} from "@chakra-ui/react";
import React, { useContext, useState } from "react";
import { BiCopy } from "react-icons/bi";
import { BsShare } from "react-icons/bs";
import {
  TextLandingMedium,
  TextSmall,
} from "../../../../../../components/fonts";
import { useColors } from "../../../../../../lib/chakra/colorMode";
import {
  addressSlicer,
  getFormattedAmount,
} from "../../../../../../utils/formaters";
import { PortfolioV2Context } from "../../../context-manager";
import { copyText } from "../../../utils";

interface SharePopupProps {
  show: boolean;
  setShow: (show: boolean) => void;
}

export const SharePopup = ({ show, setShow }: SharePopupProps) => {
  const [isCopied, setIsCopied] = useState("");
  const { activePortfolio, isWalletExplorer, wallet } =
    useContext(PortfolioV2Context);
  const { boxBg6, borders, text40, boxBg1, text80 } = useColors();
  const { colorMode } = useColorMode();

  return (
    <Modal motionPreset="none" isOpen={show} onClose={() => setShow(false)}>
      <ModalOverlay />
      <ModalContent
        bg={boxBg1}
        borderRadius="16px"
        border={borders}
        p={["15px", "15px", "15px 20px"]}
        boxShadow="none"
        w={["90vw", "100%"]}
        maxW="390px"
      >
        <ModalHeader p="0px" mb="15px">
          <TextLandingMedium>Share Portfolio</TextLandingMedium>
        </ModalHeader>
        <ModalCloseButton color={text80} />
        <ModalBody p="0px">
          <Flex pb="15px" align="center">
            <Image
              src={
                colorMode === "dark"
                  ? "/mobula/fullicon.png"
                  : "/mobula/mobula-logo.svg"
              }
              boxSize="34px"
            />
            <Flex direction="column" ml="7.5px">
              <TextSmall>
                {isWalletExplorer
                  ? addressSlicer(isWalletExplorer)
                  : activePortfolio?.name}
              </TextSmall>
              <TextSmall color={text40}>
                ${getFormattedAmount(wallet?.estimated_balance)}
              </TextSmall>
            </Flex>
          </Flex>
        </ModalBody>
        <ModalFooter px="0px" pb="0px" pt="15px" borderTop={borders}>
          <Flex direction="column" w="100%">
            <Flex align="center" mb="10px">
              <Icon as={BsShare} mr="10px" color={text80} />
              <TextSmall>Share to Community</TextSmall>
            </Flex>
            <Flex
              align="center"
              justify="space-between"
              px="10px"
              bg={boxBg6}
              borderRadius="8px"
              h="35px"
              color={text80}
            >
              <TextSmall>
                {isWalletExplorer
                  ? `https://mobula.fi/wallet/${addressSlicer(
                      isWalletExplorer
                    )}`
                  : `https://mobula.fi/portfolio/explore/${activePortfolio?.id}`}
              </TextSmall>
              <Button
                fontWeight="400"
                color={text80}
                fontSize={["12px", "12px", "13px", "14px"]}
                onClick={() =>
                  copyText(
                    isWalletExplorer
                      ? `https://mobula.fi/wallet/${isWalletExplorer}`
                      : `https://mobula.fi/portfolio/explore/${activePortfolio?.id}`,
                    setIsCopied
                  )
                }
              >
                {isCopied ? (
                  <CheckIcon color="green" ml="7.5px" fontSize="15px" />
                ) : (
                  <Icon ml="7.5px" as={BiCopy} color={text40} fontSize="15px" />
                )}
              </Button>
            </Flex>
          </Flex>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
