import {TriangleDownIcon, TriangleUpIcon} from '@chakra-ui/icons';
import {Button, Flex, Image, Link, useColorMode} from '@chakra-ui/react';
import {useEffect} from 'react';
import {getUrlFromName} from '../../../../../../../utils/helpers/formaters';
import {createSupabaseDOClient} from '../../../../../../../utils/supabase';
import {
  TextExtraSmall,
  TextLandingSmall,
  TextSmall,
} from '../../../../../../UI/Text';
import {useColors} from '../../../../../../common/utils/color-mode';
import {getDate} from '../../../../../User/Portfolio/utils';
import {useTop100} from '../../../context-manager';
import {INewsGeneral} from '../../../models';

const formatNewsSummary = (news: INewsGeneral) => {
  const elements: React.ReactNode[] = [];
  let lastIndex = 0;

  const matches = Array.from(news.summary.matchAll(/\[([^\]]+)\]/g));

  matches.forEach(match => {
    const [fullMatch, p1] = match;
    const offset = match.index || 0;

    if (offset > lastIndex) {
      elements.push(news.summary.slice(lastIndex, offset));
    }

    const assetData = news.assetsData
      ? news.assetsData[p1]
      : {price_change_24h: 0, name: ''};
    let priceChangeIcon = null;
    if (assetData.price_change_24h > 0) {
      priceChangeIcon = (
        <TriangleUpIcon boxSize="10px" color="green" mx="3px" />
      );
    } else if (assetData.price_change_24h < 0) {
      priceChangeIcon = (
        <TriangleDownIcon boxSize="10px" color="red" mx="3px" />
      );
    }

    elements.push(
      <Button
        key={offset}
        variant="outlined_grey"
        padding="2px"
        h="18px"
        fontSize={['10px', '10px', '11px', '12px']}
        fontWeight={450}
        as={Link}
        href={`https://mobula.fi/asset/${getUrlFromName(assetData.name)}`}>
        {p1} {priceChangeIcon}
      </Button>,
    );

    lastIndex = offset + fullMatch.length;
  });

  if (lastIndex < news.summary.length) {
    elements.push(news.summary.slice(lastIndex));
  }

  return elements;
};

export const AINews = ({showPage}) => {
  const {text40, text80, borders, bordersBlue} = useColors();
  const {news, setNews} = useTop100();
  const {colorMode} = useColorMode();
  const isDarkMode = colorMode === 'dark';

  useEffect(() => {
    if (news === undefined) {
      const supabase = createSupabaseDOClient();
      supabase
        .from('news')
        .select('news_count, summary, created_at')
        .order('created_at', {ascending: false})
        .limit(1)
        .single()
        .then(response => {
          setNews(response.data);
        });
    }
  }, []);

  return (
    <Flex
      minW="100%"
      direction="column"
      w="200px"
      transform={`translateX(-${showPage * 100}%)`}
      transition="all 250ms ease-in-out">
      <Flex
        align="center"
        justify="space-between"
        w="100%"
        p="10px 15px 0px 15px">
        <Flex align="center">
          <TextLandingSmall color={text80}>News</TextLandingSmall>
          <TextLandingSmall color={text40} ml="7.5px">
            {news?.created_at ? getDate(Date.parse(news?.created_at)) : ''}
          </TextLandingSmall>
        </Flex>
      </Flex>
      <TextSmall
        p="0px 15px 10px 15px"
        mt="10px"
        maxH="110px"
        overflowY="scroll"
        className="scroll"
        color={text80}>
        {news ? formatNewsSummary(news) : 'Loading...'}
      </TextSmall>
      <Flex
        align="center"
        justify="space-between"
        borderTop={borders}
        py="6px"
        px="15px"
        mt="auto">
        <Flex align="center">
          <Image
            src={
              isDarkMode
                ? '/mobula/mobula-logo.svg'
                : '/mobula/mobula-light-logo.svg'
            }
            boxSize="15px"
            w="15px"
            borderRadius="full"
            mr="7.5px"
          />
          <TextSmall color={text80} mr="7.5px">
            Mobula AI
          </TextSmall>
          <Flex
            borderRadius="12px"
            px="6px"
            align="center"
            h="20px"
            border={bordersBlue}>
            <Flex borderRadius="full" boxSize="5px" bg="blue" />
            <TextExtraSmall mb="0px" ml="5px">
              Bot
            </TextExtraSmall>
          </Flex>
        </Flex>
        <TextSmall color={text40}>
          Based on +{news?.news_count || '...'} news
        </TextSmall>
      </Flex>
    </Flex>
  );
};
