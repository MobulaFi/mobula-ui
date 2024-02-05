import {
  Dispatch,
  RefObject,
  SetStateAction,
  useContext,
  useEffect,
} from "react";
import { BiChevronDown } from "react-icons/bi";
import { SwapContext } from "../../../../..";
import { SmallFont } from "../../../../../../../components/fonts";
import { getRightPrecision } from "../../../../../../../utils/formaters";

interface SmallSwapLineProps {
  position?: "in" | "out";
  setSelectVisible?: Dispatch<SetStateAction<string | boolean | undefined>>;
  inputRef?: RefObject<HTMLInputElement>;
}

export const SmallSwapLine = ({
  setSelectVisible,
  inputRef,
  position,
}: SmallSwapLineProps) => {
  const { tokenIn, tokenOut, setAmountIn, amountIn, amountOut } =
    useContext(SwapContext);
  const token = position === "in" ? tokenIn : tokenOut;
  const amount = position === "in" ? amountIn : amountOut;
  const setAmount = position === "in" ? setAmountIn : undefined;

  useEffect(() => {
    if (tokenIn?.balance) {
      setAmountIn(tokenIn.balance);
    }
  }, [tokenIn?.balance]);

  return (
    <>
      <div
        className={`flex justify-between bg-light-bg-secondary dark:bg-dark-bg-secondary rounded-lg border
     border-light-border-primary dark:border-dark-border-primary p-[5px] h-[42px] ${
       position === "out" ? "mt-[10px]" : "mt-0"
     }`}
      >
        <div className="flex w-full">
          <div className="flex h-[30px] justify-center items-center px-[7.5px] rounded-lg">
            <img
              className="w-[21px] h-[21px] min-w-[21px] rounded-full"
              src={token?.logo || "/empty/unknown.png"}
              alt={`${token?.name} logo`}
            />
            <SmallFont extraCss="ml-[7.5px]">{token?.symbol}</SmallFont>
          </div>
          {position === "out" ? null : (
            <button
              onClick={() => {
                if (!setSelectVisible) return;
                setSelectVisible(true);
              }}
            >
              <BiChevronDown className=" text-light-font-100 dark:text-dark-font-100 text-lg" />
            </button>
          )}
        </div>

        <div className="flex">
          <input
            className="text-sm text-light-font-100 dark:text-dark-font-100 my-auto text-end pr-[5px] bg-light-bg-secondary dark:bg-dark-bg-secondary h-full w-full"
            type="number"
            lang="en"
            ref={inputRef}
            onChange={(e) => {
              if (!setAmount) return;
              if (
                !Number.isNaN(parseFloat(e.target.value)) ||
                e.target.value === ""
              ) {
                setAmount(e.target.value);
              }
            }}
            value={
              (typeof window !== "undefined" &&
                inputRef?.current === document?.activeElement) ||
              amount === ""
                ? amount
                : (getRightPrecision(amount) as number)
            }
          />
        </div>
      </div>
    </>
  );
};
