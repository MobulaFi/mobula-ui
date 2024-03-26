import {
  ExtraLargeFont,
  LargeFont,
  MediumFont,
  SmallFont,
} from "../../../../../components/fonts";
import { getFormattedAmount } from "../../../../../utils/formaters";
import ChartAnalytic from "../../../components/chart";
import { Table } from "../../../components/table";
import { selectedQueryProps } from "../../../models";

export const contentFromType = (selectedQuery: selectedQueryProps) => {
  if (selectedQuery.type === "table") return <Table />;
  else if (selectedQuery.type === "value")
    return (
      <div className="w-full h-[250px] flex flex-col justify-center items-center">
        <div className="flex items-center mb-2.5 ">
          <ExtraLargeFont extraCss="text-4xl font-medium">
            {getFormattedAmount(Number(selectedQuery.infos.amount))}
          </ExtraLargeFont>
          <ExtraLargeFont extraCss="text-4xl font-medium">
            {selectedQuery.infos.symbol}
          </ExtraLargeFont>
        </div>
        <LargeFont extraCss="mb-2.5">{selectedQuery.infos.text}</LargeFont>
      </div>
    );
  else return <ChartAnalytic chartOptions={selectedQuery} />;
};

export const PreviewOptions = ({
  selectedQuery,
  isPreview = true,
}: {
  selectedQuery: selectedQueryProps;
  isPreview?: boolean;
}) => {
  const render = contentFromType(selectedQuery);

  return (
    <div className={`${isPreview ? "w-2/4" : "w-full"}`}>
      <MediumFont extraCss="mb-0.5 font-medium">
        {selectedQuery.infos.title}
      </MediumFont>
      {selectedQuery.infos.subtitle ? (
        <SmallFont extraCss="mb-2.5 text-light-font-80 dark:text-dark-font-80">
          {selectedQuery.infos.subtitle}
        </SmallFont>
      ) : null}
      {render}
    </div>
  );
};
