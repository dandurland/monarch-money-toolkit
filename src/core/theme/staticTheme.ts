/** Properties of theme which do not change in response to environment. */
const staticTheme = {
  fontSize: {
    xxsmall: '10px',
    xsmall: '12px',
    small: '14px',
    base: '16px',
    large: '18px',
    xlarge: '24px',
    xxlarge: '30px',
    xxxlarge: '40px',
  } as const,
  spacing: {
    xxxsmall: '2px',
    xxsmall: '4px',
    xsmall: '8px',
    small: '12px',
    medium: '14px',
    default: '16px',
    large: '20px',
    xlarge: '24px',
    xxlarge: '32px',
    xxxlarge: '48px',
    xxxxlarge: '64px',
  } as const,
  radius: {
    xxsmall: '2px',
    xsmall: '3px',
    small: '4px',
    medium: '8px',
    large: '12px',
    xlarge: '16px',
    round: '100%',
    pill: '500px', // Make pill shaped (https://stackoverflow.com/a/18795153)
  } as const,
  fontWeight: {
    book: 'normal',
    medium: '500',
    bold: '600',
  } as const,
  transition: {
    default: `all 0.1s ease-out`, // TODO: we'll want to generalize this more
    fast: 'all 150ms cubic-bezier(0.4, 0, 0.2, 1)',
    /** Generates a list of CSS transition properties with a fast timing function. */
    createFastTransitions: (props: string[]) =>
      props.map((p) => `${p} 150ms cubic-bezier(0.4, 0, 0.2, 1)`),
  } as const,
  breakPoints: { xxs: 400, xs: 576, sm: 768, md: 992, lg: 1200, xl: 1360 } as const,
};

export default staticTheme;