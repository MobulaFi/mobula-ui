import { cn } from "lib/shadcn/lib/utils";
import { SmallFont } from "../../../components/fonts";
import { containerStyle } from "../styles";
import { ContainerScroll } from "./ui/container-scroll";

export const PortfolioLanding = () => {
  return (
    <>
      <section
        className="w-full flex justify-center items-center flex-col bg-no-repeat bg-contain md:bg-cover bg-center relative snap-center h-screen md:h-screenMain md:pb-[50px] md:py-[100px]"
        style={{
          backgroundImage: `url('/landing/main-background.svg'), radial-gradient(at right bottom, rgba(11, 32, 64, 1.0), #131627 80%, #131627)`,
        }}
      >
        <ContainerScroll titleComponent={"Discover Portfolio"} />
        <div
          className={cn(
            containerStyle,
            "justify-center flex-col items-center pb-20"
          )}
        >
          <SmallFont extraCss="text-lg font-poppins text-center max-w-[80%]">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Pariatur,
            expedita repellendus saepe consequuntur omnis ullam suscipit odit
            aliquam dolor maiores deserunt commodi rerum vero placeat provident
            quia architecto laboriosam illo.
          </SmallFont>
        </div>
      </section>
    </>
  );
};
