import {Box, Button, Image} from '@chakra-ui/react';
import React, {Dispatch, SetStateAction, useContext} from 'react';
import {useAlert} from 'react-alert';
import {useAccount} from 'wagmi';
import {PopupUpdateContext} from '../../../../../common/context-manager/popup';
import {HoldingsResponse} from '../../../../../common/model/holdings';
import {TableAsset} from '../../../../../common/ui/tables/model';
import {useColors} from '../../../../../common/utils/color-mode';
import {Query, TableButton} from '../../models';

export const generateFilters = (entry: string, isRecent?: boolean): Query[] => {
  switch (entry) {
    case 'Top 100':
      return [
        {
          action: 'or',
          value: [
            'volume.gte.100000,off_chain_volume.gte.100000,contracts.eq."{}",liquidity_market_cap_ratio.gte.0.01,coin.eq.true',
          ],
        },
        {
          action: 'or',
          value: ['liquidity.gte.1000,contracts.eq.{},coin.eq.true'],
        },
        ...(isRecent
          ? [
              {
                action: 'order',
                value: ['created_at', {ascending: false}],
              },
            ]
          : []),
      ];

    case 'all':
      return [
        {
          action: 'or',
          value: [
            'liquidity.gte.0,volume.gte.0,market_cap.gte.0,off_chain_volume.gte.0,contracts.eq."{}",coin.eq.true',
          ],
        },
        {
          action: 'or',
          value: ['liquidity.gte.1000,contracts.eq.{},coin.eq.true'],
        },

        ...(isRecent
          ? [
              {
                action: 'order',
                value: ['created_at', {ascending: false}],
              },
            ]
          : [
              {
                action: 'order',
                value: ['views_change_24h', {ascending: false}],
              },
            ]),
      ];

    case 'Ethereum':
      return [
        {
          action: 'eq',
          value: ['blockchains[1]', '{Ethereum}'],
        },
        {
          action: 'or',
          value: [
            'volume.gte.100000,off_chain_volume.gte.100000,contracts.eq."{}",liquidity_market_cap_ratio.gte.0.01,coin.eq.true',
          ],
        },
        {
          action: 'or',
          value: ['liquidity.gte.1000,contracts.eq.{},coin.eq.true'],
        },
        ...(isRecent
          ? [
              {
                action: 'order',
                value: ['created_at', {ascending: false}],
              },
            ]
          : [
              {
                action: 'order',
                value: ['views_change_24h', {ascending: false}],
              },
            ]),
      ];
    case 'BNB Smart Chain (BEP20)':
      return [
        {
          action: 'eq',
          value: ['blockchains[1]', '{BNB Smart Chain (BEP20)}'],
        },
        {
          action: 'or',
          value: [
            'volume.gte.100000,off_chain_volume.gte.100000,contracts.eq."{}",liquidity_market_cap_ratio.gte.0.01,coin.eq.true',
          ],
        },
        {
          action: 'or',
          value: ['liquidity.gte.1000,contracts.eq.{},coin.eq.true'],
        },
        ...(isRecent
          ? [
              {
                action: 'order',
                value: ['created_at', {ascending: false}],
              },
            ]
          : [
              {
                action: 'order',
                value: ['views_change_24h', {ascending: false}],
              },
            ]),
      ];
    case 'Avalanche C-Chain':
      return [
        {
          action: 'eq',
          value: ['blockchains[1]', '{Avalanche C-Chain}'],
        },
        {
          action: 'or',
          value: [
            'volume.gte.100000,off_chain_volume.gte.100000,contracts.eq."{}",liquidity_market_cap_ratio.gte.0.01,coin.eq.true',
          ],
        },
        {
          action: 'or',
          value: ['liquidity.gte.1000,contracts.eq.{},coin.eq.true'],
        },
        ...(isRecent
          ? [
              {
                action: 'order',
                value: ['created_at', {ascending: false}],
              },
            ]
          : [
              {
                action: 'order',
                value: ['views_change_24h', {ascending: false}],
              },
            ]),
      ];
    case 'Polygon':
      return [
        {
          action: 'eq',
          value: ['blockchains[1]', '{Polygon}'],
        },
        {
          action: 'or',
          value: [
            'volume.gte.100000,off_chain_volume.gte.100000,contracts.eq."{}",liquidity_market_cap_ratio.gte.0.01,coin.eq.true',
          ],
        },
        {
          action: 'or',
          value: ['liquidity.gte.1000,contracts.eq.{},coin.eq.true'],
        },
        ...(isRecent
          ? [
              {
                action: 'order',
                value: ['created_at', {ascending: false}],
              },
            ]
          : [
              {
                action: 'order',
                value: ['views_change_24h', {ascending: false}],
              },
            ]),
      ];
    case 'Cronos':
      return [
        {
          action: 'eq',
          value: ['blockchains[1]', '{Cronos}'],
        },
        {
          action: 'or',
          value: [
            'volume.gte.100000,off_chain_volume.gte.100000,contracts.eq."{}",liquidity_market_cap_ratio.gte.0.01,coin.eq.true',
          ],
        },
        {
          action: 'or',
          value: ['liquidity.gte.1000,contracts.eq.{},coin.eq.true'],
        },
        ...(isRecent
          ? [
              {
                action: 'order',
                value: ['created_at', {ascending: false}],
              },
            ]
          : [
              {
                action: 'order',
                value: ['views_change_24h', {ascending: false}],
              },
            ]),
      ];
    case 'Arbitrum':
      return [
        {
          action: 'eq',
          value: ['blockchains[1]', '{Arbitrum}'],
        },
        {
          action: 'or',
          value: [
            'volume.gte.100000,off_chain_volume.gte.100000,contracts.eq."{}",liquidity_market_cap_ratio.gte.0.01,coin.eq.true',
          ],
        },
        {
          action: 'or',
          value: ['liquidity.gte.1000,contracts.eq.{},coin.eq.true'],
        },
        ...(isRecent
          ? [
              {
                action: 'order',
                value: ['created_at', {ascending: false}],
              },
            ]
          : [
              {
                action: 'order',
                value: ['views_change_24h', {ascending: false}],
              },
            ]),
      ];
    default:
      return [];
  }
};

export const ButtonBlockchain = ({
  setFilters,
  entry,
  requiresLogin,
  active,
  setActive,
  setResultsData,
  holdings,
}: {
  entry: TableButton;
  active: string;
  setActive: React.Dispatch<React.SetStateAction<string>>;
  setFilters: React.Dispatch<React.SetStateAction<Query[]>>;
  requiresLogin?: boolean;
  setResultsData: Dispatch<SetStateAction<{data: TableAsset[]; count: number}>>;
  holdings: HoldingsResponse;
}) => {
  const {setConnect} = useContext(PopupUpdateContext);
  const alert = useAlert();
  const {address} = useAccount();
  const isActive = active === entry.title;
  const {boxBg3, text80, text60, bgMain, borders} = useColors();

  return (
    <Button
      transition="all 250ms ease-in-out"
      _hover={{
        cursor: 'pointer',
        color: text80,
      }}
      bg={isActive ? boxBg3 : 'none'}
      _focus={{boxShadow: 'none'}}
      minWidth="fit-content"
      mx="5px"
      fontSize={['12px', '12px', '13px', '14px']}
      color={isActive ? text80 : text60}
      border={isActive ? borders : bgMain}
      h={['30px', '30px', '35px']}
      display="flex"
      alignItems="center"
      justifyContent="center"
      maxWidth="155px"
      width="13%"
      whiteSpace="nowrap"
      borderRadius="8px"
      padding="10px"
      onClick={() => {
        if (!address && requiresLogin) {
          setConnect(true);
          return;
        }
        if (
          entry.title === 'My assets' &&
          holdings?.holdings?.multichain?.length > 0
        ) {
          setActive(entry.title);
          setResultsData(prev => ({
            ...prev,
            data: holdings?.holdings?.multichain as unknown as TableAsset[],
          }));
        } else if (entry.title !== 'My assets') {
          setFilters(generateFilters(entry.title));
          setActive(entry.title);
        } else alert.show("You don't have any assets in your wallet");
      }}>
      {entry.logo ? (
        <>
          <Image
            boxSize={['20px', '20px', '20px', '21px']}
            src={entry.logo}
            alt={`${entry.title} logo`}
          />
          <Box as="span" ml="10px">
            {entry.symbol || entry.title}
          </Box>
        </>
      ) : (
        entry.title
      )}
    </Button>
  );
};
