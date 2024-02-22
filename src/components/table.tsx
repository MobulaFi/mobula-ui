import { cn } from "../lib/shadcn/lib/utils";

interface TableProps {
  children: any;
  bg?: any;
  extraCss?: string;
  [key: string]: any;
}

export const Ths = ({ children, bg, extraCss, ...props }: TableProps) => {
  return (
    <th
      className={cn(
        `border-b border-light-border-primary dark:border-dark-border-primary md:text-xs text-sm font-medium text-light-font-100 dark:text-dark-font-100 py-5 md:py-2.5 ${
          bg ? "bg-[bg]" : "bg-transparent"
        } `,
        extraCss
      )}
      {...props}
    >
      {children}
    </th>
  );
};

export const Tds = ({ children, bg, extraCss }: TableProps) => {
  return (
    <td
      className={cn(
        `border-b border-light-border-primary dark:border-dark-border-primary md:text-xs text-sm font-medium text-light-font-100 dark:text-dark-font-100 py-5 md:py-2.5 ${
          bg ? "bg-[bg]" : "bg-transparent"
        } `,
        extraCss
      )}
    >
      {children}
    </td>
  );
};
