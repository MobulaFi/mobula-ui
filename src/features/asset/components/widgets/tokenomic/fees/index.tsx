import {Flex, Text} from "@chakra-ui/react";
import * as echarts from "echarts";
import {useCallback, useEffect, useMemo} from "react";
import {v4 as uuid} from "uuid";
import {useColors} from "../../../../../../../common/utils/color-mode";

export const Fees = () => {
  const {boxBg3, text80, borders} = useColors();
  type EChartsOption = echarts.EChartsOption;
  let options: EChartsOption;
  const id = useMemo(() => uuid(), []);

  options = {
    // color: ["#FFFFF,#42D19B,blue,#42D19B,pink"],
    tooltip: {
      trigger: "item",
    },
    legend: {
      show: true,
      bottom: "0%",
      orient: "horizontal",
    },
    padding: 20,

    series: [
      {
        name: "Access From",
        type: "pie",
        radius: ["50%", "70%"],
        center: ["50%", "40%"],
        avoidLabelOverlap: false,
        label: {
          show: false,
          position: "center",
        },
        emphasis: {
          label: {
            show: true,
            fontSize: 14,
            fontWeight: "bold",
          },
        },
        labelLine: {
          show: false,
        },
        data: [
          {value: 1048, name: "Search Engine"},
          {value: 735, name: "Direct"},
          {value: 580, name: "Email"},
          {value: 484, name: "Union Ads"},
          {value: 300, name: "Video Ads"},
        ],
      },
    ],
  };

  const createInstance = useCallback(() => {
    const instance = echarts.getInstanceByDom(document.getElementById(id));

    return (
      instance ||
      echarts.init(document.getElementById(id), null, {
        renderer: "canvas",
      })
    );
  }, [id]);

  useEffect(() => {
    const chart = createInstance();
    if (chart) chart.setOption(options);
  }, []);

  useEffect(() => {
    const chart = createInstance();
    window.onresize = function () {
      chart.resize();
    };
  }, []);

  return (
    <Flex
      p="20px"
      borderRadius="16px"
      border={borders}
      bg={boxBg3}
      mb="10px"
      w="100%"
      mx="auto"
      direction="column"
    >
      <Text
        fontSize={["14px", "14px", "16px", "18px"]}
        fontWeight="500"
        color={text80}
        mb="0px"
        display={["none", "none", "none", "flex"]}
      >
        Fees
      </Text>{" "}
      <div id={id} style={{height: "300px", width: "100%"}} />
    </Flex>
  );
};
