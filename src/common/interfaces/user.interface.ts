export interface AuthenticatedUser {
    provider: string,
    providerId: string,
    name: string,
    email: string
    token: string
    [key: string]: any; 
}