import {
  Flex,
  Image,
  Table,
  TableContainer,
  Thead,
  useColorMode,
} from "@chakra-ui/react";
import {useRouter} from "next/router";
import {useContext, useEffect, useState} from "react";
import {createSupabaseDOClient} from "../../../../../../utils/supabase";
import {MainContainer} from "../../../../../UI/MainContainer";
import {TextLandingSmall, TextSmall} from "../../../../../UI/Text";
import {NextChakraLink} from "../../../../../common/components/links";
import {UserContext} from "../../../../../common/context-manager/user";
import {EntryWatchlist} from "../../../../../common/ui/tables/components/entry-watchlist";
import {HeaderWatchlist} from "../../../../../common/ui/tables/components/header-watchlist";
import {useColors} from "../../../../../common/utils/color-mode";
import {Asset} from "../../../../Assets/AssetV2/models";
import {WatchlistContext} from "../../context-manager";
import {ButtonsHeader} from "../buttons-header";
import {Header} from "../header";

export const WatchlistExplore = ({watchlistsBuffer, page}) => {
  const {user} = useContext(UserContext);
  const [watchlistSearched, setWatchlistSearch] = useState([]);
  const {colorMode} = useColorMode();
  const isWhiteMode = colorMode === "light";
  const {
    setIsPageUserWatchlist,
    setPageSelected,
    pageSelected,
    setWatchlists,
    searchWatchlist,
    watchlists,
  } = useContext(WatchlistContext);
  const [tokens, setTokens] = useState([]);
  const [usersOwner, setUsersOwner] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const {text40, text80, text60, borders} = useColors();

  useEffect(() => {
    setWatchlists(watchlistsBuffer);
  }, [watchlistsBuffer]);

  useEffect(() => {
    if (watchlists.length === 0) return;
    const supabase = createSupabaseDOClient();
    setIsPageUserWatchlist(false);
    setPageSelected(page);
    if (!searchWatchlist)
      supabase
        .from("users")
        .select("profile_pic,username,id,address")
        .in(
          "id",
          watchlists.map(wl => wl.user_id),
        )
        .then(r => {
          if (r.data) setUsersOwner(r.data);
        });
  }, [page, pageSelected, watchlists, searchWatchlist]);

  useEffect(() => {
    if (!searchWatchlist) return;
    const supabase = createSupabaseDOClient();
    const getFilteredWatchlist = async () => {
      const {data, error} = await supabase
        .from("watchlist")
        .select("*, users(profile_pic,username,address,id)")
        .ilike("name", `%${searchWatchlist}%`)
        .limit(15);
      if (error) {
        console.error("Error fetching watchlist:", error);
      } else {
        setWatchlistSearch(data);
        setUsersOwner(data.map(wl => wl.users));
      }
    };

    getFilteredWatchlist();
  }, [searchWatchlist]);

  useEffect(() => {
    if (
      user &&
      user.watchlists_followed.length &&
      user.watchlists_followed.length !== watchlists.length &&
      router.asPath === "/watchlist/followed"
    ) {
      const supabase = createSupabaseDOClient();
      supabase
        .from("watchlist")
        .select("*, users(profile_pic,username,address,id)")
        .in("id", user.watchlists_followed)
        .then(r => {
          if (r.data) {
            setWatchlists(r.data);
            setUsersOwner(r.data.map(wl => wl.users));
          }
        });
    }
  }, [user, watchlists, searchWatchlist]);

  useEffect(() => {
    const supabase = createSupabaseDOClient();
    let assetIds;

    if (searchWatchlist.length > 0) {
      assetIds = watchlistSearched?.map(
        wl => wl.assets?.map(asset => asset) || [],
      );
    } else {
      assetIds = watchlists?.map(wl => wl.assets?.map(asset => asset) || []);
    }

    if (assetIds.length > 0) {
      const promises = assetIds.map(assetId =>
        supabase
          .from("assets")
          .select(
            "price, name, symbol,global_volume, logo, id, market_cap, price_change_24h, social_score, trust_score, utility_score",
          )
          .in("id", assetId),
      );
      Promise.all(promises).then(responses => {
        setTokens(responses.map(response => response.data));
        setIsLoading(false);
      });
    } else {
      setTokens([]);
    }
  }, [watchlists, searchWatchlist]);

  console.log("watchlists", watchlistSearched);

  return (
    <MainContainer w={["95%", "95%", "95%", "90%"]}>
      <ButtonsHeader />
      <Header
        assets={watchlists.map(entry => entry.assets) as unknown as Asset[]}
        activeWatchlist={watchlists}
      />
      <Flex
        display="block"
        overflow="auto"
        position="relative"
        top="0px"
        w="100%"
      >
        <TableContainer
          mb="0px"
          mx="auto"
          flexDirection="column"
          alignItems="center"
          position="relative"
          overflow="auto"
          top="0px"
          className="scroll"
        >
          <Table
            w={["auto", "auto", "100%"]}
            minW={["900px", "900px", "100%"]}
            maxW={["1400px", "1400px", "1280px", "1280px", "1600px"]}
            cursor="pointer"
            margin="0px auto"
            position="relative"
          >
            <Thead
              textTransform="capitalize"
              fontFamily="Inter"
              borderTop={borders}
              color={text60}
              position="sticky"
              top="0px"
            >
              <HeaderWatchlist />
            </Thead>
            {(!searchWatchlist.length ? watchlistsBuffer : watchlistSearched)
              ?.filter(entry => entry?.assets?.length > 0)
              .map((watchlist, i) => (
                <EntryWatchlist
                  key={watchlist?.id || i}
                  watchlist={watchlist}
                  tokens={tokens}
                  usersOwner={usersOwner}
                  isLoading={isLoading}
                  i={i}
                />
              ))}
          </Table>
        </TableContainer>
      </Flex>
      {((page !== "Explorer" &&
        (watchlistsBuffer?.length === 0 || !watchlistsBuffer?.[0]?.assets)) ||
        (!watchlistSearched?.length && page === "Explorer")) &&
      !isLoading ? (
        <Flex
          align="center"
          justify="center"
          my="00px"
          direction="column"
          border={borders}
          borderTop="none"
          pb="50px"
          borderRadius="0px 0px 4px 4px"
        >
          <Image
            mt={isWhiteMode ? "40px" : "0px"}
            src={isWhiteMode ? "/asset/empty-light.png" : "/asset/empty.png"}
            w={[
              isWhiteMode ? "110px" : "180px",
              isWhiteMode ? "110px" : "180px",
              isWhiteMode ? "150px" : "250px",
            ]}
          />
          <TextLandingSmall
            mt={isWhiteMode ? "15px" : "-20px"}
            textAlign="center"
            color={text80}
          >
            No Watchlist Followed
          </TextLandingSmall>
          <TextSmall textAlign="center" color={text40} maxWidth="340px" w="90%">
            Search for your favorite watchlists or find new ones by using{" "}
            <NextChakraLink color={text80} href="/watchlist/explore">
              explore
            </NextChakraLink>{" "}
            feature.
          </TextSmall>
        </Flex>
      ) : null}
    </MainContainer>
  );
};
