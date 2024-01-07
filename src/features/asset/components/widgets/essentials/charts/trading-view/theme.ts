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
  "mainSeriesProperties.candleStyle.wickUpColor": "#0CCB81",
  "mainSeriesProperties.candleStyle.width": "190px",
  "mainSeriesProperties.candleStyle.wickDownColor": "green",
  "mainSeriesProperties.candleStyle.upColor": "blue",
  "mainSeriesProperties.candleStyle.downColor": "yellow",
  "paneProperties.background": isWhiteMode ? "#fff" : "#131727",
  "paneProperties.backgroundType": "solid",
  "scalesProperties.backgroundColor": isWhiteMode ? "#fff" : "#131727",
  "paneProperties.legendProperties.showStudyArguments": true,
  "paneProperties.legendProperties.showStudyTitles": true,
  "paneProperties.legendProperties.showStudyValues": true,
  "paneProperties.legendProperties.showSeriesTitle": true,
  "paneProperties.legendProperties.showSeriesOHLC": true,
  "paneProperties.legendProperties.showLegend": true,
  "paneProperties.legendProperties.showBarChange": true,
  "paneProperties.legendProperties.showBackground": true,
  "paneProperties.legendProperties.backgroundTransparency": 50,
});
