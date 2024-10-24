import express,{ Application, NextFunction, Request, Response } from "express";
import swaggerUi from "swagger-ui-express";
import cors from "cors";
import { swaggerDocs } from "../config/swagger";
import { AppRouter, NoAuthenticateRouter, UserRouter } from "./user";
import { PostRouter } from "./post";
import { authenticateJWT, authorizeAdmin } from "../controllers/auth";
import { LikePostRouter } from "./likepost";

export const setupRoutes = (app: Application) => {


  // Servir Swagger UI
  // app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));
  app.use(cors({
    origin: ['http://localhost:4321', 'http://localhost:3000'], 
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
  }));
  app.use(express.json());
  /**
 * @swagger
 * tags:
 *   name: Autenticación
 *   description: Rutas de autenticación
 */
  app.use(NoAuthenticateRouter)
  /**
 * @swagger
 * tags:
 *   name: App
 *   description: Rutas de la aplicación
 */
  app.use(AppRouter)
  // app.use((req, res, next) => {
  //   console.log("Before authenticateJWT middleware:", req.body);
  //   next();
  // });
  app.use(authenticateJWT)
  // app.use((req, res, next) => {
  //   console.log("After authenticateJWT middleware:", req.body);
  //   next();
  // });
  app.use("/admins", authorizeAdmin)
  /**
 * @swagger
 * tags:
 *   name: Users
 *   description: Rutas de manejo de perfil (usuario) para usuarios activos.
 */
/**
 * @swagger
 * tags:
 *   name: Admin Users
 *   description: Rutas de manejo de perfil de usuarios activos para administradores.
 */
  app.use(UserRouter);
  /**
 * @swagger
 * tags:
 *   name: Posts
 *   description: Rutas de manejo de posts para usuarios activos.
 */
  app.use(PostRouter);
    /**
 * @swagger
 * tags:
 *   name: Like Posts
 *   description: Rutas de manejo de likes de posts para usuarios activos.
 */
  app.use(LikePostRouter)
  app.use((err: unknown, req: Request, res: Response, next: NextFunction) => {
    if (err instanceof Error) {
      console.error(err.stack);
      return res.status(500).json({ message: err.message });
    }
    console.error(err);
    return res.status(500).json({ message: "Error interno del servidor" });
  });
};