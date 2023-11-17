import { PiTriangleFill } from "react-icons/pi";
import { PercentageType } from "../../../models";

export const Percentage = ({ value, isPercentage }: PercentageType) => {
  const negative = Number(value) < 0;

  const renderIcon = () => {
    if (isPercentage)
      return negative ? (
        <PiTriangleFill className="rotate-180 mr-[5px] text-red text-[10px]" />
      ) : (
        <PiTriangleFill className="mr-[5px] text-green text-[10px]" />
      );
    return (
      <img
        src="/mobula/mobula-logo.svg"
        alt="mobula logo"
        className="w-[18px] h-[18px] mr-[5px]"
      />
    );
  };

  const icon = renderIcon();

  return (
    <div className="flex items-center">
      {icon}
      <p className="font-medium text-light-font-100 dark:text-dark-font-100">
        {isPercentage ? `$${value}` : value}
      </p>
    </div>
  );
};
