import {
  Box,
  Button,
  Flex,
  Icon,
  Image,
  Text,
  useColorMode,
} from "@chakra-ui/react";
import { useContext, useEffect } from "react";
import { AiFillPieChart, AiFillStar } from "react-icons/ai";
import { BsMoon, BsPower, BsSun } from "react-icons/bs";
import { FaRegUser } from "react-icons/fa";
import { useAccount } from "wagmi";
import { disconnect } from "wagmi/actions";
import { useThemeValue } from "../../../../../utils/chakra";
import ClientOnly from "../../../../common/components/client-only";
import { NextChakraLink } from "../../../../common/components/links";
import { PopupUpdateContext } from "../../../../common/context-manager/popup";
import { UserContext } from "../../../../common/context-manager/user";
import { pushData } from "../../../../common/data/utils";
import { useUrl } from "../../../../common/hooks/url";
import { useColors } from "../../../../common/utils/color-mode";
import { addressSlicer } from "../../../../common/utils/user";
import { Mobile } from "../../../common/components/navigation";
import { CommonPageContext } from "../../../common/context-manager";
import { navigation } from "../../constants";
import { ChainsChanger } from "../chains-changer";

export const MenuMobile = ({
  showChainPopover,
  setShowChainPopover,
  setShowInfoPopover,
  showInfoPopover,
}: {
  showChainPopover?: boolean;
  setShowChainPopover?: React.Dispatch<React.SetStateAction<boolean>>;
  setShowInfoPopover?: React.Dispatch<React.SetStateAction<boolean>>;
  showInfoPopover?: boolean;
}) => {
  const {address, isConnected} = useAccount();
  const {activeBorder} = useThemeValue();
  const {user} = useContext(UserContext);
  const {isMenuMobile, setIsMenuMobile} = useContext(CommonPageContext);
  const {watchlistUrl} = useUrl();
  const {setConnect} = useContext(PopupUpdateContext);
  const {text80, text40, boxBg6, bgMain} = useColors();
  const {colorMode, toggleColorMode} = useColorMode();
  const isWhiteMode = colorMode === "light";

  useEffect(() => {
    window.onscroll = () => {
      if (isMenuMobile) window.scrollTo(0, 0);
    };

    return () => {
      window.onscroll = () => {};
    };
  }, [isMenuMobile]);

  const {portfolioUrl} = useUrl();

  return (
    <Flex
      bg={bgMain}
      id="mobileNav"
      display={isMenuMobile ? "flex" : "none"}
      zIndex={20}
      pt="15px"
      top="45px"
      width="100vw"
      left="0px"
      h="100vh"
      direction="column"
      color={text80}
      overflowX="hidden"
      position="fixed"
    >
      <Mobile navigation={navigation} />
      <NextChakraLink
        href={watchlistUrl}
        mt="10px"
        onClick={() => {
          setIsMenuMobile(false);
          pushData("Header Clicked", {
            name: "Watchlist",
          });
        }}
      >
        <Flex pl="30px" align="center" mt="10px" color={text80}>
          <Icon as={AiFillStar} color="yellow" fontSize="18px" mr="5px" />
          <Text fontSize="16px">Watchlist</Text>
        </Flex>
      </NextChakraLink>
      <NextChakraLink
        href={portfolioUrl}
        onClick={() => {
          setIsMenuMobile(false);
          pushData("Header Clicked", {
            name: "Portfolio",
          });
        }}
      >
        <Flex pl="30px" align="center" mt="10px" color={text80}>
          <Box opacity={0.8} boxSize="18px" mr="5px">
            <Icon as={AiFillPieChart} color="blue" />
          </Box>
          <Text fontSize="16px">Portfolio</Text>
        </Flex>
      </NextChakraLink>
      <NextChakraLink
        href="/earn"
        onClick={() => {
          setIsMenuMobile(false);
          pushData("Header Clicked", {
            name: "Earn",
          });
        }}
      >
        <Flex pl="30px" align="center" mt="10px" color={text80}>
          <Image
            src="/header/reward.svg"
            alt="Reward"
            width="16px !important"
            maxW="16px"
            boxSize="16px"
            mr="5px"
          />
          <Text fontSize="16px">Learn to earn</Text>
        </Flex>
      </NextChakraLink>
      <ClientOnly>
        {isConnected ? (
          <>
            <Flex mt="20px" bg={boxBg6} align="center" h="40px" px="30px">
              <Text fontSize="16px" color={text80}>
                {!user?.username && user?.address && address
                  ? addressSlicer(address)
                  : user?.username || "Nickname"}
              </Text>
              {address && user?.username ? (
                <Text fontSize="16px" color={text40} ml="5px">
                  ({addressSlicer(address)})
                </Text>
              ) : null}
            </Flex>
            <Flex
              px="30px"
              mt="15px"
              align="center"
              w="100%"
              justify="space-between"
            >
              <NextChakraLink
                href={`/profile/${address}`}
                onClick={() => {
                  setIsMenuMobile(false);
                }}
              >
                <Flex align="center" color={text80}>
                  <Icon fontSize="15px" mr="5px" as={FaRegUser} />
                  <Text fontSize="16px" fontWeight="500">
                    My Profile
                  </Text>
                </Flex>
              </NextChakraLink>
              <Button
                onClick={() => {
                  disconnect();
                }}
              >
                <Flex align="center" color={text80} fontWeight="500">
                  <Icon as={BsPower} fontSize="18px" mr="5px" />
                  <Text fontSize="16px">Log Out</Text>
                </Flex>
              </Button>
            </Flex>{" "}
          </>
        ) : (
          <Button
            border={`1px solid ${activeBorder}`}
            borderRadius="4px"
            h="30px"
            w="120px"
            fontSize="16px"
            fontWeight="400"
            ml="30px"
            mt="20px"
            onClick={() => {
              setConnect(true);
            }}
          >
            Connect
          </Button>
        )}
      </ClientOnly>{" "}
      <Flex justify="space-between" align="center" mt="20px">
        <Button onClick={toggleColorMode} w="fit-content" ml="30px">
          {isWhiteMode ? (
            <Flex align="center">
              <Icon as={BsMoon} fontSize="15px" color={text80} />
              <Text ml="5px" fontSize="16px" fontWeight="500">
                Dark Mode
              </Text>
            </Flex>
          ) : (
            <Flex align="center">
              <Icon as={BsSun} fontSize="15px" color={text80} />
              <Text ml="5px" fontSize="16px" fontWeight="500">
                Light Mode
              </Text>
            </Flex>
          )}
        </Button>
        <Flex mr="15px">
          <ChainsChanger
            isMobileVersion
            showChainPopover={showChainPopover}
            setShowChainPopover={setShowChainPopover}
            setShowInfoPopover={setShowInfoPopover}
            showInfoPopover={showInfoPopover}
          />
        </Flex>
      </Flex>
    </Flex>
  );
};
