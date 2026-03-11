import * as process from 'process';

export async function signUp(email: string, password: string): Promise<void> {
    const signUpUrl = `${process.env.API_URL}/api/auth/sign-up`;
    const response = await fetch(signUpUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            username: email,
            password,
        }),
    });

    const jsonResponse = await response.json();

    if (!response.ok) {
        throw new Error(jsonResponse.message);
    }
}

export async function signIn(email: string, password: string): Promise<string> {
    const signInUrl = `${process.env.API_URL}/api/auth/sign-in`;
    const response = await fetch(signInUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
            username: email,
            password,
        }),
    });

    const jsonResponse = await response.json();

    if (!response.ok) {
        throw new Error(jsonResponse.message);
    }

    return jsonResponse.access_token;
}

export async function revokeRefreshToken(): Promise<void> {
    const revokeUrl = `${process.env.API_URL}/api/auth/revoke-token`;
    const response = await fetch(revokeUrl, {
        method: 'POST',
        credentials: 'include',
    });

    const jsonResponse = await response.json();
}

export async function refreshTokens(): Promise<void> {
    console.log('REFRESHING....');

    const refreshUrl = `${process.env.API_URL}/api/auth/refresh-tokens`;
    const response = await fetch(refreshUrl, {
        method: 'POST',
        credentials: 'include',
    });

    const jsonResponse = await response.json();

    if (!response.ok) {
        // console.log(jsonResponse);
        removeAccessToken();
    } else {
        setAccessToken(jsonResponse.access_token);
    }
}

export async function changePassword(
    access_token: string,
    newPassword: string
): Promise<void> {
    const changePasswordUrl = `${process.env.API_URL}/api/auth/change-password`;
    const response = await fetch(changePasswordUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${access_token}`,
        },
        credentials: 'include',
        body: JSON.stringify({
            newPassword: newPassword,
        }),
    });

    const jsonResponse = await response.json();

    if (!response.ok) {
        throw new Error(jsonResponse.message);
    }
}

export async function deleteAccount(access_token: string): Promise<void> {
    const deleteAccountUrl = `${process.env.API_URL}/api/auth/delete-account`;
    const response = await fetch(deleteAccountUrl, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${access_token}`,
        },
    });

    const jsonResponse = await response.json();

    if (!response.ok) {
        throw new Error(jsonResponse.message);
    }
}

export function getAccessToken(): string | null {
    return localStorage.getItem('access_token');
}

export function setAccessToken(token: string): void {
    localStorage.setItem('access_token', token);
}

export function removeAccessToken() {
    localStorage.removeItem('access_token');
    location.reload();
}

export async function googleAuth(authorizationCode: string): Promise<string> {
    const response = await fetch(
        `${process.env.API_URL}/api/auth/google/callback`,
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify({ code: authorizationCode }),
        }
    );

    const jsonResponse = await response.json();

    if (!response.ok) {
        throw new Error(jsonResponse.message);
    }

    return jsonResponse.access_token;
}

export async function requestPasswordReset(username: string): Promise<any> {
    const requestPasswordResetUrl = `${process.env.API_URL}/api/auth/request-password-reset`;
    const response = await fetch(requestPasswordResetUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            username,
        }),
    });

    const jsonResponse = await response.json();

    if (!response.ok) {
        throw new Error(jsonResponse.message);
    }
}

export async function resetPassword(
    userPK: string,
    resetPasswordToken: string,
    newPassword: string
): Promise<any> {
    const passwordResetUrl = `${process.env.API_URL}/api/auth/reset-password`;
    const response = await fetch(passwordResetUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            userPK,
            resetPasswordToken,
            newPassword,
        }),
    });

    const jsonResponse = await response.json();

    if (!response.ok) {
        throw new Error(jsonResponse.message);
    }
}
