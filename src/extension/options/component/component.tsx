import * as React from 'react';
import { faBug, faCog, faStop, faPlay, faUndoAlt, faEyeDropper } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { EffectiveBalanceSettings } from 'toolkit/extension/toolkit/features/dashboard/effective-balance/settings';
import { ReadyToAssignSettings } from 'toolkit/extension/toolkit/features/dashboard/ready-to-assign/settings';
import ToggleSwitch from 'toolkit/components/toggle-switch/component';
import { ColorOverspentCategoriesSettings } from 'toolkit/extension/toolkit/features/budget/color-overspent-categories/Settings';
import { $SettingsGroup, $SettingsGroupHeader } from './options.sc';


export function Options({ settings }: { settings: any }) {

  function ColorPicker({
    id,
    resetColor,
    onChange,
    value,
  }: {
    resetColor: string;
    onChange(hex: string): void;
    value: string;
    id: string;
  }) {
    return (
      <div className="color-picker">
        <input
          className="color-picker__input"
          id={id}
          type="color"
          onChange={(e) => onChange(e.currentTarget.value)}
          value={value}
        />
        <label className="color-picker__selector" htmlFor={id} style={{ backgroundColor: value }} />
        <div className="color-picker__actions">
          <span className="color-picker__action">
            <FontAwesomeIcon
              className="color-picker__icon"
              icon={faUndoAlt}
              onClick={() => onChange(resetColor)}
            />
          </span>
          <label htmlFor={id} className="color-picker__action">
            <FontAwesomeIcon className="color-picker__icon" icon={faEyeDropper} />
          </label>
        </div>
      </div>
    );
  }

  return (
    <div>
      <$SettingsGroupHeader>Dashboard Widgets</$SettingsGroupHeader>
      <$SettingsGroup>
        <EffectiveBalanceSettings settings={settings?.EffectiveBalanceFeature} />
        <ReadyToAssignSettings settings={settings?.ReadyToAssignFeature} />
      </$SettingsGroup>
      <$SettingsGroupHeader>Budget</$SettingsGroupHeader>
      <$SettingsGroup>
        <ColorOverspentCategoriesSettings settings={settings?.ColorOverspentCategoriesFeature} />
      </$SettingsGroup>
    </div>
  );
}