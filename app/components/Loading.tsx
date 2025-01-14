import React from 'react'
import { CircleLoader } from 'react-spinners'

const Loading = ({Size}: {Size: number}) => {
  return (
    <div className="center">
      <CircleLoader color='var(--theme-main)' size={Size} />
    </div>
  )
}

export default Loading