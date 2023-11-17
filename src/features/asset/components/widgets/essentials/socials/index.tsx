import {ExternalLinkIcon} from "@chakra-ui/icons";
import {
  Box,
  Flex,
  Image,
  Table,
  TableContainer,
  Tbody,
  Tr,
} from "@chakra-ui/react";
import {useContext} from "react";
import {getFormattedAmount} from "../../../../../../../../utils/helpers/formaters";
import {TextLandingMedium, TextSmall} from "../../../../../../../UI/Text";
import {NextChakraLink} from "../../../../../../../common/components/links";
import {HoverLink} from "../../../../../../../common/ui/hover";
import {useColors} from "../../../../../../../common/utils/color-mode";
import {BaseAssetContext} from "../../../../context-manager";
import {Social} from "../../../../models";
import {Tds} from "../../../ui/td";

export const Socials = () => {
  const {baseAsset} = useContext(BaseAssetContext);
  const {borders, text40, text60, text80} = useColors();
  const socials: Social[] = [
    {
      title: "Twitter",
      logo: "/social/twitter.png",
      username: baseAsset?.twitter?.split("https://twitter.com/")[1],
      subtitle: "Followers",
      members: baseAsset?.assets_social?.twitter_members,
      engagement: null,
      url: baseAsset?.twitter,
    },
    {
      title: "Discord",
      logo: "/social/discord.png",
      username: baseAsset?.assets_social?.discord_name,
      subtitle: "Members",
      members: baseAsset?.assets_social?.discord_members,
      online: baseAsset?.assets_social?.discord_online_members,
      url: baseAsset?.discord,
    },
    {
      title: "Telegram",
      logo: "/social/telegram.png",
      subtitle: "Members",
      members: baseAsset?.assets_social?.telegram_members,
      online: baseAsset?.assets_social?.telegram_online_members,
      username: baseAsset?.chat?.split("https://t.me/")[1],
      url: baseAsset?.chat,
    },
  ];
  return (
    <Flex
      direction="column"
      mt={["30px", "30px", "50px"]}
      w={["95%", "95%", "100%", "100%"]}
      mx="auto"
    >
      <TextLandingMedium mb="10px">Socials</TextLandingMedium>
      {socials?.filter(entry => entry.url)?.length > 0 ? (
        <TableContainer>
          <Table variant="simple">
            {socials
              .filter(entry => entry.url)
              .map((entry, i) => {
                const isLast = i === 2;
                const linkChild = (
                  <NextChakraLink
                    color={text40}
                    target="_blank"
                    rel="noopener noreferrer"
                    href={entry.url}
                    key={entry.url}
                    isExternal
                  >
                    <Flex mr="20px">
                      <TextSmall
                        maxWidth="150px"
                        whiteSpace="nowrap"
                        overflowX="scroll"
                        className="scroll"
                        color={text60}
                      >
                        {entry.username ? `@${entry.username}` : "N/A"}
                        {entry.username ? (
                          <ExternalLinkIcon ml="5px" fontSize="13px" />
                        ) : null}
                      </TextSmall>
                    </Flex>
                  </NextChakraLink>
                );
                return (
                  <Tbody>
                    <Tr>
                      <Tds
                        py="15px"
                        px="15px"
                        borderBottom={isLast ? "none" : borders}
                      >
                        <Flex align="center">
                          <Image src={entry.logo} w="25px" mr="15px" />
                          <Box>
                            <TextSmall>{entry.title}</TextSmall>
                            {entry.url ? (
                              <NextChakraLink href={entry.url} color={text60}>
                                {linkChild}
                              </NextChakraLink>
                            ) : (
                              linkChild
                            )}
                          </Box>
                        </Flex>
                      </Tds>
                      <Tds
                        py="10px"
                        px="15px"
                        borderBottom={isLast ? "none" : borders}
                      >
                        {!entry.members ||
                        (entry.online && entry.online == null) ||
                        (entry.engagement && entry.engagement == null) ? (
                          "-"
                        ) : (
                          <Box>
                            <TextSmall>
                              {getFormattedAmount(entry.members)}
                            </TextSmall>
                            <TextSmall color={text40}>
                              {entry.subtitle}
                            </TextSmall>
                          </Box>
                        )}
                      </Tds>
                      <Tds
                        px="15px"
                        py="10px"
                        borderBottom={isLast ? "none" : borders}
                      >
                        <Flex
                          direction="column"
                          align="flex-end"
                          color={text80}
                        >
                          {!entry.members ||
                          (entry.online == null && !entry.engagement) ||
                          (!entry.online && entry.engagement == null) ? (
                            "-"
                          ) : (
                            <>
                              <Flex align="center">
                                <Box
                                  boxSize="6px"
                                  borderRadius="full"
                                  mr="5px"
                                  bg={entry.engagement ? "yellow" : "green"}
                                />
                                <TextSmall>
                                  {entry.engagement
                                    ? `${entry.engagement}%`
                                    : entry.online}
                                </TextSmall>
                              </Flex>

                              <TextSmall color={text40}>
                                {entry.engagement ? "Engagement" : "Online"}
                              </TextSmall>
                            </>
                          )}
                        </Flex>
                      </Tds>
                      {/* <Tds
               py="10px"
               px="15px"
               display={["none", "none", "table-cell", "table-cell"]}
               borderBottom={isLast ? "none" : borders}
             >
               <Flex justify="flex-end">
                 <TagPercentage
                   percentage={baseAsset?.price_change_24h}
                   isUp={baseAsset?.price_change_24h > 0}
                 />
               </Flex>
             </Tds>
             <Tds
               py="10px"
               px="15px"
               display={["none", "none", "table-cell", "table-cell"]}
               borderBottom={isLast ? "none" : borders}
             >
               <Flex justify="flex-end">
                 <Box w="135px">
                   <NextImageFallback
                     alt={`${baseAsset?.name} sparkline`}
                     width="100%"
                     height="45px"
                     src={
                       `${API_ENDPOINT}/spark?id=${baseAsset?.id}.svg` ||
                       "/404/sparkline.png"
                     }
                     fallbackSrc="/404/sparkline.png"
                     priority={i < 4}
                   />
                 </Box>
               </Flex>
             </Tds> */}
                    </Tr>
                  </Tbody>
                );
              })}
          </Table>
        </TableContainer>
      ) : (
        <Flex
          align="center"
          fontSize={["12px", "12px", "13px", "14px"]}
          fontWeight="400"
          color={text60}
        >
          No social link provided. Provide one <HoverLink>now</HoverLink>
          to improve Mobula!
        </Flex>
      )}
    </Flex>
  );
};
