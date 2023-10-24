"use client";

import { Flex, Icon } from "@chakra-ui/react";
import NextImage from "next/image";
import { useRouter } from "next/navigation";
import React, { useContext, useState } from "react";
import { BsCheckLg } from "react-icons/bs";
import { useAccount } from "wagmi";
import {
  TextLandingMedium,
  TextLandingSmall,
  TextSmall,
} from "../../../../../../components/fonts";
import { UserContext } from "../../../../../../contexts/user";
import { useColors } from "../../../../../../lib/chakra/colorMode";
import { pushData } from "../../../../../../lib/mixpanel";

export const Discover = ({ showPage, info }) => {
  const { text80, bordersActive, text100, borders } = useColors();
  const router = useRouter();
  const [isHover, setIsHover] = useState(false);
  const isReferral = info.title === "Referral Program";
  const [isCopied, setIsCopied] = useState(false);
  const { address } = useAccount();
  const { user } = useContext(UserContext);
  return (
    <Flex
      minW="100%"
      direction="column"
      w="200px"
      transform={`translateX(-${showPage * 100}%)`}
      transition="all 250ms ease-in-out"
      p="10px 15px 0px 15px"
    >
      <TextLandingSmall color={text80}>{info.title}</TextLandingSmall>
      <Flex
        mt={["7.5px", "7.5px", "7.5px", "20px"]}
        w="100%"
        h={["123px", "123px", "123px", "130px"]}
        borderRadius="16px"
        border={isHover ? bordersActive : borders}
        position="relative"
        transition="all 250ms ease-in-out"
        cursor="pointer"
        onClick={() => {
          if (isReferral) {
            setIsCopied(true);
            navigator.clipboard.writeText(
              `https://mobula.fi?ref=${user?.reflink ? user.reflink : address}`
            );
            setTimeout(() => {
              setIsCopied(false);
            }, 3000);
          } else {
            pushData("Window Home Clicked", {
              name: info.title,
              to_page: info.url,
            });
            router.push(info.url);
          }
        }}
        onMouseEnter={() => setIsHover(true)}
        onMouseLeave={() => setIsHover(false)}
      >
        <Flex
          w="90%"
          justify="space-between"
          position="absolute"
          align="center"
          top="15px"
          left="15px"
        >
          <TextLandingMedium>{info.subtitle}</TextLandingMedium>
          {isCopied && isReferral ? (
            <Flex align="center">
              <TextSmall color={text80} fontWeight="600">
                Copied
              </TextSmall>
              <Icon
                as={BsCheckLg}
                ml="5px"
                color="green"
                fontSize="12px"
                mt="1px"
              />
            </Flex>
          ) : null}
          {!isCopied && isReferral ? (
            <TextSmall color={text80} fontWeight="600">
              Copy
            </TextSmall>
          ) : null}
        </Flex>

        <TextSmall
          position="absolute"
          color={text100}
          bottom="25px"
          left="15px"
          fontWeight="500"
        >
          {info.description}
        </TextSmall>
        <NextImage
          src={info.image}
          alt="Discovery banner of Mobula features"
          width="375"
          height="130"
        />
      </Flex>
    </Flex>
  );
};
