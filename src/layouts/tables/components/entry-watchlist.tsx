"use client";
import { Icon } from "@chakra-ui/icons";
import {
  Avatar,
  AvatarGroup,
  Box,
  Button,
  Flex,
  Image,
  Skeleton,
  Tbody,
  Td,
  Tr,
} from "@chakra-ui/react";
import { usePathname, useRouter } from "next/navigation";
import React, { useContext, useEffect } from "react";
import { AiFillStar, AiOutlineStar } from "react-icons/ai";
import { useAccount } from "wagmi";
import { AddressAvatar } from "../../../components/avatar";
import { TextSmall } from "../../../components/fonts";
import { WatchlistContext } from "../../../contexts/pages/watchlist";
import { UserContext } from "../../../contexts/user";
import { useColors } from "../../../lib/chakra/colorMode";
import { pushData } from "../../../lib/mixpanel";
import { GET } from "../../../utils/fetch";
import {
  addressSlicer,
  formatAmount,
  getTokenPercentage,
  getUrlFromName,
} from "../../../utils/formaters";

export const EntryWatchlist = ({
  watchlist,
  tokens,
  usersOwner,
  isLoading,
  i,
}) => {
  const [isHover, setIsHover] = React.useState(false);
  const { boxBg3, text80, boxBg6, boxBg1, hover, borders } = useColors();
  const { user, setUser } = useContext(UserContext);
  const { setIsPageUserWatchlist, watchlists, setWatchlists } =
    useContext(WatchlistContext);
  const { address } = useAccount();
  const router = useRouter();
  const pathname = usePathname();

  const userOfWatchlist = usersOwner.find(
    (newUser) => newUser.id === watchlist.user_id
  );
  const assetsOfWatchlist = tokens.filter((token) =>
    watchlist?.assets?.map((asset) => asset.id).includes(token.id)
  );

  const handleFollowWatchlist = (isAddTo) => {
    if (address && isAddTo && user && watchlist?.user_id !== user?.id) {
      GET("/watchlist/follow", {
        id: watchlist.id,
        account: user.address,
      })
        .then((r) => r.json())
        .then((r) => {
          // if (r.error) alert.error(r.error);
          // else {
          pushData("Watchlist Followed", {
            watchlist_owner_id: watchlist.user_id,
            watchlist_id: watchlist.id,
          });
          // alert.success("Successfully followed this watchlist.");
          setUser((userBuffer) => {
            if (!userBuffer) return null;
            return {
              ...userBuffer,
              watchlists_followed: [
                ...userBuffer.watchlists_followed,
                watchlist.id,
              ],
            };
          });
          // }
        });
    } else if (address && !isAddTo && watchlist?.user_id !== user?.id)
      GET("/watchlist/unfollow", {
        id: watchlist.id,
        account: user ? user.address : "",
      })
        .then((r) => r.json())
        .then((r) => {
          // if (r.error) alert.error(r.error);
          // else {
          pushData("Watchlist Unfollowed", {
            watchlist_id: watchlist.id,
          });
          // alert.success("Successfully unfollowed this watchlist.");
          setWatchlists(
            watchlists?.filter((entry) => entry.watchlist_id !== watchlist.id)
          );
          setUser((userBuffer) => {
            if (!userBuffer) return null;
            return {
              ...userBuffer,
              watchlists_followed: userBuffer.watchlists_followed.filter(
                (entry) => entry !== watchlist.id
              ),
            };
          });
          // }
        });
    // else if (watchlist?.user_id === user?.id)
    //   alert.error("You can't follow your own watchlist");
  };

  useEffect(() => {
    setIsPageUserWatchlist(false);
  }, []);

  const marketCap = assetsOfWatchlist[i]?.reduce(
    (acc, token) => acc + (token ? Number(token.market_cap) : 0),
    0
  );
  const percentage = assetsOfWatchlist[i]?.reduce(
    (acc, token) => acc + (token ? token.price_change_24h : 0),
    0
  );
  const percentageAvr =
    percentage / (assetsOfWatchlist[i] ? assetsOfWatchlist[i].length : 0);
  const sumScores = (assets, scoreType) =>
    assets
      ?.filter((entry) => entry[scoreType] > 0)
      .reduce((acc, token) => acc + token[scoreType], 0);

  const countNonZeroScores = (assets, scoreType) =>
    assetsOfWatchlist[i]?.filter((entry) => entry[scoreType] > 0).length;

  const calculateAverageScore = (assets, scoreType) =>
    sumScores(assetsOfWatchlist[i], scoreType) /
    countNonZeroScores(tokens, scoreType);

  const getAverageScore = () => {
    const averageScoreTrust = calculateAverageScore(tokens, "trust_score");
    const averageScoreSocial = calculateAverageScore(tokens, "social_score");
    const averageScoreUtility = calculateAverageScore(tokens, "utility_score");
    const average =
      (averageScoreTrust + averageScoreSocial + averageScoreUtility) / 3;
    if (Number.isNaN(Math.round(average))) return "--";
    return Math.round(average);
  };

  const getColorFromAverageScore = () => {
    if (Number(getAverageScore()) > 2 && Number(getAverageScore()) < 4)
      return "yellow";
    if (Number(getAverageScore()) <= 2) return "red";
    if (Number(getAverageScore()) >= 4) return "green";
    return text80;
  };

  return (
    <Tbody
      onMouseEnter={() => setIsHover(true)}
      onMouseLeave={() => setIsHover(false)}
      fontFamily="Inter"
      fontSize="14px"
      borderBottom="none"
      bg={[isHover ? boxBg3 : "none"]}
      h="57px"
    >
      <Tr color={text80}>
        <Td borderBottom={borders} py={["5px", "5px", "5px", "5px", "25px"]}>
          <Flex align="center" justify="center">
            {watchlist && !isLoading ? (
              <Button
                onClick={() =>
                  handleFollowWatchlist(
                    !user?.watchlists_followed.includes(watchlist.id)
                  )
                }
              >
                {user?.watchlists_followed?.includes(watchlist.id) ||
                pathname.includes("followed") ? (
                  <Icon
                    fontSize="20px"
                    mx="auto"
                    color="yellow"
                    as={AiFillStar}
                  />
                ) : (
                  <Icon
                    fontSize="20px"
                    _hover={{ color: "yellow" }}
                    transition="all 0.25s ease-in-out"
                    mx="auto"
                    color={text80}
                    as={AiOutlineStar}
                  />
                )}
              </Button>
            ) : (
              <Skeleton
                borderRadius="full"
                boxSize="20px"
                minW="20px"
                startColor={boxBg6}
                endColor={hover}
              />
            )}
          </Flex>
        </Td>
        <Td
          borderBottom={borders}
          py={["5px", "5px", "5px", "5px", "25px"]}
          left="0px"
          onClick={() => {
            router.push(
              `/watchlist/${userOfWatchlist?.address}/${getUrlFromName(
                watchlist?.name
              )}`
            );
            setIsPageUserWatchlist(true);
          }}
          _hover={{
            cursor: "pointer",
            color: "none",
          }}
        >
          {watchlist && !isLoading ? (
            <TextSmall>{watchlist.name}</TextSmall>
          ) : (
            <Skeleton
              borderRadius="4px"
              h={["14px", "14px", "15px", "16px"]}
              w="100px"
              startColor={boxBg6}
              endColor={hover}
            />
          )}
        </Td>
        <Td
          borderBottom={borders}
          py={["5px", "5px", "5px", "5px", "25px"]}
          my="0px"
          onClick={() => {
            router.push(
              `/watchlist/${userOfWatchlist?.address}/${getUrlFromName(
                watchlist?.name
              )}`
            );
            setIsPageUserWatchlist(true);
          }}
          _hover={{
            cursor: "pointer",
            color: "none",
          }}
        >
          {watchlist && !isLoading ? (
            <TextSmall>
              {watchlist.followers ? watchlist.followers : 0}
            </TextSmall>
          ) : (
            <Skeleton
              borderRadius="4px"
              h={["14px", "14px", "15px", "16px"]}
              w="30px"
              startColor={boxBg6}
              endColor={hover}
            />
          )}
        </Td>
        <Td
          borderBottom={borders}
          py={["5px", "5px", "5px", "5px", "25px"]}
          onClick={() => {
            router.push(
              `/watchlist/${userOfWatchlist?.address}/${getUrlFromName(
                watchlist?.name
              )}`
            );
            setIsPageUserWatchlist(true);
          }}
          _hover={{
            cursor: "pointer",
            color: "none",
          }}
        >
          {watchlist && !isLoading ? (
            <TextSmall color={getColorFromAverageScore()}>
              {getAverageScore()}
              <Box as="span" color={text80}>
                /5
              </Box>
            </TextSmall>
          ) : (
            <Skeleton
              borderRadius="4px"
              h={["14px", "14px", "15px", "16px"]}
              w="40px"
              startColor={boxBg6}
              endColor={hover}
            />
          )}
        </Td>
        <Td
          borderBottom={borders}
          py={["5px", "5px", "5px", "5px", "25px"]}
          onClick={() => {
            router.push(
              `/watchlist/${userOfWatchlist?.address}/${getUrlFromName(
                watchlist?.name
              )}`
            );
            setIsPageUserWatchlist(true);
          }}
          _hover={{
            cursor: "pointer",
            color: "none",
          }}
        >
          {watchlist && !isLoading ? (
            <TextSmall>${formatAmount(marketCap)}</TextSmall>
          ) : (
            <Skeleton
              borderRadius="4px"
              h={["14px", "14px", "15px", "16px"]}
              w="140px"
              startColor={boxBg6}
              endColor={hover}
            />
          )}
        </Td>
        <Td
          borderBottom={borders}
          py={["5px", "5px", "5px", "5px", "25px"]}
          onClick={() => {
            router.push(
              `/watchlist/${userOfWatchlist?.address}/${getUrlFromName(
                watchlist?.name
              )}`
            );
            setIsPageUserWatchlist(true);
          }}
          _hover={{
            cursor: "pointer",
            color: "none",
          }}
        >
          {watchlist && !isLoading ? (
            <TextSmall color={percentageAvr > 0 ? "green" : "red"}>
              {" "}
              {getTokenPercentage(percentageAvr)}%
            </TextSmall>
          ) : (
            <Skeleton
              borderRadius="4px"
              h={["14px", "14px", "15px", "16px"]}
              w="50px"
              startColor={boxBg6}
              endColor={hover}
            />
          )}
        </Td>
        <Td
          borderBottom={borders}
          py={["5px", "5px", "5px", "5px", "25px"]}
          _hover={{
            cursor: "pointer",
            color: "none",
          }}
        >
          {watchlist && !isLoading ? (
            <Flex
              align="center"
              _hover={{ color: "blue", cursor: "pointer" }}
              transition="all 0.25s ease-in-out"
              onClick={() =>
                router.push(`/profile/${userOfWatchlist?.address}`)
              }
            >
              {userOfWatchlist?.profile_pic !== "/mobula/fullicon.png" ? (
                <Image
                  src={userOfWatchlist?.profile_pic}
                  fallbackSrc="/mobula/mobula-logo.svg"
                  boxSize="22px"
                  borderRadius="full"
                  mr="7.5px"
                />
              ) : (
                <AddressAvatar
                  boxSize="22px"
                  borderRadius="full"
                  mr="7.5px"
                  address={userOfWatchlist.address}
                />
              )}
              {userOfWatchlist?.username
                ? userOfWatchlist.username
                : addressSlicer(userOfWatchlist?.address)}
            </Flex>
          ) : (
            <Flex align="center">
              <Skeleton
                boxSize="22px"
                startColor={boxBg6}
                endColor={hover}
                borderRadius="full"
                mr="7.5px"
              />
              <Skeleton
                borderRadius="4px"
                h={["14px", "14px", "15px", "16px"]}
                w="90px"
                startColor={boxBg6}
                endColor={hover}
              />
            </Flex>
          )}
        </Td>
        <Td
          borderBottom={borders}
          py={["5px", "5px", "5px", "5px", "25px"]}
          onClick={() => {
            router.push(
              `/watchlist/${userOfWatchlist?.address}/${getUrlFromName(
                watchlist?.name
              )}`
            );
            setIsPageUserWatchlist(true);
          }}
          _hover={{
            cursor: "pointer",
            color: "none",
          }}
        >
          {watchlist && !isLoading ? (
            <Flex align="center" justify="flex-end">
              <AvatarGroup fontSize="12px" spacing="-2" size="xs">
                {assetsOfWatchlist[i]?.map((token, idx) => {
                  if (idx < 5)
                    return (
                      <Avatar
                        bg={boxBg1}
                        border={borders}
                        name={token.name}
                        src={token.logo}
                      />
                    );
                  return null;
                })}
              </AvatarGroup>
              {assetsOfWatchlist[i] ? (
                <TextSmall ml="7.5px">
                  {assetsOfWatchlist[i].length - 5 > 0
                    ? `+${assetsOfWatchlist[i].length - 5}`
                    : null}
                </TextSmall>
              ) : null}
            </Flex>
          ) : (
            <Flex align="center" justify="flex-end">
              <AvatarGroup fontSize="12px" spacing="-2" size="xs">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Skeleton
                    boxSize="22px"
                    startColor={boxBg6}
                    endColor={hover}
                    borderRadius="full"
                    key={i}
                  />
                ))}
              </AvatarGroup>
              <Skeleton
                ml="7.5px"
                borderRadius="4px"
                h={["14px", "14px", "15px", "16px"]}
                w="36px"
                startColor={boxBg6}
                endColor={hover}
              />
            </Flex>
          )}
        </Td>
      </Tr>
    </Tbody>
  );
};
