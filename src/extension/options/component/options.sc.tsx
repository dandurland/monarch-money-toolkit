import styled from "styled-components";
import { $FlatGhostButton } from "toolkit/components/styles/buttons.sc";

export const $SettingTitle = styled.label`
  font-weight: 500;
`;

export const $SettingInfo = styled.div`
  display:flex;
  flex-direction: column;
  margin-left: 1rem;
  gap: 1em;
`;

export const $SettingDescription = styled.div`
  margin-top: 0.5rem;
  font-size: 0.9rem;
  line-height: 1.2rem;

  p {
    margin: 0;
  }
`;

export const $SettingContainer = styled.div<{ $hidden?: boolean }>`

  display: flex;
  flex-direction: column;
  gap: 5px;
  align-items: center;
  transform-origin: top;

  ${props => props.$hidden
  ? `
    max-height: 0px;
    transform: scaleY(0);
    margin-top: 0rem;

    transition: max-height 0.15s cubic-bezier(0, 1, 0, 1), transform 0.15s ease-in-out,
      margin-top 0.15s ease-in-out;
  `
  : `
    max-height: 1000px;
    transform: scaleY(1);
    margin-top: 1rem;

    transition: max-height 0.15s ease-in-out, transform 0.15s ease-in-out,
      margin-top 0.15s ease-in-out;
  `
};
`;

export const $SettingOptions = styled.div`
  display: flex;
  flex-direction: column;
  min-width: 400px;
  gap: 2px;
`;

export const $SettingButton = styled($FlatGhostButton) <{ $color: string }>`
  width: 100%
`;