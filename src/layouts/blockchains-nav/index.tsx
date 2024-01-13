import { generateFilters } from "@utils/filters";
import { Dispatch, SetStateAction } from "react";
import { Button } from "../../components/button";
import { SmallFont } from "../../components/fonts";
import { useTop100 } from "../../features/data/top100/context-manager";
import { Query } from "../../interfaces/pages/top100";
import { blockchainsAvailable } from "./constant";

interface BlochainNavProps {
  isMovers?: boolean;
  page?: string;
  blockchain: string;
  setBlockchain: Dispatch<SetStateAction<string>>;
  setFilters?: Dispatch<SetStateAction<Query[]>>;
  setIsFirstRequest?: Dispatch<SetStateAction<boolean>>;
}

export const BlockchainsNav = ({
  blockchain,
  setBlockchain,
  page,
  isMovers,
  setFilters,
  setIsFirstRequest,
}: BlochainNavProps) => {
  const { setIsLoading } = useTop100();
  return (
    <div
      className={`flex ${
        page === "recently" || isMovers ? "w-full" : "w-2/4"
      } lg:w-full mx-auto mb-2.5`}
    >
      <div className="flex justify-start overflow-x-scroll scroll">
        {blockchainsAvailable.map((entry, i) => (
          <Button
            key={entry.title}
            extraCss={`justify-center max-w-[155px] w-[13%] whitespace-nowrap rounded-md p-2.5 min-w-fit mx-[5px] md:mx-[2.5px] ${
              i === 0 ? "" : "ml-[5px]"
            } ${
              blockchain === entry.title
                ? "text-light-font-100 dark:text-dark-font-100 border-blue dark:border-blue"
                : "text-light-font-40 dark:text-dark-font-40 border-0 bg-inherit dark:bg-inherit"
            } hover:bg-inherit hover:dark:bg-inherit hover:text-light-font-100 hover:dark:text-dark-font-100 
            transition-all duration-200 font-normal`}
            onClick={() => {
              if (setIsFirstRequest) setIsFirstRequest(false);
              if (setIsLoading) setIsLoading(true);
              setBlockchain(entry.title);
              if (page === "recently" && setFilters)
                setFilters(generateFilters(entry.title, true));
              if (page !== "recently" && setFilters)
                setFilters(generateFilters(entry.title));
            }}
          >
            {entry.logo ? (
              <>
                <img
                  className="w-5 h-5 rounded-full"
                  src={entry.logo}
                  alt={`${entry.title} logo`}
                />
                <span className="ml-2.5">{entry.symbol}</span>
              </>
            ) : (
              <>
                <SmallFont extraCss="flex md:hidden">{entry.name}</SmallFont>
                <SmallFont extraCss="hidden md:flex">All</SmallFont>
              </>
            )}
          </Button>
        ))}
      </div>
    </div>
  );
};
