import React, { useEffect, useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import Header from './components/header/Header';
import Footer from './components/footer/Footer';
import { decodeJWT } from './utils/decodeJwt';
import { useAppDispatch } from './store/hooks';
import { setAppUser } from './store/features/user/userSlice';
import { getAccessToken, googleAuth, setAccessToken } from './services/auth';
import * as process from 'process';
import CookieConsent from "./components/cookie-consent/CookieConsent";

const App = () => {
    const dispatch = useAppDispatch();
    const location = useLocation();
    const navigate = useNavigate();

    const access_token = getAccessToken();

    if (access_token) {
        const decodedJWT = decodeJWT(access_token);
        dispatch(
            setAppUser({
                username: decodedJWT.username,
                authMethod: decodedJWT.authMethod,
                PK: decodedJWT.PK,
                SK: decodedJWT.SK,
            })
        );
    }

    // console.log(`environment is: ${process.env.NODE_ENV}`);

    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        const authorizationCode = queryParams.get('code');

        async function f() {
            if (authorizationCode) {
                const googleAccessToken = await googleAuth(authorizationCode);
                setAccessToken(googleAccessToken);
                navigate('/');
                window.location.reload();
            }
        }
        f();
    }, [location.search, navigate]);

    return (
        <div className='App'>
            <Header />
            <div className='outlet_wrapper'>
                <Outlet />
            </div>
            <Footer />
            <CookieConsent/>
        </div>
    );
};

export default App;
