import * as React from 'react';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { getBrowser } from "toolkit/core/common/browser";
import { $FlatButton } from 'toolkit/components/styles/buttons.sc';
import { $FlexContainer } from 'toolkit/components/styles/flex-container.sc';

export const $Header = styled.h2`
  text-align: center;
  font-size: 20px;
  font-weight: 500;
  line-height: 150%;
`;

const $Popup = styled($FlexContainer).attrs({ column: true, alignStretch: true })`
  padding: 1rem;
  gap: 1.25rem;
`;

export const $Actions = styled($FlexContainer).attrs({ column: true })`
  gap: 0.5rem;
`;

export const $ActionsButton = styled($FlatButton)`
  display: flex;
  gap: 0.5rem;
  align-items: center;
  justify-content: center;
`;

export function Popup() {

  const { runtime, tabs } = getBrowser();
  const { version, name } = runtime.getManifest();

  return (
    <$Popup>
      <$Header>Monarch Money Toolkit</$Header>
      <$Actions>
        <$ActionsButton $color={"#32AAF0"} $ghost={false} onClick={() => {
          runtime.openOptionsPage();
        }}>
          <FontAwesomeIcon icon={['fas', 'cog']} /> <div>Open Settings</div>
        </$ActionsButton>
      </$Actions>
    </$Popup>
  );
}