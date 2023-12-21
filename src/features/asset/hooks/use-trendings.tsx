import { useEffect, useState } from "react";
import { createSupabaseDOClient } from "../../../lib/supabase";
import { Trending } from "../models";

const generateRandomNumber = (min: number, max: number): number =>
  Math.floor(Math.random() * (max - min + 1) + min);

const generateUniqueRandomNumbers = (
  min: number,
  max: number,
  count: number
): number[] => {
  if (max - min + 1 < count) {
    throw new Error(
      "The range is too small to generate the required number of unique random numbers."
    );
  }

  const randomNumbers: Set<number> = new Set();

  while (randomNumbers.size < count) {
    const randomNumber = generateRandomNumber(min, max);
    randomNumbers.add(randomNumber);
  }

  return Array.from(randomNumbers);
};

export const useTrendings = () => {
  const [trendings, setTrendings] = useState<Trending[]>();
  useEffect(() => {
    const supabase = createSupabaseDOClient();
    supabase
      .from("assets")
      .select("name,price_change_24h,logo,id,trending_score,price")
      .order("market_cap", { ascending: false })
      .limit(30)
      .then((r) => {
        if (r.data) {
          const fourRandomNumbers = generateUniqueRandomNumbers(0, 29, 4);
          setTrendings(fourRandomNumbers.map((number) => r.data[number]));
        }
      });
  }, []);
  return trendings;
};
