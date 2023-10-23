import {Button, Flex, useColorMode} from '@chakra-ui/react';
import {useEffect, useState} from 'react';
import {useColors} from '../../../../../common/utils/color-mode';
// import {AINews} from "./AI-news";
import {getDiscoverInfos} from '../../constants';
import {AINews} from './AI-news';
import {Discover} from './discover';

export const BoxRight = ({showPageMobile}: {showPageMobile?: number}) => {
  const {boxBg3, borders, text40, text80} = useColors();
  const [showPage, setShowPage] = useState(0);
  const {colorMode} = useColorMode();
  const isDark = colorMode === 'dark';

  const render = [
    <AINews showPage={showPage} key="AiNews" />,
    <Discover
      showPage={showPage}
      info={getDiscoverInfos(isDark)[0]}
      key="Discover1"
    />,
    <Discover
      showPage={showPage}
      info={getDiscoverInfos(isDark)[1]}
      key="Discover2"
    />,
    <Discover
      showPage={showPage}
      info={getDiscoverInfos(isDark)[2]}
      key="Discover3"
    />,
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setShowPage(prevPage => (prevPage + 1) % 4);
    }, 20000);
    return () => {
      clearInterval(interval);
    };
  }, []);

  return (
    <Flex
      h={['175px', '175px', '175px', '200px']}
      borderRadius="12px"
      overflow="hidden"
      border={borders}
      bg={boxBg3}
      position="relative"
      ml={['0px', '0px', '10px']}
      minW={['100%', '100%', '407px']}
      w={['100%', '31.5%']}
      transform={`translateX(-${showPageMobile * 100}%)`}
      transition="all 500ms ease-in-out"
      zIndex={showPageMobile === 2 ? 3 : 1}>
      <Flex
        align="center"
        position="absolute"
        top="0px"
        right="0px"
        h="35px"
        px="15px"
        bg={boxBg3}
        zIndex="1">
        {render.map((_, idx) => (
          <Button
            borderRadius="full"
            key={Math.random()}
            boxSize={showPage === idx ? '9px' : '8px'}
            w={showPage === idx ? '9px' : '8px'}
            bg={showPage === idx ? text80 : text40}
            ml="5px"
            transition="all 500ms ease-in-out"
            onClick={() => setShowPage(idx)}
          />
        ))}
      </Flex>
      {render}
    </Flex>
  );
};
