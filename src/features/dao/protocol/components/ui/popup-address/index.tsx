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
import {TextSmall} from "../../../../../../UI/Text";
import {useColors} from "../../../../../../common/utils/color-mode";

export const PopupAddress = ({isOpen, setIsOpen, distribution}) => {
  const {boxBg3, text80, borders} = useColors();
  return (
    <Modal motionPreset="none" isOpen={isOpen} onClose={() => setIsOpen(false)}>
      <ModalOverlay />
      <ModalContent
        bg={boxBg3}
        boxShadow="none"
        borderRadius="16px"
        w={["90%", "90%", "100%"]}
        maxW="490px"
        border={borders}
      >
        <ModalHeader
          pb="0px"
          color={text80}
          fontSize={["16px", "16px", "18px", "20px"]}
        >
          {distribution?.name || "Distribution"}
        </ModalHeader>
        <ModalCloseButton color={text80} />
        <ModalBody p={["10px 20px 20px 20px", "15px 20px 20px 20px", "20px"]}>
          {distribution?.addresses?.map(({address, blockchain}, i) => (
            <Flex
              align="center"
              pt={[i === 0 ? "10px" : "5px"]}
              pb={[distribution.addresses.length - 1 === i ? "10px" : "5px"]}
            >
              {blockchain && (
                <Image
                  src={blockchainsContent[blockchain].logo}
                  borderRadius="full"
                  mr="7.5px"
                  boxSize={["16px", "16px", "20px"]}
                />
              )}
              <TextSmall
                overflowX="pre-wrap"
                whiteSpace="pre-wrap"
                wordBreak="break-all"
              >
                {address}
              </TextSmall>
            </Flex>
          ))}
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
