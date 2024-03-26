import { useTheme } from "next-themes";
import { BsCheck } from "react-icons/bs";
import { SmallFont } from "../../../../../components/fonts";
import { Input } from "../../../../../components/input";
import { getPercentages } from "../../../constants";
import { useAnalytics } from "../../../context-manager";
import { ColorInput } from "../../ui/color-input";

export const ViewOptions = () => {
  const { selectedQuery, setSelectedQuery } = useAnalytics();
  const { resolvedTheme } = useTheme();

  const handleChange = (name: string, value: string) => {
    setSelectedQuery((prev) => ({
      ...prev,
      infos: { ...prev.infos, [name]: value },
    }));
  };

  const renderContent = () => {
    if (selectedQuery.type === "title")
      return (
        <>
          <div className="flex flex-col w-full">
            <SmallFont extraCss="mb-2  font-medium">Title</SmallFont>
            <Input
              extraCss="w-full"
              placeholder={selectedQuery.infos.title}
              name="title"
              onChange={(e) => handleChange(e.target.name, e.target.value)}
            />
          </div>
          <div className="flex flex-col w-full mt-5">
            <SmallFont extraCss="mb-2 font-medium">Description</SmallFont>
            <textarea
              className="w-full text-sm rounded-md text-light-font-100 dark:text-dark-font-100 bg-light-bg-terciary 
              dark:bg-dark-bg-terciary h-[105px] md:h-[100px] px-2 flex items-center"
              style={{
                border:
                  resolvedTheme === "dark"
                    ? "1px solid rgba(255,255,255,0.03)"
                    : "1px solid rgba(0,0,0,0.03)",
              }}
              placeholder={selectedQuery.infos.description}
              name="description"
              onChange={(e) => handleChange(e.target.name, e.target.value)}
            />
          </div>
        </>
      );
    if (selectedQuery.type === "line")
      return (
        <>
          <div className="flex flex-col w-[45%] mr-2.5">
            <SmallFont extraCss="mb-2 font-medium">Color Up</SmallFont>
            <ColorInput type="up" />
          </div>
          <div className="flex flex-col w-[45%] mr-2.5">
            <SmallFont extraCss="mb-2 font-medium">Color Down</SmallFont>
            <ColorInput type="down" />
          </div>
        </>
      );
    if (selectedQuery.type === "bar" || selectedQuery.type === "large-area")
      return (
        <>
          <div className="flex flex-col w-[45%] mr-2.5">
            <SmallFont extraCss="mb-2 font-medium">Color </SmallFont>
            <ColorInput type="up" />
          </div>
        </>
      );
    if (selectedQuery.type === "value") {
      return (
        <>
          <div className="flex flex-col w-[45%] mr-2.5 mb-2.5">
            <SmallFont extraCss="mb-2 font-medium">Amount</SmallFont>
            <Input
              extraCss="w-full"
              type="number"
              placeholder={selectedQuery.infos.amount}
              onChange={(e) => {
                setSelectedQuery((prev) => ({
                  ...prev,
                  infos: { ...prev.infos, amount: e.target.value },
                }));
              }}
            />
          </div>
          <div className="flex flex-col w-[45%] mr-2.5 mb-2.5">
            <SmallFont extraCss="mb-2 font-medium">Text</SmallFont>
            <Input
              extraCss="w-full"
              placeholder={selectedQuery.infos.text}
              onChange={(e) => {
                setSelectedQuery((prev) => ({
                  ...prev,
                  infos: { ...prev.infos, text: e.target.value },
                }));
              }}
            />
          </div>
          <div className="flex flex-col w-[45%] mr-2.5 mb-2.5">
            <SmallFont extraCss="mb-2 font-medium">Symbol</SmallFont>
            <Input
              extraCss="w-full"
              placeholder={selectedQuery.infos.symbol}
              onChange={(e) => {
                setSelectedQuery((prev) => ({
                  ...prev,
                  infos: { ...prev.infos, symbol: e.target.value },
                }));
              }}
            />
          </div>
          <div className="flex flex-col w-[45%] mr-2.5 mb-2.5">
            <SmallFont extraCss="mb-2 font-medium">Subtitle</SmallFont>
            <Input
              extraCss="w-full"
              placeholder={selectedQuery.infos.subtitle}
              name="subtitle"
              onChange={(e) => handleChange(e.target.name, e.target.value)}
            />
          </div>
        </>
      );
    }
    return <></>;
  };
  const content = renderContent();
  const percentages = getPercentages(selectedQuery.width);

  console.log(selectedQuery);

  return (
    <div className="flex items-center flex-wrap">
      {content}

      <div className="flex flex-col w-[45%] mr-2.5 mb-2.5">
        <SmallFont extraCss="mb-2">Title</SmallFont>
        <Input
          extraCss="w-full border-l-0 rounded-r rounded-l-none"
          placeholder="Chart Title"
          name="title"
          value={selectedQuery.infos.title}
          onChange={(e) => handleChange(e.target.name, e.target.value)}
        />
      </div>
      <div className="flex flex-col w-[45%] mr-2.5 mb-2.5">
        <SmallFont extraCss="mb-2">Width</SmallFont>
        <div className="flex items-center justify-between w-full flex-wrap">
          {percentages.map((percent) => (
            <button
              className="flex items-center"
              onClick={() => {
                setSelectedQuery((prev) => ({
                  ...prev,
                  width: percent.value,
                }));
              }}
            >
              <div className="w-4 h-4 rounded bg-light-bg-hover dark:bg-dark-bg-hover mr-2 flex items-center justify-center">
                {percent.selected && (
                  <BsCheck className="text-light-font-100 dark:text-dark-font-100 text-base" />
                )}
              </div>
              <SmallFont>{`${percent.value}%`}</SmallFont>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
