import express from "express";
import { RegisterRoutes } from "./tsoa-generated/routes";
import { serve, setup } from 'swagger-ui-express';
import swaggerDocument from '../dist/swagger.json';


const app = express();
app.use("/", express.json());
app.use('/spec', serve, setup(swaggerDocument));

RegisterRoutes(app);

app.listen(3000, () => {
  console.log("Server is running on http://localhost:3000");
});
