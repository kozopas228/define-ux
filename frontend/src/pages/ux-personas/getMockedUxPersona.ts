import { UxPersonaDto } from './types';

export function getMockedUxPersona(): UxPersonaDto {
    return {
        biography: '',
        demographics_age: 0,
        demographics_gender: '',
        demographics_income: '',
        demographics_location: '',
        demographics_occupation: '',
        frustrations: '',
        goals: '',
        hasDemographics_income: true,
        hasDemographics_location: true,
        hasDemographics_occupation: true,
        hasGoals_frustrations: true,
        hasMotivations: true,
        hasPersonality: true,
        hasPersonality_introvert_extrovert: true,
        hasPersonality_judging_perceiving: true,
        hasPersonality_sensing_intuition: true,
        hasPersonality_thinking_feeling: true,
        hasSkills: true,
        name: 'John Doe',
        personality: '',
        personality_introvert_extrovert: 50,
        personality_judging_perceiving: 50,
        personality_sensing_intuition: 50,
        personality_thinking_feeling: 50,
        projectSK: '',
        skills: [
            {
                id: '175230e6-6b96-4a21-8743-dcf8a13a1843',
                name: 'Tech level',
                level: 50,
            },
            {
                id: '0560387f-8a5d-4c91-b32f-7dda3104e10c',
                name: 'Creativity',
                level: 50,
            },
            {
                id: 'd0632f12-a861-4f04-90e5-0e3cfaa03c15',
                name: '',
                level: 50,
            },
        ],
        motivations: [
            {
                id: 'cd19cb00-8e57-472a-8d1f-ad2c243f5508',
                name: 'Price',
                level: 50,
            },
            {
                id: 'e6c852c0-805b-4c68-bf2f-6b7d543d9ab7',
                name: 'Comfort',
                level: 50,
            },
            {
                id: 'da63b42c-27c4-426e-842d-4333c6a0ae68',
                name: 'Convenience',
                level: 50,
            },
            {
                id: 'f10288c2-2fdf-4a2d-97e9-84c7216d6318',
                name: 'Speed',
                level: 50,
            },
        ],
        uxPersonaSK: '',
        hasDescription: true,
    };
}
