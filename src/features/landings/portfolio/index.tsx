import React from "react";
import { ContainerScroll } from "./ui/container-scroll";

export const PortfolioLanding = () => {
  const users = [
    {
      name: "John Doe",
      designation: "CEO",
      image: "https://randomuser",
      badge: "https://randomuser",
    },
    {
      name: "John Doe",
      designation: "CEO",
      image: "https://randomuser",
      badge: "https://randomuser",
    },
    {
      name: "John Doe",
      designation: "CEO",
      image: "https://randomuser",
      badge: "https://randomuser",
    },
    {
      name: "John Doe",
      designation: "CEO",
      image: "https://randomuser",
      badge: "https://randomuser",
    },
  ];
  return (
    <>
      <section
        className="w-full flex justify-center items-center flex-col bg-no-repeat bg-contain md:bg-cover bg-center relative snap-center md:pb-[50px] md:py-[100px]"
        style={{
          backgroundImage: `url('/landing/main-background.svg'), radial-gradient(at right bottom, rgba(11, 32, 64, 1.0), #131627 80%, #131627)`,
        }}
      >
        <div className="w-full">
          <ContainerScroll
            users={users}
            titleComponent={"Discover Portfolio"}
          />{" "}
        </div>
        {/* <div
          className={cn(
            containerStyle,
            "justify-center flex-col items-center pb-20"
          )}
        >
          <SmallFont extraCss="text-lg font-poppins text-center max-w-[80%]">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Pariatur,
            expedita repellendus saepe consequuntur omnis ullam suscipit odit
            aliquam dolor maiores deserunt commodi rerum vero placeat provident
            quia architecto laboriosam illo.
          </SmallFont>
        </div> */}
      </section>
    </>
  );
};
