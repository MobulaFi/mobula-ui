import { ReactNode } from "react";
import { cn } from "../../../../../lib/shadcn/lib/utils";

interface ButtonOutlinedProps {
  children: ReactNode;
  extraCss?: string;
  [key: string]: any;
}

export const ButtonOutlined = ({
  children,
  extraCss,
  ...props
}: ButtonOutlinedProps) => {
  return (
    <button
      className={cn(
        "text-sm h-[35px] md:h-[30px] w-full flex items-center max-w-[110px] text-light-font-100 dark:text-dark-font-100 transition-all  duration-200 rounded-md bg-light-bg-terciary dark:bg-dark-bg-terciary border border-darkblue dark:border-darkblue hover:border-blue hover:dark:border-blue",
        extraCss
      )}
      {...props}
    >
      {children}
    </button>
  );
};
