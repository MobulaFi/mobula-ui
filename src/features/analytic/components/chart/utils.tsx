export const getSeries = (
  type: string,
  data: number[][] | [string, number][],
  colors?: { up: string; down: string }
) => {
  switch (type) {
    case "line":
      return {
        type: "line",
        showSymbol: false,
        itemStyle: {
          color: (params) => {
            const value = params.value[1];
            if (value > 0) return colors?.up;
            return colors?.down;
          },
        },
        lineStyle: {
          normal: {
            color:
              data[data?.length - 1][1] > data[0][1]
                ? colors?.up
                : colors?.down,
          },
        },
      };
    case "bar":
      return {
        type: "bar",
        itemStyle: {
          color: (params) => {
            const value = params.value[1];
            if (value > 0) return colors?.up;
            return colors?.down;
          },
        },
      };
    case "large-area":
      return {
        type: "line",
        areaStyle: {},
        showSymbol: false,
      };
    case "pie":
      return {
        type: "pie",
        radius: [0, 120],
        center: ["50%", "50%"],
        label: {
          color: "rgba(255,255,255,0.8)", // TODO: change to theme
          show: false,
        },
        legend: {
          orient: "vertical",
          left: 0,
          top: 50,
          data: data.map((item) => item[0]),
        },
        labelLine: {
          show: false,
        },
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: "rgba(0, 0, 0, 0.5)",
          },
        },
        data: data.map((item) => {
          return {
            value: item[1],
            name: item[0],
          };
        }),
      };
    case "multi":
      return {
        type: "line",
        series: data?.map((entry, i) => ({
          name: entry[0],
          type: "line",
          stack: "Total",
          lineStyle: { width: 1 },
          areaStyle: { borderWidth: 1 },
          //   emphasis: {
          //     focus: "series",
          //   },
          markLine: {
            data: [
              {
                xAxis: new Date().getTime(),
                lineStyle: {
                  type: "dotted",
                  // color:
                  //   resolvedTheme === "dark"
                  //     ? "rgba(255,255,255,0.1)"
                  //     : "rgba(0,0,0,0.1)",
                },
                symbol: "none",
                label: {
                  show: true,
                  position: "middle",
                  formatter() {
                    return "Today";
                  },
                  backgroundColor: "rgba(255,255,255,0.1)",
                  textStyle: {
                    color: "rgba(0,0,0,0.8)",
                    letterSpacing: 20,
                    fontWeight: "400",
                    padding: [3, 6, 3, 6],
                    textAlign: "center",
                  },
                },
              },
            ],
          },
          itemStyle: {
            borderRadius: [500, 500, 500, 500],
          },
          symbolSize: 0,
          data: entry[1],
        })),
      };
    default:
      return {
        type: "line",
        showSymbol: false,
        itemStyle: {
          color: (params) => {
            const value = params.value[1];
            if (value > 0) return colors?.up;
            return colors?.down;
          },
        },
        lineStyle: {
          normal: {
            color:
              data[data?.length - 1][1] > data[0][1]
                ? colors?.up
                : colors?.down,
          },
        },
      };
  }
};
