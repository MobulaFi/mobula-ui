import { Box, Flex } from "@chakra-ui/react";
import { NextImageFallback } from "components/image";
import { useColors } from "lib/chakra/colorMode";

export const TokenInfo = ({ token, index, showRank }) => {
  const { text60, text80, text40 } = useColors();
  const checkImage = () => {
    if (token?.logo) {
      if (token.logo["0"] === "h") return token.logo;
      return `https://${token.logo}`;
    }
    return "/icon/unknown.png";
  };
  return (
    <Flex align="center" w="100%">
      <Flex boxSize={26} minW={26} minH={26} mr="10px" borderRadius="full">
        <NextImageFallback
          src={checkImage()}
          alt="token logo"
          width={26}
          height={26}
          style={{
            borderRadius: "100%",
          }}
          priority={index < 10}
          fallbackSrc="/icon/unknown.png"
        />
      </Flex>
      <Flex
        mr={["0px", "10px", "10px", "10px", "10px"]}
        direction={["column"]}
        flexWrap="wrap"
      >
        <Flex>
          {showRank ? (
            <Box
              display={["block", "block", "none", "none"]}
              mr="7.5px"
              color={text40}
              fontSize="14px"
            >
              {token.rank}
            </Box>
          ) : null}
          <Box as="span" fontSize="14px" fontWeight="600" color={text80}>
            {token.symbol}
          </Box>
        </Flex>
        <Box
          mr="10px"
          whiteSpace="nowrap"
          as="span"
          fontSize="12px"
          textAlign="left"
          textOverflow="ellipsis"
          overflow="hidden"
          color={text60}
          maxW={["90px", "100px", "130px"]}
          w="130px"
        >
          {token.name}
        </Box>
      </Flex>
    </Flex>
  );
};
