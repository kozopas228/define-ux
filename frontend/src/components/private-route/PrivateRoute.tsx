import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAppSelector } from '../../store/hooks';

interface IProps {
    children: React.ReactNode;
}

export const PrivateRoute = ({ children }: IProps) => {
    const isAuthenticated = useAppSelector(
        (state) => state.userReducer.user !== null
    );

    if (isAuthenticated) {
        return children;
    }

    return <Navigate to='/' />;
};
