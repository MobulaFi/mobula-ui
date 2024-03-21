import { Input } from "components/input";
import { useAnalytics } from "../../../context-manager";

export const ColorInput = ({ type }: { type: "up" | "down" }) => {
  const { selectedOption, setSelectedOption } = useAnalytics();
  const handleColorChange = (color: string, type: "up" | "down") => {
    if (selectedOption.type === "large-area") {
      setSelectedOption((prev) => ({
        ...prev,
        colors: { up: color, down: color },
      }));
    } else
      setSelectedOption((prev) => ({
        ...prev,
        colors: { ...prev.colors, [type]: color },
      }));
  };

  return (
    <div className="flex items-center mb-2.5">
      <div
        className="bg-light-bg-terciary w-[40px] dark:bg-dark-bg-terciary h-[35px] md:h-[30px] border
                           border-light-border-primary dark:border-dark-border-primary rounded-l p-1"
      >
        <div
          className="h-full w-full rounded"
          style={{
            backgroundColor: selectedOption.colors[type],
          }}
        />
      </div>
      <Input
        extraCss="w-full border-l-0 rounded-r rounded-l-none"
        placeholder={`Color ${type}`}
        value={selectedOption.colors[type]}
        onChange={(e) => handleColorChange(e.target.value, type)}
      />
    </div>
  );
};
