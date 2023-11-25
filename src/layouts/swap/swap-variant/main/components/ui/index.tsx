import { ReactNode } from "react";
import { cn } from "../../../../../../lib/shadcn/lib/utils";

interface ContainerInOutProps {
  children: ReactNode;
  extraCss?: string;
  [key: string]: any;
}

export const ContainerInOut = ({
  children,
  extraCss,
  ...props
}: ContainerInOutProps) => {
  return (
    <div
      className={cn(
        "flex flex-col bg-light-bg-terciary dark:bg-dark-bg-terciary relative rounded-xl border border-light-border-primary dark:border-dark-border-primary h-[80px] w-full p-[15px] justify-between items-end",
        extraCss
      )}
      {...props}
    >
      {children}
    </div>
  );
};
