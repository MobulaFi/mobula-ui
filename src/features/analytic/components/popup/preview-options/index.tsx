import React from "react";
import {
  ExtraLargeFont,
  LargeFont,
  MediumFont,
  SmallFont,
} from "../../../../../components/fonts";
import { getFormattedAmount } from "../../../../../utils/formaters";
import ChartAnalytic from "../../../components/chart";
import { Table } from "../../../components/table";
import { selectedOptionProps } from "../../../models";

export const contentFromType = (selectedOption: selectedOptionProps) => {
  if (selectedOption.type === "table") return <Table />;
  else if (selectedOption.type === "value")
    return (
      <div className="w-full h-[250px] flex flex-col justify-center items-center">
        <div className="flex items-center mb-2.5 ">
          <ExtraLargeFont extraCss="text-4xl font-medium">
            {getFormattedAmount(Number(selectedOption.infos.amount))}
          </ExtraLargeFont>
          <ExtraLargeFont extraCss="text-4xl font-medium">
            {selectedOption.infos.symbol}
          </ExtraLargeFont>
        </div>
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

export const PreviewOptions = ({
  selectedOption,
  isPreview = true,
}: {
  selectedOption: selectedOptionProps;
  isPreview?: boolean;
}) => {
  const render = contentFromType(selectedOption);

  return (
    <div className={`${isPreview ? "w-2/4" : "w-full"}`}>
      {selectedOption.type !== "title" && (
        <>
          <MediumFont extraCss="mb-0.5 font-medium">
            {selectedOption.infos.title}
          </MediumFont>
          {selectedOption.infos.subtitle ? (
            <SmallFont extraCss="mb-2.5 text-light-font-80 dark:text-dark-font-80">
              {selectedOption.infos.subtitle}
            </SmallFont>
          ) : null}
        </>
      )}
      {render}
    </div>
  );
};
