import {CheckIcon, CopyIcon, ExternalLinkIcon} from "@chakra-ui/icons";
import {Flex, Image, Text} from "@chakra-ui/react";
import {useState} from "react";
import {NextChakraLink} from "../../../../../../../common/components/links";
import {useColors} from "../../../../../../../common/utils/color-mode";
import {SocialSort, TokenDivs} from "../../../../models";

export const CommunityPopup = ({token}: {token: Partial<TokenDivs>}) => {
  const [hasCopied, setHasCopied] = useState<string[]>([]);
  const {text80, borders, text100, boxBg6, text40, hover} = useColors();
  const socials: SocialSort[] = [
    {
      logo: "/social/discord.png",
      url: token?.links?.discord,
      alt: "Discord",
    },
    {
      logo: "/social/twitter.png",
      url: token?.links?.twitter,
      alt: "Twitter",
    },
    {
      logo: "/social/telegram.png",
      url: token?.links?.telegram,
      alt: "Telegram",
    },
  ];

  return (
    <Flex
      w="100%"
      direction="column"
      h="auto"
      zIndex="2"
      maxW="auto"
      cursor="default"
      fontSize="12px"
    >
      {socials
        .filter(entry => entry.url)
        .map((entry, i) => (
          <Flex
            align="center"
            position="relative"
            justify="space-between"
            borderRadius="8px"
            border={borders}
            bg={boxBg6}
            px="10px"
            _hover={{bg: hover}}
            transition="all 250ms ease-in-out"
            h="30px"
            w="100%"
            mb={
              i !== socials.filter(social => social.url).length - 1
                ? "10px"
                : "0px"
            }
          >
            <Flex align="center">
              <Image
                src={entry.logo}
                w="17px"
                alt={`${entry.alt} logo`}
                mr="10px"
              />
              <Text fontSize="12px" mr="10px" color={text80} w="100%">
                {entry.url}
              </Text>
            </Flex>
            <Flex align="center">
              {hasCopied.includes(entry.alt) ? (
                <CheckIcon ml="10px" color="green" />
              ) : (
                <CopyIcon
                  cursor="pointer"
                  color={text80}
                  onClick={() => {
                    if (entry.url) {
                      navigator.clipboard.writeText(entry.url);
                      setHasCopied(prev => [...prev, entry.alt]);
                      setTimeout(() => {
                        setHasCopied(
                          hasCopied.filter(copy => copy !== entry.alt),
                        );
                      }, 3000);
                    }
                  }}
                />
              )}
              <NextChakraLink
                href={entry?.url}
                target="_blank"
                rel="norefferer"
                cursor="pointer"
                _hover={{color: text100}}
                isExternal
              >
                <ExternalLinkIcon ml="10px" fontSize="14px" color={text40} />
              </NextChakraLink>
            </Flex>
          </Flex>
        ))}
    </Flex>
  );
};
