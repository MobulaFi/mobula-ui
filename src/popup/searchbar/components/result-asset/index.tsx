import { useRouter } from "next/navigation";
import React, { useContext } from "react";
import { BiArrowToRight } from "react-icons/bi";
import { pushData } from "../../../../lib/mixpanel";
import {
  getFormattedAmount,
  getUrlFromName,
} from "../../../../utils/formaters";
import { SearchbarContext } from "../../context-manager";
import { Lines } from "../ui/lines";
import { Percentage } from "../ui/percentage";
import { Title } from "../ui/title";

interface AssetsResultsProps {
  firstIndex: number;
  setTrigger: React.Dispatch<React.SetStateAction<boolean>>;
  callback?: (value: { content: string; type: string; label: string }) => void;
}

export const AssetsResults = ({
  firstIndex,
  setTrigger,
  callback,
}: AssetsResultsProps) => {
  const { results, active, setActive } = useContext(SearchbarContext);
  const router = useRouter();

  const clickEvent = (result) => {
    if (callback)
      callback({
        content: result.name,
        type: "asset",
        label: result.name,
      });
    else {
      setTrigger(false);
      pushData("Searchbar", { type: "asset", name: result.name });
      router.push(`/asset/${getUrlFromName(result.name)}`);
      const item = localStorage.getItem("token-history");
      if (item) {
        if (
          !JSON.parse(item)
            .map((newItem) => newItem.name)
            .includes(result.name)
        ) {
          if (JSON.parse(item).length > 5) {
            const entry = [...JSON.parse(item), result];
            entry.shift();
            localStorage.setItem("token-history", JSON.stringify(entry));
          } else {
            const entry = [...JSON.parse(item), result];
            localStorage.setItem("token-history", JSON.stringify(entry));
          }
        }
      } else {
        localStorage.setItem("token-history", JSON.stringify([result]));
      }
    }
  };

  return (
    <>
      {results.length > 0 && (
        <Title extraCss="mt-[5px]">Assets ({results.length})</Title>
      )}
      {results.map((result, index) => (
        <Lines
          isImage
          token={result}
          key={result.id}
          onClick={() => clickEvent(result)}
          active={active === index + firstIndex}
          index={index + firstIndex}
          setActive={setActive}
        >
          {result?.isTemplate ? (
            <BiArrowToRight className="text-md text-light-font-60 dark:text-dark-font-60" />
          ) : (
            <Percentage
              isPercentage
              value={getFormattedAmount(result?.price)}
            />
          )}
        </Lines>
      ))}
    </>
  );
};
