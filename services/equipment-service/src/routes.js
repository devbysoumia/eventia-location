import { Router } from "express";
import mongoose from "mongoose";
import EquipmentModel from "./EquipmentModel.js";
import EquipmentRepository from "./domain/EquipmentRepository.js";
import EquipmentService from "./domain/EquipmentService.js";
import EquipmentController from "./controllers/EquipmentController.js";

const router = Router();
const controller = new EquipmentController(
  new EquipmentService(new EquipmentRepository(EquipmentModel))
);
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
router.put("/:id/reserve", asyncRoute((req, res) => controller.reserve(req, res)));
router.put("/:id/release", asyncRoute((req, res) => controller.release(req, res)));
router.put("/:id", asyncRoute((req, res) => controller.update(req, res)));
router.delete("/:id", asyncRoute((req, res) => controller.delete(req, res)));

router.use((error, req, res, next) => {
  if (error.status) return res.status(error.status).json({ message: error.message });
  if (error instanceof TypeError || error instanceof mongoose.Error.ValidationError) {
    return res.status(400).json({ message: error.message });
  }
  if (error instanceof mongoose.Error.CastError) {
    return res.status(400).json({ message: "Identifiant d'équipement invalide." });
  }
  next(error);
});

export default router;
