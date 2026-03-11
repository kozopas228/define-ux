export interface User {
    username: string;
    authMethod: AuthMethod;
    PK: string;
    SK: string;
}

export enum AuthMethod {
    password = 'password',
    google = 'google',
    facebook = 'facebook',
}
