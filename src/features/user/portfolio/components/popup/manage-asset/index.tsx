import {
  Flex,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Switch,
} from "@chakra-ui/react";
import React, { useContext } from "react";
import {
  TextLandingMedium,
  TextSmall,
} from "../../../../../../components/fonts";
import { useColors } from "../../../../../../lib/chakra/colorMode";
import { manageAssetOptions } from "../../../constants";
import { PortfolioV2Context } from "../../../context-manager";

export const ManageAssetPopup = () => {
  const {
    showAssetManage,
    setShowAssetManage,
    editAssetManager,
    setEditAssetManager,
  } = useContext(PortfolioV2Context);
  const { borders, text10, boxBg1, text80 } = useColors();

  const handleSwitch = (name: string) => {
    setEditAssetManager({
      ...editAssetManager,
      [name]: !editAssetManager[name],
    });
  };

  return (
    <Modal
      motionPreset="none"
      isOpen={showAssetManage}
      onClose={() => setShowAssetManage(false)}
    >
      <ModalOverlay />
      <ModalContent
        bg={boxBg1}
        borderRadius="16px"
        border={borders}
        p={["15px", "15px", "20px"]}
        boxShadow="none"
        w={["90vw", "100%"]}
        maxW="400px"
      >
        <ModalHeader p="0px" mb="5px">
          <TextLandingMedium>Manage</TextLandingMedium>
        </ModalHeader>
        <ModalCloseButton color={text80} />
        <ModalBody p="0px">
          {manageAssetOptions.map((option) => (
            <Flex align="center" justify="space-between" mt="10px">
              <TextSmall>{option.title}</TextSmall>
              <Switch
                colorScheme="none"
                borderRadius="full"
                isChecked={editAssetManager[option.name]}
                onChange={() => handleSwitch(option.name)}
                size="sm"
                bg={editAssetManager[option.name] ? "blue" : text10}
              />
            </Flex>
          ))}
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
