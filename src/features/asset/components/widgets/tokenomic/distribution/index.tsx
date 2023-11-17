import {Flex, Image, Text, useColorMode} from "@chakra-ui/react";
import * as echarts from "echarts";
import {useCallback, useContext, useEffect, useMemo} from "react";
import {v4 as uuid} from "uuid";
import {TextSmall} from "../../../../../../../UI/Text";
import {useColors} from "../../../../../../../common/utils/color-mode";
import {BaseAssetContext} from "../../../../context-manager";

export const Distribution = ({...props}) => {
  const {boxBg3, text80, borders} = useColors();
  const {baseAsset, activeTab} = useContext(BaseAssetContext);
  type EChartsOption = echarts.EChartsOption;
  let options: EChartsOption;
  const id = useMemo(() => uuid(), []);
  const {colorMode} = useColorMode();
  const isDarkMode = colorMode === "dark";
  const data =
    baseAsset?.distribution.length > 0
      ? baseAsset?.distribution?.map(entry => ({
          value: entry.percentage,
          name: entry.name,
        }))
      : [];

  options = {
    legend: {
      show: true,
      bottom: "0%",
      orient: "horizontal",
      textStyle: {
        color: isDarkMode ? "rgba(255, 255, 255, 0.8)" : "rgba(0, 0, 0, 0.8)",
      },
      itemWidth: 10,
      itemHeight: 10,
      borderRadius: 100,
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
            width: 100,
            align: "center",
            overflow: "break",
            color: isDarkMode
              ? "rgba(255, 255, 255, 0.8)"
              : "rgba(0, 0, 0, 0.8)",
            formatter(params) {
              return `${params.name}\n\n${params.value}%`;
            },
          },
        },
        labelLine: {
          show: false,
        },
        data,
        color: [
          "#165DFF",
          "#D91AD9",
          "#F7BA1E",
          "#722ED1",
          "#0ECB81",
          "#EE5858",
          "#B4CFFF",
          "#2F3658",
        ],
      },
    ],
  };

  const createInstance = useCallback(() => {
    if (!baseAsset?.distribution?.length) return null;
    const instance = echarts.getInstanceByDom(document.getElementById(id));
    return (
      instance ||
      echarts.init(document.getElementById(id), null, {
        renderer: "canvas",
      })
    );
  }, [id, baseAsset, activeTab]);

  useEffect(() => {
    if (baseAsset?.distribution?.length === 0) return;
    const chart = createInstance();
    if (chart) chart.setOption(options);
  }, [baseAsset, activeTab]);

  useEffect(() => {
    if (baseAsset?.distribution?.length === 0) return;
    const chart = createInstance();
    window.onresize = function () {
      chart.resize();
    };
  }, [baseAsset, activeTab]);

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
      {...props}
    >
      <Text
        fontSize={["14px", "14px", "16px", "18px"]}
        fontWeight="500"
        color={text80}
        mb="0px"
        display={["none", "none", "none", "flex"]}
      >
        Distribution
      </Text>{" "}
      {data.length === 0 ? (
        <Flex direction="column" align="center" justify="center" mt="20px">
          <Image
            src={
              isDarkMode ? "/asset/empty-roi.png" : "/asset/empty-roi-light.png"
            }
            boxSize="150px"
          />
          <TextSmall mt="15px" mb="10px">
            No data available
          </TextSmall>
        </Flex>
      ) : (
        <div id={id} style={{height: "300px", width: "100%"}} />
      )}
    </Flex>
  );
};
