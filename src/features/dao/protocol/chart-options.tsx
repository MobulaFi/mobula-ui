import { colors } from "./constants";

export const DoughnutsChart = ({ token, whiteMode }) => {
  const formatFees = (side) => {
    const filteredFees = token?.tokenomics?.fees?.filter(
      (fee) => fee.side === side
    );
    const fees = filteredFees?.map((fee) => ({
      name: fee.name,
      value: fee.percentage,
    }));
    return fees;
  };

  type EChartsOption = echarts.EChartsOption;
  let options1: EChartsOption;
  let options2: EChartsOption;

  // eslint-disable-next-line prefer-const
  options1 = {
    // color: ["#FFFFF,#42D19B,blue,#42D19B,pink"],
    tooltip: {
      show: false,
    },
    legend: {
      show: true,
      right: "0%",
      top: "35%",
      orient: "vertical",
      textStyle: {
        color: whiteMode ? "rgba(0,0,0,0.8)" : "rgba(255,255,255,0.8)",
        fontSize: 14,
      },
      icon: "circle",
      itemWidth: 10,
      itemHeight: 10,
      formatter(name): any {
        const { data } = options1?.series[0];
        let target;
        for (let i = 0, l = data?.length; i < l; i += 1) {
          if (data[i].name === name) target = data[i].value;
        }
        const arr = [`${name}: ${Number(target)?.toFixed(2)}%`];
        return arr;
      },
    },
    padding: [0, 20],

    series: [
      {
        name: "Access From",
        type: "pie",
        radius: ["50%", "70%"],
        center: ["30%", "50%"],
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
            color: whiteMode ? "rgba(0,0,0,0.8)" : "rgba(255,255,255,0.8)",
          },
        },
        labelLine: {
          show: false,
        },
        data: formatFees("buy"),
        color: colors,
      },
    ],
  };
  // eslint-disable-next-line prefer-const
  options2 = {
    // color: ["#FFFFF,#42D19B,blue,#42D19B,pink"],
    tooltip: {
      show: false,
    },
    legend: {
      show: true,
      right: "0%",
      top: "35%",
      orient: "vertical",
      textStyle: {
        color: whiteMode ? "rgba(0,0,0,0.8)" : "rgba(255,255,255,0.8)",
        fontSize: 14,
      },
      icon: "circle",
      itemWidth: 10,
      itemHeight: 10,
      formatter(name): any {
        const { data } = options2?.series[0];
        let target;
        for (let i = 0, l = data?.length; i < l; i += 1) {
          if (data[i].name === name) target = data[i].value;
        }
        const arr = [`${name}: ${Number(target)?.toFixed(2)}%`];
        return arr;
      },
    },
    padding: [0, 20],

    series: [
      {
        name: "Access From",
        type: "pie",
        radius: ["50%", "70%"],
        center: ["30%", "50%"],
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
            color: whiteMode ? "rgba(0,0,0,0.8)" : "rgba(255,255,255,0.8)",
          },
        },
        labelLine: {
          show: false,
        },
        data: formatFees("sell"),
        color: colors,
      },
    ],
  };

  return { options1, options2 };
};
