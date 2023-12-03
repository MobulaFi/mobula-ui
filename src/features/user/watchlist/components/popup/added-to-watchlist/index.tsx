import {ChevronDownIcon, CloseIcon} from "@chakra-ui/icons";
import {
  Button,
  Flex,
  Img,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Slide,
} from "@chakra-ui/react";
import {useRouter} from "next/router";
import {useContext, useEffect, useRef, useState} from "react";
import {getUrlFromName} from "../../../../../../../utils/helpers/formaters";
import {createSupabaseDOClient} from "../../../../../../../utils/supabase";
import {TextSmall} from "../../../../../../UI/Text";
import {
  PopupStateContext,
  PopupUpdateContext,
} from "../../../../../../common/context-manager/popup";
import {UserContext} from "../../../../../../common/context-manager/user";
import {useWatchlist} from "../../../../../../common/ui/tables/hooks/watchlist";
import {useColors} from "../../../../../../common/utils/color-mode";
import {WatchlistContext} from "../../../context-manager";
import {IWatchlist} from "../../../models";

export const AddedToWatchlistPopup = () => {
  const {setShowAddedToWatchlist} = useContext(PopupUpdateContext);
  const {showAddedToWatchlist} = useContext(PopupStateContext);
  const {tokenToAddInWatchlist} = useContext(WatchlistContext);
  const {user} = useContext(UserContext);
  const supabase = createSupabaseDOClient();
  const router = useRouter();
  const timerRef = useRef(null);
  const [watchlistsOfUser, setWatchlistsOfUser] = useState<IWatchlist[]>([]);
  const [activeWatchlist, setActiveWatchlist] = useState<IWatchlist>();
  const {handleAddWatchlist} = useWatchlist(Number(activeWatchlist?.id));
  const {text80, boxBg6, boxBg3, bordersActive, hover, text40, borders} =
    useColors();

  const getWatchlistsOfUser = () => {
    if (user) {
      supabase
        .from("watchlist")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", {ascending: true})
        .then(r => {
          if (r.data) {
            setWatchlistsOfUser(r.data);
            setActiveWatchlist(
              r.data.filter(entry => entry.main_watchlist)[0] || r.data[0],
            );
          }
        });
    }
  };

  const startTimer = () => {
    if (activeWatchlist)
      timerRef.current = setTimeout(() => {
        handleAddWatchlist(
          Number(tokenToAddInWatchlist?.id),
          Number(activeWatchlist?.id),
          true,
          () => {},
          false,
        );
        setShowAddedToWatchlist(false);
      }, 7000);
  };

  const addToWatchlistAndClose = () => {
    clearTimeout(timerRef.current);
    handleAddWatchlist(
      Number(tokenToAddInWatchlist?.id),
      Number(activeWatchlist?.id),
      true,
      () => {},
      false,
    );
    setShowAddedToWatchlist(false);
  };

  useEffect(() => {
    if (user && showAddedToWatchlist) {
      if (!activeWatchlist) getWatchlistsOfUser();
      if (activeWatchlist) {
        startTimer();
        return () => {
          clearTimeout(timerRef.current);
        };
      }
    }
    return () => {};
  }, [user, activeWatchlist, showAddedToWatchlist]);

  return (
    <Slide
      direction="bottom"
      in={showAddedToWatchlist}
      style={{
        zIndex: 10,
        marginBottom: 20,
      }}
    >
      <Flex
        py={["10px", "10px", "20px"]}
        w="100%"
        maxW="800px"
        borderRadius="8px"
        h="auto"
        mx="auto"
        bg={boxBg3}
        px={["10px", "10px", "20px"]}
        position="relative"
        align="center"
        justify="space-between"
        borderTop={borders}
        boxShadow="1px 2px 13px 4px rgba(0,0,0,0.15)"
        direction={["column", "row"]}
        wrap="wrap"
      >
        <Flex align="center" w={["100%", "auto"]} pl={["0px", "10px", "0px"]}>
          <Img
            src={tokenToAddInWatchlist?.logo}
            boxSize={["45px", "45px", "55px"]}
            borderRadius="full"
            mr={["15px", "15px", "20px"]}
          />
          <Flex direction="column" wrap="wrap" w="100%">
            <Flex align="center" wrap="wrap" mb={["2.5px", "2.5px", "0px"]}>
              <TextSmall mr="7.5px">
                {tokenToAddInWatchlist?.name} is now added on{" "}
              </TextSmall>
              <Menu>
                <MenuButton
                  px="0px"
                  mx="0px"
                  mr="20px"
                  as={Button}
                  textAlign="start"
                  fontSize={["12px", "12px", "13px", "14px"]}
                  color={text80}
                  rightIcon={<ChevronDownIcon color={text80} />}
                >
                  {activeWatchlist?.name}
                </MenuButton>
                <MenuList
                  bg={boxBg6}
                  border={borders}
                  boxShadow="1px 2px 13px 3px rgba(0,0,0,0.1)"
                >
                  {watchlistsOfUser.map(watchlist => (
                    <MenuItem
                      bg={boxBg6}
                      color={
                        activeWatchlist.name === watchlist.name
                          ? text80
                          : text40
                      }
                      key={watchlist.id}
                      _hover={{color: text80}}
                      fontWeight="500"
                      onClick={() => setActiveWatchlist(watchlist)}
                    >
                      {watchlist.name}
                    </MenuItem>
                  ))}
                </MenuList>
              </Menu>
            </Flex>
            <TextSmall color={text40}>
              You can also select another watchlist
            </TextSmall>
          </Flex>
        </Flex>
        <Flex
          mr="20px"
          mt={["15px", "15px", "0px"]}
          w={["100%", "auto"]}
          pl={["10px", "10px", "0px"]}
        >
          <Button
            variant="outlined"
            fontSize={["12px", "12px", "13px", "14px"]}
            mr="10px"
            fontWeight="400"
            color={text80}
            maxW="fit-content"
            h={["30px", "30px", "35px"]}
            minW="120px"
            onClick={() => {
              addToWatchlistAndClose();
              router.push(`/asset/${tokenToAddInWatchlist.name}`);
            }}
          >
            Visit Asset
          </Button>
          <Button
            variant="outlined"
            fontSize={["12px", "12px", "13px", "14px"]}
            mr="10px"
            maxW="fit-content"
            minW="120px"
            border={borders}
            _hover={{border: bordersActive, bg: hover}}
            bg={boxBg6}
            fontWeight="400"
            color={text80}
            onClick={() => {
              addToWatchlistAndClose();
              router.push(
                `/watchlist/${user?.address}/${getUrlFromName(
                  activeWatchlist.name,
                )}`,
              );
            }}
          >
            Visit Watchlist
          </Button>
        </Flex>

        <Button
          position="absolute"
          top="15px"
          right="15px"
          fontSize="12px"
          onClick={addToWatchlistAndClose}
        >
          <CloseIcon color={text80} />
        </Button>
      </Flex>{" "}
    </Slide>
  );
};
