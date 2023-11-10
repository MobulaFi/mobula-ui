import { CheckIcon, CloseIcon } from "@chakra-ui/icons";
import {
  Button,
  Collapse,
  Flex,
  Icon,
  Input,
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
} from "@chakra-ui/react";

import React, { useContext, useState } from "react";
import { BiCopy } from "react-icons/bi";
import { BsThreeDotsVertical, BsTrash3 } from "react-icons/bs";
import { IoMdAddCircleOutline } from "react-icons/io";
import { isAddress } from "viem";
import { useAccount } from "wagmi";
import { AddressAvatar } from "../../../../../../components/avatar";
import {
  TextLandingMedium,
  TextSmall,
} from "../../../../../../components/fonts";
import { UserContext } from "../../../../../../contexts/user";
import { useSignerGuard } from "../../../../../../hooks/signer";
import { useColors } from "../../../../../../lib/chakra/colorMode";
import { pushData } from "../../../../../../lib/mixpanel";
import { GET } from "../../../../../../utils/fetch";
import { addressSlicer } from "../../../../../../utils/formaters";
import { PortfolioV2Context } from "../../../context-manager";
import { useWebSocketResp } from "../../../hooks";
import {
  buttonPopupStyle,
  buttonSquareStyle,
  flexGreyBoxStyle,
} from "../../../style";
import { copyText } from "../../../utils";

export const WalletsPopup = () => {
  const { user } = useContext(UserContext);
  const [isCopied, setIsCopied] = useState("");
  const { address } = useAccount();
  const signerGuard = useSignerGuard();
  const [newWalletAddress, setNewWalletAddress] = useState("");
  const [showAddWallet, setShowAddWallet] = useState(false);
  const { setShowWallet, showWallet, activePortfolio, setActivePortfolio } =
    useContext(PortfolioV2Context);
  const refreshPortfolio = useWebSocketResp();
  const { boxBg6, borders, boxBg3, boxBg1, text80, hover } = useColors();

  console.log("activePortfolio", activePortfolio);

  return (
    <Modal
      isOpen={showWallet}
      onClose={() => {
        setShowWallet(false);
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
          <TextLandingMedium>Wallets</TextLandingMedium>
        </ModalHeader>
        <ModalCloseButton color={text80} />
        {activePortfolio?.id !== 0 ? (
          <>
            <ModalBody p="0px" mb="15px">
              {activePortfolio.wallets?.map((walletAddress) => (
                <Flex align="center" mt="10px" justify="space-between">
                  <Flex align="center">
                    <AddressAvatar boxSize="32px" address={walletAddress} />
                    <Flex direction="column" ml="10px">
                      <TextSmall>{addressSlicer(walletAddress, 8)}</TextSmall>
                    </Flex>
                  </Flex>
                  <Flex>
                    <Button
                      sx={buttonSquareStyle}
                      bg={hover}
                      _hover={{ bg: hover }}
                      onClick={() => {
                        copyText(walletAddress, setIsCopied);
                      }}
                    >
                      {isCopied === walletAddress ? (
                        <CheckIcon color="green" />
                      ) : (
                        <Icon as={BiCopy} color={text80} />
                      )}
                    </Button>

                    {activePortfolio?.user === user?.id && (
                      <Menu offset={[-200, 10]}>
                        <MenuButton
                          ml="10px"
                          sx={buttonSquareStyle}
                          as={Button}
                          bg={hover}
                          _hover={{ bg: hover }}
                        >
                          <Icon as={BsThreeDotsVertical} color={text80} />
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
                            onClick={() => {
                              signerGuard(() => {
                                pushData("Wallet Removed");
                                const newPortfolio = {
                                  ...activePortfolio,
                                  wallets: activePortfolio.wallets.filter(
                                    (iteratedWallet) =>
                                      iteratedWallet !== walletAddress
                                  ),
                                };
                                GET("/portfolio/edit", {
                                  id: activePortfolio.id,
                                  name: newPortfolio.name,
                                  public: newPortfolio.public,
                                  wallets: newPortfolio.wallets.join(","),
                                  removed_transactions:
                                    newPortfolio.removed_transactions.join(","),
                                  removed_assets:
                                    newPortfolio.removed_assets.join(","),

                                  reprocess: true,
                                  account: address,
                                });

                                setActivePortfolio(newPortfolio);
                                setShowWallet(false);

                                setTimeout(() => {
                                  console.log(
                                    "Refreshing portfolio 156 wallets/index.tsx"
                                  );
                                  refreshPortfolio();
                                }, 2000);
                              });
                            }}
                          >
                            <Flex {...flexGreyBoxStyle} bg="red">
                              <Icon as={BsTrash3} color={text80} />
                            </Flex>
                            Remove wallet
                          </MenuItem>
                        </MenuList>
                      </Menu>
                    )}
                  </Flex>
                </Flex>
              ))}
            </ModalBody>
            {activePortfolio?.user === user?.id && (
              <ModalFooter borderTop={borders} pt="15px" px="0px" pb="0px">
                <Flex direction="column" w="100%">
                  {/* ADD A WALLET */}
                  <Collapse startingHeight={0} in={showAddWallet}>
                    <Flex align="center" justify="space-between" mb="10px">
                      <Flex align="center">
                        <TextSmall>Wallet Address</TextSmall>
                      </Flex>
                      <CloseIcon
                        onClick={() => setShowAddWallet(false)}
                        cursor="pointer"
                        color={text80}
                        fontSize="10px"
                      />
                    </Flex>
                    <Input
                      mb="20px"
                      px="10px"
                      onChange={(e) => {
                        setNewWalletAddress(e.target.value);
                      }}
                      placeholder="0x"
                      value={newWalletAddress}
                      h="35px"
                      borderRadius="8px"
                      _placeholder={{ color: text80 }}
                      bg={boxBg6}
                      w="100%"
                      color={text80}
                      fontWeight="400"
                    />
                    <Flex>
                      <Button
                        sx={buttonPopupStyle}
                        border={borders}
                        color={text80}
                        bg={boxBg6}
                        _hover={{
                          border: "1px solid var(--chakra-colors-borders-1)",
                          bg: hover,
                        }}
                        transition="all 250ms ease-in-out"
                        onClick={() => setShowAddWallet(false)}
                      >
                        Cancel
                      </Button>
                      <Button
                        variant="outlined"
                        sx={buttonPopupStyle}
                        color={text80}
                        onClick={() => {
                          if (isAddress(newWalletAddress)) {
                            signerGuard(() => {
                              const newPortfolio = {
                                ...activePortfolio,
                                wallets: [
                                  ...activePortfolio.wallets,
                                  newWalletAddress,
                                ],
                              };
                              pushData("Wallet Added");
                              GET("/portfolio/edit", {
                                id: newPortfolio.id,
                                name: newPortfolio.name,
                                public: newPortfolio.public,
                                reprocess: true,
                                wallets: newPortfolio.wallets.join(","),
                                removed_transactions:
                                  newPortfolio.removed_transactions.join(","),
                                removed_assets:
                                  newPortfolio.removed_assets.join(","),
                                account: address,
                              });
                              setActivePortfolio(newPortfolio);
                              refreshPortfolio(newPortfolio);

                              setShowAddWallet(false);
                              setShowWallet(false);
                              setNewWalletAddress("");
                            });
                          }
                        }}
                      >
                        Import
                      </Button>
                    </Flex>
                  </Collapse>
                  {showAddWallet ? null : (
                    <Flex w="100%">
                      <Button
                        fontSize={["12px", "12px", "13px", "14px"]}
                        fontWeight="400"
                        color={text80}
                        onClick={() => setShowAddWallet(true)}
                      >
                        <Icon
                          as={IoMdAddCircleOutline}
                          fontSize="16px"
                          mr="7.5px"
                          color={text80}
                        />
                        Add another wallet
                      </Button>
                    </Flex>
                  )}
                </Flex>
              </ModalFooter>
            )}
          </>
        ) : null}
      </ModalContent>
    </Modal>
  );
};
