import {Box, Flex, Text} from "@chakra-ui/react";
import {useEffect, useState} from "react";
import {useThemeValue} from "../../../../../utils/chakra";
import {createSupabaseDOClient} from "../../../../../utils/supabase";
import {NextChakraLink} from "../../../../common/components/links";
import styles from "./tendance.module.scss";

function Metrics({...props}) {
  const {border, text3, textTendance} = useThemeValue();
  const [metrics, setMetrics] = useState({
    total_dao_members: 0,
    total_assets: 0,
    total_dex: 0,
    "7d_listings": 0,
    total_holders: 0,
    total_governors: 0,
  });

  useEffect(() => {
    const supabase = createSupabaseDOClient();

    supabase
      .from("metrics")
      .select(
        "total_assets,total_dao_members,total_dex,7d_listings,total_holders,total_governors",
      )
      .match({id: 1})
      .then(r => {
        if (r?.data?.[0]) setMetrics(r.data[0]);
      });
  }, []);

  return (
    <Flex
      // borderTop={`2px solid ${border}`}
      fontFamily="Inter"
      px={["10px", "10px", "15px", "40px"]}
      justify="space-between"
      py={["5px", "5px", "7.5px", "10px"]}
      overflowX="scroll"
      className="scroll"
      borderBottom={[
        `2px solid ${border}`,
        `2px solid ${border}`,
        "none",
        "none",
      ]}
      {...props}
    >
      <Flex mr="10px" whiteSpace="nowrap">
        <Text
          fontSize={["10px", "10px", "10px", "10px"]}
          style={{color: text3}}
        >
          Crypto:{" "}
          <NextChakraLink href="/">
            <Box
              fontSize={["10px", "10px", "12px", "12px"]}
              as="span"
              color={textTendance}
              className={styles["blue-data"]}
            >
              {metrics.total_assets}
            </Box>
          </NextChakraLink>
        </Text>

        <Text
          fontSize={["10px", "10px", "10px", "10px"]}
          style={{color: text3}}
          className={styles["info-text"]}
        >
          Last 7 days new listings:{" "}
          <NextChakraLink href="/new">
            <Box
              fontSize={["10px", "10px", "12px", "12px"]}
              as="span"
              color={textTendance}
              className={styles["blue-data"]}
            >
              {metrics["7d_listings"]}
            </Box>
          </NextChakraLink>
        </Text>
      </Flex>
      <Flex>
        <Text
          fontSize={["10px", "10px", "10px", "10px"]}
          style={{color: text3}}
          className={styles["info-text"]}
        >
          MOBL Holders:{" "}
          <Box
            fontSize={["10px", "10px", "12px", "12px"]}
            as="span"
            color={textTendance}
            className={styles["blue-data"]}
          >
            {metrics.total_holders}
          </Box>
        </Text>
        <Text
          fontSize={["10px", "10px", "10px", "10px"]}
          style={{color: text3}}
          className={styles["info-text"]}
        >
          Mobulers:{" "}
          <NextChakraLink href="/dao/protocol/overview">
            <Box
              fontSize={["10px", "10px", "12px", "12px"]}
              as="span"
              color={textTendance}
              className={styles["blue-data"]}
            >
              {metrics.total_dao_members}
            </Box>
          </NextChakraLink>
        </Text>
        <Text
          fontSize={["10px", "10px", "10px", "10px"]}
          style={{color: text3}}
          className={styles["info-text"]}
        >
          Governors:{" "}
          <NextChakraLink href="/dao/governance/overview">
            <Box
              fontSize={["10px", "10px", "12px", "12px"]}
              as="span"
              color={textTendance}
              className={styles["blue-data"]}
            >
              {metrics.total_governors}
            </Box>
          </NextChakraLink>
        </Text>
      </Flex>
    </Flex>
  );
}

export default Metrics;
