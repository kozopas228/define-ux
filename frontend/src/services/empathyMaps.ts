import { getAccessToken, refreshTokens } from './auth';
import { HttpStatus } from '../utils/httpStatus';
import { JWT_EXPIRED_MESSAGE } from '../utils/constants';
import { EmpathyMap } from '../types/empathyMap';
import { EmpathyMapDto } from '../pages/empathy-map/types';
import { convertImageToFile } from '../utils/image';

const apiPrefix = `api/empathy-maps`;

export async function createNewEmpathyMap(
    projectSK: string
): Promise<EmpathyMap> {
    const access_token = getAccessToken();
    if (!access_token) {
        throw new Error('Access token was not present in local storage');
    }

    const createNewEmpathyMapUrl = `${process.env.API_URL}/${apiPrefix}`;
    const response = await fetch(createNewEmpathyMapUrl, {
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
        return await createNewEmpathyMap(projectSK);
    }

    return jsonResponse;
}

export async function findAllEmpathyMapsByProjectSK(
    projectSK: string
): Promise<EmpathyMap[]> {
    const access_token = getAccessToken();
    if (!access_token) {
        throw new Error('Access token was not present in local storage');
    }

    const findAllEmpathyMapsUrl = `${
        process.env.API_URL
    }/${apiPrefix}/${encodeURIComponent(projectSK)}`;
    const response = await fetch(findAllEmpathyMapsUrl, {
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
        return await findAllEmpathyMapsByProjectSK(projectSK);
    }

    return jsonResponse;
}

export async function findOneEmpathyMap(
    PK: string,
    SK: string
): Promise<EmpathyMap> {
    const access_token = getAccessToken();
    if (!access_token) {
        throw new Error('Access token was not present in local storage');
    }

    const findOneEmpathyMapUrl = `${
        process.env.API_URL
    }/${apiPrefix}/${encodeURIComponent(PK)}/${encodeURIComponent(SK)}`;
    const response = await fetch(findOneEmpathyMapUrl, {
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
        return await findOneEmpathyMap(PK, SK);
    }

    return jsonResponse;
}

export async function saveEmpathyMap(dto: EmpathyMapDto): Promise<void> {
    const access_token = getAccessToken();
    if (!access_token) {
        throw new Error('Access token was not present in local storage');
    }

    const saveEmpathyMapUrl = `${process.env.API_URL}/${apiPrefix}`;
    const response = await fetch(saveEmpathyMapUrl, {
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
        return await saveEmpathyMap(dto);
    }

    if (!response.ok) {
        throw new Error(jsonResponse);
    }

    return jsonResponse;
}

export async function uploadEmpathyMapThumbnail(
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

    const updateThumbnailUrl = `${process.env.API_URL}/${apiPrefix}/upload-thumbnail`;

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
        return await uploadEmpathyMapThumbnail(PK, SK, image);
    }

    return jsonResponse;
}

export async function deleteEmpathyMap(PK: string, SK: string): Promise<void> {
    const access_token = getAccessToken();
    if (!access_token) {
        throw new Error('Access token was not present in local storage');
    }

    const deleteEmpathyMapUrl = `${
        process.env.API_URL
    }/${apiPrefix}/${encodeURIComponent(PK)}/${encodeURIComponent(SK)}`;
    const response = await fetch(deleteEmpathyMapUrl, {
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
        return await deleteEmpathyMap(PK, SK);
    }
}
