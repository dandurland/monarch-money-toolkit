import * as React from 'react';
import type { DefaultTheme } from 'styled-components';
import styled from 'styled-components';

import $Flex from './flex.sc';
import { isNotNil } from 'toolkit/common/uitilities/isNil';

type SpacingProps = {
  margin?: keyof DefaultTheme['spacing'];
  marginHorizontal?: keyof DefaultTheme['spacing'];
  marginVertical?: keyof DefaultTheme['spacing'];

  marginLeft?: keyof DefaultTheme['spacing'];
  marginRight?: keyof DefaultTheme['spacing'];
  marginTop?: keyof DefaultTheme['spacing'];
  marginBottom?: keyof DefaultTheme['spacing'];

  padding?: keyof DefaultTheme['spacing'];
  paddingHorizontal?: keyof DefaultTheme['spacing'];
  paddingVertical?: keyof DefaultTheme['spacing'];

  // TODO
  // paddingLeft?: keyof DefaultTheme['spacing'];
  // paddingRight?: keyof DefaultTheme['spacing'];
  // paddingTop?: keyof DefaultTheme['spacing'];
  // paddingBottom?: keyof DefaultTheme['spacing'];

  gap?: keyof DefaultTheme['spacing'];
};
type Props = {
  children?: React.ElementType | React.ReactNode | React.ReactNode[] | unknown | null;
  className?: string;

  full?: boolean;
  inline?: boolean;
  center?: boolean;

  rowReverse?: boolean;
  column?: boolean;
  columnReverse?: boolean;

  wrap?: boolean;
  wrapReverse?: boolean;

  alignCenter?: boolean;
  alignStart?: boolean;
  alignEnd?: boolean;
  alignBaseline?: boolean;
  alignStretch?: boolean;

  contentCenter?: boolean;
  contentStart?: boolean;
  contentEnd?: boolean;
  contentBaseline?: boolean;
  contentStretch?: boolean;
  contentAround?: boolean;

  justifyCenter?: boolean;
  justifyStart?: boolean;
  justifyEnd?: boolean;
  justifyBetween?: boolean;
  justifyAround?: boolean;
  justifyEvenly?: boolean;
} & SpacingProps &
  Pick<
    React.HTMLProps<HTMLDivElement>,
    'id' | 'onClick' | 'onMouseEnter' | 'onMouseLeave' | 'style'
  >;

const Flex = styled($Flex)<Props>`
  margin: ${({
    theme,
    margin,
    marginHorizontal,
    marginVertical,
    marginTop,
    marginBottom,
    marginLeft,
    marginRight,
  }) => {
    switch (true) {
      case isNotNil(margin):
        return theme.spacing[margin!];
      case isNotNil(marginHorizontal) || isNotNil(marginVertical):
        return `${marginVertical ? theme.spacing[marginVertical] : 0} ${
          marginHorizontal ? theme.spacing[marginHorizontal] : 0
        }`;
      case isNotNil(marginTop) ||
        isNotNil(marginBottom) ||
        isNotNil(marginLeft) ||
        isNotNil(marginRight):
        return `${marginTop ? theme.spacing[marginTop] : 0} ${
          marginRight ? theme.spacing[marginRight] : 0
        } ${marginBottom ? theme.spacing[marginBottom] : 0} ${
          marginLeft ? theme.spacing[marginLeft] : 0
        }`;
      default:
        return '0';
    }
  }};
  padding: ${({ theme, padding, paddingHorizontal, paddingVertical }) => {
    switch (true) {
      case isNotNil(padding):
        return theme.spacing[padding!];
      case isNotNil(paddingHorizontal) || isNotNil(paddingVertical):
        return `${paddingVertical ? theme.spacing[paddingVertical] : 0} ${
          paddingHorizontal ? theme.spacing[paddingHorizontal] : 0
        }`;
    }
  }};
  gap: ${({ theme, gap }) => (gap ? theme.spacing[gap] : 0)};
`;

const FlexContainer: React.ForwardRefRenderFunction<HTMLDivElement, Props> = (
  props: Props,
  ref,
  // @ts-ignore issue with the children prop
) => <Flex ref={ref as any} {...props} />;

export const $FlexContainer = React.forwardRef(FlexContainer);