type TitleProps = { title: string };

export const Title = ({ title }: TitleProps) => {
  return (
    <div className="h-fit w-fit overflow-hidden mx-auto">
      <h2
        id="text"
        style={{
          WebkitTextFillColor: "transparent",
        }}
        className="text-[72px] md:text-[56px] md:leading-[56px] font-bold font-poppins w-fit mx-auto text-transparent 
          text-fill-color tracking-[-0.08em] bg-gradient-to-br from-[rgba(0,0,0,1)]
          to-[rgba(0,0,0,0.40)] dark:from-[rgba(255,255,255,1)]
           dark:to-[rgba(255,255,255,0.40)] dark:text-transparent bg-clip-text md:text-start"
      >
        {title}
      </h2>
    </div>
  );
};
