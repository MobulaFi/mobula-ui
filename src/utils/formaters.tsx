import { Flex, Text } from "@chakra-ui/react";

export function formatName(name: string, chars: number): string {
  return `${name.substr(0, chars)}...`;
}

export function formatNameClean(name: string, chars: number): string {
  if (name.length <= chars) return name;
  return name.substring(0, chars) + "...";
}

export function getNumberFromFormat(number: string) {
  if (isNaN(parseInt(number[number.length - 1], 10))) {
    switch (number[number.length - 1].toLowerCase()) {
      case "k":
        return parseFloat(number) * 1000;
      case "m":
        return parseFloat(number) * 1_000_000;
      case "b":
        return parseFloat(number) * 1_000_000_000;
    }
  } else {
    return parseFloat(number);
  }
}

export function formatAmount(amount: number | string, decimals = 2) {
  if (isNaN(parseInt(amount as string))) return "--";
  return (
    String(Math.floor(parseFloat(amount as string))).replace(
      /\B(?=(\d{3})+(?!\d))/g,
      ","
    ) +
    (amount.toString().includes(".") && decimals
      ? `.${amount.toString().split(".")[1].substr(0, decimals)}`
      : "")
  );
}

export function getFormattedAmount(
  price: number | string | undefined,
  lessPrecision = 0,
  settings = { minifyZeros: true, minifyBigNumbers: true }
) {
  try {
    if (price) {
      price = parseFloat(String(price)).toFixed(
        Math.min(
          String(price).includes("-")
            ? parseInt(String(price).split("-")[1]) + 2
            : String(price).split(".")[1]?.length || 0,
          100
        )
      );

      if (Math.abs(parseFloat(price)) > 1000000) {
        return settings.minifyBigNumbers
          ? formatBigAmount(price)
          : formatAmount(price, 0);
      }
      if (Math.abs(parseFloat(price)) > 1000) {
        return String(parseInt(price)).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
      }
      if (Math.abs(parseFloat(price)) < 0.0001) {
        if (!settings.minifyZeros) {
          // const last
        }
        const priceString = price.toString();
        const newPrice = [];
        const arr = priceString.split(".");
        const decimals = arr[1]?.split("");
        decimals.forEach((digit, index) => {
          if (newPrice.some((digit) => digit !== "0")) return;
          if (digit === "0") newPrice.push(digit);
          if (decimals[index - 1] == "0" && digit !== "0") {
            newPrice.push(digit);
            newPrice.push(decimals[index + 1]);
            newPrice.push(decimals[index + 2]);
          }
        });
        return `${arr[0]}.${newPrice.join("")}`;
      }
      if (Math.abs(parseFloat(price)) < 0.01) {
        return price.slice(0, 8 - lessPrecision);
      }
      price = price.slice(0, 6 - lessPrecision);
      if (price[price.length - 1] === ".")
        price = price.slice(0, 5 - lessPrecision);
      return price;
    }
    if (Number.isNaN(price)) {
      return "--";
    }
    return 0;
  } catch (e) {
    return "--";
  }
}

export function getRightPrecision(price: any, precision = 7) {
  if (Number.isNaN(parseFloat(price))) return null;
  const size = String(price).split(".")[0]?.length || 0;
  return parseFloat(parseFloat(price).toFixed(Math.max(precision - size, 0)));
}

export function formatBigAmount(amount: number | string, precision = 3) {
  amount = formatAmount(parseInt(amount as string));
  let letter: string = "";
  switch (amount.split(",").length) {
    case 1:
      letter = "";
      break;
    case 2:
      letter = "k";
      break;
    case 3:
      letter = "M";
      break;
    case 4:
      letter = "B";
      break;
    case 5:
      letter = "T";
      break;
    case 6:
      letter = "Q";
      break;
    case 7:
      letter = "Qi";
      break;
    case 8:
      letter = "S";
      break;
  }

  const fractionalPart = amount
    .split(",")
    .slice(1)
    .join("")
    .slice(0, precision - amount.split(",")[0].length);

  if (fractionalPart === "0") {
    return `${amount.split(",")[0]}${letter}`;
  }

  if (precision) {
    return `${amount.split(",")[0]}${
      fractionalPart ? `.${fractionalPart}` : ""
    }${letter}`;
  }

  return amount.split(",")[0] + letter;
}

export function getTokenPrice(price: any) {
  if (price) {
    // Making sure we're getting a number without e-7 etc..
    price = parseFloat(String(price)).toFixed(
      String(Math.abs(price)).includes("-")
        ? parseInt(String(price).split("-")[1]) + 2
        : String(price).split(".")[1]?.length || 0
    );

    if (parseFloat(price) > 1000) {
      return formatAmount(parseInt(price)).slice(0, 6);
    }
    if (parseFloat(price) < 0.0001) {
      const exp = price.match(/0\.0+[1-9]/)?.[0] || "";
      return `${price.split(".")[0]}.0..0${price
        .split(exp.slice(0, exp.length - 2))[1]
        .slice(1, 8)}`;
    }
    return price.slice(0, 8);
  }
  if (isNaN(price)) {
    return <>--</>;
  }
  return 0;
}

export function removeScNotation(num: number): string {
  const str = num.toString();
  if (str.includes("e")) {
    return Number(str)
      .toFixed(20)
      .replace(/\.?0+$/, "");
  }
  return str;
}

export function getTokenFormattedPrice(
  price: string | number,
  addOn = "",
  { justify, marginTop }: { justify: string | null; marginTop: string | null }
) {
  if (price) {
    // Making sure we're getting a number
    price = String(price);

    if (parseFloat(price) > 1000) {
      return <>{addOn + formatAmount(parseInt(price))}</>;
    }
    if (parseFloat(price) < 0.0001) {
      price = parseFloat(String(price)).toFixed(
        Math.min(
          String(price).includes("-")
            ? parseInt(String(price).split("-")[1]) + 2
            : String(price).split(".")[1].length,
          100
        )
      );

      const exp = price.match(/0\.0+[1-9]/)?.[0] || "";
      return (
        <Flex
          mt={marginTop || "-45px"}
          justify={justify || "center"}
          align="center"
        >
          {`${addOn + price.split(".")[0]}.0`}{" "}
          <Text mt="2.5%" fontSize={["xx-small", "small"]}>
            {exp.length - 3}
          </Text>{" "}
          {price.split(exp.slice(0, exp.length - 2))[1].slice(1, 6)}
        </Flex>
      );
    }
    return <>{addOn + price.slice(0, 8)}</>;
  }
  return <>--</>;
}
export function getTokenPercentage(status?: number) {
  if (typeof status !== "number") {
    status = parseFloat(status as unknown as string);
  }
  if (status === undefined || status === Infinity || Number.isNaN(status)) {
    return "-- ";
  }
  return status.toFixed(2);
}

export function getRandomColor() {
  const letters = "0123456789ABCDEF";
  let color = "#";
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

export function calculPercentage(
  percentage: string,
  amount: number,
  result: any
) {
  if (parseFloat(percentage) < 0) {
    return Math.abs(
      amount - (amount * 100) / (100 - parseFloat(percentage) * -1)
    );
  }
  return amount - (amount * 100) / (100 + parseFloat(percentage));
}

export function calculProfit(actualPrice: number, priceBought: number) {
  let result = (actualPrice * 100) / priceBought;
  if (actualPrice > priceBought) {
    result -= 100;
    return result;
  }
  if (actualPrice === priceBought) {
    return result;
  }
  result *= -1;
  result = -100 - result;
  return result;
}

export function getClosest(dataset: [number, number][], timestamp: number) {
  let bestTimestamp = -Infinity;
  let bestPrice = 0;

  for (let i = 0; i < dataset.length - 1; i++) {
    if (
      Math.abs(timestamp - dataset[i][0]) < Math.abs(timestamp - bestTimestamp)
    ) {
      bestTimestamp = dataset[i][0];
      bestPrice = dataset[i][1];
    }
  }

  return bestPrice;
}

export function getClosestUltimate(
  dataset: [number, number][],
  timestamp: number
) {
  let bestTimestamp = 0;
  let bestPrice = 0;
  let nextBestTimestamp = 0;
  let nextBestPrice = 0;

  for (let i = 0; i < dataset.length - 1; i++) {
    if (timestamp < dataset[i][0]) {
      break;
    } else if (
      Math.abs(timestamp - dataset[i][0]) < Math.abs(timestamp - bestTimestamp)
    ) {
      bestTimestamp = dataset[i][0];
      bestPrice = dataset[i][1];
      nextBestTimestamp = dataset[i + 1][0];
      nextBestPrice = dataset[i + 1][1];
    }
  }

  return [
    [bestTimestamp, bestPrice],
    [nextBestTimestamp, nextBestPrice],
  ];
}

export function getShortenedAmount(
  number: number,
  precision?: number,
  strict = true,
  lessPrecision?: number
): string {
  if (number == 0) return "0";

  if (Math.abs(number) > 100000 || (Math.abs(number) >= 1000 && strict)) {
    return formatBigAmount(number, precision);
  }
  return getFormattedAmount(number, lessPrecision) as never;
}

export function fromUrlToName(name: string) {
  if (name.includes("---")) {
    let tempName = name.split("-").join(" ");
    tempName = tempName.split("   ").join(" - ");
    return decodeURIComponent(tempName).toLowerCase();
  }
  return decodeURIComponent(name.split("-").join(" ").toLowerCase());
}

export function getUrlFromName(name: string): string {
  return encodeURIComponent(name.split(" ").join("-").toLowerCase());
}

export function formatAddress(address: string) {
  if (address) {
    return `${address.slice(0, 4)}..${address.slice(
      address.length - 4,
      address.length
    )}`;
  }
  return "0x00..00";
}

export function clearHTML(content: string) {
  return content.replace(/<[^>]*>?/gm, "");
}

export const getDate = (timestamp: number) => {
  const date = new Date(timestamp);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = String(date.getFullYear()).slice(2);

  return `${month}/${day}/${year}`;
};

export const addressSlicer = (address?: string, endCut = 4) => {
  if (!address) return "...";
  return `${address.slice(0, 4)}...${address.slice(-endCut)}`;
};

export const toNumber = (amount: bigint, decimals: number) =>
  Number((amount * 10000n) / BigInt(10 ** decimals)) / 10000;

const months = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

export const getFormattedDate = (date: number) => {
  if (!date) return null;
  const month: string = months[new Date(date).getMonth()];
  const day: number = new Date(date).getDate();
  const year: number = new Date(date).getFullYear();
  return `${month} ${day}, ${year}`;
};

export const getFormattedHours = (date: number) => {
  if (!date) return null;
  let hours: number | string = new Date(date).getHours();
  let minutes: number | string = new Date(date).getMinutes();
  let seconds: number | string = new Date(date).getSeconds();
  if (hours < 10) hours = `0${hours}`;
  if (minutes < 10) minutes = `0${minutes}`;
  if (seconds < 10) seconds = `0${seconds}`;
  return `${hours}:${minutes}:${seconds}`;
};
