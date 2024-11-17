import type * as React from 'react';
import styled, { css } from 'styled-components';

type Props = {
  children?: React.ReactNode | React.ReactNode[];
  className?: string;

  full?: boolean;
  inline?: boolean;
  center?: boolean;

  row?: boolean;
  rowReverse?: boolean;
  column?: boolean;
  columnReverse?: boolean;

  wrap?: boolean;
  nowrap?: boolean;
  wrapReverse?: boolean;

  alignCenter?: boolean;
  alignStart?: boolean;
  alignEnd?: boolean;
  alignBaseline?: boolean;
  alignStretch?: boolean;

  contentCenter?: boolean;
  contentStart?: boolean;
  contentEnd?: boolean;
  contentSpaceBetween?: boolean;
  contentStretch?: boolean;
  contentSpaceAround?: boolean;

  justifyCenter?: boolean;
  justifyStart?: boolean;
  justifyEnd?: boolean;
  justifyBetween?: boolean;
  justifyAround?: boolean;

  gap?: string;
} & Pick<React.HTMLProps<HTMLDivElement>, 'onClick' | 'id'>;

const notForwardedProps: string[] = [
  'full',
  'inline',
  'center',
  'row',
  'rowReverse',
  'column',
  'columnReverse',
  'wrap',
  'nowrap',
  'wrapReverse',
  'alignCenter',
  'alignStart',
  'alignEnd',
  'alignBaseline',
  'alignStretch',
  'contentCenter',
  'contentStart',
  'contentEnd',
  'contentSpaceBetween',
  'contentStretch',
  'contentSpaceAround',
  'justifyCenter',
  'justifyStart',
  'justifyEnd',
  'justifyBetween',
  'justifyAround',
];

// See https://github.com/SaraVieira/styled-flex-component/blob/master/src/flex.js
const $Flex = styled.div.withConfig({
  shouldForwardProp: (prop) => !notForwardedProps.includes(prop),
})`
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  justify-content: flex-start;
  align-content: stretch;
  /********************************* display *********************************/
  /***************** http://cssreference.io/property/display *****************/
  ${(props: Props) =>
    props.inline &&
    css`
      display: inline-flex;
    `};
  /******************************** direction ********************************/
  /************** http://cssreference.io/property/flex-direction **************/
  ${(props: Props) =>
    props.row &&
    css`
      flex-direction: row; /* default */
    `};
  ${(props: Props) =>
    props.rowReverse &&
    css`
      flex-direction: row-reverse;
    `};
  ${(props: Props) =>
    props.column &&
    css`
      flex-direction: column;
    `};
  ${(props: Props) =>
    props.columnReverse &&
    css`
      flex-direction: column-reverse;
    `};
  /*********************************** wrap ***********************************/
  /**************** http://cssreference.io/property/flex-wrap ****************/
  ${(props: Props) =>
    props.nowrap &&
    css`
      flex-wrap: nowrap; /* default */
    `};
  ${(props: Props) =>
    props.wrap &&
    css`
      flex-wrap: wrap;
    `};
  ${(props: Props) =>
    props.wrapReverse &&
    css`
      flex-wrap: wrap-reverse;
    `};
  /***************************** justify-content *****************************/
  /************* http://cssreference.io/property/justify-content *************/
  ${(props: Props) =>
    props.justifyStart &&
    css`
      justify-content: flex-start; /* default */
    `};
  ${(props: Props) =>
    props.justifyEnd &&
    css`
      justify-content: flex-end;
    `};
  ${(props: Props) =>
    props.justifyCenter &&
    css`
      justify-content: center;
    `};
  ${(props: Props) =>
    props.justifyBetween &&
    css`
      justify-content: space-between;
    `};
  ${(props: Props) =>
    props.justifyAround &&
    css`
      justify-content: space-around;
    `};
  /****************************** align-content ******************************/
  /************** http://cssreference.io/property/align-content **************/
  ${(props: Props) =>
    props.contentStart &&
    css`
      align-content: flex-start;
    `};
  ${(props: Props) =>
    props.contentEnd &&
    css`
      align-content: flex-end;
    `};
  ${(props: Props) =>
    props.contentCenter &&
    css`
      align-content: center;
    `};
  ${(props: Props) =>
    props.contentSpaceBetween &&
    css`
      align-content: space-between;
    `};
  ${(props: Props) =>
    props.contentSpaceAround &&
    css`
      align-content: space-around;
    `};
  ${(props: Props) =>
    props.contentStretch &&
    css`
      align-content: stretch; /* default */
    `};
  /******************************* align-items *******************************/
  /*************** http://cssreference.io/property/align-items ***************/
  ${(props: Props) =>
    props.alignStart &&
    css`
      align-items: flex-start;
    `};
  ${(props: Props) =>
    props.alignEnd &&
    css`
      align-items: flex-end;
    `};
  ${(props: Props) =>
    props.alignCenter &&
    css`
      align-items: center;
    `};
  ${(props: Props) =>
    props.alignBaseline &&
    css`
      align-items: baseline;
    `};
  ${(props: Props) =>
    props.alignStretch &&
    css`
      align-items: stretch;
    `};
  /******************************** utilities ********************************/
  ${(props: Props) =>
    props.full &&
    css`
      width: 100%;
      height: 100%;
      flex-basis: 100%;
    `};
  ${(props: Props) =>
    props.center &&
    css`
      align-items: center;
      justify-content: center;
    `};
  gap: ${(props: Props) => props.gap};
`;

export default $Flex;