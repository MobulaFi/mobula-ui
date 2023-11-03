interface TableProps {
  children: any;
  bg?: any;
  [key: string]: any;
}

export const Ths = ({ children, bg, ...props }: TableProps) => {
  return (
    <th
      className={`border-b border-light-border-primary dark:border-dark-border-primary md:text-xs text-sm font-medium text-light-font-100 dark:text-dark-font-100 py-5 md:py-2.5 ${
        bg ? "bg-[bg]" : "bg-transparent"
      } `}
      {...props}
    >
      {children}
    </th>
  );
};

export const Tds = ({ children, bg, ...props }: TableProps) => {
  return (
    <td
      className={`border-b border-light-border-primary dark:border-dark-border-primary md:text-xs text-sm font-medium text-light-font-100 dark:text-dark-font-100 py-5 md:py-2.5 ${
        bg ? "bg-[bg]" : "bg-transparent"
      } `}
      {...props}
    >
      {children}
    </td>
  );
};
