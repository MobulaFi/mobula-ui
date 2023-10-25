export const Link = {
  baseStyle: {
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    color: 'var(--text-primary)',
    textOverflow: 'ellipsis',
    transition: 'color 200ms ease-in-out',
    _hover: {
      color: '#556b90',
      transition: 'color 200ms ease-in-out',
      cursor: 'pointer',
      textDecoration: 'none',
    },
  },
  sizes: {},
  variants: {},
  defaultProps: {
    size: '',
    variant: '',
  },
};
