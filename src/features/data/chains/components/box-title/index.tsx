import { MediumFont } from "../../../../../components/fonts";
import { TagPercentage } from "../../../../../components/tag-percentage";
import { getTokenPercentage } from "../../../../../utils/formaters";

interface BoxTitleProps {
  title: string;
  price: number;
}

export const BoxTitle = ({ title, price }: BoxTitleProps) => {
  return (
    <div className="flex flex-col">
      <MediumFont extraCss="ml-2.5 whitespace-nowrap">{title}</MediumFont>
      <div className="flex items-center mt-1">
        <MediumFont extraCss="ml-2.5 whitespace-nowrap">${price}</MediumFont>
        <TagPercentage
          percentage={getTokenPercentage(price)}
          isUp={getTokenPercentage(price) > 0}
          inhert={price === 0}
        />
      </div>
    </div>
  );
};
