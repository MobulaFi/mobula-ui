import {
  AvailableSaveloadVersions,
  ResolutionString,
} from "../../../public/static/charting_library/charting_library";
import { TRADING_VIEW_DEFAULTS } from "./models";

export const widgetOptionsDefault = {
  interval: TRADING_VIEW_DEFAULTS.INTERVAL as ResolutionString,
  library_path: TRADING_VIEW_DEFAULTS.LIBRARY_PATH as string,
  charts_storage_url: TRADING_VIEW_DEFAULTS.CHARTS_STORAGE_URL as string,
  charts_storage_api_version:
    TRADING_VIEW_DEFAULTS.CHARTS_STORAGE_API_VERSION as AvailableSaveloadVersions,
  client_id: TRADING_VIEW_DEFAULTS.CLIENT_ID as string,
  user_id: TRADING_VIEW_DEFAULTS.USER_ID as string,
  custom_css_url: TRADING_VIEW_DEFAULTS.CUSTOM_CSS as string,
};
