/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable no-var */
/* eslint-disable block-scoped-var */
import React, { Dispatch, SetStateAction } from "react";
import { AiOutlineClose } from "react-icons/ai";
import { Button } from "../../../../../components/button";
import { Spinner } from "../../../../../components/spinner";
import { cn } from "../../../../../lib/shadcn/lib/utils";
import { colors } from "../../constants";
import { ComparedEntity } from "../../models";

interface CompareButtonsProps {
  buttonH?: string;
  comparedEntities: ComparedEntity[];
  setComparedEntities: Dispatch<SetStateAction<ComparedEntity[]>>;
  noMaxW?: boolean;
  extraCss?: string;
}

export const CompareButtons = ({
  buttonH = "h-[38px]",
  comparedEntities,
  setComparedEntities,
  noMaxW = false,
  extraCss,
  ...props
}: CompareButtonsProps) => (
  <div
    className={cn(
      `flex flex-wrap mr-auto ${
        noMaxW
          ? "max-w-[95%] ml-0 md:ml-[2.5%]"
          : "max-w-[500px] md:max-w-[300px] ml-0"
      }`,
      extraCss
    )}
    {...props}
  >
    {comparedEntities?.map((entity, i) => (
      <Button
        key={entity.label}
        extraCss={`z-[1] px-2 ${buttonH} mr-2.5 mb-2.5 `}
        onClick={() => {
          comparedEntities.splice(i, 1);
          setComparedEntities([...comparedEntities]);
        }}
      >
        <div
          className={`flex items-center justify-center ${colors[i]} rounded-full w-[10px] min-w-[10px] h-[10px] mr-[5px]`}
        />
        {entity.label}
        {entity.data.length ? (
          <AiOutlineClose className="ml-[5px]" />
        ) : (
          <Spinner extraCss="h-[10px] w-[10px] ml-[5px]" />
        )}
      </Button>
    ))}
  </div>
);
