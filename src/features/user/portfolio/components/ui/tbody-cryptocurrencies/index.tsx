/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Button,
  Flex,
  Icon,
  Img,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Td,
  Tr,
  useColorMode,
} from "@chakra-ui/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useContext, useEffect, useState } from "react";
import { BiHide, BiShow } from "react-icons/bi";
import { BsThreeDotsVertical } from "react-icons/bs";
import { IoMdAddCircleOutline } from "react-icons/io";
import { VscArrowSwap } from "react-icons/vsc";
import { useAccount } from "wagmi";
import {
  getFormattedAmount,
  getTokenPercentage,
  getUrlFromName,
} from "../../../../../../../utils/helpers/formaters";
import { TextSmall } from "../../../../../../UI/Text";
import {
  PopupStateContext,
  PopupUpdateContext,
} from "../../../../../../common/context-manager/popup";
import { SettingsMetricContext } from "../../../../../../common/context-manager/settings-metric-context";
import { pushData } from "../../../../../../common/data/utils";
import { useWatchlist } from "../../../../../../common/ui/tables/hooks/watchlist";
import { useColors } from "../../../../../../common/utils/color-mode";
import { GET } from "../../../../../../common/utils/fetch";
import { PortfolioV2Context } from "../../../context-manager";
import { useWebSocketResp } from "../../../hooks";
import { UserHoldingsAsset } from "../../../models";
import { flexGreyBoxStyle, tdStyle } from "../../../style";
import { getAmountLoseOrWin } from "../../../utils";
import { Privacy } from "../privacy";

const LinkTd = ({ children, asset, ...props }) => {
  const router = useRouter();
  const basePath = router.asPath.split("?")[0];

  return (
    <Td {...tdStyle} {...props}>
      <Link href={asset ? `${basePath}/${getUrlFromName(asset?.name)}` : "/"}>
        {children}
      </Link>
    </Td>
  );
};

export const TbodyCryptocurrencies = ({
  asset,
}: {
  asset: UserHoldingsAsset;
}) => {
  const {
    setShowAddTransaction,
    isMobile,
    activePortfolio,
    tokenTsx,
    setTokenTsx,
    manager,
    setActivePortfolio,
  } = useContext(PortfolioV2Context);
  const { setShowBuyDrawer } = useContext(SettingsMetricContext);
  const { handleAddWatchlist, inWatchlist } = useWatchlist(asset.id);
  const [isInWatchlist, setIsInWatchlist] = useState(false);
  const [isHover, setIsHover] = useState(null);
  const router = useRouter();
  const {
    text40,
    text80,
    boxBg1,
    borders,
    hover,
    bg,
    boxBg3,
    text60,
    borders2x,
  } = useColors();
  const [changeColor, setChangeColor] = useState(text80);
  const { colorMode } = useColorMode();
  const isDarkMode = colorMode === "dark";

  const {
    setShowAddedToWatchlist,
    setShowMenuTableMobileForToken,
    setShowMenuTableMobile,
    setShowAlert,
  } = useContext(PopupUpdateContext);

  const [showCustomMenu, setShowCustomMenu] = useState(false);

  const { showMenuTableMobileForToken } = useContext(PopupStateContext);

  const refreshPortfolio = useWebSocketResp();

  const { address } = useAccount();

  useEffect(() => {
    if (!asset) return;

    if (asset.estimated_balance_change === true) {
      setChangeColor("green");

      setTimeout(() => {
        setChangeColor(text80);
      }, 1000);
    } else if (asset.estimated_balance_change === false) {
      setChangeColor("red");

      setTimeout(() => {
        setChangeColor(text80);
      }, 1000);
    }
  }, [asset]);

  useEffect(() => {
    setIsInWatchlist(inWatchlist);
  }, [inWatchlist]);

  return (
    <Tr cursor="pointer">
      {isMobile && (
        <Td {...tdStyle} borderBottom={borders}>
          <Flex justify="flex-end">
            <Button
              onClick={() => {
                setShowCustomMenu(!showCustomMenu);
              }}
            >
              <Icon as={BsThreeDotsVertical} color={text80} />
            </Button>
          </Flex>
        </Td>
      )}

      {showCustomMenu && (
        <>
          <Flex
            position="fixed"
            w="100vw"
            h="100vh"
            left="50%"
            zIndex={12}
            transform="translateX(-50%)"
            top="0%"
            display={"flex"}
            bg={isDarkMode ? "rgba(0,0,0,0.4)" : "rgba(255,255,255,0.4)"}
            onClick={() => {
              setShowCustomMenu(!showCustomMenu);
            }}
          />
          <Flex
            direction="column"
            position="fixed"
            display={"flex"}
            bottom={"0px"}
            w="100vw"
            bg={boxBg3}
            borderTop={borders2x}
            zIndex={13}
            left="0px"
            transition="all 300ms ease-in-out"
          >
            <Flex
              p="15px"
              borderBottom={borders}
              _hover={{ bg: hover }}
              transition="all 250ms ease-in-out"
              onClick={() => {
                setShowBuyDrawer(asset as any);
              }}
            >
              <Flex {...flexGreyBoxStyle} bg={isHover === 2 ? "blue" : hover}>
                <Icon as={VscArrowSwap} color={text80} />{" "}
              </Flex>
              Swap
            </Flex>

            <Flex
              p="15px"
              borderBottom={borders}
              _hover={{ bg: hover }}
              transition="all 250ms ease-in-out"
              onClick={() => {
                setTokenTsx(asset);
              }}
            >
              <Flex {...flexGreyBoxStyle} bg={isHover === 0 ? "blue" : hover}>
                <Icon as={BiHide} color={text80} />
              </Flex>
              Hide asset
            </Flex>

            <Flex
              p="15px"
              borderBottom={borders}
              _hover={{ bg: hover }}
              transition="all 250ms ease-in-out"
              onClick={() => {
                router.push(
                  `${router.asPath.split("?")[0]}/${getUrlFromName(asset.name)}`
                );
              }}
            >
              <Flex {...flexGreyBoxStyle} bg={isHover === 1 ? "blue" : hover}>
                <Icon as={BiShow} color={text80} />
              </Flex>
              See transactions
            </Flex>

            <Flex
              p="15px"
              borderBottom={borders}
              _hover={{ bg: hover }}
              transition="all 250ms ease-in-out"
              onClick={() => {
                setTokenTsx(asset);
                setShowAddTransaction(true);
                pushData("Add Asset Button Clicked");
              }}
            >
              <Flex {...flexGreyBoxStyle} bg={isHover === 2 ? "blue" : hover}>
                <Icon as={IoMdAddCircleOutline} color={text80} />
              </Flex>
              Add transactions
            </Flex>
          </Flex>
        </>
      )}
      <LinkTd
        {...tdStyle}
        position="sticky"
        top="0px"
        left="-1px"
        asset={asset}
        borderBottom={borders}
        bg={bg}
      >
        <Flex align="center" minW="130px">
          <Img
            src={asset.image}
            boxSize={["24px", "24px", "28px"]}
            borderRadius="full"
          />
          <Flex
            direction="column"
            overflowX="hidden"
            textOverflow="ellipsis"
            ml={["7.5px", "7.5px", "7.5px", "10px"]}
            fontWeight="500"
            fontSize={["12px", "12px", "13px", "14px"]}
          >
            <TextSmall
              fontWeight="500"
              fontSize={["13px", "13px", "14px"]}
              color={text80}
            >
              {asset.symbol}
            </TextSmall>
            <TextSmall
              fontWeight="500"
              color={text40}
              maxW="130px"
              textOverflow="ellipsis"
              whiteSpace="nowrap"
              overflowX="hidden"
            >
              {asset?.name}
            </TextSmall>
          </Flex>
        </Flex>
      </LinkTd>
      <LinkTd asset={asset} borderBottom={borders} {...tdStyle}>
        <Flex direction="column" align="flex-end" w="100%">
          {manager.privacy_mode ? (
            <Privacy />
          ) : (
            <TextSmall fontWeight="500" textAlign="end" color={changeColor}>
              ${getFormattedAmount(asset.estimated_balance)}
            </TextSmall>
          )}
          {manager.privacy_mode ? (
            <Privacy />
          ) : (
            <TextSmall fontWeight="500" color={text40} textAlign="end">
              {`${getFormattedAmount(asset.token_balance)} ${asset.symbol}`}
            </TextSmall>
          )}
        </Flex>
      </LinkTd>
      <LinkTd asset={asset} borderBottom={borders} {...tdStyle}>
        <Flex direction="column" align="flex-end" w="100%">
          <TextSmall fontWeight="500" textAlign="end" color={changeColor}>
            ${getFormattedAmount(asset.price)}
          </TextSmall>
          <TextSmall
            fontWeight="500"
            color={
              Number(getTokenPercentage(asset.change_24h)) > 0 ? "green" : "red"
            }
            textAlign="end"
          >
            {getTokenPercentage(asset.change_24h)}%
          </TextSmall>
        </Flex>
      </LinkTd>
      <LinkTd asset={asset} borderBottom={borders} {...tdStyle}>
        {manager.privacy_mode ? (
          <Privacy justify="flex-end" />
        ) : (
          <TextSmall
            fontWeight="500"
            color={
              Number(
                getAmountLoseOrWin(asset.change_24h, asset.estimated_balance)
              ) > 0
                ? "green"
                : "red"
            }
            textAlign="end"
          >
            {getFormattedAmount(
              getAmountLoseOrWin(asset.change_24h, asset.estimated_balance)
            )}
            $
          </TextSmall>
        )}
      </LinkTd>
      <LinkTd asset={asset} borderBottom={borders} {...tdStyle}>
        {manager.privacy_mode ? (
          <Privacy justify="flex-end" />
        ) : (
          <TextSmall
            fontWeight="500"
            color={
              Number(getTokenPercentage(asset.realized_usd)) > 0
                ? "green"
                : "var(--chakra-colors-red)"
            }
            textAlign="end"
          >
            {getFormattedAmount(asset.realized_usd)}$
          </TextSmall>
        )}
      </LinkTd>
      <LinkTd asset={asset} borderBottom={borders} {...tdStyle}>
        {manager.privacy_mode ? (
          <Privacy justify="flex-end" />
        ) : (
          <TextSmall
            fontWeight="500"
            color={
              Number(getTokenPercentage(asset.unrealized_usd)) > 0
                ? "green"
                : "red"
            }
            textAlign="end"
          >
            {getFormattedAmount(asset.unrealized_usd)}$
          </TextSmall>
        )}
      </LinkTd>
      {!isMobile && (
        <Td {...tdStyle} borderBottom={borders}>
          <Flex justify="flex-end">
            <Button onClick={() => setShowBuyDrawer(asset as any)}>
              <Icon as={VscArrowSwap} color={text80} />{" "}
            </Button>
            <Menu offset={[-0, 10]}>
              <MenuButton ml="10px" as={Button}>
                <Icon as={BsThreeDotsVertical} color={text80} />
              </MenuButton>
              <MenuList
                bg={boxBg1}
                border={borders}
                borderRadius="8px"
                color={text80}
                boxShadow="1px 2px 13px 3px rgba(0,0,0,0.1)"
                fontSize={["12px", "12px", "13px", "14px"]}
                onMouseEnter={() => setIsHover(0)}
                onMouseLeave={() => setIsHover(null)}
                onClick={() => {
                  pushData("Asset Removed");
                  const newPortfolio = {
                    ...activePortfolio,
                    removed_assets: [
                      ...activePortfolio.removed_assets,
                      asset.id,
                    ],
                  };
                  setActivePortfolio(newPortfolio);
                  refreshPortfolio(newPortfolio);

                  GET("/portfolio/edit", {
                    account: address,
                    removed_assets: [
                      ...activePortfolio.removed_assets,
                      asset.id,
                    ].join(","),
                    removed_transactions:
                      activePortfolio.removed_transactions.join(","),
                    wallets: activePortfolio.wallets.join(","),
                    id: activePortfolio.id,
                    name: activePortfolio.name,
                    reprocess: true,
                    public: activePortfolio.public,
                  });
                }}
              >
                <MenuItem
                  bg={boxBg1}
                  fontSize={["12px", "12px", "13px", "14px"]}
                  onMouseEnter={() => setIsHover(0)}
                  onMouseLeave={() => setIsHover(null)}
                  onClick={() => {
                    setTokenTsx(asset);
                  }}
                >
                  <Flex
                    {...flexGreyBoxStyle}
                    bg={isHover === 0 ? "blue" : hover}
                  >
                    <Icon as={BiHide} color={text80} />
                  </Flex>
                  Hide asset
                </MenuItem>
                <MenuItem
                  bg={boxBg1}
                  onMouseEnter={() => setIsHover(1)}
                  onMouseLeave={() => setIsHover(null)}
                  isDisabled={manager.privacy_mode}
                  fontSize={["12px", "12px", "13px", "14px"]}
                  onClick={() => {
                    router.push(
                      `${router.asPath.split("?")[0]}/${getUrlFromName(
                        asset.name
                      )}`
                    );
                  }}
                >
                  <Flex
                    {...flexGreyBoxStyle}
                    bg={isHover === 1 ? "blue" : hover}
                  >
                    <Icon as={BiShow} color={text80} />
                  </Flex>
                  See transactions
                </MenuItem>
                <MenuItem
                  onMouseEnter={() => setIsHover(2)}
                  onMouseLeave={() => setIsHover(null)}
                  bg={boxBg1}
                  fontSize={["12px", "12px", "13px", "14px"]}
                  onClick={() => {
                    setTokenTsx(asset);
                    setShowAddTransaction(true);
                    pushData("Add Asset Button Clicked");
                  }}
                >
                  <Flex
                    {...flexGreyBoxStyle}
                    bg={isHover === 2 ? "blue" : hover}
                  >
                    <Icon as={IoMdAddCircleOutline} color={text80} />
                  </Flex>
                  Add transactions
                </MenuItem>
              </MenuList>
            </Menu>
          </Flex>
        </Td>
      )}
    </Tr>
  );
};
