import styled, { keyframes } from 'styled-components';
import { darken } from 'polished';

export const $WidgetTitle = styled.div`
  margin-bottom: 12px;
`;

export const $WidgetRoot = styled.div<{ $isDark?: boolean }> `
  display: flex;
  flex-flow: column;
  -webkit-box-pack: start;
  place-content: stretch flex-start;
  border-radius: 8px;
  box-shadow: rgba(0, 40, 100, 0.04) 0px 4px 8px;
  background-color: ${props => props.$isDark ? '#0D2C5C' : '#ffffff'};
`;

export const $Widget = styled.div<{ $isDark?: boolean }> `
  display: flex;
  flex-flow: column;
  -webkit-box-pack: start;
  place-content: stretch flex-start;
  border-radius: 8px;
  box-shadow: rgba(0, 40, 100, 0.04) 0px 4px 8px;
  padding: 16px 24px;
  background-color: ${props => props.$isDark ? '#0D2C5C' : '#ffffff'};
`;

export const $WidgetHeader = styled.div<{ $isDark?: boolean }> `
  display: flex;
  flex-flow: row;
  -webkit-box-pack: start;
  place-content: stretch flex-start;
  margin: 0px;
  gap: 0px;
  padding: 20px 20px 16px 24px;
  border-bottom: 1px solid ${props => props.$isDark ? '#082043' : '#f4f8f0'};
  font-size: 20px;
  font-weight: 500;
  line-height: 150%;
`;

export const $WidgetSettingsButton = styled.button<{ $isDark?: boolean }>`
    background-color: transparent;
    border: transparent;
    color: ${props => props.$isDark ? '#ffffff' : 'rgb(46,115,235)'};
    height: 16px;
    width: 16px;
    position: relative;
    cursor:pointer;
`;

export const $FlexContainerRoot = styled.div`
  display: flex;
  flex-flow: row;
  place-content: stretch space-between;
  -webkit-box-pack: justify;
  -webkit-box-align: center;
  align-items: center;
  margin-top: 12px;
  gap: 0px;
`;

const $Total = styled.span`
  font-style: normal;
  text-align: inherit;
  line-height: 150%;
  text-transform: none;
  font-weight: 500;
`;

export const $TotalCharges = styled($Total)`
  font-size: inherit;
  color: inherit;
`;

export const $TotalAssets = styled.span`
  font-style: normal;
  text-align: inherit;
  line-height: 150%;
  text-transform: none;
  font-weight: 500;
  font-size: 14px;
  color: rgb(120, 134, 163);
`;

export const $ProgressBar = styled.div`
  margin: 12px 0px;
`;

const rotate = keyframes`
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
`;

export const $WidgetLoading = styled($FlexContainerRoot)`
  place-content: stretch center;
  -webkit-box-pack: center;
  margin: 24px;
`;

export const $LoadingSpinner = styled.div`
  --size: 40px;
  opacity: 1;
  position: relative;
  animation: 1.5s linear 0s infinite normal none running ${rotate};
  border-width: 3px;
  border-style: solid;
  border-color: rgb(218, 225, 234) rgb(218, 225, 234) rgb(50, 170, 240);
  border-image: initial;
  border-radius: 50%;
  content: "";
  transform-origin: center center;
  height: var(--size);
  width: var(--size);
  will-change: transform;
`;
