import React from "react";
import { Button } from "../../../../components/button";
import { SmallFont } from "../../../../components/fonts";
import Dynamic from "./Dynamic";
import Static from "./Static";

const TopSection: React.FC = () => {
  return (
    <div className="w-full flex-col flex items-center">
      <div className="w-full flex flex-col items-center">
        <div className="w-[80%] max-w-[1000px] my-[40px] md:my-[14px] lg:mx-0 mx-auto">
          <p className="text-[22px] lg:text-[14px] font-medium text-light-font-100 dark:text-dark-font-100">
            Multi-chain Crypto Data API, Secure and Trustable
          </p>
          <p className="text-[20px] lg:text-[13px] font-medium text-light-font-40 dark:text-dark-font-40">
            Get free multi-chain real time data about any{" "}
            <span className="font-bold text-blue dark:text-blue">
              {" "}
              crypto-asset{" "}
            </span>
            , such as price, liquidity, volume, rank and more. To get access to
            our APIS, you can make a request directly{" "}
            <a
              href="https://form.typeform.com/to/o8JAVzDV "
              target="_blank"
              className="font-bold text-blue dark:text-blue"
            >
              here
            </a>
          </p>
        </div>
        <div className="w-[86%] lg:w-[90%] flex justify-center lg:justify-around">
          <Static />
          <Dynamic />
        </div>
      </div>
      <Button extraCss="hidde flex item-center justify-center w-[350px] py-2 rounded text-light-font-60 dark:text-dark-font-60">
        <SmallFont>Request</SmallFont>
      </Button>
    </div>
  );
};

export default TopSection;
