import { useRouter } from "next/navigation";
import React, { useContext } from "react";
import { FiExternalLink } from "react-icons/fi";
import { pushData } from "../../../../lib/mixpanel";
import { ArticlesType } from "../../../../popup/searchbar/models";
import { SearchbarContext } from "../../context-manager";
import { Lines } from "../ui/lines";
import { Title } from "../ui/title";

interface ForumResultsProps {
  firstIndex: number;
  setTrigger: React.Dispatch<React.SetStateAction<boolean>>;
}

export const ForumResults = ({ firstIndex, setTrigger }: ForumResultsProps) => {
  const { results, articles, active, setActive } = useContext(SearchbarContext);
  const router = useRouter();

  const clickEvent = (article: ArticlesType) => {
    setTrigger(false);
    pushData("Searchbar", {
      type: "article",
      name: article.title,
    });
    router.push(article.url);
  };
  return (
    <div className={`${results.length > 0 ? "mt-[10px]" : "mt-0"}`}>
      {articles.length > 0 && (
        <Title extraCss="mt-[5px]">Articles ({articles.length})</Title>
      )}
      {articles.map((article: ArticlesType, index: number) => {
        const propsArticle = {
          name: article.title,
          url: `/forum/${article.type}/${article.url}`,
        };
        return (
          <Lines
            key={article.url}
            onClick={() => clickEvent(article)}
            token={propsArticle}
            active={active === index + firstIndex}
            index={index + firstIndex}
            setActive={setActive}
          >
            <FiExternalLink className="text-light-font-60 dark:text-dark-font-60 text-sm" />
          </Lines>
        );
      })}
    </div>
  );
};
