import { childrenProps } from '@/interfaces'
import React from 'react'

const Body: React.FC<childrenProps> = ({children}) => {
  return (
    <div className="body-cont">
        {children}
    </div>
  )
}

export default Body