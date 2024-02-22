"use client";
import React, { useEffect, useRef } from "react";
import { MediumFont } from "../../../components/fonts";
import { cn } from "../../../lib/shadcn/lib/utils";
import { Title } from "../home/components/ui/title";
import { containerStyle } from "../home/style";
import { blurEffectAnimation } from "../home/utils";
import { PricingBox } from "./components/pricing-box";
import { pricingBoxStyle } from "./constants";

export const Pricing = () => {
  const basicRef = useRef<HTMLDivElement>(null);
  const startupRef = useRef<HTMLDivElement>(null);
  const entrepriseRef = useRef<HTMLDivElement>(null);
  const needsRef = useRef<HTMLDivElement>(null);
  const [isHover, setIsHover] = React.useState<number>(0);

  useEffect(() => {
    blurEffectAnimation(basicRef.current);
    blurEffectAnimation(startupRef.current);
    blurEffectAnimation(entrepriseRef.current);
    blurEffectAnimation(needsRef.current);
  }, []);

  return (
    <>
      <section
        className="w-full flex justify-center items-center bg-no-repeat bg-cover bg-center relative snap-center pt-[100px] pb-5 md:py-[50px]"
        style={{
          backgroundImage: `radial-gradient(at right bottom, rgba(11, 32, 64, 1.0), #131627 80%, #131627)`,
        }}
      >
        <div className="flex items-center justify-center w-full">
          <div className={containerStyle}>
            <div className="w-full">
              <Title
                title="Mobula API Pricing"
                extraCss="text-start w-full justify-start mx-0"
              />
              <p className="text-light-font-60 dark:text-dark-font-60 text-center font-poppins mt-6 text-xl md:text-base lg:max-w-[80%] mx-auto lg:mb-5">
                Faster indexers, multi-chain, data-enabled - consumed via REST
                or livestreamed to your DB.
              </p>
              <div className="w-full flex justify-between lg:flex-col lg:justify-center lg:items-center">
                <div className={pricingBoxStyle} ref={basicRef}>
                  <PricingBox id={0} />
                </div>
                <div className={`${pricingBoxStyle} mx-5`} ref={startupRef}>
                  <PricingBox id={1} />
                </div>
                <div className={pricingBoxStyle} ref={entrepriseRef}>
                  <PricingBox id={2} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section
        className="w-full flex justify-center items-center bg-no-repeat bg-cover bg-center relative snap-center pb-[150px] md:pb-[50px]"
        style={{
          backgroundImage: `radial-gradient(at right top, rgba(11, 32, 64, 1.0), #131627 80%, #131627)`,
        }}
      >
        <div className={containerStyle}>
          <div
            className={cn(
              pricingBoxStyle,
              "w-full p-8 flex flex-col mt-0 lg:mt-0 md:mt-0 lg:mx-auto"
            )}
            ref={needsRef}
          >
            <div className="flex items-center justify-between w-full">
              <MediumFont extraCss="font-poppins ">
                Custom needs? Get a tailored plan!
              </MediumFont>
              <button
                className="w-[200px] h-[50px] rounded-lg bg-light-font-5 dark:bg-dark-font-5 shadow-xl 
                  backdrop-blur-md border border-light-border-primary dark:border-dark-border-primary
                  hover:bg-light-font-80 hover:dark:bg-dark-font-80 transition-all duration-300 ease-in-out
                    hover:text-dark-font-100 hover:dark:text-light-font-100 font-poppins text-base 
                    text-light-font-100 dark:text-dark-font-100"
              >
                Contact us
              </button>
            </div>
            <div className="flex justify-between mt-8 w-[70%] mr-auto">
              <div className="flex flex-col">
                <MediumFont extraCss="font-poppins text-light-font-60 dark:text-dark-font-60">
                  Custom endpoints
                </MediumFont>
                <MediumFont extraCss="font-poppins text-light-font-60 dark:text-dark-font-60">
                  99.99% SLA
                </MediumFont>
              </div>
              <div className="flex flex-col">
                <MediumFont extraCss="font-poppins text-light-font-60 dark:text-dark-font-60">
                  Custom endpoints
                </MediumFont>
                <MediumFont extraCss="font-poppins text-light-font-60 dark:text-dark-font-60">
                  99.99% SLA
                </MediumFont>
              </div>
              <div className="flex flex-col">
                <MediumFont extraCss="font-poppins text-light-font-60 dark:text-dark-font-60">
                  Custom endpoints
                </MediumFont>
                <MediumFont extraCss="font-poppins text-light-font-60 dark:text-dark-font-60">
                  99.99% SLA
                </MediumFont>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};
