import React, { Dispatch, SetStateAction } from "react";

interface LinesProps {
  idx: number;
  setReason: Dispatch<SetStateAction<number>>;
  texts: { code: string; name: string };
  reason: number;
}

export const Lines = ({ idx, setReason, texts, reason }: LinesProps) => {
  return (
    <div
      className="flex items-center border-b border-light-border-primary
     dark:border-dark-border-primary py-5 justify-between"
    >
      <div className="flex flex-col">
        <p className="text-light-font-100 dark:text-dark-font-100 text-[13px] text-medium">
          {texts.code}
        </p>
        <p className="text-light-font-40 dark:text-dark-font-40 text-[11px] text-medium max-w-[280px]">
          {texts.name}
        </p>
      </div>
      <button onClick={() => setReason(idx + 1)}>
        <div
          className={`mt-0 w-4 h-4 rounded-full ${
            reason === idx + 1
              ? "bg-blue dark:bg-blue"
              : "bg-light-border-primary dark:bg-dark-border-primary"
          }`}
        />
      </button>
    </div>
  );
};
