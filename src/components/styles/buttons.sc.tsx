import styled from "styled-components";
import { darken } from 'polished';

export const $Button = styled.button`
  outline: 0;
  text-transform: uppercase;
  border-radius: 4px;
  padding: 5px 10px;
  font-size: 13px;
`;

export const $FlatButton = styled($Button) <{ $ghost: boolean, $color: string }>`
  
  border: ${props => !props.$ghost ? '2px solid' + props.$color : 0};
  background-color: ${props => !props.$ghost ? 'white' : props.$color};

  &:hover:enabled {
    background-color: ${props => !props.$ghost ? props.$color : darken(0.10, props.$color)};
    cursor: pointer;
  }

  ${props => !props.$ghost && `
    &:active:enabled {
      background-color: ${darken(0.10, props.$color)};
    }`
  };
`;

export const $FlatGhostButton = styled($Button) <{ $color?: string }>`
  border: 2px solid ${props => props.$color ?? props.theme.color.blue};
  background-color: white;

  &:hover:enabled {
    background-color: ${props => props.$color ?? props.theme.color.blue};
    cursor: pointer;
  }

  &:active:enabled {
    background-color: ${props => darken(0.10, props.$color ?? props.theme.color.blue)};
  }
`;

export const $FlatFilledButton = styled($Button) <{ $color: string }>`
  border: 0;
  color: white;
  background-color: ${props => props.$color};

  &:hover:enabled {
    background-color: ${props => darken(0.10, props.$color)};
    cursor: pointer;
  }
`;