import React from 'react'
interface Error {
    error: string | null;
}
const Error: React.FC<Error> = ({error}) => {
  return (
    <>
    { error && <div className="error">{error}</div> }
    </>
  )
}

export default Error