import { extendTheme } from "@chakra-ui/react";
import { colors } from "./colors";
import { components } from "./components";
import { config } from "./config";
import { fonts } from "./fonts";

const customTheme = extendTheme({
  fonts,
  colors,
  config,
  components,
  semanticTokens: {
    colors: {
      "chakra-body-text": {
        _light: "rgba(0,0,0,0.95)",
        _dark: "rgba(255,255,255,0.95)",
      },
      border_principal: {
        _light: "rgba(0,0,0,0.03)",
        _dark: "rgba(255,255,255,0.03)",
      },
      shadow_primary: {
        _light: "0px 0px 10px rgba(0, 0, 0, 0.07)",
        _dark: "0px 0px 10px rgba(17, 21, 36, 1)",
      },
      border_secondary: { _light: "#E7E8EC", _dark: "rgba(255,255,255,0.03)" },
      border_terciary: { _light: "#5c7df9", _dark: "#5c7df9" },
      bg_table: { _light: "rgba(255,255,255,1)", _dark: "#111524" },
      bg_principal: { _light: "rgba(255,255,255,1)", _dark: "#131627" },
      bg_secondary: { _light: "rgb(252.5, 252.5, 252.5)", _dark: "#151929" },
      bg_terciary: { _light: "rgb(250, 250, 250)", _dark: "#171B2B" },
      bg_hover: { _light: "rgb(245,245,245)", _dark: "rgba(34, 37, 49, 1)" },
      bg_tags: { _light: "#E3E3E3", _dark: "#282B37" },
      text_primary: {
        _light: "rgba(0,0,0,0.95)",
        _dark: "rgba(255,255,255,0.95)",
      },
      text_secondary: {
        _light: "rgba(0,0,0,0.8)",
        _dark: "rgba(255,255,255,0.8)",
      },
      text_terciary: {
        _light: "rgba(0,0,0,0.5)",
        _dark: "rgba(255,255,255,0.5)",
      },
      text_quaternary: {
        _light: "rgba(0,0,0,0.2)",
        _dark: "rgba(255,255,255,0.2)",
      },
      green: "#0ECB81",
      green_bg: "#163C31",
      darkgreen: "rgba(2, 192, 118, 0.2)",
      yellow: "#f3ba2f",
      darkyellow: "rgba(240, 185, 11, 0.2)",
      red: "#ea3943",
      red_bg: "rgba(234, 57, 67, 0.2)",
      blue: "#5c7df9",
      darkblue: "rgba(43, 58, 117, 1)",
      telegram: "#229ED9",
      daily_active: {
        _light: "linear-gradient(180deg, #43D19B 37.08%, #FAFAFA 37.55%)",
        _dark: "linear-gradient(180deg, #43D19B 37.08%, #141828 37.55%)",
      },
      daily_inactive: {
        _light: "linear-gradient(180deg, #5C7DF9 37.08%, #FAFAFA 37.55%)",
        _dark: "linear-gradient(180deg, #5C7DF9 37.08%, #131727 37.55%)",
      },
    },
  },
  styles: {
    global: () => ({
      body: {
        fontFamily: "Inter",
        color: "var(--text-primary)",
        bg: "var(--chakra-colors-bg_principal)",
        lineHeight: "base",
      },
    }),
  },
});

export default customTheme;
