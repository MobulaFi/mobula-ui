import * as echarts from "echarts";
import React, { useCallback, useEffect, useMemo } from "react";
import { v4 as uuid } from "uuid";
import { LargeFont } from "../../../../../../components/fonts";

export const Fees = () => {
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
          { value: 1048, name: "Search Engine" },
          { value: 735, name: "Direct" },
          { value: 580, name: "Email" },
          { value: 484, name: "Union Ads" },
          { value: 300, name: "Video Ads" },
        ],
      },
    ],
  };

  const createInstance = useCallback(() => {
    const instance = echarts.getInstanceByDom(
      document.getElementById(id) as HTMLElement
    );

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
    <div
      className="flex p-5 rounded-2xl border border-light-border-primary dark:border-dark-border-primary 
    bg-light-bg-secondary dark:bg-dark-bg-secondary w-full mb-2.5 mx-auto flex-col"
    >
      <LargeFont extraCss="flex lg:hidden">Fees</LargeFont>{" "}
      <div id={id} style={{ height: "300px", width: "100%" }} />
    </div>
  );
};
