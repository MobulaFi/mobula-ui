import React from "react";
import { LargeFont } from "../../../../../components/fonts";

interface TemplateTitleProps {
  title: string;
  subtitle: string;
}

export const TemplateTitle = ({ title, subtitle }: TemplateTitleProps) => {
  return (
    <div className="flex flex-col items-center mb-[80px] mt-[50px] md:mt-5">
      <p className="text-4xl md:text-2xl text-light-font-100 dark:text-dark-font-100 mb-2.5 text-center font-bold">
        {title}
      </p>
      <LargeFont extraCss="text-center max-w-[610px] text-light-font-60 dark:text-dark-font-60 text-normal w-[80%] md:x-[90%]">
        {subtitle}
      </LargeFont>

      {/* <Image src={image} boxSize={["293px", "293px", "360px", "430px"]} /> */}
    </div>
  );
};
