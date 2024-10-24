import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import dotenv from "dotenv"
import { SetEnvError, UnauthorizedError } from '../../../domain/errors/main';
import { CustomJwtPayload } from '../../express';
import { userRepository } from './user';

dotenv.config()

const secretKey = process.env.JWT_SECRET;
/**
 * @swagger
 * components:
 *   responses:
 *     AuthError:
 *       description: Sin autorización. Token no valido o no provisto
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               message:
 *                 type: string
 *                 description: Mensaje de error por no autorización. Token no valido o no provisto
 *             example:
 *               message: Sin autorización. Token no provisto
 *     BannedUserError:
 *       description: Prohibido. Usuario baneado.
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               message:
 *                 type: string
 *             example:
 *               message: Prohibido. Usuario baneado.
 */

/**
 * Middleware para autenticar JWT en las rutas.
 * Este middleware verifica el token en el encabezado de autorización y
 * asegura que el usuario no esté baneado.
 * 
 * @param {Request} req - La solicitud HTTP.
 * @param {Response} res - La respuesta HTTP.
 * @param {NextFunction} next - La función de siguiente middleware.
 * 
 * @returns {Promise<void>}
 * 

 * @throws {AuthError} Si el token es inválido o no provisto.
 * @throws {BannedUserError} Si el usuario está baneado.
 */
export const authenticateJWT = async(req: Request, res: Response, next: NextFunction) => {
    // Mostrar información de la solicitud para depurar
    // console.log("Authorization Header:", req.headers['authorization']);
    // console.log("Request Body Before JWT Auth:", req.body);

    // Obtener el token del encabezado de autorización
    const token = req.headers['authorization']?.split(' ')[1];

    if (!token) {
        console.error("No token provided");
        return res.status(401).json({ message: 'Sin autorización: Token no provisto' });
    }

    if (!secretKey) {
        throw new SetEnvError("JWT_SECRET not set in environment variables");
    }

    try {
        // Verificar el token y extraer el payload
        const decoded = jwt.verify(token, secretKey) as CustomJwtPayload;
        // console.log("JWT Verified, user:", user);

        // Almacenar el usuario en la solicitud
        req.user = decoded;
        const user = await userRepository.readById(decoded.id);
        if(!user)throw new UnauthorizedError("User not found")
        if(user.banned){
            res.status(403).json({ message: 'Prohibido. Usuario baneado' });
            throw new UnauthorizedError("User is banned")
        }

        // Pasar al siguiente middleware o controlador
        next();
    } catch (err) {
        console.error("Token verification failed:", err);
        return res.status(401).json({ message: 'Sin autorización. Token invalido' });
    }
};

export const authorizeAdmin = (req: Request, res: Response, next: NextFunction) => {
    if (!req.user || req.user.role !== 'ADMIN') {
        return res.status(403).json({ message: 'Prohibido: Acceso de administrador requerido' });
    }
    next();
};
