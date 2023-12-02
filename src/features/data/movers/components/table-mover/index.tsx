import { useRouter } from "next/navigation";
import { TbTriangleFilled, TbTriangleInvertedFilled } from "react-icons/tb";
import { NextImageFallback } from "../../../../../components/image";
import {
  formatAmount,
  getFormattedAmount,
  getTokenPercentage,
  getUrlFromName,
} from "../../../../../utils/formaters";
import { MoversType } from "../../models";

interface MoversTableProps {
  assets: MoversType[];
}

export const MoversTable = ({ assets }: MoversTableProps) => {
  const router = useRouter();
  const thStyle =
    "border-b border-light-border-primary dark:border-dark-border-primary text-sm md:text-xs text-light-font-100 dark:text-dark-font-100 px-[5px] py-2.5";
  const tdStyle =
    "border-b border-light-border-primary dark:border-dark-border-primary text-sm md:text-xs text-light-font-100 dark:text-dark-font-100 p-[5px]";

  return (
    <table className="lg:mt-2.5 w-full">
      <thead className="border-t border-light-border-primary dark:border-dark-border-primary text-sm md:text-[12px]">
        <tr className="text-light-font-100 dark:text-dark-font-100">
          <th
            className={`${thStyle} max-w-[150px] sticky left-0 bg-none font-normal text-start`}
          >
            Name
          </th>
          <th className={`${thStyle} text-end font-normal`}>Price</th>
          <th className={`${thStyle} text-end font-normal`}>Volume (24h)</th>
          <th className={`${thStyle} text-end font-normal`}>24h</th>
        </tr>
      </thead>
      {assets.map((asset: MoversType) => {
        const isGainer = asset.price_change_24h > 0;
        return (
          <tbody
            className="hover:bg-light-bg-terciary dark:hover:bg-dark-bg-terciary cursor-pointer"
            onClick={() => router.push(`/asset/${getUrlFromName(asset.name)}`)}
          >
            <tr className="relative">
              <td
                className={`${tdStyle} max-w-[150px] sticky left-0 bg-none md:bg-light-bg-primary dark:md:bg-dark-bg-primary`}
              >
                <div className="flex items-center w-full">
                  <NextImageFallback
                    style={{
                      marginRight: "10px",
                      borderRadius: "50%",
                      maxWidth: "30px",
                      objectFit: "cover",
                    }}
                    width={30}
                    height={30}
                    src={asset.logo}
                    fallbackSrc="/empty/unknown.png"
                    alt={`${asset.name} logo`}
                  />
                  <div className="flex flex-col flex-wrap">
                    <div className="flex">
                      <p className="text-sm mr-2">{asset.rank}</p>
                      <p className="text-sm ">{asset.symbol}</p>
                    </div>
                    <p className="text-xs min-w-[120px] whitespace-nowrap mr-2.5 truncate text-light-font-60 dark:text-dark-font-60">
                      {asset.name}
                    </p>
                  </div>
                </div>
              </td>
              <td className={`${tdStyle} text-end`}>
                {getFormattedAmount(asset.price)}
              </td>
              <td className={`${tdStyle} text-end`}>
                ${formatAmount(asset.global_volume)}
              </td>
              <td className={`${tdStyle} text-end }`}>
                <div
                  className={`${
                    isGainer
                      ? "text-green dark:text-green"
                      : "text-red dark:text-red"
                  } flex items-center justify-end`}
                >
                  {isGainer ? (
                    <TbTriangleFilled className="text-[10px] mr-1 " />
                  ) : (
                    <TbTriangleInvertedFilled className="text-[10px] mr-1" />
                  )}
                  {getTokenPercentage(asset.price_change_24h)}%{" "}
                </div>
              </td>
            </tr>
          </tbody>
        );
      })}
    </table>
  );
};
