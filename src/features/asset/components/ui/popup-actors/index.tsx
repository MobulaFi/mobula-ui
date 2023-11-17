import {
  Button,
  Flex,
  Icon,
  Image,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
} from "@chakra-ui/react";

import {
  BsFacebook,
  BsGlobe,
  BsLinkedin,
  BsReddit,
  BsTelegram,
  BsThreeDotsVertical,
  BsTwitter,
  BsYoutube,
} from "react-icons/bs";
import {FaMedium} from "react-icons/fa";
import {SiCrunchbase} from "react-icons/si";

import {TextSmall} from "../../../../../../UI/Text";
import {useColors} from "../../../../../../common/utils/color-mode";

export const ActorsPopup = ({visible, setVisible, data}) => {
  const {boxBg3, borders, text40, text100, hover, text80} = useColors();

  const getIconFromType = type => {
    switch (type) {
      case "CRUNCHBASE":
        return (
          <Icon
            as={SiCrunchbase}
            mr="7.5px"
            boxSize={["14px", "14px", "18px"]}
            color="#0C4163"
          />
        );
      case "TWITTER":
        return (
          <Icon
            as={BsTwitter}
            mr="7.5px"
            boxSize={["14px", "14px", "18px"]}
            color="#1DA1F2"
          />
        );
      case "LINKEDIN":
        return (
          <Icon
            as={BsLinkedin}
            mr="7.5px"
            boxSize={["14px", "14px", "18px"]}
            color="#0A66C2"
          />
        );
      case "WEBSITE":
        return (
          <Icon
            as={BsGlobe}
            mr="7.5px"
            boxSize={["12px", "12px", "16px"]}
            color={text80}
          />
        );
      case "MEDIUM":
        return (
          <Icon
            as={FaMedium}
            mr="7.5px"
            boxSize={["15px", "15px", "19px"]}
            color={text100}
          />
        );
      case "YOUTUBE":
        return (
          <Icon
            as={BsYoutube}
            mr="7.5px"
            boxSize={["15px", "15px", "19px"]}
            color="#FF0000"
          />
        );
      case "REDDIT":
        return (
          <Icon
            as={BsReddit}
            mr="7.5px"
            boxSize={["15px", "15px", "19px"]}
            color="#ff4500"
          />
        );
      case "FACEBOOK":
        return (
          <Icon
            as={BsFacebook}
            mr="7.5px"
            boxSize={["15px", "15px", "19px"]}
            color="#3b5998"
          />
        );
      case "TELEGRAM_ANN":
        return (
          <Icon
            as={BsTelegram}
            mr="7.5px"
            boxSize={["15px", "15px", "19px"]}
            color="#2AABEE"
          />
        );
      case "TELEGRAM_CHAT":
        return (
          <Icon
            as={BsTelegram}
            mr="7.5px"
            boxSize={["15px", "15px", "19px"]}
            color="#2AABEE"
          />
        );
      default:
        return null;
    }
  };

  return (
    <Modal
      motionPreset="none"
      isOpen={visible}
      onClose={() => setVisible(false)}
    >
      <ModalOverlay />
      <ModalContent
        bg={boxBg3}
        boxShadow="none"
        borderRadius="16px"
        w={["90%", "90%", "100%"]}
        maxW="500px"
        border={borders}
      >
        <ModalHeader
          pb="0px"
          color={text80}
          fontSize={["16px", "16px", "18px", "20px"]}
        >
          Core Actors
        </ModalHeader>
        <ModalCloseButton color={text80} />
        <ModalBody p="20px" maxH="435px" overflowY="scroll">
          {data.map(item => (
            <Flex align="center" mb="15px" justify="space-between">
              <Flex align="center">
                <Flex position="relative">
                  <Image
                    src={item.image}
                    boxSize={["32px", "32px", "38px"]}
                    borderRadius="full"
                    mr="10px"
                    boxShadow="1px 2px 13px 4px rgba(0, 0, 0, 0.1)"
                  />
                  {item.country?.flag ? (
                    <Image
                      src={item.country.flag}
                      boxSize={["12px", "12px", "15px"]}
                      borderRadius="full"
                      position="absolute"
                      bottom="-3px"
                      right="8px"
                    />
                  ) : null}
                </Flex>
                <Flex direction="column">
                  <TextSmall color={text40} fontWeight="500" mb="2px">
                    {item.type}
                  </TextSmall>
                  <TextSmall color={text80} fontWeight="500">
                    {item.name}
                  </TextSmall>
                </Flex>
              </Flex>
              {item?.links?.length > 0 ? (
                <Menu offset={[-200, 10]}>
                  <MenuButton as={Button}>
                    <Icon as={BsThreeDotsVertical} boxSize="18px" />
                  </MenuButton>
                  <MenuList
                    border={borders}
                    bg={boxBg3}
                    borderRadius="16px"
                    boxShadow="1px 2px 13px 4px rgba(0,0,0,0.15)"
                  >
                    {item.links?.map(link => (
                      <MenuItem
                        bg={boxBg3}
                        _hover={{bg: hover}}
                        transition="all 250ms ease-in-out"
                        onClick={() => window.open(link.link, "_blank")}
                        fontSize={["12px", "12px", "13px", "14px"]}
                      >
                        {getIconFromType(link.type)}{" "}
                        {link.type.toLowerCase().slice(0, 1).toUpperCase() +
                          link.type.toLowerCase().slice(1)}
                      </MenuItem>
                    ))}
                  </MenuList>
                </Menu>
              ) : null}
            </Flex>
          ))}
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
