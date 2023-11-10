import { ChevronDownIcon } from "@chakra-ui/icons";
import { Avatar, AvatarGroup, Button, Flex, FlexProps } from "@chakra-ui/react";
import { blockchainsContent } from "mobula-lite/lib/chains/constants";
import { useContext } from "react";
import { useColors } from "../../../../../lib/chakra/colorMode";
import { PortfolioV2Context } from "../../context-manager";
import { buttonHeaderStyle } from "../../style";

export const NetworkButton = ({ ...props }: FlexProps) => {
  const {
    setShowNetwork,
    activeNetworks,
    setShowWallet,
    activePortfolio,
    isWalletExplorer,
    activeStep,
  } = useContext(PortfolioV2Context);
  const { boxBg6, boxBg3, text80, borders, hover } = useColors();

  return (
    <Flex {...props} display={["flex"]}>
      {isWalletExplorer ? null : (
        <Button
          sx={buttonHeaderStyle}
          color={text80}
          border={borders}
          bg={boxBg3}
          _hover={{ bg: hover }}
          px="0px"
          mb="0px"
          mt="0px"
          mr={["5px", "10px"]}
          onClick={() => setShowWallet(true)}
          zIndex={activeStep.nbr === 1 ? 5 : 0}
        >
          {/* <Icon as={SlWallet} mr="7.5px" /> */}
          {activePortfolio?.wallets?.length} Wallet(s)
          <ChevronDownIcon ml="2.5px" mr="-2.5px" fontSize="16px" />
        </Button>
      )}
      {false && (
        <Button
          sx={buttonHeaderStyle}
          color={text80}
          border={borders}
          bg={boxBg3}
          _hover={{ bg: hover }}
          px="0px"
          mb="0px"
          ml="0px"
          mr={isWalletExplorer ? "0px" : "10px"}
          zIndex="2"
          isDisabled
          onClick={() => setShowNetwork(true)}
        >
          <AvatarGroup
            size="xs"
            fontSize="12px"
            mr="5px"
            max={4}
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
          All networks
          <ChevronDownIcon ml="5px" fontSize="16px" />
        </Button>
      )}
    </Flex>
  );
};
