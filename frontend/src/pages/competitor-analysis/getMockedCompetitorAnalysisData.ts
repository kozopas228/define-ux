import { CompetitorResponseDto } from './types';

export function getMockedCompetitorAnalysisData(): CompetitorResponseDto[] {
    return tableData;
}

const tableData: CompetitorResponseDto[] = [
    {
        id: '324abf26-6edd-42e1-8a35-3162a656b45f',
        name: 'Comp. name 1',
        criterias: [
            {
                id: '42913141-9b0e-40c0-b255-efdc17959554',
                name: 'Criteria 1',
                type: 'string',
                value: {
                    id: '852e832f-d0c3-4130-a163-4af273e5ca70',
                    value: 'Value 1',
                },
            },
            {
                id: 'dc6d44ee-d221-49e0-aba5-4ebbd8e41100',
                name: 'Criteria 2',
                type: 'string',
                value: {
                    id: '7f41693b-216f-4680-931f-71c3a00f11ab',
                    value: 'Value 14',
                },
            },
            {
                id: 'f728d166-e07e-4d4e-aebe-d9fc6b171987',
                name: 'Criteria 3',
                type: 'boolean',
                value: {
                    id: '3e6606a1-5fb3-44b9-8490-0472dfda3f53',
                    value: false,
                },
            },
        ],
    },
    {
        id: '435898d8-88a6-48d4-aa98-3cd5aae6baca',
        name: 'Competitor full precise verbose name 2',
        criterias: [
            {
                id: '42913141-9b0e-40c0-b255-efdc17959554',
                name: 'Criteria 1',
                type: 'string',
                value: {
                    id: '5cb76e86-b061-43b5-ab52-7b1943ea010d',
                    value: 'Value 2',
                },
            },
            {
                id: 'dc6d44ee-d221-49e0-aba5-4ebbd8e41100',
                name: 'Criteria 2',
                type: 'string',
                value: {
                    id: '20eeaa54-31b6-4010-90fc-3a69b96df4ae',
                    value: '',
                },
            },
            {
                id: 'f728d166-e07e-4d4e-aebe-d9fc6b171987',
                name: 'Criteria 3',
                type: 'boolean',
                value: {
                    id: '47cd9959-8aeb-47ff-933c-a7c6c143986b',
                    value: true,
                },
            },
        ],
    },
    {
        id: '0d671ada-b8ef-4079-90d5-b9a2e6924c7f',
        name: 'Microsoft',
        criterias: [
            {
                id: '42913141-9b0e-40c0-b255-efdc17959554',
                name: 'Criteria 1',
                type: 'string',
                value: {
                    id: '08ab37f1-af15-4b27-b988-09558cdd1805',
                    value: 'Value 3',
                },
            },
            {
                id: 'dc6d44ee-d221-49e0-aba5-4ebbd8e41100',
                name: 'Criteria 2',
                type: 'string',
                value: {
                    id: 'ec6a90e4-6af1-42bd-abef-117eb82116ad',
                    value: 'Value 15',
                },
            },
            {
                id: 'f728d166-e07e-4d4e-aebe-d9fc6b171987',
                name: 'Criteria 3',
                type: 'boolean',
                value: {
                    id: 'e9652fad-4418-4437-a310-e529b45e050f',
                    value: false,
                },
            },
        ],
    },
    {
        id: '2baefe0f-51ea-436e-9381-d3f357c3a74f',
        name: 'Google',
        criterias: [
            {
                id: '42913141-9b0e-40c0-b255-efdc17959554',
                name: 'Criteria 1',
                type: 'string',
                value: {
                    id: 'c29b45d7-c084-4433-9dfd-2c33910b70f4',
                    value: 'Value 4',
                },
            },
            {
                id: 'dc6d44ee-d221-49e0-aba5-4ebbd8e41100',
                name: 'Criteria 2',
                type: 'string',
                value: {
                    id: '86ec80f2-aa90-4ed1-b6fc-56a04ee42d9c',
                    value: '',
                },
            },
            {
                id: 'f728d166-e07e-4d4e-aebe-d9fc6b171987',
                name: 'Criteria 3',
                type: 'boolean',
                value: {
                    id: '889137e0-2f8a-4b69-8862-2eb86d03eb19',
                    value: true,
                },
            },
        ],
    },
    {
        id: '858ce1dd-c73d-491c-a79e-9b79f6a6cbe1',
        name: 'Roga i Kopyta',
        criterias: [
            {
                id: '42913141-9b0e-40c0-b255-efdc17959554',
                name: 'Criteria 1',
                type: 'string',
                value: {
                    id: '997082e2-014a-467f-8b34-4db5dbefa656',
                    value: 'Value 4',
                },
            },
            {
                id: 'dc6d44ee-d221-49e0-aba5-4ebbd8e41100',
                name: 'Criteria 2',
                type: 'string',
                value: {
                    id: 'c81259b7-5f31-476a-ab36-a744d298b6a1',
                    value: '',
                },
            },
            {
                id: 'f728d166-e07e-4d4e-aebe-d9fc6b171987',
                name: 'Criteria 3',
                type: 'boolean',
                value: {
                    id: '358402c4-7e20-4a53-b62a-1c4def0b384e',
                    value: true,
                },
            },
        ],
    },
    {
        id: '78d47507-9c04-4d8b-a9fe-39de08e80d99',
        name: 'Oracle',
        criterias: [
            {
                id: '42913141-9b0e-40c0-b255-efdc17959554',
                name: 'Criteria 1',
                type: 'string',
                value: {
                    id: 'cf73d578-b7ad-469f-821a-1f8a948237ea',
                    value: 'Value 6',
                },
            },
            {
                id: 'dc6d44ee-d221-49e0-aba5-4ebbd8e41100',
                name: 'Criteria 2',
                type: 'string',
                value: {
                    id: '97c6d590-654d-482d-9af9-1fee5e97b446',
                    value: 'Value 16',
                },
            },
            {
                id: 'f728d166-e07e-4d4e-aebe-d9fc6b171987',
                name: 'Criteria 3',
                type: 'boolean',
                value: {
                    id: '9bfa23ff-3e62-4b89-b88f-d46668ca08ef',
                    value: false,
                },
            },
        ],
    },
    {
        id: '69d16178-ad70-4aea-94cf-995f33d61da0',
        name: 'Company 3',
        criterias: [
            {
                id: '42913141-9b0e-40c0-b255-efdc17959554',
                name: 'Criteria 1',
                type: 'string',
                value: {
                    id: 'ae096b8b-076c-4d44-bb28-0900c407f31f',
                    value: 'Value 7',
                },
            },
            {
                id: 'dc6d44ee-d221-49e0-aba5-4ebbd8e41100',
                name: 'Criteria 2',
                type: 'string',
                value: {
                    id: '6c46f26f-c738-4ae8-8e02-a1961909908d',
                    value: '',
                },
            },
            {
                id: 'f728d166-e07e-4d4e-aebe-d9fc6b171987',
                name: 'Criteria 3',
                type: 'boolean',
                value: {
                    id: 'bf2265f8-69f6-4d66-9b8d-4b2bce82eb83',
                    value: false,
                },
            },
        ],
    },
];
