import React from "react";
import './styles.scss'

interface props {
  id?: string;
  name?: string;
  checked: boolean;
  disabled?: boolean;
  onChange(checked: boolean): void;
}
const ToggleSwitch = ({
  id,
  name,
  checked,
  disabled,
  onChange }: props) => {
  return (
    <div className='toggle'>
      <div className='toggle-switch'>
        <input type="checkbox"
          className="checkbox"
          name={name}
          id={id}
          checked={checked}
          onChange={(e) => onChange(e.currentTarget.checked)}
          disabled={disabled ?? false}
        />
        <label className="label" htmlFor={id}>
          <span className="inner" />
          <span className="switch" />
        </label>
      </div>
    </div>
  )
}

export default ToggleSwitch;