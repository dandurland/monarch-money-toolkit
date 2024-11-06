import styled from "styled-components";
import { $FlatButton } from "toolkit/components/styles/flat-button.sc";

export const $Header = styled.h2`
  text-align: center;
  font-size: 20px;
  font-weight: 500;
  line-height: 150%;
`;

export const $Popup = styled.div`
  display: flex;
  flex-direction: column;
  align-items: stretch;
  padding: 1rem;
  gap: 1.25rem;
`;

export const $Actions = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

export const $ActionsButton = styled($FlatButton)`
  display: flex;
  gap: 0.5rem;
  align-items: center;
  justify-content: center;
`;