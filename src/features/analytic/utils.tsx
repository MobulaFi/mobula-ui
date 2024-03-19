import React from "react";
import { ExtraLargeFont, MediumFont } from "../../components/fonts";
import ChartAnalytic from "./components/chart";
import { Table } from "./components/table";
import { selectedOptionProps } from "./models";

export const contentFromType = (selectedOption: selectedOptionProps) => {
  if (selectedOption.type === "table") return <Table />;
  else if (selectedOption.type === "title")
    return (
      <div className="w-full flex flex-col">
        <ExtraLargeFont extraCss="mb-2.5">
          {selectedOption.title}
        </ExtraLargeFont>
        <MediumFont extraCss="mb-2.5 text-light-font-80 dark:text-dark-font-80">
          {selectedOption.description}
        </MediumFont>
      </div>
    );
  else return <ChartAnalytic chartOptions={selectedOption} />;
};
