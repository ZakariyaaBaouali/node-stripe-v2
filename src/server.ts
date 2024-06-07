import express from "express";
import cors from "cors";
import { SERVER_PORT } from "./config";
import stripeController from "./controllers/stripe.controller";

const app = express();
app.use(
  cors({
    origin: "*",
  })
);
app.use(express.json());

app.get(`/`, (req, res) => {
  return res.status(200).send("Server working!!!");
});
app.use(`/stripe`, stripeController);

app.listen(SERVER_PORT, () =>
  console.log(`Server running on port ${SERVER_PORT}`)
);
