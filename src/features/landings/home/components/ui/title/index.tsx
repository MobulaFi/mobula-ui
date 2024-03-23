import { cn } from "../../../../../../lib/shadcn/lib/utils";

type TitleProps = { title: string; extraCss?: string };

export const Title = ({ title, extraCss }: TitleProps) => {
  return (
    <div className={cn(`h-fit w-fit overflow-hidden mx-auto`, extraCss)}>
      <h2
        id="text"
        style={{
          WebkitTextFillColor: "transparent",
        }}
        className={`text-[72px] md:text-[56px] md:leading-[70px] leading-[90px] font-bold font-poppins w-fit mx-auto text-transparent 
          text-fill-color tracking-tighter bg-gradient-to-br from-[rgba(0,0,0,1)]
          to-[rgba(0,0,0,0.40)] dark:from-[rgba(255,255,255,1)]
           dark:to-[rgba(255,255,255,0.40)] dark:text-transparent bg-clip-text md:text-center`}
      >
        {title}
      </h2>
    </div>
  );
};
