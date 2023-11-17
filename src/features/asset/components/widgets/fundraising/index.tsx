import {Flex} from "@chakra-ui/react";
import {Allocation} from "./allocation";
import {FundraisingStats} from "./fundraising-stats";
import {Investors} from "./investors";
import {Rounds} from "./rounds";

export const Fundraising = () => (
  //   const {text80, boxBg3, boxBg6, borders, hover, text40, borders2x} =
  //     useColors();
  //   const {baseAsset} = useContext(BaseAssetContext);
  <Flex
    mt={["0px", "0px", "0px", "20px"]}
    mx="auto"
    w={["95%", "95%", "100%", "100%"]}
    direction={["column-reverse", "column-reverse", "column-reverse", "row"]}
  >
    <Flex
      direction="column"
      maxW="990px"
      w={["100%", "100%", "100%", "calc(100% - 345px)"]}
      mr={["0px", "0px", "0px", "25px"]}
    >
      <Rounds />
      <Investors />
      <Flex
        direction="column"
        display={["flex", "flex", "flex", "none"]}
        mt="10px"
      >
        {/* <LaunchDate /> */}
        <Allocation />
        <FundraisingStats />
      </Flex>
    </Flex>
    <Flex
      direction="column"
      display={["none", "none", "none", "flex"]}
      maxW="320px"
      w="100%"
    >
      {/* <LaunchDate /> */}
      <Allocation />
      <FundraisingStats />
    </Flex>
  </Flex>
);
