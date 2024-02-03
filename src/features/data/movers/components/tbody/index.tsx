import { useRouter } from "next/navigation";
import { TagPercentage } from "../../../../../components/tag-percentage";
import {
  formatAmount,
  getFormattedAmount,
  getTokenPercentage,
  getUrlFromName,
} from "../../../../../utils/formaters";
import { useLiteStreamMarketDataMovers } from "../../../../../utils/stream-movers";

export const TbodyMovers = ({ asset }) => {
  const router = useRouter();
  const tdStyle =
    "border-b border-light-border-secondary dark:border-dark-border-secondary text-sm md:text-xs text-light-font-100 dark:text-dark-font-100 p-[5px] py-2";
  const marketMetrics = useLiteStreamMarketDataMovers(asset);

  const getColorFromMarketChange = (marketChange: boolean | undefined) => {
    if (marketChange === true) return "text-green dark:text-green";
    if (marketChange === false) return "text-red dark:text-red";
    return "text-light-font-100 dark:text-dark-font-100";
  };

  const priceChange = getColorFromMarketChange(marketMetrics.priceChange);
  const volumeChange = getColorFromMarketChange(marketMetrics.volumeChange);

  return (
    <tbody
      key={asset?.id}
      className="hover:bg-light-bg-terciary dark:hover:bg-dark-bg-terciary cursor-pointer"
      onClick={() => router.push(`/asset/${getUrlFromName(asset.name)}`)}
    >
      <tr className="relative">
        <td
          className={`${tdStyle} max-w-[150px] sticky left-0 bg-none md:bg-light-bg-primary dark:md:bg-dark-bg-primary overflow-x-hidden`}
        >
          <div className="flex items-center w-full">
            <img
              className="mr-2.5 rounded-full max-w-[30px] w-[30px] h-[30px] min-w-[30px] object-cover"
              src={asset.logo || "/empty/unknown.png"}
              alt={`${asset.name} logo`}
            />
            <div className="flex flex-col flex-wrap">
              <div className="flex">
                <div className="mb-0.5 flex items-center justify-center rounded-md bg-light-bg-hover dark:bg-dark-bg-hover mr-2 py-0.5 px-1">
                  <p className="text-xs m-0">{asset.rank}</p>
                </div>
                <p className="text-sm ">{asset.symbol}</p>
              </div>
              <p className="text-xs min-w-[120px] md:min-w-full mr-2.5 whitespace-prewrap text-light-font-60 dark:text-dark-font-60">
                {asset.name}
              </p>
            </div>
          </div>
        </td>
        <td className={`${tdStyle} text-end ${priceChange}`}>
          {getFormattedAmount(marketMetrics.price, 0, {
            canUseHTML: true,
          })}
        </td>
        <td className={`${tdStyle} text-end ${volumeChange}`}>
          ${formatAmount(marketMetrics.volume)}
        </td>
        <td className={`${tdStyle} text-end }`}>
          <div className="w-full flex justify-end">
            <TagPercentage
              percentage={getTokenPercentage(marketMetrics.price_change_24h)}
              isUp={
                (Number(getTokenPercentage(marketMetrics.price_change_24h)) ||
                  0) > 0
              }
            />
          </div>
        </td>
      </tr>
    </tbody>
  );
};
