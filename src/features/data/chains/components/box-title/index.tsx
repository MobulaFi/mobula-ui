import React from "react";
import { MediumFont } from "../../../../../components/fonts";
import { TagPercentage } from "../../../../../components/tag-percentage";
import {
  getFormattedAmount,
  getTokenPercentage,
} from "../../../../../utils/formaters";

interface BoxTitleProps {
  data: {
    title: string;
    value: number | null;
    dollar?: boolean;
    percentage: number;
  };
}

export const BoxTitle = ({ data }: BoxTitleProps) => {
  return (
    <div className="flex flex-col">
      <MediumFont extraCss="ml-2.5 whitespace-nowrap">{data.title}</MediumFont>
      <div className="flex items-center mt-1">
        <MediumFont extraCss="ml-2.5 whitespace-nowrap">
          {data.dollar ? "$" : ""}
          {data?.value
            ? getFormattedAmount(data.value, 0, { canUseHTML: true })
            : ""}
        </MediumFont>
        {data?.percentage ? (
          <TagPercentage
            percentage={getTokenPercentage(data.percentage)}
            isUp={
              (getTokenPercentage(
                Number(data.percentage) || 0
              ) as unknown as number) > 0
            }
            inhert={data.percentage === 0}
          />
        ) : null}
      </div>
    </div>
  );
};
