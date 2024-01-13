import { NextChakraLink } from "components/link";
import { useRouter } from "next/navigation";
import { useContext } from "react";
import { Container } from "../../../../../components/container";
import { SmallFont } from "../../../../../components/fonts";
import { PopupUpdateContext } from "../../../../../contexts/popup";
import { tokens } from "../../constant";

export const TopConvertion = () => {
  const { setShowCard } = useContext(PopupUpdateContext);
  const router = useRouter();
  return (
    <div className="flex w-full border-t-2 border-light-border-primary dark:border-dark-border-primary mb-10">
      <Container extraCss="min-h-auto my-10">
        <p
          className="text-3xl md:text-lg font-normal text-center
         text-light-font-100 dark:text-dark-font-100 my-[50px] lg:my-[30px] md:my-5"
        >
          Top Cryptocurrency Conversions
        </p>
        {/* <div className="w-full flex items-center flex-wrap justify-between lg:w-[85%] lg:justify-center mx-auto">
          {fiats.map((fiat) => (
            <button
              className="h-10 md:h-[35px] w-[fit-content] px-2.5 rounded-lg flex items-center justify-center hover:bg-light-bg-terciary dark:hover:bg-dark-bg-terciary transition-all duration-200"
              onClick={() => setShowCard(fiat.name)}
            >
              <img
                className="mr-[7.5px] h-[24px] w-[24px] rounded-full"
                src={fiat.logo}
                alt={`${fiat.name} logo`}
              />
              <SmallFont>Buy with {fiat.name}</SmallFont>
            </button>
          ))}
        </div> */}
        {/* <div className="flex h-[1px] w-full bg-light-border-primary dark:bg-dark-border-primary my-5" /> */}
        <div className="flex w-full lg:w-[95%] flex-wrap justify-between mx-auto items-center lg:justify-center">
          {tokens.map((token) => (
            <button
              key={token?.logo}
              className="flex justify-center px-2.5 h-10 md:h-[35px] w-1/5 md:w-fit rounded-md items-center"
            >
              <NextChakraLink
                extraCss="w-full h-full flex items-center justify-center"
                href={`/swap/${token.name}`}
              >
                <img
                  src={token.logo}
                  className="mr-[7.5px] h-[24px] w-[24px] rounded-full"
                  alt={`${token.name} logo`}
                />
                <SmallFont>{`Buy ${token.name}`}</SmallFont>
              </NextChakraLink>
            </button>
          ))}
        </div>
      </Container>
    </div>
  );
};
