import { ArrowUpIcon } from "@chakra-ui/icons";
import { TableColumnHeaderProps, Th } from "@chakra-ui/react";
import { useContext } from "react";
import { useTop100 } from "../../../features/data/Home/context-manager";
import { useColors } from "../../../lib/chakra/colorMode";
import { titleToDBKey } from "../constants";
import { TableContext } from "../context-manager";

export const TableHeaderEntry = ({
  title,
  smaller = null,
  canOrder = false,
  ...props
}: {
  title: string;
  smaller?: string | null;
  canOrder?: boolean;
  [key: string]: any;
} & TableColumnHeaderProps) => {
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
    <Th
      borderBottom={borders}
      letterSpacing="auto"
      whiteSpace="nowrap"
      fontWeight="500"
      fontSize={["12px", "12px", "14px", "14px"]}
      fontFamily="Inter"
      color={text80}
      textTransform="capitalize"
      padding={["12px 12px", "12px 12px", "17.5px 20px"]}
      w="auto"
      h="30px"
      position="sticky"
      cursor={shouldUseOrderBy() ? "pointer" : "default"}
      top="0px"
      left="0px"
      zIndex="101"
      textAlign="end"
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
    </Th>
  );
};
