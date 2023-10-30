import { ArrowUpIcon } from "@chakra-ui/icons";
import { TableColumnHeaderProps } from "@chakra-ui/react";
import { useContext } from "react";
import { useTop100 } from "../../../features/data/top100/context-manager";
import { useColors } from "../../../lib/chakra/colorMode";
import { titleToDBKey } from "../constants";
import { TableContext } from "../context-manager";

interface TableHeaderEntryProps extends TableColumnHeaderProps {
  title: string;
  smaller?: string | null;
  canOrder?: boolean;
  extraCss?: string;
}

export const TableHeaderEntry = ({
  title,
  smaller = null,
  canOrder = false,
  extraCss,
  ...props
}: TableHeaderEntryProps) => {
  const { borders, text80 } = useColors();
  const { orderBy, setOrderBy } = useContext(TableContext);
  const isMobile = typeof window !== "undefined" && window.innerWidth < 768;
  const { setIsLoading, isLoading } = useTop100();

  // const [pos, setPos] = useState(0);
  // var oldScrollY;
  // useEffect(() => {
  //   if (typeof window !== undefined) setPos(window.screenTop);
  // });

  const shouldUseOrderBy = () => {
    switch (title) {
      case "Name":
        return false;
      case "Chart":
        return false;
      case "Interact":
        return false;
      case "24h Chart":
        return false;
      default:
        return true;
    }
  };

  return (
    <th
      className={`border border-light-border-primary dark:border-dark-border-primary tracking-normal whitespace-nowrap font-medium text-sm md:text-xs text-light-font-100 dark:text-dark-font-100 py-[17.5px] px-5 w-fit h-[30px] sticky ${
        shouldUseOrderBy() ? "pointer" : "default"
      } top-0 left-0 z-[101] text-end ${extraCss}`}
      onClick={() => {
        if (shouldUseOrderBy() === false) return;
        setIsLoading(true);
        if (titleToDBKey[title] === orderBy?.type) {
          setOrderBy({
            type: titleToDBKey[title],
            ascending: !orderBy.ascending,
          });
        } else if (titleToDBKey[title] === "rank")
          setOrderBy({
            type: titleToDBKey[title],
            ascending: orderBy ? !orderBy.ascending : false,
          });
        else
          setOrderBy({
            type: titleToDBKey[title],
            ascending: orderBy ? orderBy.ascending : false,
          });
      }}
      {...props}
    >
      {!isLoading ? (
        <>
          {smaller && isMobile ? smaller : title}
          {canOrder &&
            (titleToDBKey[title] === orderBy?.type ? (
              <ArrowUpIcon
                color={text80}
                ml="5px"
                transform={
                  !orderBy?.ascending ? "rotate(180deg)" : "rotate(0deg)"
                }
                transition="all 250ms ease-in-out"
              />
            ) : null)}{" "}
        </>
      ) : null}
    </th>
  );
};
