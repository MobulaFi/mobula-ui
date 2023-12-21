import React, { useContext } from "react";
import { BaseAssetContext } from "../../../context-manager";
import { SocialInfo } from "./social-info";

export const SocialsDeveloper = () => {
  const { baseAsset } = useContext(BaseAssetContext);
  return (
    <div className="flex mt-5 lg:mt-0 w-full md:w-[95%] mx-auto flex-row lg:flex-col-reverse">
      <div className="max-w-[990px] w-full-345 lg:w-full flex flex-col mr-[25px] lg:mr-0">
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
        {/* {baseAsset?.twitter_history?.length > 0 ? (
          <MultiChart chartId="social-chart" />
        ) : null} */}
        <SocialInfo extraCss="hidden lg:flex mt-[5px] mb-2.5" />
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
      </div>
      <div className="flex flex-col max-w-[345px] w-full lg:hidden">
        {/* <GithubInfo /> */}
        <SocialInfo />
      </div>
    </div>
  );
};
