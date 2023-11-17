/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable consistent-return */
import {Flex, Image, Text, useColorMode} from "@chakra-ui/react";
import * as echarts from "echarts";
import {useCallback, useContext, useEffect, useMemo} from "react";
import {v4 as uuid} from "uuid";
import {TextSmall} from "../../../../../../../UI/Text";
import {useColors} from "../../../../../../../common/utils/color-mode";
import {colors, nonMatchingColors} from "../../../../constant";
import {BaseAssetContext} from "../../../../context-manager";

export const Allocation = ({...props}) => {
  const {baseAsset} = useContext(BaseAssetContext);
  const {text80, borders, boxBg3, text60} = useColors();
  type EChartsOption = echarts.EChartsOption;
  const id = useMemo(() => uuid(), []);
  const {colorMode} = useColorMode();
  const isDarkMode = colorMode === "dark";

  const getHeight = () => {
    if (baseAsset?.distribution?.length > 7) return {h: "380px", y: "33%"};
    if (baseAsset?.distribution?.length >= 5) return {h: "350px", y: "38%"};
    return {h: "300px", y: "43%"};
  };

  const getPositionTooltip = () => {
    if (baseAsset?.distribution?.length > 7) return ["23%", "21%"];
    if (baseAsset?.distribution?.length >= 5) return ["23%", "25%"];
    return ["23%", "29%"];
  };

  const {h, y} = getHeight();

  const data =
    baseAsset?.distribution.length > 0
      ? baseAsset?.distribution?.map(entry => ({
          value: entry.percentage,
          name: entry.name,
        }))
      : [];

  const getNameWithColors = () => {
    const vestings = baseAsset?.release_schedule;
    const types = [];
    const seen = new Set();
    vestings.forEach(([, , type], idx) => {
      if (idx === 0) {
        Object.keys(type)?.forEach(key => {
          types.push(key);
          seen.add(key);
        });
      } else {
        Object.keys(type)?.forEach(key => {
          if (!seen.has(key)) {
            seen.add(key);
            types.push(key);
          }
        });
      }
    });
    const typeWithColor = [];
    types.forEach((type, i) => {
      typeWithColor.push({name: type, color: colors[i]});
    });

    return typeWithColor;
  };

  const getFinalColors = () => {
    const newColors = [];
    data.forEach((e, i) => {
      getNameWithColors().forEach(vesting => {
        if (e.name === vesting.name) {
          newColors[i] = vesting.color;
        }
      });
      if (newColors[i] === undefined) {
        newColors[i] = nonMatchingColors[i];
      }
    });
    return newColors;
  };

  const newColors = getFinalColors();
  const options: EChartsOption = {
    legend: {
      show: true,
      bottom: baseAsset?.distribution?.length > 5 ? "0%" : "2%",
      orient: "horizontal",
      textStyle: {
        color: isDarkMode ? "rgba(255, 255, 255, 0.8)" : "rgba(0, 0, 0, 0.8)",
      },
      itemWidth: 10,
      itemHeight: 10,
      borderRadius: 100,
    },

    tooltip: {
      alwaysShowContent: false,
      show: true,
      backgroundColor: "transparent",
      borderColor: "transparent",
      trigger: "item",
      position: getPositionTooltip(),
      shadowColor: "none",
      extraCssText:
        "width: 150px; height: auto;display:flex;align-items:center;justify-content:center;flex-direction:column;box-shadow:none",
      formatter(params) {
        let {name} = params;

        if (params.name.length > 25) name = `${name.slice(0, 25)}...`;
        return `<div style="display:flex;flex-direction:column;align-items:center"><p style="font-weight:500;font-size:12px;color:${text60};margin-bottom:0px;max-width:150px;white-space:pre-wrap;text-align:center"> ${name}</p><p style="font-weight:600;color:${text80};font-size:18px;margin:0px">${params.value}%</p></div>`;
      },
    },
    padding: 20,
    series: [
      {
        name: "Liquidity",
        type: "pie",
        radius: ["55%", "70%"],
        center: ["50%", y],
        avoidLabelOverlap: false,
        label: {
          show: false,
          position: "center",
        },
        data: data as any[],
        color: newColors,
      },
    ],
  };

  const createInstance = useCallback(() => {
    if (!data?.length) return;
    const instance = echarts.getInstanceByDom(document.getElementById(id));
    return (
      instance ||
      echarts.init(document.getElementById(id), null, {
        renderer: "canvas",
      })
    );
  }, [id, baseAsset?.distribution, colorMode]);

  useEffect(() => {
    if (!baseAsset?.distribution.length) return;
    const chart = createInstance();
    if (chart) chart.setOption(options);
  }, [baseAsset?.distribution, colorMode]);

  useEffect(() => {
    if (!baseAsset?.distribution.length) return;
    const chart = createInstance();
    const handleResize = () => chart.resize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [baseAsset?.distribution, colorMode]);

  return (
    <Flex
      p="20px"
      borderRadius="16px"
      border={[borders]}
      bg={boxBg3}
      mb="10px"
      w="100%"
      mx="auto"
      direction="column"
      {...props}
    >
      <Text
        fontSize={["16px", "16px", "16px", "18px"]}
        fontWeight="500"
        color={text80}
        mb="0px"
      >
        Token Allocation
      </Text>
      {baseAsset?.distribution?.length === 0 ? (
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
        <Flex h={h} w="100%" maxW="278px" mx="auto">
          <div
            id={id}
            style={{
              height: h,
              width: "100%",
            }}
          />
        </Flex>
      )}
    </Flex>
  );
};
