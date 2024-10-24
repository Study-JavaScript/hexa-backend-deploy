import { NextFunction, Request, Response } from "express";
import { PrismaLikePostRepository } from "../../../infrastructure/repositories/prisma-likepost";
import { UnauthenticatedError } from "../../../domain/errors/main";
import { CreateLikePost } from "../../../application/usecases/atomic/likepost";
const likePostRepository = new PrismaLikePostRepository()

/**
 * @swagger
 * components:
 *   schemas:
 *     LikePost:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         postId:
 *           type: integer
 *         userId:
 *           type: integer
 *       example:
 *         id: 1
 *         postId: 1
 *         userId: 1
 */ 
export class LikePostController {
/**
     * @swagger
     * /likepost/{id}:
     *   post:
     *     summary: 💖 Like a post
     *     description: <h4>Dar me gusta a un Post.</h4><br/> Este endpoint permite dar me gusta a un post.
     *     tags: [Like Posts] 
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - name: id
     *         in: path
     *         description: ID del post a dar me gusta
     *         required: true
     *         schema:
     *           type: integer
     *     responses:
     *       '201':
     *         description: Like creado exitosamente
     *         schema:
     *           $ref: '#/components/schemas/LikePost'
     *       401: 
     *         $ref: '#/components/responses/AuthError'
     *       403:
     *          $ref: '#/components/responses/BannedUserError'
     */    
    async create(req:Request, res:Response, next:NextFunction) {
        // Faltaría crear el delete y hacer un switch aquí 🧠⬇️
        const {id} = req.params
        try {
            if(!req.user)throw new UnauthenticatedError("user jwt not set at likePost Controller")
            const c = new CreateLikePost(likePostRepository)
            const post = await c.execute(parseInt(id),req.user.id)
            res.status(201).json(post)
        } catch (error) {
            next(error)
        }
    
    }
}