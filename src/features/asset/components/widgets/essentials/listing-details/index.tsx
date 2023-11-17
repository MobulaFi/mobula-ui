import {ExternalLinkIcon} from "@chakra-ui/icons";
import {Flex, Link, Text} from "@chakra-ui/react";
import {useContext} from "react";
import {TextSmall} from "../../../../../../../UI/Text";
import {useColors} from "../../../../../../../common/utils/color-mode";
import {BaseAssetContext} from "../../../../context-manager";
import {FlexBorderBox} from "../../../../style";
import {formatISODate} from "../../../../utils";

export const ListingDetails = ({...props}: {[props: string]: any}) => {
  const {baseAsset} = useContext(BaseAssetContext);
  const {text80, borders, boxBg3, text60} = useColors();
  const getColorFromScore = (score: number) => {
    if (score >= 4) return "green";
    if (score === 3) return "yellow";
    return "red";
  };

  const metrics = [
    {
      title: "Price Paid",
      value: baseAsset?.listing_amount ? `${baseAsset?.listing_amount}$` : "",
      link: `https://polygonscan.com/tx/${baseAsset?.listing_hash}`,
    },
    {
      title: "Vote Time (DAO)",
      value: formatISODate(baseAsset?.created_at),
    },
    {
      title: "Utility Score",
      value: (
        <Text
          fontSize="13px"
          color={getColorFromScore(baseAsset?.utility_score)}
        >
          {`${baseAsset?.utility_score}/5`}
        </Text>
      ),
    },
    {
      title: "Trust Score",
      value: (
        <Text fontSize="13px" color={getColorFromScore(baseAsset?.trust_score)}>
          {`${baseAsset?.trust_score}/5`}
        </Text>
      ),
    },
    {
      title: "Social Score",
      value: (
        <Text
          fontSize="13px"
          color={getColorFromScore(baseAsset?.social_score)}
        >
          {`${baseAsset?.social_score}/5`}
        </Text>
      ),
    },
  ];

  return (
    <Flex
      {...FlexBorderBox}
      bg={["none", "none", "none", boxBg3]}
      border={["none", "none", "none", borders]}
      {...props}
    >
      <Text
        fontSize={["14px", "14px", "16px", "18px"]}
        fontWeight="500"
        color={text80}
        mb="10px"
        display={["none", "none", "none", "flex"]}
      >
        Listing Details
      </Text>
      <Text
        fontSize={["14px", "14px", "16px", "18px"]}
        fontWeight="500"
        color={text80}
        mb="5px"
        mt="10px"
        display={["flex", "flex", "flex", "none"]}
      >
        Listing Details
      </Text>
      {metrics.map(
        (entry, i) =>
          entry.value && (
            <Flex
              justify="space-between"
              borderTop={i === 0 ? "none" : borders}
              py="10px"
              pb={metrics.length - 1 === i ? "0px" : "10px"}
            >
              <Flex align="center" mb="5px">
                <TextSmall color={text60}>{entry.title}</TextSmall>
              </Flex>
              <Flex color={text80} align="center">
                {entry.value}
                {entry.link ? (
                  <Flex color={text80} align="center" ml="5px">
                    <Link
                      href={entry.link}
                      target="_blank"
                      display="flex"
                      rel="noreferrer"
                      alignItems="center"
                      justifyContent="center"
                    >
                      <ExternalLinkIcon color={text60} />
                    </Link>
                  </Flex>
                ) : null}
              </Flex>
            </Flex>
          ),
      )}
    </Flex>
  );
};
