import React from 'react';
import App from './App';
import './index.css';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import NotFoundPage from './pages/not-found/NotFoundPage';
import { store } from './store/store';
import TestSitemap from './pages/test-sitemap-page/TestSitemap';
import TestUiKit from './pages/test-ui-kit/TestUiKit';
import MainPage from './pages/main/MainPage';
import ProfilePage from './pages/profile/ProfilePage';
import ProjectPage from './pages/project/ProjectPage';
import ProjectsPage from './pages/projects/ProjectsPage';
import EmpathyMapPage from './pages/empathy-map/EmpathyMapPage';
import CompetitorAnalysisPage from './pages/competitor-analysis/CompetitorAnalysisPage';
import UxPersonasPage from './pages/ux-personas/UxPersonasPage';
import { PrivateRoute } from './components/private-route/PrivateRoute';
import { ErrorBoundary } from 'react-error-boundary';
import PasswordResetPage from './pages/password-reset/PasswordResetPage';

const router = createBrowserRouter([
    {
        path: '/',
        element: <App />,
        children: [
            {
                path: '/',
                element: <MainPage />,
            },
            {
                path: '/profile',
                element: (
                    <PrivateRoute>
                        <ProfilePage />
                    </PrivateRoute>
                ),
            },
            {
                path: '/project/:SK',
                element: (
                    <PrivateRoute>
                        <ProjectPage />
                    </PrivateRoute>
                ),
            },
            {
                path: '/projects',
                element: (
                    <PrivateRoute>
                        <ProjectsPage />
                    </PrivateRoute>
                ),
            },
            {
                path: '/empathymap',
                element: <EmpathyMapPage />,
            },
            {
                path: '/empathymap/:PK/:SK',
                element: (
                    <PrivateRoute>
                        <EmpathyMapPage />
                    </PrivateRoute>
                ),
            },
            {
                path: '/competitoranalysis',
                element: <CompetitorAnalysisPage />,
            },
            {
                path: '/competitoranalysis/:PK/:SK',
                element: (
                    <PrivateRoute>
                        <CompetitorAnalysisPage />
                    </PrivateRoute>
                ),
            },
            {
                path: '/uxpersonas',
                element: <UxPersonasPage />,
            },
            {
                path: '/uxpersonas/:PK/:SK',
                element: (
                    <PrivateRoute>
                        <UxPersonasPage />
                    </PrivateRoute>
                ),
            },
            {
                path: '/passwordReset',
                element: <PasswordResetPage />,
            },
            {
                path: '/testsitemap',
                element: <TestSitemap />,
            },
            {
                path: '/testuikit',
                element: <TestUiKit />,
            },
        ],
        errorElement: <NotFoundPage />,
    },
]);

const root = createRoot(document.getElementById('root')!);

root.render(
    <ErrorBoundary fallback={<div>Something went wrong</div>}>
        <React.StrictMode>
            <Provider store={store}>
                <RouterProvider router={router} />
            </Provider>
        </React.StrictMode>
    </ErrorBoundary>
);
