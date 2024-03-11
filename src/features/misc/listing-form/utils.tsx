/* eslint-disable no-param-reassign */
import { AiFillEdit } from "react-icons/ai";
import { BsLinkedin, BsTelegram, BsTwitter } from "react-icons/bs";
import { FaUserAlt } from "react-icons/fa";

export const getNameFromNumber = (number: number) => {
  switch (number) {
    case 1:
      return "First";
    case 2:
      return "Second";
    case 3:
      return "Third";
    case 4:
      return "Fourth";
    case 5:
      return "Fifth";
    case 6:
      return "Sixth";
    default:
      return "";
  }
};

export const getInfoFromIndex = (index: number) => {
  switch (index) {
    case 0:
      return {
        placeholder: "29/06/2023",
        title: "Start Date",
        type: "number",
      };
    case 1:
      return {
        placeholder: "Seed, Public, Private",
        title: "Round Name",
        type: "text",
      };
    case 5:
      return {
        placeholder: "20/09/2023",
        title: "End Date",
        type: "number",
      };
    case 3:
      return {
        placeholder: "0.02",
        title: "Fully dilluted valuation",
        type: "number",
      };
    case 2:
      return {
        placeholder: "--.--",
        title: "Token Price (empty if unknown)",
        type: "number",
      };
    case 4:
      return {
        placeholder: "140000",
        title: "Tokens Sold",
        type: "number",
      };
    default:
      return;
  }
};

export const getIconFromMemberTitle = (title: string) => {
  if (title === "role")
    return (
      <FaUserAlt
        className={`text-xl lg:text-lg md:text-base mr-[7.5px] text-light-font-100 dark:text-dark-font-100`}
      />
    );
  if (title === "name")
    return (
      <AiFillEdit
        className={`text-xl lg:text-lg md:text-base mr-[7.5px] text-light-font-100 dark:text-dark-font-100`}
      />
    );
  if (title === "linkedin")
    return (
      <BsLinkedin className="text-xl lg:text-lg md:text-base mr-[7.5px] text-linkedin dark:text-linkedin" />
    );
  if (title === "twitter")
    return (
      <BsTwitter className="text-xl lg:text-lg md:text-base mr-[7.5px] text-twitter dark:text-twitter" />
    );
  return (
    <BsTelegram className="text-xl lg:text-lg md:text-base mr-[7.5px] text-telegram dark:text-telegram" />
  );
};

export const getDateError = (dateRef) => {
  const regex = /^\d{2}\/\d{2}\/\d{4}$/;
  if (dateRef.current === null || dateRef.current.value === "") return false;
  if (!regex.test(dateRef.current.value)) return true;
  return false;
};

// Avoiding fee details = "" in the database
export const cleanFee = (fee) => {
  if (!fee.details) delete fee.details;
  return fee;
};

export const cleanVesting = (vesting) => {
  vesting[2] = vesting[2].filter((e) => e?.amount);
  return vesting;
};

export function formatDate(dateString: string): number | null {
  if (typeof dateString !== "string") {
    console.error("formatDate: dateString must be a string");
    return dateString;
  }

  const parts = dateString.split("/");
  if (parts.length === 3) {
    const day = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10);
    const year = parseInt(parts[2], 10);

    // Vérifiez si les valeurs du jour, du mois et de l'année sont valides
    if (
      !isNaN(day) &&
      day >= 1 &&
      day <= 31 &&
      !isNaN(month) &&
      month >= 1 &&
      month <= 12 &&
      !isNaN(year) &&
      parts[2].length === 4
    ) {
      const date = new Date(year, month - 1, day); // Les mois sont indexés à partir de 0
      let timestamp = date.getTime();

      // Vérifiez si la date est valide (non NaN et correspond à la saisie)
      if (!isNaN(timestamp) && date.getDate() === day) {
        return timestamp / 100;
      }
    }
  }
  return null; // Retournez null si la date n'est pas valide ou complète
}
