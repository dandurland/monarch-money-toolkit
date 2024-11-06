import styled from "styled-components";
import { darken } from "polished";
import { $Button } from './button.sc';

export const $FlatButton = styled($Button) <{ $ghost: boolean, $color: string }>`
  
  border: ${props => props.$ghost ? 0 : '2px solid' + props.$color};
  background-color: ${props => props.$ghost ? props.$color : 'white'};
  ${props => props.$ghost && `color: white;`};

  &:hover:enabled {
    background-color: ${props => props.$ghost ? darken(0.10, props.$color) : props.$color};
    cursor: pointer;
  }

  ${props => !props.$ghost && `
    &:active:enabled {
      background-color: ${darken(0.10, props.$color)};
    }`
  };
`;