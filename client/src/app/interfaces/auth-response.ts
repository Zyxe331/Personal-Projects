import { User } from './user';

export interface AuthResponse {
    user : User,
    access_token: string,
    expires_in: number
}