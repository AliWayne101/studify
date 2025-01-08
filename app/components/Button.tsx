'use client';
import { ButtonProps } from '@/interfaces'
import React from 'react'
import "../css/sections/components/button.scss";

const Button:React.FC<ButtonProps> = ({onClick, children}) => {
  return (
    <button onClick={onClick}>{children}</button>
  )
}

export default Button
