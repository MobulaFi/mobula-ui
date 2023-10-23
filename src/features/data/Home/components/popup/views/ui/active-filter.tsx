import {Icon} from '@chakra-ui/icons';
import {Flex} from '@chakra-ui/react';
import {PiDotsNineBold} from 'react-icons/pi';
import {useColors} from '../../../../../../../common/utils/color-mode';

export const ActiveFilters = ({name, ...props}) => {
  const {hover, borders} = useColors();
  return (
    <Flex
      align="center"
      px={['7.5px', '10px']}
      mr="7.5"
      bg={hover}
      borderRadius="full"
      w="fit-content"
      h={['25px', '30px']}
      mt="7.5px"
      border={borders}
      fontSize={['12px', '12px', '13px', '14px']}
      cursor="pointer"
      {...props}>
      <Icon as={PiDotsNineBold} mr="7.5px" />
      {name}
    </Flex>
  );
};
