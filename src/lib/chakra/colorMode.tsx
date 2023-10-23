import { useColorModeValue } from "@chakra-ui/react";

export const useColors = () => {
  const colors = {
    shadow: "shadow_primary",
    borders: "1px solid var(--chakra-colors-border_principal)",
    bordersActive: "1px solid var(--chakra-colors-border_secondary)",
    borders2x: "2px solid var(--chakra-colors-border_principal)",
    bordersBlue: "1px solid var(--chakra-colors-border_terciary)",
    text_100: "text_primary",
    text_80: "text_primary",
    text_60: "text_secondary",
    text_40: "text_terciary",
    text_20: "text_quaternary",
    text_10: "text_quaternary",
    bg_box_3: "var(--chakra-colors-bg_secondary)",
    bg_box_1: "var(--chakra-colors-bg_table)",
    bg_box_11: useColorModeValue(
      "var(--chakra-colors-light_box_bg-9)",
      "var(--chakra-colors-box_bg-11)"
    ),
    bg_box_6: "var(--chakra-colors-bg_terciary)",
    bg: "var(--chakra-colors-bg_principal)",
    bg_table: "var(--chakra-colors-bg_table)",
    bg_main: "var(--chakra-colors-bg_principal)",
    hover: "var(--chakra-colors-bg_hover)",
    tags: "var(--chakra-colors-bg_tags)",
  };
  return {
    text100: colors.text_100,
    text80: colors.text_80,
    text60: colors.text_60,
    text40: colors.text_40,
    shadow: colors.shadow,
    text10: colors.text_10,
    text20: colors.text_20,
    hover: colors.hover,
    boxBg11: colors.bg_box_11,
    boxBg6: colors.bg_box_6,
    boxBg3: colors.bg_box_3,
    boxBg1: colors.bg_box_1,
    bgTable: colors.bg_table,
    bgMain: colors.bg_main,
    borders: colors.borders,
    bordersBlue: colors.bordersBlue,
    borders2x: colors.borders2x,
    bordersActive: colors.bordersActive,
    tags: colors.tags,
    bg: colors.bg,
  };
};
