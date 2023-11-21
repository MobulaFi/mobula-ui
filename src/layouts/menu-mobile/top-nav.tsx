import { useRouter } from "next/navigation";
import { Dispatch, Key, SetStateAction } from "react";

interface NavProps {
  list: string[] | { name: string; url: string }[];
  active: string;
  setActive?: Dispatch<SetStateAction<string>>;
  setPreviousTab?: Dispatch<SetStateAction<string>>;
  isGeneral?: boolean;
  isPortfolio?: boolean;
}

export const TopNav = ({
  list,
  setActive,
  active,
  setPreviousTab,
  isGeneral = false,
  isPortfolio = false,
}: NavProps) => {
  const router = useRouter();

  const getWidth = () => {
    const widthPerButton = 100 / (list?.length || 0);
    const left = widthPerButton * list.indexOf(active as any);
    return left;
  };
  const width = getWidth();

  return (
    <div
      className={`hidden ${
        isPortfolio ? "lg:flex" : ""
      } md:flex w-full overflow-x-scroll scroll relative flex flex-col border-b border-light-border-primary dark:border-dark-border-primary`}
    >
      <div className="flex items-center w-full">
        {list.map((item, index) => (
          <button
            className={`font-medium pb-2.5 text-xs h-full p-2.5 ${
              isGeneral && active === item?.name
                ? "border-2 border-[#5c6ac4] dark:border-[#5c6ac4]"
                : ""
            } ${
              active === item || (isGeneral && active === item?.name)
                ? "text-light-font-100 dark:text-dark-font-100"
                : "text-light-font-40 dark:text-dark-font-40"
            } transition-all duration-250`}
            style={{
              width: `${100 / (list?.length || 0)}%`,
            }}
            key={item as Key}
            onClick={() => {
              if (isGeneral) router.push(item.url);
              else {
                if (setPreviousTab) setPreviousTab(active);
                if (setActive) setActive(item);
              }
            }}
          >
            {isGeneral ? item.name : item}
          </button>
        ))}
      </div>
      {!isGeneral ? (
        <div
          className={`flex h-[2px] mt-[5px] px-2.5 bottom-0 transition-all duration-200 absolute bg-blue dark:bg-blue 
        ${100 / (list?.length || 0)}%`}
          style={{
            width: `${100 / (list?.length || 0)}%`,
            left: `${width}%`,
          }}
        />
      ) : null}
    </div>
  );
};
