import {ExternalLinkIcon} from "@chakra-ui/icons";
import {Flex, FlexProps, Link, Text} from "@chakra-ui/react";
import {useContext} from "react";
import {getFormattedAmount} from "../../../../../../../../utils/helpers/formaters";
import {TextSmall} from "../../../../../../../UI/Text";
import {useColors} from "../../../../../../../common/utils/color-mode";
import {BaseAssetContext} from "../../../../context-manager";
import {FlexBorderBox} from "../../../../style";
import {formatISODate} from "../../../../utils";

export const PresaleDetails = ({...props}: FlexProps) => {
  const {baseAsset} = useContext(BaseAssetContext);
  const {text80, borders, boxBg3, text60} = useColors();

  const currentSale = baseAsset?.sales?.[(baseAsset?.sales?.length || 0) - 1];

  if (!currentSale) return null;

  const metrics = [
    {
      title: "Platform",
      value: currentSale.platform,
      link: currentSale.link,
    },
    {
      title: "Valuation",
      value: currentSale.valuation || "-",
    },
    {
      title: "Amount",
      value: currentSale?.amount
        ? `${getFormattedAmount(currentSale?.amount)} ${baseAsset?.symbol}`
        : "-",
    },
    {
      title: "Date",
      value: formatISODate(baseAsset?.created_at),
    },
    {
      title: "Price",
      value: currentSale?.price
        ? `$${getFormattedAmount(currentSale?.price)}`
        : "-",
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
        Presale Details
      </Text>
      <Text
        fontSize={["14px", "14px", "16px", "18px"]}
        fontWeight="500"
        color={text80}
        mb="5px"
        mt="10px"
        display={["flex", "flex", "flex", "none"]}
      >
        Presale Details
      </Text>
      {metrics.map((entry, i) => (
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
      ))}
    </Flex>
  );
};
