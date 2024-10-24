import { Router } from "express";
import { UserController } from "../controllers/user";

const controller = new UserController();
const NoAuthenticateRouter = Router();
const UserRouter = Router();
const AppRouter = Router();



NoAuthenticateRouter.post("/login", controller.login);
NoAuthenticateRouter.post("/signup", controller.register);

AppRouter.get("/total", controller.countAll);



UserRouter.get("/users/:type", controller.read);
UserRouter.put("/users/:id", controller.update);


UserRouter.get("/admins/users", controller.readAll);
UserRouter.patch("/admins/banned/:id", controller.updateBanned);

export { UserRouter, NoAuthenticateRouter, AppRouter };
