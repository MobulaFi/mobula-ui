import { Box, Flex, Icon, Spinner } from "@chakra-ui/react";
import React from "react";
import { AiFillStar, AiOutlineStar } from "react-icons/ai";
import { useTop100 } from "../../../../features/data/top100/context-manager";
import { useColors } from "../../../../lib/chakra/colorMode";
import { useWatchlist } from "../../hooks/watchlist";

export const WatchlistAdd = ({
  addOrRemoveFromWatchlist,
  setAddedToWatchlist,
  addedToWatchlist,
  token,
}) => {
  const { isLoading } = useTop100();
  const { boxBg3, text60, text80 } = useColors();
  const { inWatchlist } = useWatchlist(token.id);
  return (
    <Flex align="center" justify="center" display={["none", "none", "flex"]}>
      {isLoading ? (
        <Spinner
          thickness="2px"
          speed="0.65s"
          emptyColor={boxBg3}
          color="blue"
          size="xs"
        />
      ) : (
        <>
          {inWatchlist || addedToWatchlist ? (
            <Icon
              as={AiFillStar}
              color="yellow"
              onClick={() => {
                addOrRemoveFromWatchlist();
                setAddedToWatchlist(!addedToWatchlist);
              }}
            />
          ) : (
            <Icon
              as={AiOutlineStar}
              color={text60}
              onClick={() => {
                addOrRemoveFromWatchlist();
                setAddedToWatchlist(!addedToWatchlist);
              }}
            />
          )}
        </>
      )}
      <Box marginLeft="5px" opacity="0.6" color={text80}>
        {token.rank}
      </Box>
    </Flex>
  );
};
