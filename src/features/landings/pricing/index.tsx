"use client";
import React, { useEffect, useRef } from "react";
import { Title } from "../home/components/ui/title";
import { containerStyle } from "../home/style";
import { blurEffectAnimation } from "../home/utils";
import { PricingBox } from "./components/pricing-box";
import { pricingBoxStyle } from "./constants";

export const Pricing = () => {
  const liveRef = useRef<HTMLDivElement>(null);
  const mulitRef = useRef<HTMLDivElement>(null);
  const surcharge = useRef<HTMLDivElement>(null);
  const [isHover, setIsHover] = React.useState<number>(0);

  useEffect(() => {
    blurEffectAnimation(liveRef.current);
    blurEffectAnimation(mulitRef.current);
    blurEffectAnimation(surcharge.current);
  }, []);

  return (
    <section
      className="w-full flex justify-center items-center bg-no-repeat bg-cover bg-center relative snap-center py-[150px] md:py-[50px]"
      style={{
        backgroundImage: `radial-gradient(at right bottom, rgba(11, 32, 64, 1.0), #131627 80%, #131627)`,
      }}
    >
      <div className="flex items-center justify-center">
        <div className={containerStyle}>
          <div className="w-full">
            <Title
              title="Mobula API Pricing"
              extraCss="text-start w-full justify-start mx-0"
            />
            <p className="text-light-font-60 dark:text-dark-font-60 font-poppins mt-6 text-xl md:text-base text-start">
              Faster indexers, multi-chain, data-enabled - consumed via REST or
              livestreamed to your DB.
            </p>
            <div className="w-full flex justify-between md:flex-col md:justify-start">
              <div className={pricingBoxStyle} ref={mulitRef}>
                <PricingBox id={0} />
              </div>
              <div className={`${pricingBoxStyle} mx-5`} ref={mulitRef}>
                <PricingBox id={1} />
              </div>
              <div className={pricingBoxStyle} ref={mulitRef}>
                <PricingBox id={2} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
