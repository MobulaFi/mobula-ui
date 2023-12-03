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
import {pushData} from "../../../../../../common/data/utils";
import {useSignerGuard} from "../../../../../../common/hooks/signerguard";
import {useColors} from "../../../../../../common/utils/color-mode";
import {GET} from "../../../../../../common/utils/fetch";
import {WatchlistContext} from "../../../context-manager";

export const CreatePopup = ({watchlist}) => {
  const {showCreateWL, setShowCreateWL, watchlists} =
    useContext(WatchlistContext);
  const {address} = useAccount();
  const alert = useAlert();
  const {user, setUser} = useContext(UserContext);
  const errorRef = useRef<HTMLDivElement>();
  const errorNameRef = useRef<HTMLDivElement>();
  const [isPublic, setIsPublic] = useState(false);
  const {onCopy, hasCopied} = useClipboard("");
  const signerGuard = useSignerGuard();
  const [name, setName] = useState("");
  const {text80, boxBg6, text40, text60, text10, boxBg1, borders} = useColors();

  const addNewWatchlist = () => {
    if (
      user &&
      user.watchlist?.find(entry => entry.name === name) === undefined
    ) {
      GET("/watchlist/create", {
        account: user?.address,
        name,
        public: isPublic,
      })
        .then(response => response.json())
        .then(add => {
          if (add.error) alert.error(add.error);
          else {
            pushData("Watchlist Added", {
              watchlist_name: name,
            });
            alert.success("Successfully created new watchlist");
            setUser(userBuffer => ({
              ...userBuffer,
              watchlist: [
                ...userBuffer.watchlist,
                {
                  name,
                  assets: [],
                  id: add.id,
                  user_id: user.id,
                  created_at: new Date(),
                },
              ],
            }));
          }
        });
    } else {
      alert.show("Please connect your wallet to add a watchlist");
    }
  };

  return (
    <Modal
      motionPreset="none"
      isOpen={showCreateWL}
      onClose={() => setShowCreateWL(false)}
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
          <TextLandingMedium>Create Watchlist</TextLandingMedium>
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
              _placeholder={{color: text80}}
              color={text80}
              transition="all 250ms ease-in-out"
              onChange={e => {
                if (
                  watchlists?.find(entry => entry.name === e.target.value) !==
                  undefined
                ) {
                  e.target.style.border = "1px solid var(--chakra-colors-red)";
                  errorNameRef.current.style.opacity = "1";
                } else if (e.target.value.length < 33) {
                  setName(e.target.value);
                  e.target.style.border = borders;
                  errorRef.current.style.opacity = "0";
                  errorNameRef.current.style.opacity = "0";
                } else {
                  e.target.style.border = "1px solid var(--chakra-colors-red)";
                  errorRef.current.style.opacity = "1";
                }
              }}
            />
            <Flex justify="space-between" mt="7.55px">
              <TextExtraSmall color={text40}>
                {name.length}/32 characters
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
              <Flex
                ref={errorNameRef}
                opacity="0"
                transition="all 250ms ease-in-out"
              >
                <TextExtraSmall color="red" fontWeight="500">
                  Name already exists
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
                onChange={() => setIsPublic(!isPublic)}
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
                borderRadius="8px"
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
                  addNewWatchlist();
                  setShowCreateWL(false);
                });
            }}
          >
            Create Watchlist
          </Button>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
