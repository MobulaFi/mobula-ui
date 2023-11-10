import { ChevronDownIcon } from "@chakra-ui/icons";
import { Button, Flex, Icon } from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import React, { useContext, useState } from "react";
import { AiOutlineSetting } from "react-icons/ai";
import { BsShare } from "react-icons/bs";
import { TextLandingMedium, TextSmall } from "../../../../../components/fonts";
import { PopupUpdateContext } from "../../../../../contexts/popup";
import { UserContext } from "../../../../../contexts/user";
import { useColors } from "../../../../../lib/chakra/colorMode";
import { pushData } from "../../../../../lib/mixpanel";
import { addressSlicer } from "../../../../../utils/formaters";
import { PortfolioV2Context } from "../../context-manager";
import { buttonHeaderStyle } from "../../style";
import { NetworkButton } from "../network-button";
import { SharePopup } from "../popup/share";

export const Header = () => {
  const {
    setShowManage,
    activePortfolio,
    setShowPortfolioSelector,
    setShowSelect,
    isWalletExplorer,
    isPortfolioExplorer,
    setShowCreatePortfolio,
    setPortfolioSettings,
    isMobile,
    activeStep,
  } = useContext(PortfolioV2Context);
  const { boxBg3, borders, text80, hover } = useColors();
  const [showShare, setShowShare] = useState(false);
  const router = useRouter();
  const { user } = useContext(UserContext);
  const { setConnect } = useContext(PopupUpdateContext);

  return (
    <Flex align="center" justify="space-between" w="100%" wrap="wrap">
      <Flex>
        {isWalletExplorer ? (
          <TextLandingMedium>
            {addressSlicer(isWalletExplorer)}
          </TextLandingMedium>
        ) : (
          <Button
            onClick={() => {
              setShowPortfolioSelector(true);
            }}
            fontWeight="500"
            color={text80}
            fontSize={["16px", "16px", "20px", "24px"]}
            mr={["-5px", "0px"]}
            zIndex={activeStep.nbr === 5 ? 5 : 0}
          >
            {isMobile ? "Portfolio" : activePortfolio.name}
            {activePortfolio && router.asPath === "/portfolio" && (
              <ChevronDownIcon />
            )}
          </Button>
        )}

        <Button
          ml="10px"
          mr={["5px", "10px"]}
          sx={buttonHeaderStyle}
          color={text80}
          border={borders}
          bg={boxBg3}
          _hover={{ bg: hover }}
          onClick={() => setShowShare(true)}
        >
          <TextSmall display={["none", "none", "flex"]} mr="5px">
            Share
          </TextSmall>
          <Icon as={BsShare} color={text80} />
        </Button>
        <Button
          sx={buttonHeaderStyle}
          color={text80}
          border={borders}
          bg={boxBg3}
          _hover={{ bg: hover }}
          onClick={() => setShowManage(true)}
          zIndex={activeStep.nbr === 3 ? 5 : 0}
        >
          <TextSmall display={["none", "none", "flex"]} mr="5px">
            Manage
          </TextSmall>{" "}
          <Icon as={AiOutlineSetting} color={text80} />
        </Button>
      </Flex>
      <Flex wrap="wrap" my="auto" align="center">
        <NetworkButton wrap="wrap" />
        {isWalletExplorer || isPortfolioExplorer ? null : (
          <Button
            // mt={["0px", "0px", "10px"]}
            sx={buttonHeaderStyle}
            color={text80}
            border={borders}
            bg={boxBg3}
            zIndex={activeStep.nbr === 2 ? 5 : 0}
            _hover={{ bg: hover }}
            onClick={() => setShowSelect(true)}
          >
            Add Asset +
          </Button>
        )}
        {isWalletExplorer ? (
          <Button
            // mt={["0px", "0px", "10px"]}
            sx={buttonHeaderStyle}
            color={text80}
            border={borders}
            bg={boxBg3}
            zIndex={activeStep.nbr === 2 ? 5 : 0}
            _hover={{ bg: hover }}
            onClick={() => {
              if (!user) {
                setConnect(true);
              } else {
                router.push("/portfolio");

                setTimeout(() => {
                  setShowPortfolioSelector(true);
                  setShowCreatePortfolio(true);
                  setPortfolioSettings({
                    name: `${addressSlicer(isWalletExplorer)}'s Portfolio`,
                    public: false,
                    wallets: [isWalletExplorer],
                  });
                  pushData("Create Portfolio Clicked");
                }, 1000);
              }
            }}
          >
            Create Portfolio
          </Button>
        ) : null}
        <SharePopup show={showShare} setShow={setShowShare} />
      </Flex>
    </Flex>
  );
};
