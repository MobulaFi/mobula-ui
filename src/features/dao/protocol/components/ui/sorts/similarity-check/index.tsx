import { blockchainsContent } from "mobula-lite/lib/chains/constants";
import React, { useEffect, useState } from "react";
import { SiConvertio } from "react-icons/si";
import { MediumFont, SmallFont } from "../../../../../../../components/fonts";
import { Tds, Ths } from "../../../../../../../components/table";
import { createSupabaseDOClient } from "../../../../../../../lib/supabase";
import {
  addressSlicer,
  getFormattedAmount,
} from "../../../../../../../utils/formaters";
import { BoxContainer } from "../../../../../common/components/box-container";
import { TokenDivs } from "../../../../models";
import { thStyles } from "../../../../style";
import { getClosestSimilarToken } from "../../../../utils";

interface SimilarityCheckProps {
  token: TokenDivs;
}

const REQUEST_SELECT =
  "name,symbol,volume,liquidity,logo,market_cap,contracts,blockchains";

export const SimiliratyCheck = ({ token }: SimilarityCheckProps) => {
  const [similarTokens, setSimilarTokens] = useState({
    name: {} as TokenDivs,
    symbol: {} as TokenDivs,
    contracts: {} as TokenDivs,
  });

  const supabase = createSupabaseDOClient();

  const verifySimilarity = async (field, value, callback) => {
    const { data } = await supabase
      .from("assets")
      .select(REQUEST_SELECT)
      .ilike(field, `%${value}%`);
    callback(data);
  };

  const verifyContracts = async (newToken, callback) => {
    const contracts = newToken.contracts.filter((entry) => entry.address);
    const { data, error } = await supabase.rpc("find_token_contract", {
      contract_addresses: [contracts],
    });
    callback(data);
  };

  useEffect(() => {
    verifySimilarity("name", token?.name, (data) =>
      getClosestSimilarToken(data, setSimilarTokens, "name", token)
    );
    verifySimilarity("symbol", token?.symbol, (data) =>
      getClosestSimilarToken(data, setSimilarTokens, "symbol", token)
    );
    verifyContracts(token, (data) =>
      getClosestSimilarToken(data, setSimilarTokens, "contracts", token)
    );
  }, []);

  const getDisplay = () => {
    const newArr: boolean[] = [];
    for (let i = 0; i < Object.values(similarTokens).length; i += 1) {
      if (Object.values(similarTokens)[i]?.name) newArr.push(true);
      else newArr.push(false);
    }
    return newArr.some((arr) => arr === true) ? "flex" : "hidden";
  };
  const display = getDisplay();

  return (
    <BoxContainer
      extraCss={`mb-5 relative transition-all duration-200 py-[15px] md:py-2.5 px-5 lg:px-[15px] md:px-2.5 rounded-2xl sm:rounded-0 ${display}`}
    >
      <div className="flex items-center">
        <SiConvertio className="text-blue dark:text-blue" />
        <MediumFont extraCss="ml-2.5">Similarity check</MediumFont>
      </div>
      <div className="w-full mt-5 lg:mt-[15px] md:mt-2.5 overflow-x-scroll scroll">
        <table className="w-full">
          <thead>
            <tr>
              <Ths extraCss={`${thStyles} min-w-[130px] text-start`}>Name</Ths>
              <Ths extraCss={`${thStyles} text-end whitespace-nowrap`}>
                Market Cap
              </Ths>
              <Ths extraCss={`${thStyles} text-end  whitespace-nowrap`}>
                24h Volume
              </Ths>
              <Ths extraCss={`${thStyles} text-end  whitespace-nowrap`}>
                Liquidity
              </Ths>
              <Ths extraCss={`${thStyles} text-end`}>Contract</Ths>
              <Ths extraCss={`${thStyles} text-end  whitespace-nowrap`}>
                Mobula Listed
              </Ths>
            </tr>
          </thead>
          <tbody>
            {Object.keys(similarTokens).map((key) => {
              if (similarTokens[key].name)
                return (
                  <tr key={key}>
                    <Tds extraCss="px-2.5 md:pl-0 py-[15px] min-w-[130px]">
                      <div className="flex items-center">
                        <img
                          className="w-6 h-6 mr-2.5 rounded-full"
                          src={similarTokens[key]?.logo}
                          alt={similarTokens[key]?.name}
                        />
                        <div className="flex flex-col">
                          <SmallFont extraCss="max-w-[130px] whitespace-pre-wrap">
                            {similarTokens[key]?.name}
                          </SmallFont>
                          <SmallFont extraCss="text-light-font-40 dark:text-dark-font-40">
                            {similarTokens[key].symbol}
                          </SmallFont>
                        </div>
                      </div>
                    </Tds>
                    <Tds extraCss="px-2.5 py-[15px] text-end">
                      {getFormattedAmount(similarTokens[key].market_cap)}
                    </Tds>
                    <Tds extraCss="px-2.5 py-[15px] text-end">
                      ${getFormattedAmount(similarTokens[key].volume)}
                    </Tds>
                    <Tds extraCss="px-2.5 py-[15px] text-end">
                      ${getFormattedAmount(similarTokens[key].liquidity)}
                    </Tds>
                    <Tds extraCss="px-2.5 py-[15px] text-end">
                      <div className="flex items-center w-full justify-end">
                        {blockchainsContent[similarTokens[key].blockchains?.[0]]
                          ?.logo ? (
                          <img
                            className="rounded-full mr-[7.5px] w-4 h-4"
                            src={
                              blockchainsContent[
                                similarTokens[key].blockchains?.[0]
                              ]?.logo || "/empty/unknown.png"
                            }
                            alt={similarTokens[key].blockchains}
                          />
                        ) : null}
                        {addressSlicer(similarTokens[key].contracts?.[0])}
                      </div>
                    </Tds>
                    <Tds extraCss="px-2.5 py-[15px] text-end">
                      <div className="flex items-center w-full justify-end">
                        <img
                          className="rounded-full mr-2.5 w-5 h-5"
                          src="/mobula/coinMobula.png"
                          alt="mobula logo"
                        />
                        Yes
                      </div>
                    </Tds>
                  </tr>
                );
              return null;
            })}
          </tbody>
        </table>
      </div>
    </BoxContainer>
  );
};
