'use client';
import {CheckIcon, CloseIcon} from '@chakra-ui/icons';
import {
  Button,
  Flex,
  Image,
  Input,
  Popover,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
  Spinner,
  useDisclosure,
} from '@chakra-ui/react';
import Cookies from 'js-cookie';
import {blockchainsContent} from 'mobula-lite/lib/chains/constants';
import {useContext, useState} from 'react';
import {useAccount} from 'wagmi';
import {TextSmall} from '../../../../../../UI/Text';
import {UserContext} from '../../../../../../common/context-manager/user';
import {useColors} from '../../../../../../common/utils/color-mode';
import {POST} from '../../../../../../common/utils/fetch';
import {defaultCategories, formatDataForFilters} from '../../../constants';
import {useTop100} from '../../../context-manager';
import {View} from '../../../models';
import {ACTIONS, maxValue} from '../../../reducer';

export const PopoverTrade = ({
  dispatch,
  children,
  state,
  name,
  setTypePopup,
}: {
  state: View;
  dispatch: React.Dispatch<unknown>;
  children: JSX.Element[] | JSX.Element | string;
  name: string;
  setTypePopup: React.Dispatch<React.SetStateAction<string>>;
}) => {
  const {boxBg3, text80, hover, bordersActive, borders, boxBg6} = useColors();
  const {activeView, setIsLoading, setShowCategories, setActiveView} =
    useTop100();
  const {user, setUser} = useContext(UserContext);
  // const alert = useAlert();
  const {isOpen, onOpen, onClose} = useDisclosure();
  const [loadTime, setLoadTime] = useState(false);
  const {address} = useAccount();

  const handleInputChange = (e, time) => {
    dispatch({
      type: ACTIONS.SET_INPUT,
      payload: {
        name: e.target.name,
        value: e.target.value,
        time,
      },
    });
  };

  const inputStyle = {
    _placeholder: {color: text80},
    borderRadius: '8px',
    type: 'number',
    px: '10px',
    h: '40px',
    bg: boxBg6,
    color: text80,
  };

  const editView = toEdit => {
    setLoadTime(true);

    onClose();
    POST('/views/update', toEdit)
      .then(r => r.json())
      .then(r => {
        if (r.error) {
          // alert.error(r.error);
          return;
        } else {
          setUser(prev => ({
            ...prev,
            views: [
              ...(prev.views?.filter(
                entry => entry.name !== activeView?.name,
              ) || []),
              r.view[0],
            ],
          }));
          setLoadTime(false);
        }
      });
  };

  const handleBlockchainsChange = (chain: string) => {
    if (!state.filters.blockchains.includes(chain))
      dispatch({
        type: ACTIONS.ADD_BLOCKCHAINS,
        payload: {value: chain},
      });
    else
      dispatch({
        type: ACTIONS.REMOVE_BLOCKCHAINS,
        payload: {value: chain},
      });
  };

  const handleCategoryChange = (category: string) => {
    if (!state.filters.categories?.includes(category))
      dispatch({
        type: ACTIONS.ADD_CATEGORY,
        payload: {value: category},
      });
    else
      dispatch({
        type: ACTIONS.REMOVE_CATEGORY,
        payload: {value: category},
      });
  };

  const newDefault = [...defaultCategories];

  return (
    <Popover isOpen={isOpen} onClose={onClose} onOpen={onOpen} matchWidth>
      <PopoverTrigger>{children}</PopoverTrigger>
      <PopoverContent
        maxW="240px"
        bg={boxBg3}
        p="10px"
        borderRadius="16px"
        border={borders}>
        <PopoverBody p="0px">
          <Flex direction="column">
            {name !== 'blockchains' && name !== 'categories' ? (
              <Flex direction="column">
                <Input
                  {...inputStyle}
                  value={state.filters?.[name]?.from}
                  name={name}
                  mb="10px"
                  // _focus={{bg: "red"}}
                  // _active={{bg: "red"}}
                  // _hover={{bg: "red"}}
                  onChange={e => handleInputChange(e, 'from')}
                  border={borders}
                />
                <Input
                  {...inputStyle}
                  value={
                    state.filters?.[name]?.to === 100_000_000_000_000_000
                      ? 'Any'
                      : state.filters?.[name]?.to
                  }
                  name={name}
                  border={borders}
                  onChange={e => handleInputChange(e, 'to')}
                />
              </Flex>
            ) : null}
            {name === 'blockchains' ? (
              <Flex direction="column">
                <Flex
                  direction="column"
                  w="100%"
                  maxH="390px"
                  overflowY="scroll">
                  {Object.keys(blockchainsContent)?.map((chain, i) => {
                    if (!chain) return null;
                    return (
                      <Flex
                        key={Math.random() + chain}
                        align="center"
                        mt={i !== 0 ? '7.5px' : '0px'}
                        mb={
                          i ===
                          (Object.keys(blockchainsContent).length || 0) - 1
                            ? '0px'
                            : '7.5px'
                        }>
                        <Button
                          boxSize="16px"
                          borderRadius="4px"
                          border={bordersActive}
                          onClick={() => {
                            handleBlockchainsChange(chain);
                          }}>
                          <CheckIcon
                            fontSize="11px"
                            color={text80}
                            opacity={
                              state?.filters?.blockchains?.includes(chain)
                                ? 1
                                : 0
                            }
                          />
                        </Button>

                        <Image
                          ml="15px"
                          borderRadius="full"
                          src={
                            blockchainsContent[chain]?.logo ||
                            `/logo/${chain.toLowerCase().split(' ')[0]}.png`
                          }
                          boxSize="25px"
                          minW="25px"
                          mr="10px"
                        />
                        <TextSmall>{chain}</TextSmall>
                      </Flex>
                    );
                  })}
                </Flex>
              </Flex>
            ) : null}
            {name === 'categories' ? (
              <Flex wrap="wrap" w="100%">
                {newDefault
                  ?.sort(entry =>
                    state.filters?.categories?.includes(entry) ? -1 : 1,
                  )
                  ?.filter((_, i) => i < 5)
                  .map(categorie => (
                    <Button
                      variant="outlined_grey"
                      borderRadius="16px"
                      mt="7.5px"
                      h="30px"
                      mr="7.5px"
                      bg={
                        state.filters.categories?.includes(categorie)
                          ? hover
                          : boxBg6
                      }
                      border={borders}
                      color={text80}
                      onClick={() => handleCategoryChange(categorie)}>
                      <TextSmall mt="1px" m="0px">
                        {categorie}
                      </TextSmall>
                      {state.filters.categories?.includes(categorie) ? (
                        <CloseIcon fontSize="9px" ml="5px" />
                      ) : null}
                    </Button>
                  ))}
                <Button
                  variant="outlined_grey"
                  borderRadius="16px"
                  mt="7.5px"
                  h="30px"
                  mr="7.5px"
                  bg={boxBg6}
                  border={borders}
                  color={text80}
                  onClick={() => {
                    setTypePopup('edit');
                    setShowCategories(true);
                  }}>
                  <TextSmall mt="1px" m="0px">
                    See all
                  </TextSmall>
                </Button>
              </Flex>
            ) : null}

            <Flex mt="10px">
              <Button
                w="50%"
                h={['35px', '40px']}
                variant="outlined_grey"
                onClick={() => {
                  setIsLoading(true);
                  setLoadTime(true);

                  const commonFilters = {
                    ...state.filters,
                    [name]: {from: 0, to: maxValue},
                  };

                  let newFilters = {};
                  let edit = false;

                  switch (name) {
                    case 'categories':
                      dispatch({type: ACTIONS.RESET_CATEGORY});
                      newFilters = {
                        ...commonFilters,
                        [name]: defaultCategories,
                      };
                      edit = true;
                      break;
                    case 'blockchains':
                      dispatch({type: ACTIONS.RESET_BLOCKCHAINS});
                      newFilters = {
                        ...commonFilters,
                        [name]: Object.keys(blockchainsContent),
                      };
                      edit = true;
                      break;
                    default:
                      dispatch({type: ACTIONS.RESET_FILTER, payload: {name}});
                      if (activeView?.name === 'All') {
                        newFilters = commonFilters;
                      } else {
                        newFilters = commonFilters;
                        edit = true;
                      }
                      break;
                  }

                  setActiveView({
                    ...state,
                    filters: newFilters,
                    isFirst: false,
                  });
                  if (activeView?.name === 'All') {
                    const activeViewStr = formatDataForFilters(
                      {
                        ...state,
                        name: 'All',
                        filters: newFilters,
                        isFirst: false,
                      },
                      state,
                    );
                    Cookies.set(`view-${address}`, activeViewStr, {
                      secure: process.env.NODE_ENV !== 'development',
                      sameSite: 'strict',
                    });
                  }
                  if (edit && activeView?.name !== 'All') {
                    const {id} = activeView;
                    editView({
                      account: user?.address,
                      user_id: user?.id,
                      color: state.color,
                      name: state.name,
                      is_favorite: state.is_favorite,
                      display: state.display,
                      filters: newFilters,
                      id,
                    });
                  }
                }}>
                Reset
              </Button>
              <Button
                mb="0px"
                h={['35px', '40px']}
                ml="5px"
                variant="outlined"
                bg={boxBg6}
                w="50%"
                _hover={{border: '1px solid var(--chakra-colors-blue)'}}
                transition="all 250ms ease-in-out"
                onClick={() => {
                  if (!activeView) return;
                  setIsLoading(true);
                  setLoadTime(true);
                  if (activeView.name === 'All') {
                    setActiveView({...state, name: 'All', isFirst: false});
                    if (!user || !activeView) return;
                    const activeViewStr = formatDataForFilters(
                      {...state, name: 'All', isFirst: false},
                      state,
                    );
                    Cookies.set(`view-${address}`, activeViewStr, {
                      secure: process.env.NODE_ENV !== 'development',
                      sameSite: 'strict',
                    });
                    setLoadTime(false);
                    onClose();
                  } else if (activeView.name !== 'All') {
                    const {id} = activeView;
                    setActiveView({
                      ...activeView,
                      color: state.color,
                      name: state.name,
                      is_favorite: state.is_favorite,
                      display: state.display,
                      filters: state.filters,
                    });
                    editView({
                      account: user?.address,
                      user_id: user?.id,
                      color: state.color,
                      name: state.name,
                      is_favorite: state.is_favorite,
                      display: state.display,
                      filters: state.filters,
                      id,
                    });
                  }
                }}>
                {loadTime ? (
                  <Spinner
                    thickness="2px"
                    speed="0.65s"
                    emptyColor={boxBg3}
                    color="blue"
                    size="xs"
                    mr="7.5px"
                  />
                ) : null}
                Apply
              </Button>{' '}
            </Flex>
          </Flex>
        </PopoverBody>
      </PopoverContent>
    </Popover>
  );
};
