import { useRouter } from "next/navigation";
import React, { useContext } from "react";
import { AiOutlineSearch } from "react-icons/ai";
import { BiArrowToRight } from "react-icons/bi";
import { useAccount } from "wagmi";
import { PopupUpdateContext } from "../../../../contexts/popup";
import { pushData } from "../../../../lib/mixpanel";
import { SearchbarContext } from "../../context-manager";
import { Page } from "../../models";
import { Lines } from "../ui/lines";
import { Title } from "../ui/title";

interface PageResultsProps {
  firstIndex: number;
  setTrigger: React.Dispatch<React.SetStateAction<boolean>>;
}

export const PageResults = ({ firstIndex, setTrigger }: PageResultsProps) => {
  const { results, active, setActive, pages } = useContext(SearchbarContext);
  const router = useRouter();
  const { isConnected } = useAccount();
  const { setConnect } = useContext(PopupUpdateContext);
  const clickEvent = (page: Page) => {
    setTrigger(false);
    pushData("Searchbar", { type: "page", name: page.name });
    if (page.name === "Portfolio Page") {
      if (isConnected) router.push(page.url);
      else setConnect(true);
    } else router.push(page.url);
  };
  return (
    <div className={`${pages.length > 0 ? "mt-2.5" : "mt-0 hidden"}`}>
      {pages.length > 0 && (
        <Title extraCss="mt-[5px]">Pages ({pages.length})</Title>
      )}
      {pages.map((page: Page, index: number) => (
        <Lines
          key={page?.name}
          token={page}
          active={active === index + firstIndex}
          index={index + firstIndex}
          setActive={setActive}
          extraCss="text-light-font-100 dark:text-dark-font-100"
          onClick={() => clickEvent(page)}
          icon={
            <AiOutlineSearch className="text-lg mr-2.5 text-light-font-100 dark:text-dark-font-100" />
          }
        >
          <BiArrowToRight className="text-light-font-60 dark:text-dark-font-60 text-sm" />
        </Lines>
      ))}
    </div>
  );
};
