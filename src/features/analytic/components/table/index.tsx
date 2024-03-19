import { cn } from "lib/shadcn/lib/utils";
import { tdStyle, thStyle } from "../../style";

export const Table = () => {
  return (
    <div className="w-full overflow-x-scroll">
      <table className="w-full">
        <thead>
          <th className={cn(thStyle, "text-start")}>Company</th>
          <th className={cn(thStyle, "text-end")}>Contact</th>
          <th className={cn(thStyle, "text-end")}>Country</th>
        </thead>
        <tbody>
          <tr>
            <td className={cn(tdStyle, "text-start")}>Alfreds Futterkiste</td>
            <td className={cn(tdStyle, "text-end")}>Maria Anders</td>
            <td className={cn(tdStyle, "text-end")}>Germany</td>
          </tr>
          <tr>
            <td className={cn(tdStyle, "text-start")}>Alfreds Futterkiste</td>
            <td className={cn(tdStyle, "text-end")}>Maria Anders</td>
            <td className={cn(tdStyle, "text-end")}>Germany</td>
          </tr>
          <tr>
            <td className={cn(tdStyle, "text-start")}>Alfreds Futterkiste</td>
            <td className={cn(tdStyle, "text-end")}>Maria Anders</td>
            <td className={cn(tdStyle, "text-end")}>Germany</td>
          </tr>
          <tr>
            <td className={cn(tdStyle, "text-start")}>Alfreds Futterkiste</td>
            <td className={cn(tdStyle, "text-end")}>Maria Anders</td>
            <td className={cn(tdStyle, "text-end")}>Germany</td>
          </tr>
          <tr>
            <td className={cn(tdStyle, "text-start")}>Alfreds Futterkiste</td>
            <td className={cn(tdStyle, "text-end")}>Maria Anders</td>
            <td className={cn(tdStyle, "text-end")}>Germany</td>
          </tr>
          <tr>
            <td className={cn(tdStyle, "text-start")}>Alfreds Futterkiste</td>
            <td className={cn(tdStyle, "text-end")}>Maria Anders</td>
            <td className={cn(tdStyle, "text-end")}>Germany</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};
