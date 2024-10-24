import { Router } from "express";
import { LikePostController } from "../controllers/likepost";

const controller = new LikePostController()
const LikePostRouter = Router()

// Estaría bien manejar la acción como un get ❓🧠⬇️❓
LikePostRouter.post("/likepost/:id", controller.create)

export {LikePostRouter}