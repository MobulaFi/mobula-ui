import {ExternalLinkIcon} from "@chakra-ui/icons";
import {Box, Button, Flex, Image} from "@chakra-ui/react";
import {useContext} from "react";
import {
  TextExtraSmall,
  TextLandingMedium,
  TextLandingSmall,
} from "../../../../../UI/Text";
import {NextChakraLink} from "../../../../../common/components/links";
import {useColors} from "../../../../../common/utils/color-mode";
import {ListingContext} from "../../context-manager";

export const Nav = ({state}) => {
  const {text80, boxBg6, hover, text40, boxBg3, borders} = useColors();
  const {actualPage, setActualPage} = useContext(ListingContext);

  const infos = [
    {
      name: "Asset Info",
    },
    {
      name: "Socials",
    },
    {
      name: "Contracts",
    },
    ...(state.type === "nft"
      ? []
      : [
          {
            name: "Vesting",
          },
          {
            name: "Fees",
          },
        ]),

    {
      name: "Submit",
    },
  ];

  return (
    <Box>
      <Flex
        borderRadius="12px"
        mr="25px"
        direction="column"
        w="235px"
        pb="25px"
        align="center"
        bg={boxBg3}
        border={borders}
        display={["none", "none", "flex"]}
      >
        <Image
          mt="30px"
          src={
            state.image.logo ||
            state.image.uploaded_logo ||
            "/mobula/mobula-logo.svg"
          }
          borderRadius="full"
          boxSize="87px"
          mb="10px"
        />
        <TextLandingMedium mb="30px">Listing Form</TextLandingMedium>
        <Flex direction="column" w="100%" mb="20px" position="relative">
          <Flex
            direction="column"
            w="100%"
            align="flex-start"
            position="relative"
          >
            {infos.map((info, i) => (
              <Flex w="100%" direction="column" pl="30px" key={info.name}>
                <Flex align="center">
                  <Button
                    boxSize="24px"
                    borderRadius="full"
                    fontWeight="400"
                    color={text80}
                    transition="all 250ms ease-in-out"
                    border={
                      i <= actualPage
                        ? "1px solid var(--chakra-colors-blue)"
                        : borders
                    }
                    bg={i <= actualPage ? hover : boxBg6}
                    _hover={{bg: hover}}
                    fontSize="14px"
                    onClick={() => {
                      if (i <= actualPage) setActualPage(i);
                    }}
                  >
                    {i + 1}
                  </Button>
                  <TextLandingSmall ml="10px">{info.name}</TextLandingSmall>
                </Flex>
                {infos.length - 1 === i ? null : (
                  <Flex
                    borderLeft={
                      i < actualPage
                        ? "1px dashed var(--chakra-colors-blue)"
                        : "1px dashed var(--chakra-colors-borders-1)"
                    }
                    h="30px"
                    transition="all 250ms ease-in-out"
                    w="2px"
                    ml="12px"
                  />
                )}
              </Flex>
            ))}
          </Flex>
        </Flex>
        <TextExtraSmall ml="25px" mr="auto">
          <NextChakraLink
            color="blue"
            href="https://docs.mobula.fi/"
            isExternal
          >
            Read here{" "}
          </NextChakraLink>{" "}
          the documentation
        </TextExtraSmall>
        <Flex align="center" ml="25px" mr="auto">
          <NextChakraLink
            href="https://t.me/MobulaPartnerBot?start=Form_Help"
            isExternal
          >
            <TextExtraSmall textDecoration="underline" color={text40}>
              {" "}
              Get in touch with core-team
              <ExternalLinkIcon ml="5px" fontSize="11px" color={text40} />
            </TextExtraSmall>
          </NextChakraLink>
        </Flex>
      </Flex>
    </Box>
  );
};
