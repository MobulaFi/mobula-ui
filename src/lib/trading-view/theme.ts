export const overrides = (isWhiteMode: boolean) => ({
  "paneProperties.vertGridProperties.color": isWhiteMode
    ? "#0D0D0D08"
    : "rgba(255, 255, 255, 0.03)",
  "paneProperties.horzGridProperties.color": isWhiteMode
    ? "#0D0D0D08"
    : "rgba(255, 255, 255, 0.03)",
  "symbolWatermarkProperties.transparency": 90,
  "scalesProperties.textColor": isWhiteMode
    ? "rgba(0,0,0,0.8)"
    : "rgba(255,255,255,0.8)",
  "mainSeriesProperties.candleStyle.wickUpColor": "#0ECB81",
  "mainSeriesProperties.candleStyle.width": "190px",
  "mainSeriesProperties.candleStyle.wickDownColor": "#ea3943",
  "mainSeriesProperties.candleStyle.upColor": "#0ECB81",
  "mainSeriesProperties.candleStyle.downColor": "#ea3943",
  "paneProperties.background": isWhiteMode
    ? "rgba(255,255,255,1)"
    : "rgba(19, 22, 39, 1)",
  "paneProperties.backgroundType": "solid",
  "scalesProperties.backgroundColor": isWhiteMode
    ? "rgba(255,255,255,1)"
    : "rgba(19, 22, 39, 1)",
  "paneProperties.legendProperties.showStudyArguments": true,
  "paneProperties.legendProperties.showStudyTitles": true,
  "paneProperties.legendProperties.showStudyValues": true,
  "paneProperties.legendProperties.showSeriesTitle": true,
  "paneProperties.legendProperties.showSeriesOHLC": true,
  "paneProperties.legendProperties.showLegend": true,
  "paneProperties.legendProperties.showBarChange": true,
  "paneProperties.legendProperties.showBackground": true,
  "mainSeriesProperties.hollowCandleStyle.drawWick": true,
  "mainSeriesProperties.hollowCandleStyle.drawBorder": true,
  "mainSeriesProperties.candleStyle.drawBorder": true,
  "mainSeriesProperties.haStyle.drawWick": true,
  "mainSeriesProperties.haStyle.drawBorder": true,
  "paneProperties.legendProperties.backgroundTransparency": 50,
});
