"use client";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Container } from "../../../components/container";
import { LeftBox } from "./components/box-left";
import { MiddleBox } from "./components/box-middle";
import { RightBox } from "./components/box-right";
import { TableTbody } from "./components/table-body";
import { TableHeader } from "./components/table-header";
import { useChains } from "./context-manager";

// Import Swiper styles
import "swiper/css";

export const Chains = () => {
  const { pairs, chain } = useChains();
  const router = useRouter();
  const [showPage, setShowPage] = useState(0);

  return (
    <div className="flex pb-5 md:pb-2.5 w-full flex-col">
      <Container extraCss="lg:flex flex-row max-w-[1300px] justify-between mb-0 md:mb-0 pb-0 lg:w-full overflow-x-scroll">
        <div className="hidden w-95per lg:w-full mx-auto mb-5 lg:flex">
          <Swiper spaceBetween={50} slidesPerView={1}>
            <SwiperSlide>
              <LeftBox showPageMobile={showPage} />
            </SwiperSlide>
            <SwiperSlide>
              <MiddleBox showPageMobile={showPage} />
            </SwiperSlide>
            <SwiperSlide>
              <RightBox showPageMobile={showPage} />
            </SwiperSlide>
          </Swiper>
        </div>
        <div className="flex mb-5 lg:hidden">
          <div className="">
            <div className="flex">
              <div className="flex justify-center">
                <LeftBox showPageMobile={showPage} />
              </div>
              <div className="flex justify-center">
                <MiddleBox showPageMobile={showPage} />
              </div>
              <div className="flex justify-center">
                <RightBox showPageMobile={showPage} />
              </div>
            </div>
          </div>
        </div>
      </Container>
      <Container extraCss="max-w-[1300px] mt-0 overflow-x-scroll">
        <TableHeader isLoading={false}>
          <TableTbody />
        </TableHeader>{" "}
      </Container>
    </div>
  );
};
