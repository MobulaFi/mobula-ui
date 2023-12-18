import { useRouter } from "next/navigation";
import { Dispatch, Key, SetStateAction, useContext } from "react";
import { BaseAssetContext } from "../../features/asset/context-manager";

interface NavProps {
  list: (string | { name: string; url: string })[];
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
  const { baseAsset } = useContext(BaseAssetContext);

  const getWidth = () => {
    const widthPerButton = 100 / (list?.length || 0);
    const left = widthPerButton * list.indexOf(active);
    return left;
  };
  const width = getWidth();

  const getColorFromItem = (item) => {
    if (active === item || (isGeneral && active === item?.name))
      return "text-light-font-100 dark:text-dark-font-100";
    if (
      (item === "Fundraising" && !baseAsset?.sales?.length) ||
      (item === "Vesting" && !baseAsset?.release_schedule?.length)
    )
      return "text-light-font-20 dark:text-dark-font-20";
    return "text-light-font-60 dark:text-dark-font-60";
  };

  return (
    <div
      className={`hidden ${
        isPortfolio ? "lg:flex" : ""
      } md:flex w-full overflow-x-scroll scroll relative flex flex-col border-b border-light-border-primary dark:border-dark-border-primary`}
    >
      <div className="flex items-center w-full">
        {list.map((item) => {
          const color = getColorFromItem(item);
          return (
            <button
              className={`font-medium pb-2.5 text-xs h-full p-2.5 ${color} ${
                active === item ||
                (typeof item === "object" && active === item?.name)
                  ? "text-light-font-100 dark:text-dark-font-100"
                  : "text-light-font-40 dark:text-dark-font-40"
              } transition-all duration-200`}
              style={{
                width: `${100 / (list?.length || 0)}%`,
              }}
              key={item as Key}
              disabled={
                (item === "Fundraising" && !baseAsset?.sales?.length) ||
                (item === "Vesting" && !baseAsset?.release_schedule?.length)
              }
              onClick={() => {
                if (typeof item === "object" && item !== null) {
                  if (isGeneral) router.push(item.url);
                } else if (typeof item === "string") {
                  if (setPreviousTab) setPreviousTab(active);
                  if (setActive) setActive(item);
                }
              }}
            >
              {typeof item === "object" ? item.name : item}
            </button>
          );
        })}
      </div>
      {!isGeneral ? (
        <div
          className="flex h-[2px] mt-[5px] px-2.5 bottom-0 transition-all duration-200 absolute bg-blue dark:bg-blue"
          style={{
            width: `${100 / (list?.length || 0)}%`,
            left: `${width}%`,
          }}
        />
      ) : null}
    </div>
  );
};
