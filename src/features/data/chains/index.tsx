"use client";
import { useEffect } from "react";
import "swiper/css";
import { Swiper, SwiperSlide } from "swiper/react";
import { Container } from "../../../components/container";
import { LeftBox } from "./components/box-left";
import { MiddleBox } from "./components/box-middle";
import { RightBox } from "./components/box-right";
import { TableTbody } from "./components/table-body";
import { TableHeader } from "./components/table-header";
import { useChains } from "./context-manager";

export const Chains = () => {
  const { pairs } = useChains();
  useEffect(() => {
    const socket = new WebSocket(
      process.env.NEXT_PUBLIC_PRICE_WSS_ENDPOINT as string
    );

    socket.addEventListener("open", () => {
      socket.send(
        JSON.stringify({
          type: "pair",
          authorization: process.env.NEXT_PUBLIC_PRICE_KEY,
          payload: { blockchain: "ethereum", interval: 5 },
        })
      );
    });

    socket.addEventListener("message", (event) => {
      console.log("event", event);
      const eventData = JSON.parse(event.data);
      console.log("eventData", eventData);
    });
  }, []);
  return (
    <div className="flex pb-5 md:pb-2.5 items-center flex-col w-full overflow-x-hidden">
      <Container extraCss="lg:flex flex-row max-w-[1300px] justify-between mb-0 md:mb-0 pb-0 lg:w-full overflow-x-scroll">
        <div className="hidden w-95per mx-auto mb-5 lg:mb-0 lg:flex">
          <Swiper spaceBetween={50} slidesPerView={1}>
            <SwiperSlide>
              <LeftBox />
            </SwiperSlide>
            <SwiperSlide>
              <MiddleBox />
            </SwiperSlide>
            <SwiperSlide>
              <RightBox />
            </SwiperSlide>
          </Swiper>
        </div>
        <div className="flex mb-5 lg:hidden justify-between w-full">
          <div className="flex justify-center">
            <LeftBox />
          </div>
          <div className="flex justify-center">
            <MiddleBox />
          </div>
          <div className="flex justify-center">
            <RightBox />
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
