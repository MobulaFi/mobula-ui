"use client";
import { blockchainsContent } from "mobula-lite/lib/chains/constants";
import { useParams } from "next/navigation";
import { SetStateAction, useEffect } from "react";
import { useAccount } from "wagmi";
import { OrderBy } from "../../../../interfaces/assets";
import { defaultCategories, defaultFilter, defaultTop100 } from "../constants";
import { useTop100 } from "../context-manager";
import { Query } from "../models";
import { maxValue } from "../reducer";

interface IUseFilter {
  setFilters: React.Dispatch<SetStateAction<Query[] | null>>;
  orderBy: OrderBy;
}

export const useFilter = ({ setFilters, orderBy }: IUseFilter) => {
  const { activeView, setIsLoading } = useTop100();
  const { isConnected } = useAccount();
  const params = useParams();
  const page = params.page;

  const getFilter = () => {
    if (isConnected === false) return [...defaultFilter];
    if (activeView?.name === "Portfolio") {
      setIsLoading(false);
      return [...defaultFilter];
    }
    const actualView = activeView?.filters;

    const filteredValues: { action: string; value: string[] }[] = [];
    if (actualView) {
      Object.keys(actualView).forEach((key) => {
        const value = actualView[key];
        const top100Filter: {
          blockchains: string[];
          [key: string]: string[] | { from: number; to: number };
        } = defaultTop100.filters;
        const fromValue = (top100Filter[key] as { from: number; to: number })
          .from;
        const toValue = (top100Filter[key] as { from: number; to: number }).to;
        const defaultValue = { from: 0, to: maxValue };
        const isPriceChange = key === "price_change";
        // Filters for other settings
        if (
          JSON.stringify(value) !== JSON.stringify(defaultValue) &&
          key !== "blockchains" &&
          key !== "categories"
        ) {
          if (value.from !== fromValue && key === "volume")
            filteredValues.push({
              action: "filter",
              value: [
                isPriceChange ? `${"global_volume"}` : "global_volume",
                "gte",
                value.from,
              ],
            });
          else if (value.from !== fromValue) {
            filteredValues.push({
              action: "filter",
              value: [isPriceChange ? `${key}_24h` : key, "gte", value.from],
            });
          }

          if (value.to !== toValue && key === "volume")
            filteredValues.push({
              action: "filter",
              value: [
                isPriceChange ? `${"global_volume"}` : "global_volume",
                "lte",
                value.to,
              ],
            });
          else if (value.to !== toValue) {
            filteredValues.push({
              action: "filter",
              value: [isPriceChange ? `${key}_24h` : key, "lte", value.to],
            });
          }
        }
        if (key === "tokens") {
          filteredValues.push({
            action: "in",
            value: ["id", value],
          });
        }
        if (
          key === "blockchains" &&
          value.length !== Object.keys(blockchainsContent)?.length
        ) {
          const filters = value.map((v: string) => `blockchains.cs.{${v}}`);
          const filterString = filters.join(",");
          filteredValues.push({
            action: "or",
            value: [filterString],
          });
        }
        if (
          key === "categories" &&
          value.length !== defaultCategories?.length
        ) {
          const filters = value.map((v: string) => `tags.cs.{${v}}`);
          const filterString = filters.join(",");
          filteredValues.push({
            action: "or",
            value: [filterString],
          });
        }
      });
    }
    if (!filteredValues.length) return [...defaultFilter];
    return filteredValues;
  };

  useEffect(() => {
    const previousPath = localStorage.getItem("previousPath");

    if (previousPath !== "/home" && previousPath !== `/home?page=${page}`)
      return;
    if (!activeView?.isFirst || !orderBy.first || page) {
      setFilters([...getFilter()]);
    } else setIsLoading(false);
  }, [activeView, isConnected, orderBy, page]);
};
