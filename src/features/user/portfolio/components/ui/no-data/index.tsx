import React from "react";
import { MediumFont } from "../../../../../../components/fonts";
import { NextChakraLink } from "../../../../../../components/link";
import { cn } from "../../../../../../lib/shadcn/lib/utils";

interface NoDataProps {
  text: string;
  url?: string;
  urlText?: string;
  extraCss?: string;
}

export const NoData = ({ text, url, urlText, extraCss }: NoDataProps) => {
  return (
    <div className={cn("flex max-w-[80%] flex-col m-auto mt-[40px]", extraCss)}>
      <MediumFont extraCss="mb-[5px] text-center text-light-font-40 dark:text-dark-font-40">
        {text}
      </MediumFont>
      {url ? <NextChakraLink href={url}>{urlText}</NextChakraLink> : null}
    </div>
  );
};
