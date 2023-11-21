import {CheckIcon} from "@chakra-ui/icons";
import {Flex, Icon, Text} from "@chakra-ui/react";
import {AiOutlineEye, AiOutlineStar} from "react-icons/ai";
import {BiGitRepoForked} from "react-icons/bi";
import {BsThreeDots} from "react-icons/bs";
import {HiOutlineUsers} from "react-icons/hi";
import {TbArrowsShuffle2} from "react-icons/tb";

import {TextSmall} from "../../../../../../../UI/Text";
import {useColors} from "../../../../../../../common/utils/color-mode";
import {FlexBorderBox} from "../../../../style";

export const GithubInfo = ({...props}) => {
  const {text80, borders, boxBg3, text60} = useColors();
  //   const {baseAsset} = useContext(BaseAssetContext);
  const metrics = [
    {
      title: "Stars",
      //   value: baseAsset?.assets_social?.github_stars,
      value: 132,
      icon: <Icon as={AiOutlineStar} color="yellow" />,
    },
    {
      title: "Watchers",
      //   value: baseAsset?.assets_social?.github_watchers,
      value: 43253,
      icon: <Icon as={AiOutlineEye} color={text80} />,
    },
    {
      title: "Forks",
      //   value: baseAsset?.assets_social?.github_forks,
      value: 2340,
      icon: <Icon as={BiGitRepoForked} color={text80} />,
    },
    {
      title: "Contributors",
      //   value: baseAsset?.assets_social?.github_contributors,
      value: 103,
      icon: <Icon as={HiOutlineUsers} color="blue" />,
    },
    {
      title: "Merged Pull Requests",
      //   value: baseAsset?.assets_social?.github_merged_pull_request,
      value: 3422,
      icon: <Icon as={TbArrowsShuffle2} color="green" />,
    },
    {
      title: "Closed Issues",
      //   value: baseAsset?.assets_social?.github_closed_issues,
      value: 2344,
      icon: <Icon as={CheckIcon} color="green" />,
    },
    {
      title: "Total Issues",
      //   value: baseAsset?.assets_social?.github_total_issues,
      value: 2344,
      icon: <Icon as={BsThreeDots} color={text80} />,
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
        Github Metrics
      </Text>
      {metrics.map((entry, i) => (
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
