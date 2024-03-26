import { Input } from "components/input";
import { useContext, useEffect, useState } from "react";
import { Button } from "../../../../../components/button";
import { LargeFont, SmallFont } from "../../../../../components/fonts";
import { UserContext } from "../../../../../contexts/user";
import { fetchAllQueries, fetchUserQueries } from "../../api";
import { dataExplorerButtonsIcons } from "../../constants";
import { getIconFromQueryType, renderEmptyStateFromState } from "../../utils";

enum Section {
  USER_QUERY,
  GLOBAL_QUERY,
}

export const DataExplorer = () => {
  const [activeSection, setActiveSection] = useState(Section.USER_QUERY);
  const [queries, setQueries] = useState([]);
  const [search, setSearch] = useState("");
  const { user } = useContext(UserContext);

  const handleSectionChange = (section: Section) => {
    setActiveSection(section);
  };

  const fetchQueriesDependingOnActiveSection = () => {
    if (!user) return;
    switch (activeSection) {
      case Section.USER_QUERY:
        fetchUserQueries(user.id).then((data) => {
          if (data) setQueries(data);
        });
        break;
      case Section.GLOBAL_QUERY:
        fetchAllQueries(search).then((data) => {
          if (data) setQueries(data);
        });
        break;
      default:
        fetchUserQueries(user.id).then((data) => {
          if (data) setQueries(data);
        });
        break;
    }
  };

  useEffect(() => {
    fetchQueriesDependingOnActiveSection();
  }, [user, search, activeSection]);

  const searchIsEmpty = search !== "" && !queries?.length;
  const userQueriesIsEmpty =
    activeSection === Section.USER_QUERY && !queries?.length;
  const globalQueriesIsEmpty =
    activeSection === Section.GLOBAL_QUERY && !queries?.length;

  const handleEmptyState = () => {
    if (!searchIsEmpty && !userQueriesIsEmpty && !globalQueriesIsEmpty)
      return false;
    if (searchIsEmpty) {
      return renderEmptyStateFromState("search");
    } else if (userQueriesIsEmpty) {
      return renderEmptyStateFromState("user");
    } else if (globalQueriesIsEmpty) {
      return renderEmptyStateFromState("all");
    }
  };
  const renderEmptyState = handleEmptyState();

  return (
    <div
      className="max-w-[360px] min-w-[360px] mr-5 rounded-lg bg-light-bg-secondary dark:bg-dark-bg-secondary border
       border-light-border-primary dark:border-dark-border-primary p-5 flex flex-col min-h-[500px] overflow-y-scroll"
    >
      <LargeFont extraCss="mb-5">Data Explorer</LargeFont>
      <div className="flex justify-between w-full mb-2.5">
        {dataExplorerButtonsIcons.map((item, i) => {
          const isActive = i === activeSection;
          return (
            <Button
              extraCss={`w-[49%] text-lg h-[40px] ${
                isActive ? "border-darkblue dark:border-darkblue" : ""
              }`}
              onClick={() => handleSectionChange(i)}
            >
              <span
                className={`${
                  isActive ? "" : "opacity-60"
                } flex items-center justify-center w-full`}
              >
                {item.icon}
                <SmallFont extraCss="ml-2">{item.label}</SmallFont>
              </span>
            </Button>
          );
        })}
      </div>
      {activeSection === Section.GLOBAL_QUERY && (
        <Input
          placeholder="Search any queries"
          extraCss="mb-2.5"
          onChange={(e) => setSearch(e.target.value)}
        />
      )}
      {renderEmptyState ? (
        <SmallFont>{renderEmptyState}</SmallFont>
      ) : (
        queries?.map((query) => {
          const icon = getIconFromQueryType(query.visualization.type);
          return (
            <div className="w-full py-2 border-b border-light-border-primary dark:border-dark-border-primary flex items-center">
              <div
                className="flex items-center justify-center p-2 rounded bg-light-bg-terciary
             dark:bg-dark-bg-terciary border border-light-border-primary dark:border-dark-border-primary w-fit
              text-light-font-100 dark:text-dark-font-100"
              >
                {icon}
              </div>
              <div className="flex flex-col justify-start ml-1">
                <SmallFont extraCss="ml-2.5">{query.title}</SmallFont>
                <SmallFont extraCss="ml-2.5">
                  {query.visualization.description}
                </SmallFont>
              </div>
            </div>
          );
        })
      )}
    </div>
  );
};
