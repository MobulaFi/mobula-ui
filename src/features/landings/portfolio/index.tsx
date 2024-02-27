import React from "react";
import { ContainerScroll } from "./ui/container-scroll";
import { StickyScroll } from "./ui/sticky-scroll-reveal";

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
  const infoDescription = [
    {
      title: "Multiple wallets & chains",
      logo: "/landing/supercharged/subgraph.png",
      description:
        "Connect tens of wallets (Ledger, Metamask, etc.) to automatically synchronize your positions in real time.",
    },
    {
      title: "Profit & Losses Analysis",
      logo: "/landing/supercharged/chains.png",
      description:
        "Understand where you're winning & where you're losing: realized PNL, unrealized PNL, fees, etc.",
    },
    {
      title: "No Security Risk",
      logo: "/landing/supercharged/livestream.png",
      description:
        "You own your keys & your coins. You don't even NEED to connect a wallet to track it.",
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
      </section>
      <section
        className="w-full flex justify-center items-center flex-col bg-no-repeat bg-contain md:bg-cover bg-center relative snap-center py-[50px]  md:py-[100px]"
        style={{
          backgroundImage: `radial-gradient(at right top, rgba(11, 32, 64, 1.0), #131627 80%, #131627)`,
        }}
      >
        {/* <Title title="Description" extraCss="mb-[50px] font-medium" /> */}
        <div className="w-full">
          <StickyScroll content={infoDescription} />
        </div>{" "}
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
