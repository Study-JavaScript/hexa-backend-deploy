import express from "express";
// import swaggerUi from "swagger-ui-express";
import { setupRoutes } from "./interface/routes/main";
// import { swaggerDocs } from "./interface/config/swagger";


const app = express();

setupRoutes(app);

app.listen(3000, () => {
  console.log("Server is running on http://localhost:3000");
});