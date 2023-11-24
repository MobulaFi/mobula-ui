import React from "react";
import { colors } from "../../../../constants";
import { ACTIONS } from "../../../../reducer";

interface ColorPopoverProps {
  dispatch: Function;
}

export const ColorPopover = ({ dispatch }: ColorPopoverProps) => {
  return (
    <div
      className="flex max-w-[200px] flex-wrap z-[2] p-2.5 bg-light-bg-terciary dark:bg-dark-bg-terciary
     rounded-xl border border-light-border-primary dark:border-dark-border-primary shadow-md absolute"
    >
      {colors.map((color) => (
        <button
          key={color}
          className="m-1.5 h-[12px] w-[12px] flex justify-center bg-light-bg-terciary dark:bg-dark-bg-terciary"
          onClick={() =>
            dispatch({
              type: ACTIONS.SET_COLOR,
              payload: { value: color },
            })
          }
        >
          <div
            className="min-h-[12px] w-[12px] h-[12px] max-w-[12px] min-w-[12px] rounded-full"
            style={{ background: color }}
          />
        </button>
      ))}
    </div>
  );
};
