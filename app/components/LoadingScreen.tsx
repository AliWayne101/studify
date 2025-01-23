import React from 'react'
import Loading from './Loading'

interface LoadingProps {
    children: React.ReactNode;
    IsLoadingCompleted: boolean;
}

const LoadingScreen: React.FC<LoadingProps> = ({ children, IsLoadingCompleted }) => {
    return (
        <>
            {IsLoadingCompleted ?
                children
                :
                <Loading Size={48} />
            }
        </>
    )
}

export default LoadingScreen