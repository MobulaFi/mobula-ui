import {Flex, Icon, Text} from "@chakra-ui/react";
import {useContext} from "react";
import {BsDiscord, BsTwitter} from "react-icons/bs";
import {FaTelegramPlane} from "react-icons/fa";

import {getFormattedAmount} from "../../../../../../../../utils/helpers/formaters";
import {TextSmall} from "../../../../../../../UI/Text";
import {useColors} from "../../../../../../../common/utils/color-mode";
import {BaseAssetContext} from "../../../../context-manager";
import {FlexBorderBox} from "../../../../style";

export const SocialInfo = ({...props}) => {
  const {baseAsset} = useContext(BaseAssetContext);
  const {text80, borders, boxBg3, text60} = useColors();
  const metrics = [
    {
      title: "Twitter Followers",
      value: getFormattedAmount(baseAsset?.assets_social?.twitter_members),
      icon: <Icon as={BsTwitter} color="#33CCFF" />,
    },
    {
      title: "Telegram Members",
      value: getFormattedAmount(baseAsset?.assets_social?.telegram_members),
      icon: <Icon as={FaTelegramPlane} color="#3098C8" />,
    },
    {
      title: "Discord Members",
      value: getFormattedAmount(baseAsset?.assets_social?.discord_members),
      icon: <Icon as={BsDiscord} color="#5865F2" />,
    },
  ];
  return (
    <Flex
      {...FlexBorderBox}
      {...props}
      bg={["none", "none", "none", boxBg3]}
      border={["none", "none", "none", borders]}
    >
      <Text
        fontSize={["14px", "14px", "16px", "18px"]}
        fontWeight="500"
        color={text80}
        mb="10px"
        display={["none", "none", "none", "flex"]}
      >
        Socials Metrics
      </Text>
      {metrics
        .filter(entry => entry.value && entry.value !== 0)
        .map((entry, i) => (
          <Flex
            justify="space-between"
            borderTop={i === 0 ? "none" : borders}
            py="10px"
            pb={metrics.length - 1 === i ? "0px" : "10px"}
          >
            <Flex align="center" mb="5px">
              {entry.icon}
              <TextSmall ml="7.5px" color={text60}>
                {entry.title}
              </TextSmall>
            </Flex>
            <Flex align="center">
              <Text fontSize="13px" color={text80}>
                {entry.value}
              </Text>
            </Flex>
          </Flex>
        ))}
    </Flex>
  );
};
