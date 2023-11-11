import { Flex, Text } from "@chakra-ui/react";
import React from "react";
import { cn } from "../@/lib/utils";
import { useColors } from "../lib/chakra/colorMode";

interface defaultProps {
  children: React.ReactNode;
  [key: string]: any;
  extraCss?: string;
}

interface TitleProps {
  title: string;
  subtitle?: string;
}

export const TextExtraSmall = ({ children, ...props }: defaultProps) => {
  const { text80 } = useColors();
  return (
    <Text
      fontSize={["10px", "10px", "11px", "12px"]}
      fontWeight="400"
      textOverflow="ellipsis"
      color={text80}
      {...props}
    >
      {children}
    </Text>
  );
};

export const TextSmall = ({ children, ...props }: defaultProps) => {
  const { text80 } = useColors();
  return (
    <Text
      fontSize={["12px", "12px", "13px", "14px"]}
      fontWeight="400"
      textOverflow="ellipsis"
      color={text80}
      {...props}
    >
      {children}
    </Text>
  );
};

export const TextMedium = ({ children, ...props }: defaultProps) => {
  const { text80 } = useColors();
  return (
    <Text
      fontSize={["14px", "14px", "15px", "16px"]}
      fontWeight="400"
      textOverflow="ellipsis"
      color={text80}
      {...props}
    >
      {children}
    </Text>
  );
};

export const TextLandingSmall = ({ children, ...props }: defaultProps) => {
  const { text60 } = useColors();
  return (
    <Text
      fontSize={["12px", "12px", "14px", "16px"]}
      fontWeight="400"
      textOverflow="ellipsis"
      color={text60}
      {...props}
    >
      {children}
    </Text>
  );
};

export const TextLandingMedium = ({ children, ...props }: defaultProps) => {
  const { text80 } = useColors();
  return (
    <Text
      fontSize={["16px", "16px", "18px", "20px"]}
      fontWeight="600"
      textOverflow="ellipsis"
      color={text80}
      {...props}
    >
      {children}
    </Text>
  );
};

export const TextLandingLarge = ({ children, ...props }: defaultProps) => {
  const { text80 } = useColors();
  return (
    <Text
      fontSize={["20px", "20px", "24px", "32px"]}
      fontWeight="600"
      textOverflow="ellipsis"
      color={text80}
      {...props}
    >
      {children}
    </Text>
  );
};

export const LandingTitle = ({ title, subtitle }: TitleProps) => (
  <Flex direction="column" mb={["20px", "20px", "25px", "30px"]}>
    <TextLandingLarge mb="5px">{title}</TextLandingLarge>
    <TextLandingSmall maxWidth={["auto", "auto", "auto", "615px"]}>
      {subtitle}
    </TextLandingSmall>
  </Flex>
);

export const SmallFont = ({ extraCss, children, ...props }: defaultProps) => {
  return (
    <p
      className={cn(
        "text-light-font-100 dark:text-dark-font-100 text-sm lg:text-[13px] md:text-xs font-normal",
        extraCss
      )}
    >
      {children}
    </p>
  );
};

export const MediumFont = ({ extraCss, children, ...props }: defaultProps) => {
  return (
    <p
      className={cn(
        "text-light-font-100 dark:text-dark-font-100 text-base lg:text-sm font-medium",
        extraCss
      )}
    >
      {children}
    </p>
  );
};

export const LargeFont = ({ extraCss, children, ...props }: defaultProps) => {
  return (
    <p
      className={cn(
        "text-light-font-100 dark:text-dark-font-100 text-lg lg:text-base font-bold ",
        extraCss
      )}
    >
      {children}
    </p>
  );
};
