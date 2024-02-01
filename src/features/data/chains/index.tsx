"use client";
import React, { useState } from "react";
import { Container } from "../../../components/container";
import { LeftBox } from "./components/box-left";
import { MiddleBox } from "./components/box-middle";
import { RightBox } from "./components/box-right";

export const Chains = () => {
  const [showPage, setShowPage] = useState(0);
  return (
    <div className="flex flex-col bg-light-bg-primary dark:bg-dark-bg-primary overflow-x-hidden">
      <div className="flex bg-light-bg-table dark:bg-dark-bg-table pb-5 md:pb-2.5 w-full">
        <Container
          extraCss="lg:flex flex-row max-w-[1300px] bg-light-bg-table dark:bg-dark-bg-table 
            justify-between mb-0 md:mb-0 pb-0 overflow-x-scroll w-full hidden"
        >
          fjiofriofsrfiosrfiosrio
          <div className="flex w-95per mx-auto ">
            <div className="swiper">
              <div className="swiper-wrapper">
                <div className="swiper-slide flex justify-center">
                  <LeftBox showPageMobile={showPage} />
                </div>
                <div className="swiper-slide flex justify-center">
                  <MiddleBox showPageMobile={showPage} />
                </div>
                <div className="swiper-slide flex justify-center">
                  <RightBox showPageMobile={showPage} />
                </div>
              </div>
            </div>
          </div>
        </Container>
      </div>
    </div>
  );
};
