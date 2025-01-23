import React from 'react'
interface Error {
  error: string | null;
}
const ErrorContainer: React.FC<Error> = ({ error }) => {
  return (
    <>
      {error && <div className="error">{error}</div>}
    </>
  )
}

export default ErrorContainer