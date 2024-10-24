import { Request } from 'express';
import { JwtPayload } from 'jsonwebtoken';

declare global {
    namespace Express {
        interface Request {
            user?: UserJWT
        }
    }
}


interface CustomJwtPayload extends JwtPayload, UserJWT {}
type UserJWT = {
    id: number;
    role: string;
};