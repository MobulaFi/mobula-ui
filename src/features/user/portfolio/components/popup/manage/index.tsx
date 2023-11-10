import { ChevronDownIcon } from "@chakra-ui/icons";
import {
  Avatar,
  AvatarGroup,
  Button,
  Flex,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Spinner,
  Switch,
} from "@chakra-ui/react";
import { blockchainsContent } from "mobula-lite/lib/chains/constants";
import React, { useContext, useEffect } from "react";
import { useAccount } from "wagmi";
import {
  TextLandingMedium,
  TextSmall,
} from "../../../../../../components/fonts";
import { useColors } from "../../../../../../lib/chakra/colorMode";
import { pushData } from "../../../../../../lib/mixpanel";
import { createSupabaseDOClient } from "../../../../../../lib/supabase";
import { manageOptions } from "../../../constants";
import { PortfolioV2Context } from "../../../context-manager";
import { PortfolioDeleteTokens } from "../../../models";
import { buttonHeaderStyle } from "../../../style";

const supabase = createSupabaseDOClient();

export const ManagePopup = () => {
  const {
    showManage,
    setShowManage,
    manager,
    setShowNetwork,
    setManager,
    activeNetworks,
    setShowWallet,
    activePortfolio,
    hiddenTokens,
    setHiddenTokens,
    isWalletExplorer,
    setShowHiddenTokensPopup,
    isLoading,
  } = useContext(PortfolioV2Context);
  const { address } = useAccount();
  const { boxBg6, borders, boxBg1, text10, text80, hover } = useColors();

  const handleSwitch = (name: string) => {
    pushData("Portfolio Settings Modified", {
      setting_name: name,
      new_value: !manager[name],
    });
    setManager({ ...manager, [name]: !manager[name] });
  };

  const getAssetDetails = async () => {
    const { data, error } = await supabase
      .from("assets")
      .select("symbol, logo, id")
      .in("id", activePortfolio.removed_assets);

    if (error) {
      console.error(error);
      return;
    }

    const newHiddenTokensObj: Record<number, PortfolioDeleteTokens> = {};

    data.forEach((asset) => {
      newHiddenTokensObj[asset.id] = {
        symbol: asset.symbol,
        logo: asset.logo,
      };
    });

    setHiddenTokens(newHiddenTokensObj);
  };

  useEffect(() => {
    if (activePortfolio) {
      getAssetDetails();
    }
  }, [activePortfolio.id]);

  return (
    <>
      <Modal
        motionPreset="none"
        isOpen={showManage}
        onClose={() => setShowManage(false)}
      >
        <ModalOverlay />
        <ModalContent
          bg={boxBg1}
          borderRadius="16px"
          border={borders}
          p={["15px", "15px", "20px"]}
          boxShadow="none"
          w={["90vw", "100%"]}
          maxW="400px"
        >
          <ModalHeader p="0px" mb="5px">
            <TextLandingMedium>Manage</TextLandingMedium>
          </ModalHeader>
          <ModalCloseButton color={text80} />
          <ModalBody p="0px">
            <Flex
              align="center"
              justify="space-between"
              mt="10px"
              _hover={{ color: "blue" }}
            >
              <TextSmall>Hidden assets</TextSmall>
              <Button
                isDisabled={Object.keys(hiddenTokens).length <= 0}
                sx={buttonHeaderStyle}
                bg={boxBg6}
                color={text80}
                _hover={{ bg: hover }}
                border={borders}
                onClick={() => {
                  setShowHiddenTokensPopup(true);
                  setShowManage(false);
                }}
              >
                Edit{" "}
                {isLoading ? (
                  <Spinner
                    thickness="2px"
                    speed="0.65s"
                    boxSize="16px"
                    ml="7.5px"
                    emptyColor={text10}
                    color="blue"
                  />
                ) : null}
              </Button>
            </Flex>
            {manageOptions
              .filter((entry) =>
                !entry.type && isWalletExplorer
                  ? entry.title !== "Wallets" && !entry.type
                  : entry && !entry.type
              )
              .map((option) => (
                <Flex align="center" justify="space-between" mt="10px">
                  <TextSmall>{option.title}</TextSmall>
                  {option.title === "Active Networks" ? (
                    <Button
                      sx={buttonHeaderStyle}
                      bg={boxBg6}
                      color={text80}
                      _hover={{ bg: hover }}
                      border={borders}
                      px="0px"
                      mb="0px"
                      isDisabled
                      mt="0px"
                      onClick={() => {
                        setShowNetwork(true);
                        setShowManage(false);
                      }}
                    >
                      <AvatarGroup
                        size="xs"
                        fontSize="12px"
                        max={6}
                        spacing="-7.5px"
                      >
                        {activeNetworks
                          ?.filter((entry) => entry !== null)
                          .map((blockchain) => (
                            <Avatar
                              fontSize="12px"
                              bg={boxBg6}
                              name={`${blockchain} logo`}
                              src={blockchainsContent[blockchain]?.logo}
                            />
                          ))}
                      </AvatarGroup>
                      <ChevronDownIcon
                        ml="5px"
                        fontSize="16px"
                        color={text80}
                      />
                    </Button>
                  ) : (
                    <Button
                      sx={buttonHeaderStyle}
                      bg={boxBg6}
                      color={text80}
                      _hover={{ bg: hover }}
                      border={borders}
                      px="0px"
                      mb="0px"
                      mt="0px"
                      onClick={() => {
                        setShowWallet(true);
                        setShowManage(false);
                      }}
                    >
                      {activePortfolio?.wallets?.length} Wallets
                    </Button>
                  )}
                </Flex>
              ))}
            <Flex align="center" justify="space-between" mt="10px">
              <TextSmall>Show non-trade transactions</TextSmall>
              <Switch
                colorScheme="none"
                borderRadius="full"
                isChecked={manager.show_interaction}
                onChange={() =>
                  setManager({
                    ...manager,
                    show_interaction: !manager.show_interaction,
                  })
                }
                size="sm"
                bg={manager.show_interaction ? "blue" : "borders.1"}
              />
            </Flex>
            {manageOptions
              .filter((entry) =>
                entry.type && isWalletExplorer
                  ? entry.title !== "Privacy Mode" && entry.type
                  : entry.type
              )
              .map((option, i) => {
                if (i < 7)
                  return (
                    <Flex align="center" justify="space-between" mt="10px">
                      <TextSmall>{option.title}</TextSmall>
                      <Switch
                        colorScheme="none"
                        borderRadius="full"
                        isChecked={manager[option.name]}
                        onChange={() => handleSwitch(option.name)}
                        size="sm"
                        bg={manager[option.name] ? "blue" : "borders.1"}
                      />
                    </Flex>
                  );
                return null;
              })}
            <TextLandingMedium mt="10px" pt="10px" borderTop={borders}>
              Asset Informations
            </TextLandingMedium>
            {manageOptions
              .filter((entry) => entry.type)
              .map((option, i) => {
                if (i > 6)
                  return (
                    <Flex align="center" justify="space-between" mt="10px">
                      <TextSmall>{option.title}</TextSmall>
                      <Switch
                        colorScheme="none"
                        borderRadius="full"
                        isChecked={manager[option.name]}
                        onChange={() => handleSwitch(option.name)}
                        size="sm"
                        bg={manager[option.name] ? "blue" : "borders.1"}
                      />
                    </Flex>
                  );
                return null;
              })}
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};
