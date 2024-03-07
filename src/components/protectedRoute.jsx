// protectedRoute.jsx
import React, { useState, useEffect } from 'react';
import { Route, Navigate } from 'react-router-dom';
import { account } from '../firebase/firebase';

const ProtectedRoute = ({ element: Element, ...rest }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        const unsubscribe = account.onAuthStateChanged((user) => {
            setIsLoggedIn(!!user);
        });
        return unsubscribe;
    }, []);

    return (
        <Route
            {...rest}
            element={isLoggedIn ? <Element /> : <Navigate to="/login" />}
        />
    );
};

export default ProtectedRoute;
