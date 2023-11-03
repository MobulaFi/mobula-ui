import {Icon} from "@chakra-ui/icons";
import {Button, Flex} from "@chakra-ui/react";
import {Dispatch, SetStateAction, useContext, useEffect, useState} from "react";
import {AiOutlineSetting} from "react-icons/ai";
import {useFeeData, useNetwork} from "wagmi";
import {SwapContext} from "../../../../..";
import {ColorsContext} from "../../../../../../../../../pages/iframe/swap";
import {TitleContainer} from "../../../../../../../../Pages/Misc/Dex/components/ui/container-title";
import {pushData} from "../../../../../../../data/utils";
import {useColors} from "../../../../../../../utils/color-mode";
import {ISwapContext} from "../../../../../model";
import {cleanNumber} from "../../../../../utils";
import {GweiSettings} from "../../popup/gwei";

export const ProTitle = ({
  setSettingsVisible,
  setShowGweiSettings,
  showGweiSettings,
}: {
  setSettingsVisible: Dispatch<SetStateAction<boolean>>;
  setShowGweiSettings: Dispatch<SetStateAction<boolean>>;
  showGweiSettings: boolean;
}) => {
  const {settings, chainNeeded, tokenIn, tokenOut} =
    useContext<ISwapContext>(SwapContext);
  const {chain} = useNetwork();
  const {bgTitle, fontSecondary, borderColor, fontMain} =
    useContext(ColorsContext);
  const {text40, borders, text80, boxBg6, hover} = useColors();
  const {data} = useFeeData({chainId: chainNeeded || chain?.id || 1});
  // Workaround for SSR & gas price
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <>
      <TitleContainer
        title="Swap at the best price, 0% fees."
        h="auto"
        bg={bgTitle || boxBg6}
        color={fontMain || text80}
      >
        <Flex align="center" ml="auto">
          <Flex
            color={fontMain || text80}
            p="7px"
            minWidth="47px"
            h="25px"
            align="center"
            justify="center"
            whiteSpace="nowrap"
            fontSize="12px"
            onClick={() => {
              setShowGweiSettings(true);
              pushData("TRADE-ADVANCED-GWEI");
            }}
            cursor="pointer"
            borderRadius="full"
            border={borderColor ? `1px solid ${borderColor}` : borders}
            bg={bgTitle || boxBg6}
            _hover={{bg: bgTitle || hover}}
            transition="all 250ms ease-in-out"
            suppressHydrationWarning
          >
            {isMounted &&
              data?.gasPrice &&
              `${(
                cleanNumber(data.gasPrice, 9) * settings.gasPriceRatio
              ).toFixed(2)} Gwei`}
          </Flex>
          <Button
            color={fontSecondary || text40}
            onClick={() => {
              setSettingsVisible(true);
              pushData("TRADE-ADVANCED-SETTINGS");
            }}
            _focus={{boxShadow: "none"}}
            ml="10px"
          >
            <Icon fontSize="18px" as={AiOutlineSetting} />
          </Button>
        </Flex>
      </TitleContainer>
      <GweiSettings
        setShowGweiSettings={setShowGweiSettings}
        showGweiSettings={showGweiSettings}
      />
    </>
  );
};
