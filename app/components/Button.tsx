'use client';
import { ButtonProps } from '@/interfaces'
import React, { useState } from 'react'
import "../css/sections/components/button.scss";

const Button:React.FC<ButtonProps> = ({onClick, Disabled, children, SingleUse}) => {
  const [permDisabled, setPermDisabled] = useState(false);
  const handleClick = () => {
    if (SingleUse)
      setPermDisabled(true);

    if (onClick)
      onClick();
  }
  return (
    <button onClick={handleClick} disabled={Disabled || permDisabled} className={Disabled || permDisabled ? 'disabled' : ''}>
      {children}
    </button>
  )
}

export default Button
