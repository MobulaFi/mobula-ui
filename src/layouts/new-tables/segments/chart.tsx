import React from "react";
import { Segment } from ".";
import { NextImageFallback } from "../../../components/image";
import { TableAsset } from "../model";

interface ChartSegmentProps {
  token: TableAsset;
  extraCss?: string;
}

export const ChartSegment = ({ token, extraCss = "" }: ChartSegmentProps) => (
  <Segment extraCss={`${extraCss} md:px-[5px]`}>
    <div className="flex justify-end w-full h-[45px] z-[1]">
      <NextImageFallback
        width={135}
        height={45}
        alt={`${token.name} sparkline`}
        style={{ zIndex: 0, minWidth: "135px" }}
        src={
          `https://storage.googleapis.com/mobula-assets/sparklines/${token.id}/24h.png` ||
          "/empty/sparkline.png"
        }
        fallbackSrc="/empty/sparkline.png"
        unoptimized
      />
    </div>
  </Segment>
);
