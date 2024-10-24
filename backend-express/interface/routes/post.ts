import { Router } from "express";
import { PostController } from "../controllers/post";
import { debounce } from "../../../utils/execute";


const controller = new PostController()
const PostRouter = Router()

PostRouter.post('/posts', controller.create);
PostRouter.get('/posts/:order', debounce(controller.readAll, 2000));
PostRouter.delete('/posts/:id', controller.delete);
PostRouter.put('/posts/:id', controller.update);
PostRouter.get('/popularity', controller.popularity);



export {PostRouter}