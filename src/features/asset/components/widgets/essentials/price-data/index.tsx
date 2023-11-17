import {Flex} from "@chakra-ui/react";
import {useContext} from "react";
import {
  getFormattedAmount,
  getTokenPercentage,
} from "../../../../../../../../utils/helpers/formaters";
import {TextLandingMedium, TextSmall} from "../../../../../../../UI/Text";
import {useColors} from "../../../../../../../common/utils/color-mode";
import {BaseAssetContext} from "../../../../context-manager";

export const PriceData = () => {
  const {baseAsset} = useContext(BaseAssetContext);
  const {text80, text60} = useColors();
  const formatDate = timestamp => {
    const date = new Date(timestamp);
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })?.format(date);
  };

  return (
    <Flex
      direction="column"
      mt={["30px", "30px", "50px"]}
      w={["95%", "95%", "100%", "100%"]}
      mx="auto"
    >
      <TextLandingMedium mb="15px">
        {baseAsset?.name} ({baseAsset?.symbol}) Price Data
      </TextLandingMedium>
      <TextSmall color={text80} mb="7.5px" fontWeight="600">
        {baseAsset?.name} ({baseAsset?.symbol}) price has{" "}
        {baseAsset?.price_change_24h > 0 ? "increased" : "decreased"} today.
      </TextSmall>
      <TextSmall color={text60} mb="15px">
        {baseAsset?.name} price today is ${getFormattedAmount(baseAsset?.price)}{" "}
        with a 24-hours trading volume{" "}
        {baseAsset?.circulating_supply ? "up" : "down"} by{" "}
        {getTokenPercentage(baseAsset?.volume_change_24h)}%. {baseAsset?.symbol}{" "}
        price is {baseAsset?.price_change_24h > 0 ? "up" : "down"} in the last
        24 hours. It has a circulating supply is{" "}
        {getFormattedAmount(baseAsset?.circulating_supply)} {baseAsset?.symbol}{" "}
        coins and a total supply of{" "}
        {getFormattedAmount(baseAsset?.total_supply)}.
      </TextSmall>
      {baseAsset?.ath?.[1] &&
      baseAsset?.ath?.[0] &&
      baseAsset?.atl?.[1] &&
      baseAsset?.atl?.[0] ? (
        <>
          <TextSmall color={text80} mb="7.5px" fontWeight="600">
            What is the highest price for {baseAsset?.name}?
          </TextSmall>
          <TextSmall color={text60} mb="15px">
            The all-time high price of {baseAsset?.name} is $
            {getFormattedAmount(baseAsset?.ath?.[1])} on{" "}
            {formatDate(baseAsset?.ath?.[0])}.
          </TextSmall>
          <TextSmall color={text80} mb="7.5px" fontWeight="600">
            What is the lowest price for {baseAsset?.name}?
          </TextSmall>
          <TextSmall color={text60} mb="15px">
            The all-time low price of {baseAsset?.name} is $
            {getFormattedAmount(baseAsset?.atl?.[1])} on{" "}
            {formatDate(baseAsset?.atl?.[0])}.
          </TextSmall>
        </>
      ) : null}
    </Flex>
  );
};
