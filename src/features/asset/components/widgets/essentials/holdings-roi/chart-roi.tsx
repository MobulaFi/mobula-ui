/* eslint-disable no-underscore-dangle */
import {useColorMode} from "@chakra-ui/react";
import {useContext} from "react";
import {getTokenPercentage} from "../../../../../../../../utils/helpers/formaters";
import {BaseAssetContext} from "../../../../context-manager";

export const ROIChart = () => {
  const {wallet, baseAsset} = useContext(BaseAssetContext);
  const asset = wallet?.find(entry => entry.name === baseAsset.name);
  const roiData = [asset?.unrealized_roi, asset?.realized_roi];
  const {colorMode} = useColorMode();
  const isWhiteMode = colorMode === "light";

  const getData = () => {
    if (!asset) return {};
    const hoverlabel = {
      id: "hoverlabel",
      afterDraw(chart) {
        const {ctx, height, width} = chart;
        ctx.save();
        if (chart.active?.length > 0) {
          const textLabel = chart.data.labels[chart.active[0]._index];
          const numberLabel =
            chart.data.datasets[0].data[chart.active[0]._index];

          ctx.font = "15px Poppins";
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          ctx.fillStyle = isWhiteMode
            ? "rgba(0,0,0,0.8)"
            : "rgba(255,255,255,0.8)";
          ctx.fillText(textLabel, width / 2, height / 2.2);
          ctx.fillStyle =
            chart.data.datasets[0].data[chart.active[0]._index] > 0
              ? "#0ECB81"
              : "#E84142";
          ctx.fillText(
            `${getTokenPercentage(numberLabel)}%`,
            width / 2,
            height / 1.7,
          );
        }
        ctx.restore();
      },
    };

    return {
      type: "doughnut",
      plugins: [hoverlabel],
      data: {
        labels: ["Unrealized PNL", "Realized PNL"],
        datasets: [
          {
            data: roiData,
            backgroundColor: [
              asset?.unrealized_roi > 0 ? "#288558" : "#A54147",
              asset?.realized_roi > 0 ? "#0ECB81" : "#EE5858",
            ],
            borderColor: [
              asset?.unrealized_roi > 0 ? "#288558" : "#A54147",
              asset?.realized_roi > 0 ? "#0ECB81" : "#EE5858",
            ],
            responsive: true,
            hoverOpacity: 1,
            hoverOffset: 15,
            borderWidth: 0,
            hoverBorderWidth: 4,
          },
        ],
      },
      options: {
        borderWidth: 0,
        borderColor: "red",
        maintainAspectRatio: false,
        cutoutPercentage: 75,
        legend: {
          display: false,
        },
        tooltips: {
          enabled: false,
        },
      },
    };
  };

  return getData();
};
