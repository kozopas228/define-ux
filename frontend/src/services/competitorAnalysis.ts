import { CompetitorAnalysis } from '../types/competitorAnalysis';
import { getAccessToken, refreshTokens } from './auth';
import { HttpStatus } from '../utils/httpStatus';
import { JWT_EXPIRED_MESSAGE } from '../utils/constants';
import { CompetitorAnalysisResponseDto } from '../pages/competitor-analysis/types';
import { convertImageToFile } from '../utils/image';

export async function createNewCompetitorAnalysis(
    projectSK: string
): Promise<CompetitorAnalysis> {
    const access_token = getAccessToken();
    if (!access_token) {
        throw new Error('Access token was not present in local storage');
    }

    const createNewCompetitorAnalysisUrl = `${process.env.API_URL}/api/competitor-analysis`;
    const response = await fetch(createNewCompetitorAnalysisUrl, {
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
        return await createNewCompetitorAnalysis(projectSK);
    }

    return jsonResponse;
}

export async function findAllCompetitorAnalysisByProjectSK(
    projectSK: string
): Promise<CompetitorAnalysis[]> {
    const access_token = getAccessToken();
    if (!access_token) {
        throw new Error('Access token was not present in local storage');
    }

    const findAllCompetitorAnalysisUrl = `${
        process.env.API_URL
    }/api/competitor-analysis/${encodeURIComponent(projectSK)}`;
    const response = await fetch(findAllCompetitorAnalysisUrl, {
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
        return await findAllCompetitorAnalysisByProjectSK(projectSK);
    }

    return jsonResponse;
}

export async function findOneCompetitorAnalysis(
    PK: string,
    SK: string
): Promise<CompetitorAnalysisResponseDto> {
    const access_token = getAccessToken();
    if (!access_token) {
        throw new Error('Access token was not present in local storage');
    }

    const findAllCompetitorAnalysisUrl = `${
        process.env.API_URL
    }/api/competitor-analysis/${encodeURIComponent(PK)}/${encodeURIComponent(
        SK
    )}`;
    const response = await fetch(findAllCompetitorAnalysisUrl, {
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
        return await findOneCompetitorAnalysis(PK, SK);
    }

    (jsonResponse as CompetitorAnalysisResponseDto).competitors.forEach(
        (comp) => {
            comp.criterias.forEach((crit) => {
                if (crit.type === 'boolean') {
                    if (crit.value) {
                        crit.value.value = crit.value.value === 'true';
                    }
                }
            });
        }
    );

    return jsonResponse;
}

export async function saveCompetitorAnalysis(
    dto: CompetitorAnalysisResponseDto
): Promise<void> {
    const access_token = getAccessToken();
    if (!access_token) {
        throw new Error('Access token was not present in local storage');
    }

    const saveCompetitorAnalysisUrl = `${process.env.API_URL}/api/competitor-analysis`;
    const response = await fetch(saveCompetitorAnalysisUrl, {
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
        return await saveCompetitorAnalysis(dto);
    }

    if (!response.ok) {
        throw new Error(jsonResponse);
    }

    return jsonResponse;
}

export async function uploadCompetitorAnalysisThumbnail(
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

    if (file.size > 300000) {
        return;
    }

    const updateThumbnailUrl = `${process.env.API_URL}/api/competitor-analysis/upload-thumbnail`;

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
        return await uploadCompetitorAnalysisThumbnail(PK, SK, image);
    }

    return jsonResponse;
}

export async function deleteCompetitorAnalysis(
    PK: string,
    SK: string
): Promise<void> {
    const access_token = getAccessToken();
    if (!access_token) {
        throw new Error('Access token was not present in local storage');
    }
    const deleteCompetitorAnalysisUrl = `${
        process.env.API_URL
    }/api/competitor-analysis/${encodeURIComponent(PK)}/${encodeURIComponent(
        SK
    )}`;
    const response = await fetch(deleteCompetitorAnalysisUrl, {
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
        return await deleteCompetitorAnalysis(PK, SK);
    }
}
