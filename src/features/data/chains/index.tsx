"use client";
import { useState } from "react";
import { Container } from "../../../components/container";
import { LeftBox } from "./components/box-left";
import { MiddleBox } from "./components/box-middle";
import { RightBox } from "./components/box-right";
import { useChains } from "./context-manager";

export const Chains = () => {
  const { pairs, chain } = useChains();
  const [showPage, setShowPage] = useState(0);

  console.log("PAIRS", pairs);
  console.log("CHAIN", chain);

  // Chain traders (chart)
  // Chain volume (chart)
  // Chain DEX TVL (chart)
  return (
    <>
      <div className="flex pb-5 md:pb-2.5 w-full">
        <Container extraCss="lg:flex flex-row max-w-[1300px] ">
          <div className="flex w-95per mx-auto ">
            <div className="swiper">
              <div className="swiper-wrapper flex">
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
    </>
  );
};
