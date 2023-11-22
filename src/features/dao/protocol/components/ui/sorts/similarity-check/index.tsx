import {
  Flex,
  Icon,
  Image,
  Table,
  TableContainer,
  Tbody,
  Text,
  Thead,
  Tr,
} from "@chakra-ui/react";
import {blockchainsContent} from "mobula-lite/lib/chains/constants";
import {useEffect, useState} from "react";
import {SiConvertio} from "react-icons/si";
import {getFormattedAmount} from "../../../../../../../../utils/helpers/formaters";
import {createSupabaseDOClient} from "../../../../../../../../utils/supabase";
import {Tds} from "../../../../../../../UI/Tds";
import {TextSmall} from "../../../../../../../UI/Text";
import {Ths} from "../../../../../../../UI/Ths";
import {useColors} from "../../../../../../../common/utils/color-mode";
import {addressSlicer} from "../../../../../../../common/utils/user";
import {BoxContainer} from "../../../../../common/components/box-container";
import {TokenDivs} from "../../../../models";
import {getClosestSimilarToken} from "../../../../utils";

const REQUEST_SELECT =
  "name,symbol,volume,liquidity,logo,market_cap,contracts,blockchains";

export const SimiliratyCheck = ({token}) => {
  console.log(token);
  const {borders, text40} = useColors();
  const [similarTokens, setSimilarTokens] = useState({
    name: {} as TokenDivs,
    symbol: {} as TokenDivs,
    contracts: {} as TokenDivs,
  });

  const supabase = createSupabaseDOClient();

  const verifySimilarity = async (field, value, callback) => {
    const {data} = await supabase
      .from("assets")
      .select(REQUEST_SELECT)
      .ilike(field, `%${value}%`);
    callback(data);
  };

  const verifyContracts = async (newToken, callback) => {
    const contracts = newToken.contracts.filter(entry => entry.address);
    const {data, error} = await supabase.rpc("find_token_contract", {
      contract_addresses: [contracts],
    });
    console.log("data", error);
    callback(data);
  };

  useEffect(() => {
    verifySimilarity("name", token?.name, data =>
      getClosestSimilarToken(data, setSimilarTokens, "name", token),
    );
    verifySimilarity("symbol", token?.symbol, data =>
      getClosestSimilarToken(data, setSimilarTokens, "symbol", token),
    );
    verifyContracts(token, data =>
      getClosestSimilarToken(data, setSimilarTokens, "contracts", token),
    );
  }, []);

  const getDisplay = () => {
    const newArr = [];
    for (let i = 0; i < Object.values(similarTokens).length; i += 1) {
      if (Object.values(similarTokens)[i]?.name) newArr.push(true);
      else newArr.push(false);
    }
    return newArr.some(arr => arr === true) ? "flex" : "none";
  };

  return (
    <BoxContainer
      mb="20px"
      position="relative"
      transition="all 300ms ease-in-out"
      p={["10px", "10px", "15px", "15px 20px"]}
      borderRadius={["0px", "16px"]}
      display={getDisplay()}
    >
      <Flex align="center">
        <Icon as={SiConvertio} color="blue" />
        <Text fontSize={["14px", "14px", "16px", "18px"]} ml="10px">
          Similarity check
        </Text>
      </Flex>
      <TableContainer
        mt={["10px", "10px", "15px", "20px"]}
        overflowX="scroll"
        className="scroll"
      >
        <Table variant="simple">
          <Thead>
            <Tr>
              <Ths py="15px" px="10px" borderTop={borders}>
                Name
              </Ths>
              <Ths py="15px" px="10px" borderTop={borders} isNumeric>
                Market Cap
              </Ths>
              <Ths py="15px" px="10px" borderTop={borders} isNumeric>
                24h Volume
              </Ths>
              <Ths py="15px" px="10px" borderTop={borders} isNumeric>
                Liquidity
              </Ths>
              <Ths py="15px" px="10px" borderTop={borders} isNumeric>
                Contract
              </Ths>
              <Ths py="15px" px="10px" borderTop={borders} isNumeric>
                Mobula Listed
              </Ths>
            </Tr>
          </Thead>
          <Tbody>
            {Object.keys(similarTokens).map(key => {
              if (similarTokens[key].name)
                return (
                  <Tr key={key}>
                    <Tds px="10px" py="15px">
                      <Flex align="center">
                        <Image
                          src={similarTokens[key]?.logo}
                          boxSize="24px"
                          mr="10px"
                          borderRadius="full"
                        />
                        <Flex direction="column">
                          <TextSmall maxW="130px" whiteSpace="pre-wrap">
                            {similarTokens[key]?.name}
                          </TextSmall>
                          <TextSmall color={text40}>
                            {similarTokens[key].symbol}
                          </TextSmall>
                        </Flex>
                      </Flex>
                    </Tds>
                    <Tds px="10px" py="15px" isNumeric>
                      {getFormattedAmount(similarTokens[key].market_cap)}
                    </Tds>
                    <Tds px="10px" py="15px" isNumeric>
                      ${getFormattedAmount(similarTokens[key].volume)}
                    </Tds>
                    <Tds px="10px" py="15px" isNumeric>
                      ${getFormattedAmount(similarTokens[key].liquidity)}
                    </Tds>
                    <Tds px="10px" py="15px" isNumeric>
                      <Flex align="center" w="100%" justify="end">
                        {blockchainsContent[similarTokens[key].blockchains?.[0]]
                          ?.logo ? (
                          <Image
                            boxSize="16px"
                            borderRadius="full"
                            mr="7.5px"
                            src={
                              blockchainsContent[
                                similarTokens[key].blockchains?.[0]
                              ]?.logo || "/icon/unknown.png"
                            }
                          />
                        ) : null}
                        {addressSlicer(similarTokens[key].contracts?.[0])}
                      </Flex>
                    </Tds>
                    <Tds px="10px" py="15px" isNumeric>
                      <Flex align="center" w="100%" justify="end">
                        <Image
                          mr="10px"
                          src="/mobula/coinMobula.png"
                          boxSize="20px"
                        />
                        Yes
                      </Flex>
                    </Tds>
                  </Tr>
                );
              return null;
            })}
          </Tbody>
        </Table>
      </TableContainer>
    </BoxContainer>
  );
};
