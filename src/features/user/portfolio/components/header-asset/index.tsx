import { Button, Flex, Icon, Image, Skeleton } from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import React, { useContext, useEffect, useState } from "react";
import { AiOutlineSetting } from "react-icons/ai";
import { BsChevronLeft } from "react-icons/bs";
import { TextLandingMedium } from "../../../../../components/fonts";
import { TagPercentage } from "../../../../../components/tag-percentage";
import { useColors } from "../../../../../lib/chakra/colorMode";
import {
  getFormattedAmount,
  getUrlFromName,
} from "../../../../../utils/formaters";
import { PortfolioV2Context } from "../../context-manager";
import { buttonHeaderStyle } from "../../style";

export const HeaderAsset = () => {
  const router = useRouter();
  const { setShowAssetManage, asset, isLoading } =
    useContext(PortfolioV2Context);
  const { hover, text80, text40, boxBg6 } = useColors();
  const [changeColor, setChangeColor] = useState(text80);

  useEffect(() => {
    if (!asset) return;

    if (asset.estimated_balance_change === true) {
      setChangeColor("green");

      setTimeout(() => {
        setChangeColor(text80);
      }, 1000);
    } else if (asset.estimated_balance_change === false) {
      setChangeColor("red");

      setTimeout(() => {
        setChangeColor(text80);
      }, 1000);
    }
  }, [asset]);

  return (
    <Flex w="100%" direction="column">
      <Flex align="center" justify="space-between">
        {/* <Button
          display={["flex", "flex", "none"]}
          sx={buttonHeaderStyle}
          bg={boxBg6}
          _hover={{bg: hover}}
          color={text80}
          onClick={() => setShowAssetManage(true)}
        >
          Manage <Icon ml="5px" as={AiOutlineSetting} color={text80} />
        </Button> */}
      </Flex>
      <Flex align="center" justify="space-between">
        <Flex align="center">
          <Button
            onClick={() => {
              router.push(
                router.asPath.split("?")[0].split("/").slice(0, -1).join("/")
              );
            }}
            color={text80}
          >
            <Icon as={BsChevronLeft} color={text80} mr="10px" fontSize="16px" />{" "}
          </Button>
          {isLoading ? (
            <Flex position="relative">
              <Skeleton
                boxSize={["16px", "16px", "20px", "24px"]}
                borderRadius="full"
                minW="32px"
                minH="32px"
                startColor={boxBg6}
                endColor={hover}
              />
            </Flex>
          ) : (
            <Flex position="relative">
              {asset?.image && (
                <Image
                  src={asset?.image}
                  fallbackSrc="/unknown.png"
                  boxSize={["16px", "16px", "20px", "24px"]}
                  borderRadius="full"
                />
              )}
            </Flex>
          )}

          {isLoading ? (
            <Skeleton
              borderRadius="8px"
              h={["16px", "16px", "20px", "24px"]}
              w="150px"
              startColor={boxBg6}
              endColor={hover}
              ml="5px"
            />
          ) : (
            <TextLandingMedium
              color={text80}
              fontSize={["16px", "16px", "20px", "24px"]}
              ml="5px"
              cursor="pointer"
              onClick={() =>
                router.push(`/asset/${getUrlFromName(asset?.name)}`)
              }
            >
              {asset?.name}
            </TextLandingMedium>
          )}
          {isLoading ? (
            <Skeleton
              borderRadius="8px"
              h={["16px", "16px", "20px", "24px"]}
              w="90px"
              startColor={boxBg6}
              endColor={hover}
              ml="5px"
            />
          ) : (
            <TextLandingMedium
              color={text40}
              fontSize={["16px", "16px", "20px", "24px"]}
              ml="5px"
              cursor="pointer"
              onClick={() =>
                router.push(`/asset/${getUrlFromName(asset?.name)}`)
              }
            >
              {asset?.symbol}
            </TextLandingMedium>
          )}
        </Flex>

        <Flex align="center" display={["flex", "flex", "none"]}>
          <TextLandingMedium mr="5px" ml="10px" color={changeColor}>
            ${getFormattedAmount(asset?.price)}
          </TextLandingMedium>

          <TagPercentage
            percentage={asset?.change_24h}
            isUp={asset?.change_24h > 0}
          />
        </Flex>
        <Button
          display={["none", "none", "flex"]}
          sx={buttonHeaderStyle}
          bg={boxBg6}
          _hover={{ bg: hover }}
          color={text80}
          mr="0px !important"
          onClick={() => setShowAssetManage(true)}
        >
          Manage <Icon ml="5px" as={AiOutlineSetting} />
        </Button>
      </Flex>
    </Flex>
  );
};
