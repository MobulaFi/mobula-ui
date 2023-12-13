import React from "react";
import { BsCheckLg } from "react-icons/bs";
import { SmallFont } from "../../../../../components/fonts";

const Static: React.FC = () => {
  return (
    <div className="flex flex-col lg:bg-none dark:lg:bg-none  bg-light-bg-secondary dark:bg-dark-bg-secondary rounded-xl ml-2 shadow-md lg:shadow-none py-5 px-[40px] lg:p-2.5">
      <p className="text-lg mb-5 text-blue dark:text-blue font-medium">
        Static API
      </p>
      <p className="text-light-font-60 dark:text-dark-font-60 mb-[30px] mt-2.5 text-base flex lg:hidden">
        An on-chain API to retrieve relational information
        <br /> from the address of a crypto-token.
      </p>
      <div className="flex mb-[30px] items-center">
        <BsCheckLg className="text-light-font-100 dark:text-dark-font-100 text-lg" />
        <SmallFont extraCss="whitepace-nowrap ml-[5px]">Website</SmallFont>
      </div>
      <div className="flex mb-[30px] items-center">
        <BsCheckLg className="text-light-font-100 dark:text-dark-font-100 text-lg" />
        <SmallFont extraCss="whitepace-nowrap ml-[5px]">
          Social networks
        </SmallFont>
      </div>
      <div className="flex mb-[30px] items-center">
        <BsCheckLg className="text-light-font-100 dark:text-dark-font-100 text-lg" />
        <SmallFont extraCss="whitepace-nowrap ml-[5px]">Logo</SmallFont>
      </div>
      <div className="flex mb-[30px] items-center">
        <BsCheckLg className="text-light-font-100 dark:text-dark-font-100 text-lg" />
        <SmallFont extraCss="whitepace-nowrap ml-[5px]">
          Audits & KYCs
        </SmallFont>
      </div>
    </div>
  );
};

export default Static;
