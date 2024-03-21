import React from "react";
import { ExtraLargeFont, LargeFont, MediumFont } from "../../components/fonts";
import ChartAnalytic from "./components/chart";
import { Table } from "./components/table";
import { selectedOptionProps } from "./models";

export const contentFromType = (selectedOption: selectedOptionProps) => {
  if (selectedOption.type === "table") return <Table />;
  else if (selectedOption.type === "value")
    return (
      <div className="w-full h-[80%] flex flex-col justify-center items-center">
        <ExtraLargeFont extraCss="mb-2.5 text-5xl">
          {selectedOption.infos.amount}
        </ExtraLargeFont>
        <LargeFont extraCss="mb-2.5">{selectedOption.infos.text}</LargeFont>
      </div>
    );
  else if (selectedOption.type === "title")
    return (
      <div className="w-full flex flex-col">
        <ExtraLargeFont extraCss="mb-2.5">
          {selectedOption.infos.title}
        </ExtraLargeFont>
        <MediumFont extraCss="mb-2.5 text-light-font-80 dark:text-dark-font-80">
          {selectedOption.infos.description}
        </MediumFont>
      </div>
    );
  else return <ChartAnalytic chartOptions={selectedOption} />;
};
