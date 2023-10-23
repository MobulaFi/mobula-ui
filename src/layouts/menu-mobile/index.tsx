import { TextSmall } from "@/components/fonts";
import { useColors } from "@/lib/chakra/colorMode";
import { Flex, Icon, useColorMode } from "@chakra-ui/react";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FiHome } from "react-icons/fi";
import { SlWallet } from "react-icons/sl";
import { VscArrowSwap } from "react-icons/vsc";

export const MenuFixedMobile = () => {
  const { boxBg3, borders, text100, text60 } = useColors();
  const { colorMode } = useColorMode();
  const router = useRouter();
  const [lastScroll, setLastScroll] = useState(0);
  const [visible, setVisible] = useState(true);
  const { portfolioUrl } = useUrl();
  const pathname = usePathname();
  const [isHover, setIsHover] = useState({
    home: pathname === "/",
    swap: pathname === "/swap",
    portfolio: pathname === "/portfolio",
  });
  const isLightMode = colorMode === "light";

  const handleHoverIn = (key: string) => {
    setIsHover((prev) => ({ ...prev, [key]: true }));
  };

  const handleHoverOut = (key: string) => {
    if (pathname === `/${key}` || (key === "home" && pathname === "/")) return;
    setIsHover((prev) => ({ ...prev, [key]: false }));
  };

  useEffect(() => {
    const handleScroll = () => {
      const scrollCourant =
        window.pageYOffset || document.documentElement.scrollTop;

      if (scrollCourant >= lastScroll && scrollCourant > 0) setVisible(false);
      else setVisible(true);

      setLastScroll(scrollCourant);
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [lastScroll]);

  return (
    <Flex
      w="100%"
      h="75px"
      align="center"
      position="fixed"
      bottom={visible ? "0px" : "-80px"}
      transition="all 300ms ease-in-out"
      display={["flex", "flex", "none"]}
      bg={boxBg3}
      borderTop={borders}
      direction="column"
      pb="10px"
      zIndex={10}
      boxShadow={
        isLightMode
          ? "1px 2px 13px 3px rgba(0,0,0,0.05)"
          : "1px 2px 13px 3px rgba(255,255,255,0.05)"
      }
    >
      <Flex w="100%" h="100%" maxW="340px" mx="auto">
        <Flex w="33%" h="100%" align="center" justify="center">
          <NextChakraLink
            href="/"
            _hover={{ color: text100 }}
            onMouseEnter={() => handleHoverIn("home")}
            onMouseLeave={() => handleHoverOut("home")}
            onClick={() =>
              setIsHover({ swap: false, portfolio: false, home: true })
            }
          >
            <Flex direction="column" align="center" justify="center">
              <Icon
                as={FiHome}
                mb="5px"
                fontSize="18px"
                color={isHover.home ? text100 : text60}
                transition="all 200ms ease-in-out"
              />
              <TextSmall
                color={isHover.home ? text100 : text60}
                transition="all 200ms ease-in-out"
              >
                Home
              </TextSmall>
            </Flex>
          </NextChakraLink>
        </Flex>
        <Flex w="33%" h="100%" align="center" justify="center">
          <NextChakraLink
            href="/swap"
            onMouseEnter={() => handleHoverIn("swap")}
            onMouseLeave={() => handleHoverOut("swap")}
            onClick={() =>
              setIsHover({ swap: true, portfolio: false, home: false })
            }
          >
            <Flex direction="column" align="center" justify="center">
              <Icon
                color={isHover.swap ? text100 : text60}
                as={VscArrowSwap}
                mb="5px"
                fontSize="18px"
                transition="all 200ms ease-in-out"
              />
              <TextSmall
                color={isHover.swap ? text100 : text60}
                transition="all 200ms ease-in-out"
              >
                Swap
              </TextSmall>
            </Flex>
          </NextChakraLink>
        </Flex>
        <Flex w="33%" h="100%" align="center" justify="center">
          <NextChakraLink
            href={portfolioUrl}
            onMouseEnter={() => handleHoverIn("portfolio")}
            onMouseLeave={() => handleHoverOut("portfolio")}
            onClick={() =>
              setIsHover({ swap: false, portfolio: true, home: false })
            }
          >
            <Flex direction="column" align="center" justify="center">
              <Icon
                as={SlWallet}
                mb="5px"
                fontSize="18px"
                color={isHover.portfolio ? text100 : text60}
                transition="all 200ms ease-in-out"
              />
              <TextSmall
                color={isHover.portfolio ? text100 : text60}
                transition="all 200ms ease-in-out"
              >
                Portfolio
              </TextSmall>
            </Flex>
          </NextChakraLink>
        </Flex>
      </Flex>
    </Flex>
  );
};
