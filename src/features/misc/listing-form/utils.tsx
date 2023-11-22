/* eslint-disable no-param-reassign */
import React from "react";
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
        placeholder: "Seed, Public, Private",
        title: "Round Name",
        type: "text",
      };
    case 1:
      return {
        placeholder: "29/06/2023",
        title: "Round Date",
        type: "text",
      };
    case 2:
      return {
        placeholder: "0.02",
        title: "Fully dilluted valuation",
        type: "number",
      };
    case 3:
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
    case 5:
      return {
        placeholder: "Exchange",
        title: "Platform",
        type: "text",
      };
    default:
      return {
        placeholder: "Seed, Public, Private",
        title: "Round Name",
        type: "text",
      };
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
