import {
  Box,
  Button,
  Collapse,
  Flex,
  Icon,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
} from "@chakra-ui/react";
import { useContext, useState } from "react";
// import {useAlert} from "react-alert";
import React from "react";
import { AiOutlineEdit } from "react-icons/ai";
import { BsThreeDotsVertical, BsTrash3 } from "react-icons/bs";
import { IoMdAddCircleOutline } from "react-icons/io";
import { useAccount } from "wagmi";
import {
  TextLandingMedium,
  TextLandingSmall,
  TextSmall,
} from "../../../../../../components/fonts";
import { useColors } from "../../../../../../lib/chakra/colorMode";
import { GET } from "../../../../../../utils/fetch";
import { getFormattedAmount } from "../../../../../../utils/formaters";
import { colors } from "../../../constants";
import { PortfolioV2Context } from "../../../context-manager";
import { buttonSquareStyle, flexGreyBoxStyle } from "../../../style";
import { CreatePortfolio } from "../create-portfolio";
import { RenamePortfolio } from "../rename-portfolio";

export const SelectorPortfolioPopup = () => {
  // const alert = useAlert();
  const {
    activePortfolio,
    showPortfolioSelector,
    setShowPortfolioSelector,
    setShowCreatePortfolio,
    showCreatePortfolio,
    userPortfolio,
    setActivePortfolio,
    setUserPortfolio,
    wallet,
  } = useContext(PortfolioV2Context);
  const [isHover, setIsHover] = useState<null | number>(null);
  const [showPopover, setShowPopover] = useState<null | number[]>(null);
  const { boxBg3, boxBg6, borders, text60, boxBg1, text80, text40, hover } =
    useColors();
  const [showEditName, setShowEditName] = useState<number | false>(false);
  const { address } = useAccount();

  const removePortfolio = (id, name) => {
    GET("/portfolio/delete", { id, account: address })
      .then((resp) => resp.json())
      .then((resp) => {
        if (resp.error) {
          return;
          // alert.error(resp.error);
        } else {
          // alert.success("Successfully deleted your portfolio");
          setUserPortfolio(userPortfolio.filter((prev) => prev.name !== name));
        }
      });
  };

  return (
    <Modal
      isOpen={showPortfolioSelector}
      onClose={() => {
        setShowPortfolioSelector(false);
      }}
      motionPreset="none"
    >
      <ModalOverlay />
      <ModalContent
        bg={boxBg1}
        borderRadius="16px"
        border={borders}
        p={["15px", "15px", "15px 20px"]}
        boxShadow="none"
        w={["90vw", "100%"]}
        maxW="400px"
      >
        <ModalHeader p="0px" mb="5px">
          <TextLandingMedium>My Portfolios</TextLandingMedium>
          <TextLandingSmall>
            Total:{" "}
            {`$${getFormattedAmount(
              userPortfolio.reduce((acc, otherPortfolio) => {
                if (
                  otherPortfolio.portfolio &&
                  otherPortfolio.id !== activePortfolio.id
                ) {
                  return (
                    acc +
                    otherPortfolio.portfolio.reduce(
                      (balance, curr) => balance + curr.balance_usd,
                      0
                    )
                  );
                }
                return acc;
              }, 0) + (wallet?.estimated_balance || 0)
            )}`}{" "}
          </TextLandingSmall>
        </ModalHeader>
        <ModalCloseButton color={text80} />
        <ModalBody p="0px" mb="15px">
          {userPortfolio?.map((otherPortfolio, index) => {
            console.log(wallet);
            const isActive = activePortfolio?.id === otherPortfolio.id;
            const totalBalance = isActive
              ? wallet?.estimated_balance || 0
              : otherPortfolio.portfolio.reduce(
                  (acc, curr) => acc + curr.balance_usd,
                  0
                );
            const assets = isActive
              ? wallet?.portfolio || []
              : otherPortfolio.portfolio;

            const finalAssets = assets
              // This is bad, but name for Portfolio ("cache") holdings isn't the same as
              // live (main) holdings. So we need to use the ||from balance_ud & estimated_balance
              .map((a) => ({
                ...a,
                balance_usd: a.balance_usd || a.estimated_balance || 0,
              }))
              .sort((a, b) => {
                if (a.balance_usd > b.balance_usd) return -1;
                if (a.balance_usd < b.balance_usd) return 1;
                return 0;
              })
              .slice(0, 10);

            console.log(activePortfolio.portfolio, "im here");
            // eslint-disable-next-line react-hooks/rules-of-hooks

            return (
              <Flex direction="column">
                <Flex
                  align="center"
                  mt="10px"
                  justify="space-between"
                  bg={isActive || isHover === index ? boxBg6 : undefined}
                  onMouseEnter={() => setIsHover(index)}
                  onMouseLeave={() => setIsHover(null)}
                  onClick={() => {
                    setShowPortfolioSelector(false);
                    setActivePortfolio(otherPortfolio);
                  }}
                  transition="all 250ms ease-in-out"
                  cursor={isActive ? "not-allowed" : "pointer"}
                  py="10px"
                  borderRadius="8px"
                  direction="column"
                >
                  <Flex
                    align="center"
                    w="100%"
                    mb={finalAssets?.length > 0 ? "10px" : "0px"}
                  >
                    <Flex justify="space-between" ml="10px" w="100%">
                      <TextSmall>{otherPortfolio.name}</TextSmall>
                      <Flex ml="auto" w="fit-content">
                        {totalBalance ? (
                          <TextSmall color={text40}>
                            ${getFormattedAmount(totalBalance)}
                          </TextSmall>
                        ) : null}
                        <Menu>
                          <MenuButton
                            ml="10px"
                            sx={buttonSquareStyle}
                            as={Button}
                            onClick={(e) => e.stopPropagation()}
                          >
                            <Icon
                              as={BsThreeDotsVertical}
                              color={text80}
                              mt="5px"
                            />
                          </MenuButton>
                          <MenuList
                            bg={boxBg3}
                            border={borders}
                            borderRadius="8px"
                            color={text80}
                            boxShadow="1px 2px 13px 3px rgba(0,0,0,0.1)"
                          >
                            <MenuItem
                              bg={boxBg3}
                              fontSize={["12px", "12px", "13px", "14px"]}
                              onClick={(e) => {
                                e.stopPropagation();
                                setShowEditName(otherPortfolio.id);
                              }}
                            >
                              <Flex {...flexGreyBoxStyle} bg={hover}>
                                <Icon as={AiOutlineEdit} color={text80} />
                              </Flex>
                              Rename
                            </MenuItem>
                            <MenuItem
                              bg={boxBg3}
                              fontSize={["12px", "12px", "13px", "14px"]}
                              onClick={(e) => {
                                e.stopPropagation();
                                removePortfolio(
                                  otherPortfolio.id,
                                  otherPortfolio.name
                                );
                              }}
                            >
                              <Flex {...flexGreyBoxStyle} bg="red">
                                <Icon as={BsTrash3} color={text80} />
                              </Flex>
                              Delete Portfolio
                            </MenuItem>
                          </MenuList>
                        </Menu>
                      </Flex>
                    </Flex>
                  </Flex>
                  {finalAssets?.length > 0 ? (
                    <Flex w="calc(100% - 20px)" mx="auto" mb="5px">
                      {finalAssets.map((asset, i) => (
                        <Flex
                          w={`${(asset.balance_usd / totalBalance) * 100}%`}
                          h="10px"
                          mr="4px"
                        >
                          <Popover
                            isOpen={
                              showPopover?.[0] === i &&
                              showPopover?.[1] === otherPortfolio.id
                            }
                            onClose={() => setShowPopover(null)}
                            placement="right"
                          >
                            <PopoverTrigger>
                              <Box
                                w="100%"
                                key={asset.asset_id}
                                bg={colors[i]}
                                borderRadius="4px"
                                onMouseOver={() => {
                                  setShowPopover([i, otherPortfolio.id]);
                                }}
                                onMouseLeave={() => setShowPopover(null)}
                              />
                            </PopoverTrigger>
                            <PopoverContent
                              maxW="fit-content"
                              border={borders}
                              borderRadius="10px"
                              bg={hover}
                            >
                              <PopoverArrow bg={hover} />
                              <PopoverBody bg={hover}>
                                <TextSmall mr="5px">{asset.name}</TextSmall>{" "}
                                <TextSmall color={text60} fontWeight="500">
                                  ${getFormattedAmount(asset.balance_usd)}
                                </TextSmall>
                              </PopoverBody>
                            </PopoverContent>
                          </Popover>
                        </Flex>
                      ))}
                    </Flex>
                  ) : null}
                </Flex>
                <Collapse
                  startingHeight={0}
                  in={showEditName === otherPortfolio.id}
                >
                  <RenamePortfolio
                    portfolio={otherPortfolio}
                    setShow={setShowEditName}
                  />
                </Collapse>
              </Flex>
            );
          })}
        </ModalBody>
        <ModalFooter borderTop={borders} pt="15px" px="0px" pb="0px">
          <Flex direction="column" w="100%">
            {/* ADD A WALLET */}
            <Collapse startingHeight={0} in={showCreatePortfolio}>
              <CreatePortfolio />
            </Collapse>
            {showCreatePortfolio ? null : (
              <Flex w="100%">
                <Button
                  fontSize={["12px", "12px", "13px", "14px"]}
                  fontWeight="400"
                  color={text80}
                  onClick={() => setShowCreatePortfolio(true)}
                >
                  <Icon as={IoMdAddCircleOutline} fontSize="16px" mr="7.5px" />
                  Create a new portfolio
                </Button>
              </Flex>
            )}
          </Flex>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
