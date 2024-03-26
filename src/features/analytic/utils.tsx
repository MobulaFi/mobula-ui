import React from "react";
import { ExtraLargeFont, LargeFont, MediumFont } from "../../components/fonts";
import ChartAnalytic from "./components/chart";
import { Table } from "./components/table";
import { selectedQueryProps } from "./models";

export const contentFromType = (selectedQuery: selectedQueryProps) => {
  if (selectedQuery.type === "table") return <Table />;
  else if (selectedQuery.type === "value")
    return (
      <div className="w-full h-[80%] flex flex-col justify-center items-center">
        <ExtraLargeFont extraCss="mb-2.5 text-5xl">
          {selectedQuery.infos.amount}
        </ExtraLargeFont>
        <LargeFont extraCss="mb-2.5">{selectedQuery.infos.text}</LargeFont>
      </div>
    );
  else if (selectedQuery.type === "title")
    return (
      <div className="w-full flex flex-col">
        <ExtraLargeFont extraCss="mb-2.5">
          {selectedQuery.infos.title}
        </ExtraLargeFont>
        <MediumFont extraCss="mb-2.5 text-light-font-80 dark:text-dark-font-80">
          {selectedQuery.infos.description}
        </MediumFont>
      </div>
    );
  else return <ChartAnalytic chartOptions={selectedQuery} />;
};
