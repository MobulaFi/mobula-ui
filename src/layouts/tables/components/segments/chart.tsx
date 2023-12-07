import { NextImageFallback } from "../../../../components/image";
import { TableAsset } from "../../../../interfaces/assets";
import { Segment } from "../segment";

interface ChartSegmentProps {
  token: TableAsset;
  extraCss?: string;
}

export const ChartSegment = ({ token, extraCss = "" }: ChartSegmentProps) => (
  <Segment extraCss={extraCss}>
    <div className="flex justify-end w-full h-[45px] z-[1]">
      <NextImageFallback
        width={135}
        height={45}
        alt={`${token.name} sparkline`}
        style={{ zIndex: 0, minWidth: "135px" }}
        src={
          `https://mobula-assets.s3.eu-west-3.amazonaws.com/sparklines/${token.id}/24h.png` ||
          "/empty/sparkline.png"
        }
        fallbackSrc="/empty/sparkline.png"
        unoptimized
      />
    </div>
  </Segment>
);
