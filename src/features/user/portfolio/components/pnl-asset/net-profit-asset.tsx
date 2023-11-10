import { Flex, FlexProps, Skeleton, Text } from "@chakra-ui/react";
import React, { useContext } from "react";
import { TextLandingMedium } from "../../../../../components/fonts";
import { useColors } from "../../../../../lib/chakra/colorMode";
import { getFormattedAmount } from "../../../../../utils/formaters";
import { PortfolioV2Context } from "../../context-manager";
import { Privacy } from "../ui/privacy";

export const NetProfitAsset = ({
  changeColor,
  ...props
}: { changeColor: string } & FlexProps) => {
  const { manager, isLoading, asset } = useContext(PortfolioV2Context);
  const { text60, hover, boxBg6 } = useColors();

  return manager.privacy_mode ? (
    <Privacy {...props} fontSize={["18px", "18px", "24px", "30px"]} />
  ) : (
    <Flex direction="column" {...props}>
      {isLoading ? (
        <Skeleton
          borderRadius="8px"
          h={["23px", "23px", "29px", "35px"]}
          w="100px"
          startColor={boxBg6}
          endColor={hover}
          mt="10px"
        />
      ) : (
        <Text
          fontSize={["18px", "18px", "24px", "30px"]}
          fontWeight="600"
          mr="5px"
          color={changeColor}
        >
          ${getFormattedAmount(asset?.estimated_balance)}
        </Text>
      )}

      {isLoading ? (
        <Skeleton
          borderRadius="8px"
          h={["16px", "16px", "18px", "20px"]}
          w="120px"
          startColor={boxBg6}
          endColor={hover}
          mt="10px"
        />
      ) : (
        <TextLandingMedium
          color={text60}
          fontSize={["16px", "16px", "18px", "20px"]}
          fontWeight="400"
        >
          {getFormattedAmount(asset?.token_balance)} {asset?.symbol}
        </TextLandingMedium>
      )}
    </Flex>
  );
};
