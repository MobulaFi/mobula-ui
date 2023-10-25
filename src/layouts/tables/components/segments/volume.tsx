import { Flex, Text } from "@chakra-ui/react";
import { getFormattedAmount } from "@utils/formaters";
import { useColors } from "lib/chakra/colorMode";
import { useTop100 } from "../../../../features/data/top100/context-manager";
import { Segment } from "../segment";

export const VolumeSegment = ({ token, display, metricsChanges }) => {
  const { text80, text60 } = useColors();
  const { activeView } = useTop100();
  const isBalance = activeView?.name === "Portfolio";

  const getColorFromVolume = () => {
    if (metricsChanges.volume === true) return "green";
    if (metricsChanges.volume === false) return "red";
    return text80;
  };

  const getVolumeOrBalance = () => {
    if (display === "24h Volume" && token.global_volume)
      return `$${getFormattedAmount(token.global_volume)}`;
    if (display === "7d Volume" && token.global_volume_7d)
      return `$${getFormattedAmount(token.global_volume_7d)}`;
    if (display === "1m Volume" && token.global_volume_1m)
      return `$${getFormattedAmount(token.global_volume_1m)}`;
    return "-";
  };
  return (
    <Segment>
      <Flex
        align="center"
        justify="flex-end"
        fontWeight="500"
        color={isBalance ? text80 : getColorFromVolume()}
      >
        {isBalance ? (
          <Flex direction="column" pr={["10px", "0px"]}>
            <Text
              fontSize={["12px", "13px", "14px", "14px"]}
              color={text80}
              fontWeight="500"
            >{`${getFormattedAmount(token.amount)} ${token.symbol.slice(
              0,
              10
            )}${token.symbol.length > 10 ? "..." : ""}`}</Text>
            <Text
              fontSize={["12px", "12px", "13px", "13px"]}
              color={text60}
              fontWeight="500"
            >{`${getFormattedAmount(token.amount_usd)} USD`}</Text>
          </Flex>
        ) : (
          getVolumeOrBalance()
        )}
      </Flex>
    </Segment>
  );
};
