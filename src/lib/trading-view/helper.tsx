import { ResolutionString } from "../../../public/static/charting_library/charting_library";
import { TRADING_VIEW_DEFAULTS } from "./models";

export const widgetOptionsDefault = {
  interval: TRADING_VIEW_DEFAULTS.INTERVAL as ResolutionString,
  library_path: TRADING_VIEW_DEFAULTS.LIBRARY_PATH as string,
  custom_css_url: TRADING_VIEW_DEFAULTS.CUSTOM_CSS as string,
};
