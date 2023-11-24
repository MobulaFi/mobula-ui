import React from "react";
import { NextImageFallback } from "../../../../components/image";
import { TableAsset } from "../../../../interfaces/assets";
import { Segment } from "../segment";

interface ChartSegmentProps {
  token: TableAsset;
}

export const ChartSegment = ({ token }: ChartSegmentProps) => (
  <Segment>
    <div className="flex justify-center w-full h-[45px] z-[1]">
      <NextImageFallback
        width={135}
        height={45}
        alt={`${token.name} sparkline`}
        style={{ zIndex: 0 }}
        src={
          `https://mobula-assets.s3.eu-west-3.amazonaws.com/sparklines/${token.id}/24h.png` ||
          "/404/sparkline.png"
        }
        fallbackSrc="/404/sparkline.png"
        unoptimized
      />
    </div>
  </Segment>
);
