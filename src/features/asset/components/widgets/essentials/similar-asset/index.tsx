import {Box, Button, Flex, Image} from "@chakra-ui/react";
import {useRouter} from "next/router";
import {
  formatNameClean,
  getFormattedAmount,
  getTokenPercentage,
  getUrlFromName,
} from "../../../../../../../../utils/helpers/formaters";
import {TextLandingMedium, TextSmall} from "../../../../../../../UI/Text";
import {useColors} from "../../../../../../../common/utils/color-mode";
import {useTrendings} from "../../../../hooks/use-trendings";

export const SimilarAsset = () => {
  const trendings = useTrendings();
  const router = useRouter();
  const {borders, text40, boxBg3, hover, bordersActive} = useColors();

  return (
    <Flex
      direction="column"
      mt={["30px", "30px", "50px"]}
      w={["95%", "95%", "100%", "100%"]}
      mx="auto"
    >
      <TextLandingMedium mb="15px" fontSize={["16px", "16px", "16px", "18px"]}>
        Similar Assets
      </TextLandingMedium>
      <Flex>
        <Flex overflowX="scroll" className="scroll">
          {trendings?.map(trending => {
            const color = trending.price_change_24h > 0 ? "green" : "red";
            if (trending.name)
              return (
                <Button
                  key={trending.id}
                  width={["160px", "160px", "270px", "300px"]}
                  minWidth="270px"
                  p={["10px 10px", "10px 10px", "10px 20px", "15px"]}
                  mx="auto"
                  border={borders}
                  borderRadius="16px"
                  mr="15px"
                  bg={boxBg3}
                  _hover={{
                    bg: hover,
                    border: bordersActive,
                  }}
                  transition="all 250ms ease-in-out"
                  onClick={() => {
                    router.push(`/asset/${getUrlFromName(trending.name)}`);
                  }}
                >
                  <Flex h="100%" w="100%" direction="column">
                    <Flex justify="space-between" align="flex-start">
                      <Flex align="center">
                        <Image
                          borderRadius="full"
                          boxSize={["16px", "16px", "28px", "28px"]}
                          src={trending.logo}
                          mr="10px"
                        />
                        <Box>
                          <TextSmall>
                            {formatNameClean(trending.name, 15)}
                          </TextSmall>
                          <TextSmall color={text40}>
                            ${getFormattedAmount(trending.price)}
                          </TextSmall>
                        </Box>
                      </Flex>
                      <TextSmall color={color}>
                        {parseFloat(
                          getTokenPercentage(trending.price_change_24h),
                        ) > 0
                          ? `+${getTokenPercentage(trending.price_change_24h)}`
                          : getTokenPercentage(trending.price_change_24h)}{" "}
                        %
                      </TextSmall>
                    </Flex>
                    <Image
                      mt={["10px", "10px", "20px", "20px"]}
                      src={`https://mobula-assets.s3.eu-west-3.amazonaws.com/sparklines/${trending.id}/24h.png`}
                      fallbackSrc="/404/sparkline.png"
                      w={["90%", "90%", "100%", "100%"]}
                    />
                  </Flex>
                </Button>
              );
            return null;
          })}
        </Flex>
      </Flex>
    </Flex>
  );
};
