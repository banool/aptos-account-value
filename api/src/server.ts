import express from "express";
import { RegisterRoutes } from "./tsoa-generated/routes";
import { serve, setup } from "swagger-ui-express";
import swaggerDocument from "../static/swagger.json";

const app = express();
app.use("/", express.json());
app.use("/spec", serve, setup(swaggerDocument));

RegisterRoutes(app);

const port = process.env.PORT || 3002;
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
