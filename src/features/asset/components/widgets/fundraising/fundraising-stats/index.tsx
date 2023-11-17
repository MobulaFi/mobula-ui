import {Flex, Text} from "@chakra-ui/react";
import {useContext} from "react";
import {
  getFormattedAmount,
  getTokenPercentage,
} from "../../../../../../../../utils/helpers/formaters";
import {TextSmall} from "../../../../../../../UI/Text";
import {useColors} from "../../../../../../../common/utils/color-mode";
import {BaseAssetContext} from "../../../../context-manager";

export const FundraisingStats = () => {
  const {text80, boxBg3, borders, text60, hover} = useColors();
  const {baseAsset} = useContext(BaseAssetContext);
  const reduceResult = baseAsset?.sales
    ?.filter(entry => entry.date)
    ?.map(sale => ({
      token_sold: sale.amount,
      raised: sale.raised,
    }));
  const tokensSold = reduceResult.reduce(
    (acc, curr) => acc + Number(curr.token_sold),
    0,
  );
  const amountRaised = reduceResult.reduce(
    (acc, curr) => acc + Number(curr.raised),
    0,
  );

  const percentage = getFormattedAmount(
    (tokensSold / (baseAsset?.total_supply || 0)) * 100,
  );

  return (
    <Flex
      p="20px"
      borderRadius="16px"
      border={borders}
      bg={boxBg3}
      mb="10px"
      w="100%"
      mx="auto"
      direction="column"
    >
      <Text
        fontSize={["16px", "16px", "16px", "18px"]}
        fontWeight="500"
        color={text80}
        mb="0px"
      >
        Fundraising Stats
      </Text>{" "}
      <Flex
        align="center"
        borderBottom={borders}
        py="10px"
        mt="5px"
        justify="space-between"
      >
        <TextSmall color={text60}> Tokens Sold:</TextSmall>
        <TextSmall fontWeight="500">{getFormattedAmount(tokensSold)}</TextSmall>
      </Flex>
      <Flex
        align="center"
        borderBottom={borders}
        py="10px"
        justify="space-between"
      >
        <TextSmall color={text60}>Amount Raised:</TextSmall>
        <TextSmall fontWeight="500">
          ${getFormattedAmount(amountRaised)}
        </TextSmall>
      </Flex>
      <Flex
        align="center"
        borderBottom={borders}
        py="10px"
        justify="space-between"
      >
        <TextSmall fontWeight="500">Total % for sale</TextSmall>
        <TextSmall fontWeight="500">
          {getTokenPercentage(percentage)}%
        </TextSmall>
      </Flex>
      <Flex h="8px" w="100%" borderRadius="full" bg={hover}>
        <Flex bg="blue" w={`${percentage}%`} h="100%" borderRadius="full" />
      </Flex>
    </Flex>
  );
};
