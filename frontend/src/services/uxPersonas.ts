import { getAccessToken, refreshTokens } from './auth';
import { HttpStatus } from '../utils/httpStatus';
import { JWT_EXPIRED_MESSAGE } from '../utils/constants';
import { UxPersona } from '../types/uxPersona';
import { convertImageToFile } from '../utils/image';
import { UxPersonaDto } from '../pages/ux-personas/types';

export async function createNewUxPersona(
    projectSK: string
): Promise<UxPersona> {
    const access_token = getAccessToken();
    if (!access_token) {
        throw new Error('Access token was not present in local storage');
    }

    const createNewUxPersonaUrl = `${process.env.API_URL}/api/ux-personas`;
    const response = await fetch(createNewUxPersonaUrl, {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${access_token}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            projectSK,
        }),
    });

    const jsonResponse = await response.json();

    if (
        response.status === HttpStatus.UNAUTHORIZED &&
        jsonResponse.message == JWT_EXPIRED_MESSAGE
    ) {
        await refreshTokens();
        return await createNewUxPersona(projectSK);
    }

    return jsonResponse;
}

export async function findAllUxPersonasByProjectSK(
    projectSK: string
): Promise<UxPersona[]> {
    const access_token = getAccessToken();
    if (!access_token) {
        throw new Error('Access token was not present in local storage');
    }

    const findAllUxPersonasUrl = `${
        process.env.API_URL
    }/api/ux-personas/${encodeURIComponent(projectSK)}`;
    const response = await fetch(findAllUxPersonasUrl, {
        method: 'GET',
        headers: {
            Authorization: `Bearer ${access_token}`,
        },
    });

    const jsonResponse = await response.json();

    if (response.status === HttpStatus.NOT_FOUND) {
        return [];
    }

    if (
        response.status === HttpStatus.UNAUTHORIZED &&
        jsonResponse.message == JWT_EXPIRED_MESSAGE
    ) {
        await refreshTokens();
        return await findAllUxPersonasByProjectSK(projectSK);
    }

    return jsonResponse;
}

export async function findOneUxPersona(
    PK: string,
    SK: string
): Promise<UxPersonaDto> {
    const access_token = getAccessToken();
    if (!access_token) {
        throw new Error('Access token was not present in local storage');
    }

    const findOneUxPersonaUrl = `${
        process.env.API_URL
    }/api/ux-personas/${encodeURIComponent(PK)}/${encodeURIComponent(SK)}`;
    const response = await fetch(findOneUxPersonaUrl, {
        method: 'GET',
        cache: 'no-cache',
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
        return await findOneUxPersona(PK, SK);
    }

    return jsonResponse;
}

export async function saveUxPersona(dto: UxPersonaDto): Promise<void> {
    const access_token = getAccessToken();
    if (!access_token) {
        throw new Error('Access token was not present in local storage');
    }

    const saveUxPersonaUrl = `${process.env.API_URL}/api/ux-personas`;
    const response = await fetch(saveUxPersonaUrl, {
        method: 'PATCH',
        headers: {
            Authorization: `Bearer ${access_token}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(dto),
    });

    const jsonResponse = await response.json();

    if (
        response.status === HttpStatus.UNAUTHORIZED &&
        jsonResponse.message == JWT_EXPIRED_MESSAGE
    ) {
        await refreshTokens();
        return await saveUxPersona(dto);
    }

    if (!response.ok) {
        throw new Error(jsonResponse);
    }

    return jsonResponse;
}

export async function uploadUxPersonaThumbnail(
    PK: string,
    SK: string,
    image: string
): Promise<void> {
    const access_token = getAccessToken();
    if (!access_token) {
        throw new Error('Access token was not present in local storage');
    }

    if (!image) {
        return;
    }

    const file = convertImageToFile(image);

    if (file.size > 10_000_000) {
        return;
    }

    const updateThumbnailUrl = `${process.env.API_URL}/api/ux-personas/upload-thumbnail`;

    const formData = new FormData();

    formData.append('PK', PK);
    formData.append('SK', SK);

    formData.append('image', file);

    const response = await fetch(updateThumbnailUrl, {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${access_token}`,
        },
        body: formData,
    });

    const jsonResponse = await response.json();

    if (
        response.status === HttpStatus.UNAUTHORIZED &&
        jsonResponse.message == JWT_EXPIRED_MESSAGE
    ) {
        await refreshTokens();
        return await uploadUxPersonaThumbnail(PK, SK, image);
    }

    return jsonResponse;
}

export async function deleteUxPersona(PK: string, SK: string): Promise<void> {
    const access_token = getAccessToken();
    if (!access_token) {
        throw new Error('Access token was not present in local storage');
    }

    const deleteUxPersonaUrl = `${
        process.env.API_URL
    }/api/ux-personas/${encodeURIComponent(PK)}/${encodeURIComponent(SK)}`;
    const response = await fetch(deleteUxPersonaUrl, {
        method: 'DELETE',
        headers: {
            Authorization: `Bearer ${access_token}`,
        },
    });

    if (
        response.status === HttpStatus.UNAUTHORIZED &&
        (await response.json()).message == JWT_EXPIRED_MESSAGE
    ) {
        await refreshTokens();
        return await deleteUxPersona(PK, SK);
    }
}

export async function getUxPersonaPhoto(
    PK: string,
    SK: string
): Promise<string | undefined> {
    const access_token = getAccessToken();
    if (!access_token) {
        throw new Error('Access token was not present in local storage');
    }

    const findOneUxPersonaUrl = `${
        process.env.API_URL
    }/api/ux-personas/thumbnailUrl/${encodeURIComponent(
        PK
    )}/${encodeURIComponent(SK)}`;
    const response = await fetch(findOneUxPersonaUrl, {
        method: 'GET',
        cache: 'no-cache',
        headers: {
            Authorization: `Bearer ${access_token}`,
            'Cache-Control': 'no-cache',
        },
    });

    if (
        response.status === HttpStatus.UNAUTHORIZED &&
        (await response.json()).message == JWT_EXPIRED_MESSAGE
    ) {
        await refreshTokens();
        return await getUxPersonaPhoto(PK, SK);
    }

    return await response.text();
}
