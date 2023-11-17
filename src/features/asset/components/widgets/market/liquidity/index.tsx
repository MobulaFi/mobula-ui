/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable consistent-return */
import {Button, Flex, Image, Text, useColorMode} from "@chakra-ui/react";
import * as echarts from "echarts";
import {useCallback, useContext, useEffect, useMemo, useState} from "react";
import {v4 as uuid} from "uuid";
import {getTokenPercentage} from "../../../../../../../../utils/helpers/formaters";
import {TextSmall} from "../../../../../../../UI/Text";
import {useColors} from "../../../../../../../common/utils/color-mode";
import {BaseAssetContext} from "../../../../context-manager";
import {getColorAndLogoFromName} from "../../../../utils";

export const Liquidity = ({...props}) => {
  const {baseAsset} = useContext(BaseAssetContext);
  const [biggestPairs, setBiggestPairs] = useState<[string, number][]>([]);
  const {text80, borders, text40, boxBg6, hover, boxBg3, text60} = useColors();
  type EChartsOption = echarts.EChartsOption;
  const id = useMemo(() => uuid(), []);
  const [title, setTitle] = useState("asset");
  const {colorMode} = useColorMode();
  const isDarkMode = colorMode === "dark";

  const data = biggestPairs.map(pair => ({
    name: pair[0],
    value: getTokenPercentage(pair[1]),
  }));
  const getColorArrayFromData = () =>
    data.map(item => getColorAndLogoFromName(item.name)?.logo);
  const logos = getColorArrayFromData();

  useEffect(() => {
    if (baseAsset && baseAsset.assets_raw_pairs) {
      if (title === "asset" && baseAsset?.assets_raw_pairs?.pairs_data) {
        setBiggestPairs(
          Object.entries(baseAsset?.assets_raw_pairs?.pairs_data).sort(
            (a, b) => b[1] - a[1],
          ),
        );
      } else if (
        title === "chain" &&
        baseAsset?.assets_raw_pairs?.pairs_per_chain
      ) {
        setBiggestPairs(
          Object.entries(baseAsset?.assets_raw_pairs?.pairs_per_chain).sort(
            (a, b) => b[1] - a[1],
          ),
        );
      }
    }
  }, [baseAsset, title]);

  const options: EChartsOption = {
    legend: {
      show: true,
      bottom: biggestPairs?.length > 5 ? "0%" : "2%",
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
      position: ["23%", "20%"],
      shadowColor: "none",
      extraCssText:
        "width: 150px; height: auto;display:flex;align-items:center;justify-content:center;flex-direction:column;box-shadow:none",
      formatter(params) {
        let {name} = params;
        if (params.name === "BNB Smart Chain (BEP20)") name = "BNB";
        if (params.name === "Avalanche C-Chain") name = "Avalanche";
        return `<div style="display:flex;flex-direction:column;align-items:center"><img src="${
          getColorAndLogoFromName(name)?.logo
        }" style="width:30px;height:30px;border-radius:20px;margin-bottom:10px;"/><p style="font-weight:600;color:${text60};margin-bottom:0px"> ${name}</p><p style="font-weight:600;color:${text80};font-size:18px;margin:0px">${
          params.value
        }%</p></div>`;
      },
    },
    padding: 20,
    series: [
      {
        name: "Liquidity",
        type: "pie",
        radius: ["55%", "70%"],
        center: ["50%", biggestPairs?.length > 5 ? "40%" : "45%"],
        avoidLabelOverlap: false,
        label: {
          show: false,
          position: "center",
        },
        data: data as any[],
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
    if (!biggestPairs.length) return;
    const instance = echarts.getInstanceByDom(document.getElementById(id));
    return (
      instance ||
      echarts.init(document.getElementById(id), null, {
        renderer: "canvas",
      })
    );
  }, [id, biggestPairs, title]);

  useEffect(() => {
    if (!biggestPairs.length) return;
    const chart = createInstance();
    if (chart) chart.setOption(options);
  }, [biggestPairs, title]);

  useEffect(() => {
    if (!biggestPairs.length) return;
    const chart = createInstance();
    const handleResize = () => chart.resize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [biggestPairs, title]);

  return (
    <Flex
      p="20px"
      borderRadius={["0px", "0px", "16px"]}
      border={["none", "none", "none", borders]}
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
        On-Chain liquidity repartition
      </Text>
      <Flex
        w="100%"
        h="fit-content"
        bg={boxBg6}
        borderRadius="8px"
        p="1px"
        position="relative"
        border={borders}
        align="center"
        mt="10px"
      >
        <Flex
          position="absolute"
          w="calc(50% - 2px)"
          h={["28px", "28px", "30px", "32px"]}
          borderRadius="6px"
          bg={hover}
          left={title === "asset" ? "calc(0% + 3px)" : "calc(50% - 2px)"}
          transition="all 250ms ease-in-out"
        />
        <Button
          w="50%"
          h={["32px", "32px", "34px", "36px"]}
          onClick={() => setTitle("asset")}
          color={title === "asset" ? text80 : text40}
          transition="all 250ms ease-in-out"
          fontWeight="500"
          fontSize={["12px", "12px", "13px", "14px"]}
        >
          Asset
        </Button>
        <Button
          w="50%"
          h={["32px", "32px", "34px", "36px"]}
          fontWeight="500"
          onClick={() => setTitle("chain")}
          color={title === "chain" ? text80 : text40}
          transition="all 250ms ease-in-out"
          fontSize={["12px", "12px", "13px", "14px"]}
        >
          Chain
        </Button>
      </Flex>
      {biggestPairs.length === 0 ? (
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
        <Flex
          h={biggestPairs?.length > 5 ? "300px" : "250px"}
          w="100%"
          maxW="278px"
          mx="auto"
        >
          <div
            id={id}
            style={{
              height: biggestPairs?.length > 5 ? "300px" : "250px",
              width: "100%",
            }}
          />
        </Flex>
      )}
    </Flex>
  );
};
