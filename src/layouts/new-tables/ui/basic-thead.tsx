import { useContext } from "react";
import { FaArrowUp } from "react-icons/fa";
import { useTop100 } from "../../../features/data/top100/context-manager";
import { cn } from "../../../lib/shadcn/lib/utils";
import { titleToDBKey } from "../constants";
import { TableContext } from "../context-manager";

interface TableHeaderEntryProps {
  title: string | JSX.Element;
  smaller?: string | null;
  canOrder?: boolean;
  extraCss?: string;
  titleCssPosition?: string;
  callback?: () => void;
}

export const BasicThead = ({
  title,
  smaller = null,
  canOrder = false,
  extraCss,
  titleCssPosition = "justify-end",
  callback,
}: TableHeaderEntryProps) => {
  const { orderBy, setOrderBy } = useContext(TableContext);
  const isMobile = typeof window !== "undefined" && window.innerWidth < 768;
  const { setIsLoading, isLoading } = useTop100();

  const shouldUseOrderBy = () => {
    switch (title) {
      case "Name":
        return false;
      case "Chart":
        return false;
      case "Swap":
        return false;
      case "24h Chart":
        return false;
      default:
        return true;
    }
  };

  return (
    <th
      className={cn(
        `border-t border-y border-light-border-primary dark:border-dark-border-primary tracking-normal 
        whitespace-nowrap font-medium text-sm md:text-xs text-light-font-100 dark:text-dark-font-100 
        py-[17.5px] md:py-[10px] px-5 w-fit h-[30px] sticky ${
          shouldUseOrderBy() ? "cursor-pointer" : "cursor-default"
        } top-0 left-0 z-[101] text-end`,
        extraCss
      )}
      onClick={() => {
        if (callback) callback();
        if (shouldUseOrderBy() === false) return;
        setIsLoading(true);
        if (typeof title === "string")
          if (titleToDBKey?.[title] === orderBy?.type) {
            setOrderBy({
              type: titleToDBKey?.[title],
              ascending: !orderBy.ascending,
            });
          } else if (titleToDBKey?.[title] === "rank")
            setOrderBy({
              type: titleToDBKey?.[title],
              ascending: orderBy ? !orderBy.ascending : false,
            });
          else
            setOrderBy({
              type: titleToDBKey?.[title],
              ascending: orderBy ? orderBy.ascending : false,
            });
      }}
    >
      {!isLoading ? (
        <div className={cn("flex items-center font-normal", titleCssPosition)}>
          {smaller && isMobile ? smaller : title}
          {canOrder &&
            (typeof title === "string" &&
            titleToDBKey[title] === orderBy?.type ? (
              <FaArrowUp
                className={`text-light-font-100 dark:text-dark-font-100 ml-[5px] text-xs transition-all duration-200 ease-in-out ${
                  !orderBy?.ascending ? "rotate-180" : "rotate-0"
                }`}
              />
            ) : null)}{" "}
        </div>
      ) : null}
    </th>
  );
};
