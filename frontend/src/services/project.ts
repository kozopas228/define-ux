import { getAccessToken, refreshTokens } from './auth';
import { Project } from '../types/project';
import { HttpStatus } from '../utils/httpStatus';
import { JWT_EXPIRED_MESSAGE } from '../utils/constants';
import * as process from "process";

export async function createNewProject(): Promise<string> {
    const access_token = getAccessToken();
    if (!access_token) {
        throw new Error('Access token was not present in local storage');
    }

    const createNewProjectUrl = `${process.env.API_URL}/api/projects`;
    const response = await fetch(createNewProjectUrl, {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${access_token}`,
        },
    });

    const jsonResponse = await response.json();

    if (
        response.status === HttpStatus.UNAUTHORIZED &&
        jsonResponse.message == JWT_EXPIRED_MESSAGE
    ) {
        await refreshTokens();
        return await createNewProject();
    }

    return jsonResponse.SK;
}

export async function findOneProject(PK: string, SK: string): Promise<Project> {
    const access_token = getAccessToken();
    if (!access_token) {
        throw new Error('Access token was not present in local storage');
    }

    const encodedPKSK = `${encodeURIComponent(PK)}/${encodeURIComponent(SK)}`;

    const findOneProjectUrl = `${process.env.API_URL}/api/projects/${encodedPKSK}`;

    const response = await fetch(findOneProjectUrl, {
        method: 'GET',
        headers: {
            Authorization: `Bearer ${access_token}`,
        },
    });

    const jsonResponse = await response.json();

    if (
        response.status === HttpStatus.UNAUTHORIZED &&
        jsonResponse.message == JWT_EXPIRED_MESSAGE
    ) {
        await refreshTokens();
        return await findOneProject(PK, SK);
    }

    return jsonResponse;
}

export async function saveProject(
    SK: string,
    name: string,
    description?: string
): Promise<void> {
    const access_token = getAccessToken();
    if (!access_token) {
        throw new Error('Access token was not present in local storage');
    }

    const saveProjectUrl = `${process.env.API_URL}/api/projects`;

    const response = await fetch(saveProjectUrl, {
        method: 'PATCH',
        headers: {
            Authorization: `Bearer ${access_token}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            SK,
            name,
            description,
        }),
    });

    const jsonResponse = await response.json();

    if (
        response.status === HttpStatus.UNAUTHORIZED &&
        jsonResponse.message == JWT_EXPIRED_MESSAGE
    ) {
        await refreshTokens();
        return await saveProject(SK, name, description);
    }
}

export async function getAllProjects(): Promise<Project[]> {
    const access_token = getAccessToken();
    if (!access_token) {
        throw new Error('Access token was not present in local storage');
    }

    const getAllProjectsUrl = `${process.env.API_URL}/api/projects`;

    const response = await fetch(getAllProjectsUrl, {
        method: 'GET',
        headers: {
            Authorization: `Bearer ${access_token}`,
        },
    });

    const jsonResponse = await response.json();

    if (
        response.status === HttpStatus.UNAUTHORIZED &&
        jsonResponse.message == JWT_EXPIRED_MESSAGE
    ) {
        await refreshTokens();
        return await getAllProjects();
    }

    return jsonResponse;
}

export async function deleteProject(PK: string, SK: string): Promise<void> {
    const access_token = getAccessToken();
    if (!access_token) {
        throw new Error('Access token was not present in local storage');
    }

    const encodedPKSK = `${encodeURIComponent(PK)}/${encodeURIComponent(SK)}`;

    const deleteProjectUrl = `${process.env.API_URL}/api/projects/${encodedPKSK}`;

    const response = await fetch(deleteProjectUrl, {
        method: 'DELETE',
        headers: {
            Authorization: `Bearer ${access_token}`,
        },
    });

    if (response.status === 204) {
        return;
    }

    const jsonResponse = await response.json();

    if (
        response.status === HttpStatus.UNAUTHORIZED &&
        jsonResponse.message == JWT_EXPIRED_MESSAGE
    ) {
        await refreshTokens();
        return await deleteProject(PK, SK);
    }
}
