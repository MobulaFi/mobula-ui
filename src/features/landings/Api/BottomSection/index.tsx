import {Box, Flex, Image, useMediaQuery} from "@chakra-ui/react";
import {useThemeValue} from "../../../../../utils/chakra";

const TopSection = ({}) => {
  const {text6, containersBg, shadow} = useThemeValue();
  const [isLargerThan1280] = useMediaQuery("(min-width: 1280px)");
  return (
    <Flex w="90%" direction="column" mt="0px" pb="50px" align="center">
      <Flex
        p={["0px", "0px", "0px 20px", "0px 20px"]}
        justify="center"
        direction={["column", "row", "row", "row"]}
      >
        <br />
      </Flex>
      <Flex
        align="center"
        justify="center"
        bg={["none", "none", "none", containersBg]}
        maxWidth="1025px"
        mt={["30px", "30px", "0px", "0px"]}
        ml={["10px", "10px", "25px", "25px"]}
        borderRadius="12px"
        mr={["16px", "16px", "", ""]}
        boxShadow={["none", "none", "none", `1px 2px 12px 3px ${shadow}`]}
      >
        <Flex
          bg={["none", "none", "none", containersBg]}
          wrap="wrap"
          borderRadius="12px"
          align="center"
          justify="space-around"
        >
          <Box
            h="80px"
            w="320px"
            display="flex"
            alignItems="center"
            justifyContent="center"
            borderRadius="12px"
            my={isLargerThan1280 ? "0px" : "10px"}
          >
            <Image src="apis/boggedFinance.png" />
          </Box>
          <Box
            h="80px"
            w="320px"
            display="flex"
            alignItems="center"
            justifyContent="center"
            borderRadius="12px"
            my={isLargerThan1280 ? "0px" : "10px"}
          >
            <Image src="/dex.png" />
          </Box>
          <Box
            h="80px"
            w="320px"
            display="flex"
            alignItems="center"
            justifyContent="center"
            borderRadius="12px"
            my={isLargerThan1280 ? "0px" : "10px"}
          >
            <Image src="apis/staysafu.png" />
          </Box>
          <Box
            h="80px"
            w="320px"
            display="flex"
            alignItems="center"
            justifyContent="center"
            borderRadius="12px"
            my={isLargerThan1280 ? "0px" : "10px"}
          >
            <Image src="apis/coinsniper.png" />
          </Box>
          <Box
            h="80px"
            w="320px"
            display="flex"
            alignItems="center"
            justifyContent="center"
            borderRadius="12px"
            my={isLargerThan1280 ? "0px" : "10px"}
          >
            <Image src="apis/degem.png" />
          </Box>
          <Box
            h="80px"
            w="320px"
            display="flex"
            alignItems="center"
            justifyContent="center"
            borderRadius="12px"
            my={isLargerThan1280 ? "0px" : "10px"}
          >
            <Image src="apis/gempad.png" />
          </Box>
        </Flex>
      </Flex>
    </Flex>
  );
};

export default TopSection;
