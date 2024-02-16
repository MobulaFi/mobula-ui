import { useContext, useState } from "react";
import { AiOutlineClose } from "react-icons/ai";
import { BsCheckLg, BsTwitter } from "react-icons/bs";
import { FaArrowLeft } from "react-icons/fa6";
import { FiCheck, FiCopy, FiExternalLink } from "react-icons/fi";
import { Button } from "../../../../../components/button";
import {
  ExtraLargeFont,
  LargeFont,
  MediumFont,
  SmallFont,
} from "../../../../../components/fonts";
import { getUrlFromName } from "../../../../../utils/formaters";
import { ListingContext } from "../../context-manager";
import { buttonsOption } from "../../styles";

export const Submit = ({ state }) => {
  const [hasPaid, setHasPaid] = useState(false);
  const { actualPage, setActualPage, isLaunched, wallet, isListed } =
    useContext(ListingContext);
  const [isCopied, setIsCopied] = useState(false);

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000); // Reset icon after 2 seconds
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  return hasPaid ? (
    <div className="flex flex-col w-[450px] md:w-full">
      <ExtraLargeFont>Congratulations!</ExtraLargeFont>
      <div className="flex mt-5 border-b-2 border-light-border-primary dark:border-dark-border-primary pb-5 items-center">
        <img
          className="w-7 h-7 md:w-[22px] md:h-[22px] rounded-full border border-light-border-primary dark:border-dark-border-primary"
          src={state.image.logo}
          alt={`${state.name} logo`}
        />
        <MediumFont extraCss="ml-2.5">
          <span className="font-bold">{state.name}</span> has been sent to be
          reviewed by the protocol DAO
        </MediumFont>
      </div>
      <div className="flex mt-5 border-b-2 border-light-border-primary dark:border-dark-border-primary pb-5 flex-col">
        <MediumFont extraCss="ml-2.5">
          ⚡️ Wanna boost <span className="font-bold">{state.name}</span> ?
        </MediumFont>
        <SmallFont extraCss="mt-2.5 text-light-font-60 dark:text-dark-font-60">
          Get exclusive access to Mobula Bot, our APIs, win-win deals etc.
        </SmallFont>
        <Button
          extraCss="border-darkblue dark:border-darkblue hover:border-blue hover:dark:border-blue mt-5 md:mt-2.5 w-fit"
          onClick={() => {
            window.open("https://t.me/MobulaPartnerBot?start=Token", "_blank");
            window.focus();
          }}
        >
          Get in-touch
          <FiExternalLink className="text-light-font-40 dark:text-dark-font-40 mb-[1px] ml-[5px]" />
        </Button>
      </div>
      <Button
        extraCss="mt-5 md:mt-2.5 w-fit"
        onClick={() => {
          window.open(
            `https://mobula.fi/dao/protocol/sort/${getUrlFromName(state.name)}`,
            "_blank"
          );
          window.focus();
        }}
      >
        Follow the listing process (takes 2 minutes to complete)
        <FiExternalLink className="text-light-font-40 dark:text-dark-font-40 mb-[1px] ml-[5px]" />
      </Button>
    </div>
  ) : (
    <div className="flex flex-col max-w-[800px] w-full">
      <div className="flex items-center">
        <button
          className="hidden md:flex"
          onClick={() => {
            if (isLaunched || state.type === "nft") setActualPage(2);
            else setActualPage(actualPage - 1);
          }}
        >
          <FaArrowLeft className="text-light-font-100 dark:text-dark-font-100 mr-[5px]" />
        </button>
        <ExtraLargeFont>Submit</ExtraLargeFont>
      </div>
      <div className="flex w-full flex-col">
        <div className="flex items-end flex-wrap mt-5 lg:mt-[15px]">
          <LargeFont>How fast do you want to be listed? </LargeFont>
        </div>
        {/* DO NOT DELETE */}
        {/* <Flex
            border="1px solid var(--chakra-colors-blue)"
            borderRadius="full"
            h={["30px", "30px", "36px", "43px"]}
            px={["10px", "10px", "15px", "20px"]}
            mt="15px"
            align="center"
            justify="space-between"
          >
            <TextLandingSmall color={text80} mr="5px">
              You&apos;ll be ranked #234
            </TextLandingSmall>
            <NextChakraLink href="leaderboard" isExternal>
              <Flex align="center">
                <Icon as={BsArrowRight} color="blue" />
                <TextLandingSmall color="blue" ml="5px" fontWeight="400">
                  See the listing leaderboard
                </TextLandingSmall>
              </Flex>
            </NextChakraLink>
          </Flex> */}
        {/* SLIDER TO REPLACE */}
        {/* <div className="mt-[50px] md:mt-[40px] relative">
            <Slider
              aria-label="slider-ex-6"
              onChange={(val) => setFastTrack(val)}
              value={fastTrack}
              min={30}
              max={1000}
            >
              <SliderMark value={30} {...labelStyles}>
                <p
                // fontSize="14px" ml="20px" color={"text80"} fontWeight="400"
                >
                  Standard
                </p>
              </SliderMark>
              <SliderMark value={300} {...labelStyles}>
                <p
                // fontSize="14px" ml="15px" color={"text80"} fontWeight="400"
                >
                  Fast
                </p>
              </SliderMark>
              <SliderMark value={1000} {...labelStyles}>
                <p
                // fontSize="14px"
                // color={"text80"}
                // ml="-80px"
                // whiteSpace="nowrap"
                // fontWeight="400"
                >
                  🔥 Blazing Fast
                </p>
              </SliderMark>
              <Flex
                // max={1000}
                sx={markOption}
                transform="translateY(-50%)"
                top="50%"
                left="10px"
                color={text80}
              />
              <Flex
                sx={markOption}
                transform="translateY(-50%) translateX(50%)"
                top="50%"
                color={text80}
                left="27%"
              />
              <Flex
                sx={markOption}
                transform="translateY(-50%)"
                top="50%"
                color={text80}
                right="10px"
              />
              <SliderTrack bg={text10}>
                <SliderFilledTrack bg={isDarkMode ? "borders.blue" : "blue"} />
              </SliderTrack>
              <SliderThumb bg={isDarkMode ? "blue" : "borders.blue"}>
                <Box
                  bg={isDarkMode ? "borders.blue" : "blue"}
                  h="95%"
                  w="95%"
                  borderRadius="full"
                />
              </SliderThumb>
            </Slider>
          </div> */}
        <div className="flex flex-col w-full">
          <div className="flex justify-between mt-5">
            <div className="border border-light-border-primary dark:border-dark-border-primary rounded-md p-4 w-2/4 mr-3">
              <MediumFont>Standard Listing</MediumFont>
              <SmallFont extraCss="text-center mt-2">
                <div className="flex items-center mb-[5px]">
                  <SmallFont>🚀 Express Listing Request</SmallFont>
                  <AiOutlineClose className="text-red dark:text-red ml-[7.5px]" />
                </div>
                <div className="flex items-center">
                  <BsTwitter className="ml-[3px] mr-[9px] text-twitter dark:text-twitter" />
                  <SmallFont>An exclusive Tweet from @MobulaFI</SmallFont>
                  <AiOutlineClose className="text-red dark:text-red ml-[7.5px]" />
                </div>
              </SmallFont>
              <SmallFont extraCss="mt-4">
                Price: $50 (stablecoin only)
              </SmallFont>
            </div>
            <div className="border border-light-border-primary dark:border-dark-border-primary rounded-md p-4 w-2/4 ml-3">
              <MediumFont>Express Listing</MediumFont>
              <SmallFont extraCss="text-center mt-2">
                <div className="flex items-center mb-[5px]">
                  <SmallFont>🚀 Express Listing Request</SmallFont>
                  <BsCheckLg className="text-blue dark:text-blue ml-[7.5px]" />
                </div>
                <div className="flex items-center">
                  <BsTwitter className="ml-[3px] mr-[9px] text-twitter dark:text-twitter" />
                  <SmallFont>An exclusive Tweet from @MobulaFI</SmallFont>
                  <BsCheckLg className="text-blue dark:text-blue ml-[7.5px]" />
                </div>
              </SmallFont>
              <SmallFont extraCss="mt-4">
                Price: $150 (stablecoin only)
              </SmallFont>
            </div>
          </div>
          <div className="flex flex-col w-full">
            <div className="relative flex items-center justify-center my-2">
              <div className="flex-grow border-t border-gray-300 opacity-50"></div>
              <span className="relative bg-dark-background px-2 text-sm text-gray-500">
                OR
              </span>
              <div className="flex-grow border-t border-gray-300 opacity-50"></div>
            </div>
          </div>
          <div className="border border-light-border-primary dark:border-dark-border-primary rounded-md p-4">
            <MediumFont>Free Listing Offer</MediumFont>
            <SmallFont extraCss="text-center mt-2">
              <div className="flex items-center mb-[5px]">
                <SmallFont>List for free by using our Lambo Buy Bot.</SmallFont>
              </div>
            </SmallFont>
            <Button
              extraCss="border-darkblue dark:border-darkblue hover:border-blue hover:dark:border-blue mt-5 md:mt-2.5 w-fit"
              onClick={() => {
                window.open(
                  "https://t.me/MobulaPartnerBot?start=Free_Listing",
                  "_blank"
                );
                window.focus();
              }}
            >
              Contact us
              <FiExternalLink className="text-light-font-40 dark:text-dark-font-40 mb-[1px] ml-[5px]" />
            </Button>
          </div>
          <SmallFont extraCss="mt-6">
            Send $50 for Standard Listing or $150 for Express Listing to the
            following Ethereum address:
            <div className="flex mt-1 md:ml-0">
              (Supported chains: Polygon, BSC, Ethereum)
            </div>
            <div className="font-bold mt-5 flex items-center">
              {wallet}
              <button
                onClick={() => copyToClipboard(`${wallet}`)}
                className="ml-2 flex items-center"
              >
                {isCopied ? <FiCheck size="1em" /> : <FiCopy size="1em" />}
              </button>
            </div>
          </SmallFont>
        </div>
        <div className="flex flex-row md:flex-col my-5 flex-wrap">
          <div className="flex mt-2.5 md:ml-0">
            <Button
              extraCss={`${buttonsOption} flex justify-center items-center border-darkblue dark:border-darkblue hover:border-blue hover:dark:border-blue`}
            >
              {isListed ? "Successfully Listed" : "Waiting..."}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
