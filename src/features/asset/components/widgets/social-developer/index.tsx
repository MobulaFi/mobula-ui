import {Flex} from "@chakra-ui/react";
import {useContext} from "react";
import {useColors} from "../../../../../../common/utils/color-mode";
import {BaseAssetContext} from "../../../context-manager";
import {MultiChart} from "./chart/social-chart";
import {SocialInfo} from "./social-info";

export const SocialsDeveloper = () => {
  const {baseAsset} = useContext(BaseAssetContext);
  const {text60} = useColors();

  return (
    <Flex
      mt={["0px", "0px", "0px", "20px"]}
      w={["95%", "95%", "100%", "100%"]}
      mx="auto"
      direction={["column-reverse", "column-reverse", "column-reverse", "row"]}
    >
      <Flex
        direction="column"
        maxW="990px"
        w={["100%", "100%", "100%", "calc(100% - 345px)"]}
        mr={["0px", "0px", "0px", "25px"]}
      >
        {/* <Charts chartId="github-chart" isGithub /> */}
        {/* <Flex
          w="100%"
          direction="column"
          mt="25px"
          mb={["0px", "0px", "0px", "0px"]}
        >
          <GithubInfo
            display={["flex", "flex", "flex", "none"]}
            mt="-25px"
            mb="15px"
          />
          <TextLandingMedium mb="10px">
            How github & social activity are computed?
          </TextLandingMedium>
          <TextSmall color={text60}>
            {baseAsset?.name} github & social activity are computed based on the
            original platforms APIs (Github API, Twitter API, etc.) - this data
            comes from centralized sources and thus could have been manipulated,
            take it with caution!
          </TextSmall>
        </Flex> */}
        {baseAsset?.twitter_history?.length > 0 ? (
          <MultiChart chartId="social-chart" />
        ) : null}
        <SocialInfo
          display={["flex", "flex", "flex", "none"]}
          mt="5px"
          mb="10px"
        />
        {/* <Flex
          w="100%"
          direction="column"
          mt={["10px", "10px", "10px", "25px"]}
          mb={["0px", "0px", "0px", "0px"]}
        >
          <TextLandingMedium mb="10px">
            How website visitors history is computed?
          </TextLandingMedium>
          <TextSmall color={text60}>
            Data is provided by Similarweb, a centralized company with
            closed-source code. Exercice with caution!
          </TextSmall>
        </Flex>
        <Charts chartId="website-chart" /> */}
      </Flex>
      <Flex
        direction="column"
        display={["none", "none", "none", "flex"]}
        maxW="320px"
        w="100%"
      >
        {/* <GithubInfo /> */}
        <SocialInfo />
      </Flex>
    </Flex>
  );
};
