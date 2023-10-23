import type {ComponentStyleConfig} from '@chakra-ui/react';

export const Button: ComponentStyleConfig = {
  baseStyle: {},
  sizes: {},
  defaultProps: {
    size: '',
    variant: '',
  },
  variants: {
    default: props => ({
      color: 'var(--text-primary)',
      fontWeight: '500',
      fontSize: ['12px', '12px', '13px', '14px'],
    }),
    primary: props => ({
      bg: 'var(--box_primary)',
      color: 'var(--text-primary)',
      border: '1px solid var(--box_border)',
      borderRadius: '4px',
      boxShadow: '1px 2px 12px 3px var(--shadow)',
      _hover: {
        bg: 'var(--box_primary)',
        color: 'var(--text-primary)',
        border: '1px solid var(--box_border)',
        boxShadow: '1px 2px 12px 3px var(--shadow)',
      },
    }),
    secondary: props => ({
      bg: 'var(--box_active)',
      color: 'var(--text-primary)',
      border: '1px solid var(--box_border_active)',
      boxShadow: '1px 2px 12px 3px var(--shadow)',
      _hover: {
        bg: 'var(--box_active)',
        color: 'var(--text-primary)',
        border: '1px solid var(--box_border_active)',
        boxShadow: '1px 2px 12px 3px var(--shadow)',
      },
    }),
    blue: props => ({
      bg: 'var(--blue)',
      color: 'white',
      boxShadow: '1px 2px 12px 3px var(--shadow)',
    }),
    elections: props => ({
      bg: 'var(--elections)',
      color: 'white',
      boxShadow: '1px 2px 12px 3px var(--shadow)',
    }),
    outlined: props => ({
      height: '35px',
      width: '100%',
      borderRadius: '4px',
      fontWeight: '400',
      fontSize: ['12px', '12px', '13px', '14px'],
      border: '1px solid #5c7df9',
      px: '8px',
      _hover: {border: '1px solid #5c7df9'},
      transition: 'all 250ms ease-in-out',
    }),
    outlined_grey: props => ({
      color: 'var(--chakra-colors-text_primary)',
      fontWeight: '400',
      fontSize: ['12px', '12px', '13px', '14px'],
      px: '12px',
      h: '35px',
      transition: 'all 250ms ease-in-out',
      borderRadius: '4px',
      bg: 'var(--chakra-colors-bg_hover)',
      border: '1px solid var(--chakra-colors-border_principal)',
      _hover: {
        border: '1px solid var(--chakra-colors-border_secondary)',
        bg: 'var(--chakra-colors-bg_hover)',
      },
    }),
  },
};
