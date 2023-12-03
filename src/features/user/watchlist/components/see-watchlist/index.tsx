import {Icon} from "@chakra-ui/icons";
import {Button, Flex, Img} from "@chakra-ui/react";
import {useRouter} from "next/router";
import {useContext, useEffect, useState} from "react";
import {BiArrowBack} from "react-icons/bi";
import {MainContainer} from "../../../../../UI/MainContainer";
import {TextLandingMedium, TextLandingSmall} from "../../../../../UI/Text";
import {AddressAvatar} from "../../../../../common/components/avatar";
import {AssetsTable} from "../../../../../common/ui/tables/components";
import {useColors} from "../../../../../common/utils/color-mode";
import {addressSlicer} from "../../../../../common/utils/user";
import {WatchlistContext} from "../../context-manager";
import {Header} from "../header";
import {AddedToWatchlistPopup} from "../popup/added-to-watchlist";

export const SeeWatchlist = ({
  watchlist,
  isMobile,
  tokens,
  userOfWatchlist,
}) => {
  const router = useRouter();
  const {text80} = useColors();
  const [orderBy, setOrderBy] = useState({
    ascending: false,
    type: "market_cap",
    first: true,
  } as any);
  const getUsername = () => {
    if (userOfWatchlist) {
      if (userOfWatchlist?.username) return userOfWatchlist.username;
      return addressSlicer(userOfWatchlist?.address);
    }
    return null;
  };
  const {setIsPageUserWatchlist} = useContext(WatchlistContext);
  useEffect(() => {
    setIsPageUserWatchlist(true);
  }, []);

  const [resultsData, setResultsData] = useState({data: tokens, count: 0});

  return (
    <MainContainer>
      <Flex align="center">
        <Button onClick={() => router.push("/watchlist")} mr="10px">
          <Icon as={BiArrowBack} color={text80} />
        </Button>
        <TextLandingMedium fontWeight="500">
          {watchlist?.name}
        </TextLandingMedium>
      </Flex>

      <Flex align="center" ml="auto" mb="15px">
        {userOfWatchlist?.profile_pic !== "/mobula/fullicon.png" ? (
          <Img
            src={userOfWatchlist?.profile_pic}
            boxSize="22px"
            borderRadius="full"
          />
        ) : (
          <AddressAvatar
            boxSize="22px"
            borderRadius="full"
            address={userOfWatchlist?.address}
          />
        )}
        <TextLandingSmall
          color={text80}
          ml="7.5px"
          onClick={() => router.push(`/profile/${userOfWatchlist?.address}`)}
          cursor="pointer"
        >
          By {getUsername()}
        </TextLandingSmall>
      </Flex>
      {tokens ? (
        <>
          <Header assets={tokens} activeWatchlist={watchlist} />
          <AssetsTable
            resultsData={resultsData}
            setResultsData={setResultsData}
            orderBy={orderBy}
            setOrderBy={setOrderBy}
            isMobile={isMobile}
          />
        </>
      ) : null}
      <AddedToWatchlistPopup />
    </MainContainer>
  );
};
