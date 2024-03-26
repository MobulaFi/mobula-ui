import { BsPieChart } from "react-icons/bs";
import { GrBarChart, GrLineChart, GrTable } from "react-icons/gr";
import { MdCenterFocusWeak, MdOutlineAreaChart } from "react-icons/md";

type QueryType = "value" | "table" | "bar" | "line" | "pie" | "large-area";

export const getIconFromQueryType = (queryType: QueryType) => {
  const color = "text-light-font-100 dark:text-dark-font-100";
  switch (queryType) {
    case "value":
      return <MdCenterFocusWeak className={color} />;
    case "table":
      return <GrTable className={color} />;
    case "bar":
      return <GrBarChart className={color} />;
    case "line":
      return <GrLineChart className={color} />;
    case "pie":
      return <BsPieChart className={color} />;
    case "large-area":
      return <MdOutlineAreaChart className={color} />;
    default:
      return <GrBarChart className={color} />;
  }
};

type Type = "user" | "search" | "all";

export const renderEmptyStateFromState = (type: Type) => {
  switch (type) {
    case "user":
      return "You don't have any queries yet";
    case "search":
      return "No queries found with this search term";
    case "all":
      return "No queries found";
    default:
      return "No queries found";
  }
};
