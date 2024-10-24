import { NextFunction, Request, Response } from "express";
import { PrismaPostRepository } from "../../../infrastructure/repositories/prisma-post";
import { FindDbError, InvalidUrlError, UnauthorizedError } from "../../../domain/errors/main";
import { Post } from "../../../domain/entities/post";
import { UserJWT } from "../../express";
import { CreatePost, ReadAllPosts, ReadById, UpdatePost } from "../../../application/usecases/atomic/post";
import { PostsPopularity } from "../../../application/usecases/comp/post";
import { userRepository } from "./user";

const postRepository = new PrismaPostRepository()


/**
 * @swagger
 * components:
 *   schemas:
 *     Post:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: El identificador único del post.
 *         title:
 *           type: string
 *           description: El título del post.
 *         content:
 *           type: string
 *           nullable: true
 *           description: El contenido del post.
 *         deleted:
 *           type: boolean
 *           description: Indica si el post está eliminado.
 *         authorId:
 *           type: integer
 *           description: El ID del autor que creó el post.
 */

export class PostController {
    constructor() {
        this.delete = this.delete.bind(this);
        this.hardDelete = this.hardDelete.bind(this);
        this.softDelete = this.softDelete.bind(this);
    }
/**
 * @swagger
 * /posts:
 *   post:
 *     summary: Crear un nuevo post
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 description: El título del post.
 *               content:
 *                 type: string
 *                 description: El contenido del post.
 *               authorName:
 *                 type: string
 *                 description: El nombre del autor que crea el post.
 *             required:
 *               - title
 *               - content
 *               - authorName
 *             example:
 *               title: "Titulo de Post de Prueba"
 *               content: "Este es el contenido del post de prueba del User2"
 *               authorName: "User2"
 *              
 *     responses:
 *       201:
 *         description: El post creado.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Post'
 *       401:
 *         $ref: '#/components/responses/AuthError'
 *       403:
 *          $ref: '#/components/responses/BannedUserError'
 *      
 */
    async create(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { title, content, authorName } = req.body;
            if (!req.user) {
                res.status(401).json({ message: 'Sin autorización: Token no provisto' });
                throw new UnauthorizedError("user not set in jwt")
            }
            const userId = req.user.id;
            const c = new CreatePost(postRepository)
            const post = await c.execute({ title, content, authorName }, userId);
            res.status(201).json(post);
        } catch (error) {
            next(error);
        }
    }
    /**
 * @swagger
 * /posts/{order}:
 *   get:
 *     summary: Recuperar todos los posts
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: order
 *         schema:
 *           type: string
 *           enum: [nombre-asc, nombre-desc, popularidad-asc, popularidad-desc]
 *         description: Tipo de búsqueda <br/> <ul><li>Si no se especifica -> Se ordenara por fecha mas reciente</li><li>`nombre-asc` -> Se ordenara por nombre de manera ascendente, por lo tanto los que tengan nombres empezados con z irán primero.</li><li>`nombre-desc` -> Se ordenara por nombre de manera descendente, por lo tanto los que tengan nombres empezados con a irán primero.</li><li>`popularidad-asc` -> Se ordenara por popularidad de manera ascendente, por lo tanto los que tengan menos likes irán primero.</li><li>`popularidad-desc` -> Se ordenara por popularidad de manera descendente, por lo tanto los que tengan mas likes irán primero.</li></ul>
 *       - in: query
 *         name: q
 *         schema:
 *           type: string
 *         description: Parámetro de búsqueda en los títulos y contenido de los posts
 *     responses:
 *       200:
 *         description: Una lista de posts.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Post'
 */
// TODO: Añadir ordenación por fecha, ordenación por name asc y desc, ordenación por popularidad asc y desc, y search param por title y content.
    async readAll(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { order } = req.params;
            const searchQuery = req.query.q as string | undefined;
            const ra = new ReadAllPosts(postRepository)
            let posts = await ra.execute();

            // Filtrar posts si hay una consulta de búsqueda
            if (searchQuery) {
                posts = posts.filter(post => 
                    post.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                    post.content?.toLowerCase().includes(searchQuery.toLowerCase())
                );
            }

            // Ordenar posts
            switch (order) {
                case 'nombre-asc':
                    posts = posts.sort((a, b) => a.title.localeCompare(b.title));
                    break;
                case 'nombre-desc':
                    posts = posts.sort((a, b) => b.title.localeCompare(a.title));
                    break;
                case 'popularidad-asc':
                case 'popularidad-desc':
                    const pp = new PostsPopularity(postRepository, userRepository)
                    const postsPopularity = await pp.execute()
                    posts = posts.sort((a, b) => {
                        const popularityA = postsPopularity.find(p => p.id === a.id)?.popularity || 0;
                        const popularityB = postsPopularity.find(p => p.id === b.id)?.popularity || 0;
                        return order === 'popularidad-asc' 
                            ? popularityA - popularityB 
                            : popularityB - popularityA;
                    });
                    break;
                default:
                    // Ordenar por fecha más reciente
                    posts = posts.sort((a, b) => b.date.getTime() - a.date.getTime());
            }

            res.status(200).json(posts);
        } catch (error) {
            next(error);
        }
    } 

// TODO: Añadir endpoint con la popularidad de cada post. y/o pp de todos los posts
    /**
 * @swagger
 * /posts/{id}:
 *   put:
 *     summary: Actualizar un post
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: El ID del post a actualizar.
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 description: El título actualizado del post.
 *               content:
 *                 type: string
 *                 description: El contenido actualizado del post.
 *               userId:
 *                 type: integer
 *                 description: El ID del usuario que realiza la actualización.
 *             required:
 *               - userId
 *             example:
 *               content: "Este es el contenido del post de prueba del User2 updated"
 *               userId: 2
 *     responses:
 *       200:
 *         description: El post actualizado.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Post'
 *       401:
 *         description: No autorizado.
 */
    async update(req: Request, res: Response, next: NextFunction): Promise<void>{
        try {
            const { id } = req.params;
            const { title, content, userId } = req.body;
            if (!req.user || req.user.id !== parseInt(userId)) {
                res.status(401).json({ message: 'Unauthorized' });
                throw new UnauthorizedError(`user jwt ${!req.user ? "not set" : "invalid"}`)
            }
            const u = new UpdatePost(postRepository)
            const post = await u.execute(parseInt(id), { title, content });
            res.status(200).json(post);
        } catch (error) {
            next(error);
        }
    }

/**
 * @swagger
 * /posts/{id}:
 *   delete:
 *     summary: Eliminar/restablecer un post
 *     description: Elimina o restablece un post, según su estado actual. Si se utiliza la version "soft", permite recuperar un Post eliminado, si se utiliza "hard" este no se podrá recuperar.
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         description: El ID del post a eliminar.
 *         schema:
 *           type: integer
 *         required: true
 *       - name: type
 *         in: query
 *         description: El tipo de eliminación (suave o permanente).
 *         schema:
 *           type: string
 *           enum: [soft, hard]
 *         required: true
 *     responses:
 *       200:
 *         description: El post eliminado.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Post'
 *       404:
 *         description: Post no encontrado.
 *       401:
 *         description: No autorizado.
 *       400:
 *         description: Tipo de eliminación inválido.
 */
    async delete(req: Request, res: Response, next: NextFunction): Promise<void>{
        try {
            const { id } = req.params;
            const r = new ReadById(postRepository)
            const post = await r.execute(parseInt(id))
            if(!post){
                res.status(404).json({message: "Post not found"})
                throw new FindDbError("Post")
            }
            if(!req.user ){
                res.status(401).json({message: "Unauthorized"})
                throw new UnauthorizedError(`user jwt not set`)
            }
            const deleteType = req.query.type;
            if(deleteType === "hard"){
                this.hardDelete( parseInt(id),req.user,  res)
            } else if(deleteType === "soft") {
                this.softDelete(post, parseInt(id),req.user,  res)
            } else {
                res.status(400).json({message: "Invalid delete type"})
            }

        } catch (error) {
            next(error);
        }
    }
    private hardDelete = async (id: number, user: UserJWT, res: Response): Promise<void> => {
        if (user.role === "ADMIN") {
            const deletedPost = await postRepository.delete(id);
            res.status(200).json(deletedPost);
        } else {
            res.status(403).json({ message: "Forbidden" });
            throw new UnauthorizedError("user not authorized for hardDelete");
        }
    };
    
    private softDelete = async (post: Post, id: number, user: UserJWT, res: Response): Promise<void> => {
    
        if (user.id === post.authorId || user.role === "ADMIN") {
            const deletedPost = await postRepository.update(id, { deleted: !post.deleted });
            res.status(200).json(deletedPost);
        } else {
            res.status(403).json({ message: "Forbidden" });
            throw new UnauthorizedError("user not authorized for softDelete");
        }
    };
    /**
 * @swagger
 * /popularity:
 *   get:
 *     summary: Popularidad de los posts
 *     description: Este endpoint permite ver la popularidad de los posts. Esta corresponde a la suma de likes dividido entre el total de usuarios - 1.
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de posts y su popularidad.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   popularity:
 *                     type: number
 *       401: 
 *         $ref: '#/components/responses/AuthError'
 *       403:
 *          $ref: '#/components/responses/BannedUserError'
 */

    async popularity(req: Request, res: Response, next: NextFunction): Promise<void> {
        const pp = new PostsPopularity(postRepository, userRepository)
        const popularity = await pp.execute()
        res.status(200).json(popularity)
    }
}
