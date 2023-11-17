import {
  Button,
  Flex,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
} from "@chakra-ui/react";
import React, { useContext, useEffect } from "react";
import {
  TextLandingMedium,
  TextLandingSmall,
} from "../../../../../../components/fonts";
import { useColors } from "../../../../../../lib/chakra/colorMode";
import { PortfolioV2Context } from "../../../context-manager";

export const DeleteNftPopup = () => {
  const { showDeleteNft, setShowDeleteNft, setNftsDeleted } =
    useContext(PortfolioV2Context);
  const { text80, boxBg1, boxBg6, hover, borders, text10, bordersActive } =
    useColors();

  useEffect(() => {
    console.log(localStorage.getItem("hiddenNft"));
  }, []);

  const getNftHidden = () => {
    const nfts = localStorage.getItem("hiddenNft");
    if (nfts) {
      console.log(JSON.parse(nfts));
      localStorage.setItem(
        "hiddenNft",
        JSON.stringify([...JSON.parse(nfts), showDeleteNft.token_hash])
      );
      setNftsDeleted([...JSON.parse(nfts), showDeleteNft.token_hash]);
      return null;
    }
    localStorage.setItem(
      "hiddenNft",
      JSON.stringify([showDeleteNft.token_hash])
    );
    setNftsDeleted([showDeleteNft.token_hash]);
    return null;
  };

  return (
    <Modal
      isOpen={showDeleteNft !== null}
      onClose={() => setShowDeleteNft(null)}
    >
      <ModalOverlay />
      <ModalContent
        bg={boxBg1}
        borderRadius="16px"
        border={borders}
        p={["15px", "15px", "20px"]}
        boxShadow="none"
        w={["90vw", "100%"]}
        maxW="355px"
      >
        <ModalHeader p="0px" mb="5px">
          <TextLandingMedium>Delete your NFT</TextLandingMedium>
        </ModalHeader>
        <ModalCloseButton color={text80} />
        <ModalBody p="0px">
          <Flex bg={text10} h="1px" w="60%" mx="auto" mt="15px" />
          <TextLandingSmall color={text80} my="20px">
            Are you sure that you want to delete {showDeleteNft?.name}?
          </TextLandingSmall>
          <Flex borderTop={borders} pt="15px" pb="0px">
            <Button
              variant="outlined"
              borderRadius="8px"
              fontWeight="400"
              color={text80}
              maxW="fit-content"
              border={borders}
              bg={boxBg6}
              _hover={{
                border: bordersActive,
                bg: hover,
              }}
              mr="10px"
              fontSize={["12px", "12px", "13px", "14px"]}
              onClick={() => setShowDeleteNft(null)}
            >
              Cancel
            </Button>
            <Button
              variant="outlined"
              borderRadius="8px"
              fontWeight="400"
              color={text80}
              maxW="fit-content"
              fontSize={["12px", "12px", "13px", "14px"]}
              onClick={() => {
                setShowDeleteNft(null);
                getNftHidden();
              }}
            >
              Confirm
            </Button>
          </Flex>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
