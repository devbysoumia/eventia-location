import { Router } from "express";
import mongoose from "mongoose";
import ClientModel from "./ClientModel.js";
import ClientRepository from "./domain/ClientRepository.js";
import ClientService from "./domain/ClientService.js";
import ClientController from "./controllers/ClientController.js";

const router = Router();
const service = new ClientService(new ClientRepository(ClientModel));
const controller = new ClientController(service);

const asyncRoute = (handler) => async (req, res, next) => {
  try {
    await handler(req, res);
  } catch (error) {
    next(error);
  }
};

router.get("/", asyncRoute((req, res) => controller.getAll(req, res)));
router.get("/:id", asyncRoute((req, res) => controller.getById(req, res)));
router.post("/", asyncRoute((req, res) => controller.create(req, res)));
router.put("/:id", asyncRoute((req, res) => controller.update(req, res)));
router.delete("/:id", asyncRoute((req, res) => controller.delete(req, res)));

router.use((error, req, res, next) => {
  if (error instanceof TypeError || error instanceof mongoose.Error.ValidationError) {
    return res.status(400).json({ message: error.message });
  }
  if (error instanceof mongoose.Error.CastError) {
    return res.status(400).json({ message: "Identifiant de client invalide." });
  }
  if (error?.code === 11000) {
    return res.status(409).json({ message: "Ce courriel est déjà utilisé." });
  }
  next(error);
});

export default router;
