'use client';
import { ButtonProps } from '@/interfaces'
import React from 'react'
import "../css/sections/components/button.scss";

const Button:React.FC<ButtonProps> = ({onClick, Disabled, children}) => {
  return (
    <button onClick={onClick} disabled={Disabled} className={Disabled ? 'disabled' : ''}>
      {children}
    </button>
  )
}

export default Button
