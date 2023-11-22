import {Flex, Icon, Text, useColorMode} from "@chakra-ui/react";
import * as echarts from "echarts";
import {useCallback, useEffect, useMemo} from "react";
import {AiOutlinePieChart} from "react-icons/ai";
import {v4 as uuid} from "uuid";
import {TextSmall} from "../../../../../../../UI/Text";
import {useColors} from "../../../../../../../common/utils/color-mode";
import {BoxContainer} from "../../../../../common/components/box-container";
import {DoughnutsChart} from "../../../../chart-options";

export const TokenFees = ({token}) => {
  console.log(token);
  const {borders} = useColors();
  const {colorMode} = useColorMode();
  const whiteMode = colorMode === "light";

  const id = useMemo(() => uuid(), []);
  const {options1, options2} = DoughnutsChart({token, whiteMode});
  const createInstance = useCallback(
    newId => {
      const instance = echarts.getInstanceByDom(document.getElementById(newId));
      return (
        instance ||
        echarts.init(document.getElementById(newId), null, {
          renderer: "canvas",
        })
      );
    },
    [id],
  );

  useEffect(() => {
    const chart1 = createInstance("chart1");
    const chart2 = createInstance("chart2");

    if (chart1) chart1.setOption(options1);
    if (chart2) chart2.setOption(options2);
  }, []);

  const getDisplay = () => {
    if (token?.tokenomics?.fees.length > 0) return "flex";
    return "none";
  };

  return (
    <BoxContainer
      mb="20px"
      position="relative"
      transition="all 300ms ease-in-out"
      p={["10px", "10px", "15px", "15px 20px"]}
      borderRadius={["0px", "16px"]}
      display={getDisplay()}
    >
      <Flex
        align="center"
        borderBottom={borders}
        pb={["10px", "10px", "15px", "20px"]}
      >
        <Icon as={AiOutlinePieChart} color="yellow" />
        <Text fontSize={["14px", "14px", "16px", "18px"]} ml="10px">
          Token Fees
        </Text>
      </Flex>
      <Flex
        mt="15px"
        direction={["column", "column", "column", "row"]}
        w="100%"
      >
        <Flex w={["100%", "100%", "100%", "50%"]} direction="column">
          <TextSmall mb="-20px" fontWeight="500" ml="10px">
            Buy Fees
          </TextSmall>
          <Flex id="chart1" style={{height: "250px", width: "100%"}} />
        </Flex>
        <Flex w={["100%", "100%", "100%", "50%"]} direction="column">
          <TextSmall mb="-20px" fontWeight="500" ml="10px">
            Sell Fees
          </TextSmall>
          <Flex id="chart2" w="100%" h="250px" />
        </Flex>
      </Flex>
    </BoxContainer>
  );
};
