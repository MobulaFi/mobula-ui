import {
  Flex,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
} from "@chakra-ui/react";
import {useContext} from "react";
import {
  TextLandingMedium,
  TextLandingSmall,
  TextSmall,
} from "../../../../../../UI/Text";
import {useColors} from "../../../../../../common/utils/color-mode";
import {BaseAssetContext} from "../../../context-manager";

export const PopupAllTags = () => {
  const {baseAsset, showSeeAllTags, setShowSeeAllTags} =
    useContext(BaseAssetContext);
  const {text80, boxBg1, tags, borders} = useColors();
  return (
    <Modal
      motionPreset="none"
      isOpen={showSeeAllTags}
      onClose={() => setShowSeeAllTags(false)}
    >
      <ModalOverlay />
      <ModalContent
        bg={boxBg1}
        borderRadius="16px"
        border={borders}
        boxShadow="none"
        w={["90vw", "100%"]}
        maxW="420px"
      >
        <ModalHeader
          mb="0px"
          p={["15px", "15px", "20px"]}
          borderBottom={borders}
        >
          <TextLandingMedium color={text80}>
            {baseAsset?.name} Tags
          </TextLandingMedium>
        </ModalHeader>
        <ModalCloseButton color={text80} />
        <ModalBody
          p={["15px 15px 15px 15px", "15px 15px 15px 15px", "15px 20px"]}
        >
          <TextLandingSmall fontSize="15px" mb="10px">
            Category
          </TextLandingSmall>
          <Flex wrap="wrap">
            {baseAsset?.tags?.map(tag => (
              <Flex
                h="24px"
                mt="7.5px"
                w="fit-content"
                px="10px"
                mr="7.5px"
                borderRadius="8px"
                align="center"
                justify="center"
                bg={tags}
                key={tag}
              >
                <TextSmall
                  h="100%"
                  mt={["5px", "5px", "3px", "2px"]}
                  mb={["0px", "0px", "0px", "2px"]}
                >
                  {tag}
                </TextSmall>
              </Flex>
            ))}
          </Flex>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
