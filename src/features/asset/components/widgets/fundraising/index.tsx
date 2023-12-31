import React from "react";
import { Allocation } from "./allocation";
import { FundraisingStats } from "./fundraising-stats";
import { Investors } from "./investors";
import { LaunchDate } from "./launch-date";
import { Rounds } from "./rounds";

export const Fundraising = () => (
  <div className="flex mt-5 lg:mt-0 mx-auto w-full md:w-[95%] flex-row lg:flex-col-reverse">
    <div className="flex flex-col max-w-[990px] w-calc-full-345 lg:w-full mr-[25px] lg:mr-0">
      <Rounds />
      <Investors />
      <div className="flex-col hidden lg:flex mt-2.5">
        <LaunchDate />
        <Allocation />
        <FundraisingStats />
      </div>
    </div>
    <div className="flex-col flex lg:hidden max-w-[345px] w-full">
      <LaunchDate />
      <Allocation />
      <FundraisingStats />
    </div>
  </div>
);
