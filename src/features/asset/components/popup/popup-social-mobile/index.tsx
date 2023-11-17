import {ExternalLinkIcon} from "@chakra-ui/icons";
import {
  Button,
  Flex,
  Icon,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
} from "@chakra-ui/react";
import {useContext} from "react";
import {BsLink45Deg} from "react-icons/bs";
import {FaDiscord, FaTelegramPlane, FaTwitter} from "react-icons/fa";

import {HiOutlineDocumentText} from "react-icons/hi";
import {
  TextLandingMedium,
  TextLandingSmall,
  TextSmall,
} from "../../../../../../UI/Text";
import {useColors} from "../../../../../../common/utils/color-mode";
import {BaseAssetContext} from "../../../context-manager";
import {mainButtonStyle} from "../../../style";

export const PopupSocialMobile = () => {
  const {baseAsset, setShowPopupSocialMobile, showPopupSocialMobile} =
    useContext(BaseAssetContext);
  const {text80, text60, borders, bordersActive, boxBg3, hover} = useColors();

  const links = [
    {
      title: "Official Links",
      content:
        baseAsset?.website || baseAsset?.white_paper
          ? [
              {
                title: "Website",
                link: baseAsset?.website,
                icon: <Icon as={BsLink45Deg} color={text80} fontSize="16px" />,
              },
              {
                title: "Whitepaper",
                link: baseAsset?.white_paper,
                icon: (
                  <Icon
                    as={HiOutlineDocumentText}
                    color={text80}
                    fontSize="14px"
                  />
                ),
              },
            ]
          : null,
    },
    {
      title: "Social Links",
      content:
        baseAsset?.telegram ||
        baseAsset?.chat ||
        baseAsset?.twitter ||
        baseAsset?.discord
          ? [
              {
                title: "Telegram",
                link: baseAsset?.telegram || baseAsset?.chat,
                icon: <Icon as={FaTelegramPlane} color="#30A7DE" />,
              },
              {
                title: "Twitter",
                link: baseAsset?.twitter,
                icon: <Icon as={FaTwitter} color="#1C97EA" />,
              },
              {
                title: "Discord",
                link: baseAsset?.discord,
                icon: <Icon as={FaDiscord} color="#5062F0" />,
              },
            ]
          : null,
    },
    {
      title: "Audit & KYC",
      content:
        baseAsset?.audit || baseAsset?.kyc
          ? [
              {
                title: "Audit",
                link: baseAsset?.audit,
              },
              {
                title: "KYC",
                link: baseAsset?.kyc,
              },
            ]
          : null,
    },
  ];

  return (
    <Modal
      isOpen={showPopupSocialMobile}
      onClose={() => setShowPopupSocialMobile(false)}
    >
      <ModalOverlay />
      <ModalContent
        bg={boxBg3}
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
          <TextLandingMedium color={text80} ml="10px">
            Links
          </TextLandingMedium>
        </ModalHeader>
        <ModalCloseButton color={text80} />
        <ModalBody
          p={["5px 15px 15px 15px", "5px 15px 15px 15px", "15px 20px"]}
        >
          {links.map(link => (
            <Flex
              direction="column"
              key={link.title}
              display={link.content !== null ? "flex" : "none"}
            >
              <TextLandingSmall
                ml="10px"
                fontSize="15px"
                color={text80}
                mb="10px"
                mt="10px"
              >
                {link.title}
              </TextLandingSmall>
              <Flex align="center" wrap="wrap">
                {link.content?.map(item => (
                  <Button
                    sx={mainButtonStyle}
                    bg={boxBg3}
                    border={borders}
                    _hover={{bg: hover, border: bordersActive}}
                    key={item.title}
                    mb="10px"
                    w="fit-content"
                    display={item.link ? "flex" : "none"}
                    onClick={() => window.open(item.link, "_blank")}
                  >
                    {item.icon}
                    <TextSmall ml="5px">{item.title}</TextSmall>
                    <ExternalLinkIcon ml="7.5px" color={text60} />
                  </Button>
                ))}{" "}
              </Flex>
            </Flex>
          ))}
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
