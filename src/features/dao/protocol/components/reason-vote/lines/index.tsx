import { Dispatch, SetStateAction } from "react";
import { BsCheckLg } from "react-icons/bs";

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
          className={`flex bg-light-bg-hover dark:bg-dark-bg-hover justify-center items-center mt-0 w-4 h-4 
          rounded-md border border-light-border-primary dark:border-dark-border-primary `}
        >
          <BsCheckLg
            className={`${
              reason === idx + 1 ? "" : "opacity-0"
            } text-light-font-100 dark:text-dark-font-100 transition-all duration-200 ease-in-out`}
          />
        </div>
      </button>
    </div>
  );
};
