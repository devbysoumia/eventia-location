import express from "express";
import cors from "cors";
import "dotenv/config";
import mongoose from "mongoose";
import routes from "./routes.js";

const app = express();
const port = Number(process.env.PORT) || 4001;
const mongoUri = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/eventia_clients";

app.use(cors());
app.use(express.json());
app.get("/health", (req, res) => res.json({ service: "client-service", status: "UP" }));
app.use("/api/clients", routes);
app.use((error, req, res, next) => {
  console.error(error);
  res.status(500).json({ message: "Erreur interne du service client." });
});

mongoose.connect(mongoUri)
  .then(() => app.listen(port, () => console.log(`client-service sur le port ${port}`)))
  .catch((error) => {
    console.error("Connexion MongoDB impossible.", error);
    process.exitCode = 1;
  });
