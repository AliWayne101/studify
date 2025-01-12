import React from 'react'
import { CircleLoader } from 'react-spinners'

const Loading = ({Size}: {Size: number}) => {
  return (
    <CircleLoader color='var(--theme-main)' size={Size} />
  )
}

export default Loading