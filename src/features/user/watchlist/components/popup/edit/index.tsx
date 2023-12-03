import {CheckIcon, CopyIcon, Icon} from "@chakra-ui/icons";
import {
  Box,
  Button,
  Collapse,
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
import {useContext, useRef, useState} from "react";
import {useAlert} from "react-alert";
import {Share} from "react-feather";
import {BsGlobe2} from "react-icons/bs";
import {useAccount} from "wagmi";
import {
  TextExtraSmall,
  TextLandingMedium,
  TextSmall,
} from "../../../../../../UI/Text";
import {UserContext} from "../../../../../../common/context-manager/user";
import {useSignerGuard} from "../../../../../../common/hooks/signerguard";
import {useColors} from "../../../../../../common/utils/color-mode";
import {GET} from "../../../../../../common/utils/fetch";
import {WatchlistContext} from "../../../context-manager";
import {IWatchlist} from "../../../models";
import {editWatchlist} from "../../../utils";

export const EditPopup = ({watchlist}) => {
  const {setShowEdit, showEdit, setEditName, editName, activeWatchlist} =
    useContext(WatchlistContext);
  const {address} = useAccount();
  const alert = useAlert();
  const {user, setUser} = useContext(UserContext);
  const errorRef = useRef<HTMLDivElement>();
  const [isPublic, setIsPublic] = useState(watchlist?.public);
  const {onCopy, hasCopied} = useClipboard("");
  const signerGuard = useSignerGuard();
  const {text80, boxBg6, text40, text60, text10, boxBg1, borders} = useColors();

  const getWatchlistPublic = () => {
    GET("/watchlistpublic", {
      id: watchlist.id,
      account: address,
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
      isOpen={showEdit}
      onClose={() => setShowEdit(false)}
    >
      <ModalOverlay />
      <ModalContent
        bg={boxBg1}
        borderRadius="16px"
        border={borders}
        p={["15px", "15px", "15px"]}
        boxShadow="none"
        w={["90vw", "100%"]}
        maxW="450px"
      >
        <ModalHeader p="0px" mb="15px">
          <TextLandingMedium>Edit Watchlist</TextLandingMedium>
        </ModalHeader>
        <ModalCloseButton color={text80} />

        <ModalBody p="0px" color={text80}>
          <Flex direction="column">
            <TextSmall>Watchlist Name</TextSmall>

            <Input
              h="35px"
              borderRadius="8px"
              bg={boxBg6}
              px="10px"
              mt="10px"
              border={borders}
              color={text80}
              _placeholder={{color: text80}}
              transition="all 250ms ease-in-out"
              onChange={e => {
                if (e.target.value.length < 33 && activeWatchlist) {
                  setEditName({
                    oldname: activeWatchlist.name,
                    newname: e.target.value,
                    watchlist: activeWatchlist.name,
                  });
                  e.target.style.border = borders;
                  errorRef.current.style.opacity = "0";
                } else {
                  e.target.style.border = "1px solid var(--chakra-colors-red)";
                  errorRef.current.style.opacity = "1";
                }
              }}
            />
            <Flex justify="space-between" mt="7.55px">
              <TextExtraSmall color={text40}>
                {editName.newname.length}/32 characters
              </TextExtraSmall>
              <Flex
                ref={errorRef}
                opacity="0"
                transition="all 250ms ease-in-out"
              >
                <TextExtraSmall color="red" fontWeight="500">
                  Should have max 32 characters
                </TextExtraSmall>
              </Flex>
            </Flex>

            <Flex align="center" justify="space-between" mt="15px">
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
                borderRadius="full"
                bg={isPublic ? "blue" : text10}
                isChecked={isPublic}
                onChange={getWatchlistPublic}
              />
            </Flex>
          </Flex>
          <Collapse startingHeight={0} in={isPublic}>
            <Flex direction="column" mt="7.5px">
              <Flex align="center">
                <Icon as={Share} fontSize="18px" mr="10px" color={text40} />
                <TextSmall color={text80}>Share to Community</TextSmall>
              </Flex>
              <InputGroup
                h="35px"
                borderRadius="4px"
                bg={boxBg6}
                px="10px"
                mt="10px"
                border={borders}
              >
                <Input
                  pr="60px"
                  h="100%"
                  color={text80}
                  _placeholder={{color: text80}}
                  textOverflow="ellipsis"
                  value={`https://mobula.app/watchlist/${watchlist?.id}`}
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
                      <CopyIcon ml="5px" color={text60} />
                    )}
                  </Flex>
                </InputRightElement>
              </InputGroup>
            </Flex>
          </Collapse>
          <Button
            variant="outlined"
            color={text80}
            fontWeight="400"
            mt="15px"
            fontSize={["12px", "12px", "13px", "14px"]}
            onClick={() => {
              if (address)
                signerGuard(() => {
                  editWatchlist(editName, address, alert);
                  const newWatchlist: IWatchlist[] = [];
                  for (let i = 0; i < user.watchlist.length; i += 1) {
                    newWatchlist.push(user.watchlist[i]);
                    if (user.watchlist[i].name === editName.oldname)
                      user.watchlist[i].name = editName.newname;
                  }
                  setUser({...user, watchlist: newWatchlist});
                  setShowEdit(false);
                });
            }}
          >
            Edit Watchlist
          </Button>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
