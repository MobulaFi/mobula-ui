import React from "react";
import { Segment } from ".";
import { TagPercentage } from "../../../components/tag-percentage";
import { getTokenPercentage } from "../../../utils/formaters";
import { TableAsset } from "../model";

interface ChangeSegmentProps {
  token: TableAsset;
  display: string;
  extraCss?: string;
}

export const ChangeSegment = ({
  token,
  display,
  extraCss = "",
}: ChangeSegmentProps) => {
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
  const changeForType = getChangeFromType();

  return (
    <Segment extraCss={`${extraCss} md:px-[5px]`}>
      <div className="flex items-center justify-end pr-[5px] md:pr-0">
        <TagPercentage
          percentage={Number(changeForType)}
          isUp={Number(changeForType) > 0}
          extraCss="ml-0"
        />
      </div>
    </Segment>
  );
};
