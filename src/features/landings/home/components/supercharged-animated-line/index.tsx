export const SuperchargedAnimatedLine = ({ content }) => {
  return (
    <div
      key={content.evmChainId}
      className="flex justify-center items-center p-2.5 rounded-xl shadow-xl m-2.5 md:m-1 
                   border border-light-border-primary dark:border-dark-border-primary shadow-4xl "
      style={{
        background:
          "radial-gradient(at right top, rgba(11, 32, 64, 0.4), rgba(19, 22, 39, 0.4))",
      }}
    >
      <img
        className="h-[45px] w-[45px] rounded-full opacity-80 shadow-2xl min-w-[45px]
                           min-h-[45px] md:w-[30px] md:h-[30px] md:min-w-[30px] md:min-h-[30px]"
        src={content?.logo}
      />
    </div>
  );
};
