import {CheckIcon, CopyIcon, Icon} from "@chakra-ui/icons";
import {
  Box,
  Flex,
  Input,
  InputGroup,
  InputRightElement,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Switch,
  useClipboard,
} from "@chakra-ui/react";
import {useContext, useEffect, useState} from "react";
import {useAlert} from "react-alert";
import {Share} from "react-feather";

import {BsGlobe2} from "react-icons/bs";

import {getUrlFromName} from "../../../../../../../utils/helpers/formaters";
import {
  TextExtraSmall,
  TextLandingMedium,
  TextSmall,
} from "../../../../../../UI/Text";
import {UserContext} from "../../../../../../common/context-manager/user";
import {useColors} from "../../../../../../common/utils/color-mode";
import {GET} from "../../../../../../common/utils/fetch";
import {WatchlistContext} from "../../../context-manager";

export const SharePopup = ({watchlist}) => {
  const [isPublic, setIsPublic] = useState(watchlist?.public);
  const {user} = useContext(UserContext);
  const alert = useAlert();
  const {onCopy, setValue, hasCopied} = useClipboard("");
  const {showShare, setShowShare} = useContext(WatchlistContext);
  const isOwner = watchlist?.user_id === user?.id;
  const {text80, boxBg6, text10, text40, boxBg1, borders} = useColors();

  useEffect(() => {
    if (watchlist)
      setValue(
        `http://mobula.fi/watchlist/${user?.address}/${getUrlFromName(
          watchlist?.name,
        )}`,
      );
  }, [watchlist]);

  const getWatchlistPublic = () => {
    GET("/watchlist/public", {
      id: watchlist.id,
      account: user?.address,
      public: !isPublic,
    })
      .then(r => r.json())
      .then(r => {
        if (r.error) alert.error(r.error);
        else {
          setIsPublic(!isPublic);
          if (isPublic) alert.success("Your watchlist is now public.");
          else alert.success("Your watchlist is now private.");
        }
      });
  };

  return (
    <Modal
      motionPreset="none"
      isOpen={showShare}
      onClose={() => setShowShare(false)}
    >
      <ModalOverlay />
      <ModalContent
        bg={boxBg1}
        borderRadius="16px"
        border={borders}
        p={["15px", "15px", "15px"]}
        boxShadow="none"
        w={["90vw", "100%"]}
        maxW="300px"
      >
        <ModalHeader p="0px" mb="15px">
          <TextLandingMedium>Share</TextLandingMedium>
        </ModalHeader>
        <ModalCloseButton color={text80} />
        <ModalBody p="0px ">
          {isOwner ? (
            <Flex align="center" justify="space-between">
              <Flex align="center">
                <Icon mr="10px" fontSize="18px" as={BsGlobe2} color={text40} />
                <Box>
                  <TextSmall color={text80}>Public</TextSmall>
                  <TextExtraSmall color={text40}>
                    You can share the watchlist
                  </TextExtraSmall>
                </Box>
              </Flex>
              <Switch
                size="sm"
                mt="10px"
                isChecked={isPublic}
                bg={isPublic ? "blue" : text10}
                borderRadius="full"
                onChange={() => getWatchlistPublic()}
              />
            </Flex>
          ) : null}

          <Flex direction="column" mt="7.5px">
            <Flex align="center">
              <Icon as={Share} fontSize="18px" mr="10px" color={text40} />
              <TextSmall color={text80}>Share to Community</TextSmall>
            </Flex>
            <InputGroup
              h="35px"
              borderRadius="8px"
              bg={boxBg6}
              px="10px"
              pl="0px"
              mt="10px"
              border={borders}
            >
              <Input
                pr="60px"
                h="100%"
                color={text80}
                textOverflow="ellipsis"
                value={
                  user && watchlist
                    ? `http://mobula.fi/watchlist/${
                        user?.address
                      }/${getUrlFromName(watchlist?.name)}`
                    : null
                }
              />
              <InputRightElement
                h="100%"
                onClick={() => {
                  onCopy();
                }}
              >
                <Flex
                  h="100%"
                  pr="10px"
                  color={text80}
                  bg={boxBg6}
                  align="center"
                  pl="10px"
                >
                  {hasCopied ? "copied" : "copy"}
                  {hasCopied ? (
                    <CheckIcon ml="5px" color="green" />
                  ) : (
                    <CopyIcon ml="5px" />
                  )}
                </Flex>
              </InputRightElement>
            </InputGroup>
          </Flex>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
