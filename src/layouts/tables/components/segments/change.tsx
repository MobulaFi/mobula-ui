import { Flex } from "@chakra-ui/react";
import { getTokenPercentage } from "@utils/formaters";
import { TagPercentage } from "components/tag-percentage";
import { Segment } from "../segment";

export const ChangeSegment = ({ token, display }) => {
  const getChangeFromType = () => {
    switch (display) {
      case "1h %":
        return getTokenPercentage(token.price_change_1h) || 0;
      case "24h %":
        return getTokenPercentage(token.price_change_24h) || 0;
      case "7d %":
        return getTokenPercentage(token.price_change_7d) || 0;
      case "1m %":
        return getTokenPercentage(token.price_change_1m) || 0;
      case "3m %":
        return getTokenPercentage(token.price_change_3m) || 0;
      case "6m %":
        return getTokenPercentage(token.price_change_6m) || 0;
      case "1y %":
        return getTokenPercentage(token.price_change_1y) || 0;
      default:
        return 0;
    }
  };

  return (
    <Segment>
      <Flex align="center" justify="flex-end" fontWeight="400" pr="5px">
        <TagPercentage
          percentage={Number(getChangeFromType())}
          isUp={Number(getChangeFromType()) > 0}
        />
      </Flex>
    </Segment>
  );
};
