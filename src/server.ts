import express from "express";
import cors from "cors";
import { SERVER_PORT } from "./config";

const app = express();
app.use(cors());
app.use(express.json());

app.listen(SERVER_PORT, () =>
  console.log(`Server running on port ${SERVER_PORT}`)
);
