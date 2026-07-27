import { Router } from "express";
import mongoose from "mongoose";
import ReservationModel from "./ReservationModel.js";
import ReservationRepository from "./domain/ReservationRepository.js";
import ReservationService from "./domain/ReservationService.js";
import ReservationController from "./controllers/ReservationController.js";
import ServiceClient from "./infrastructure/ServiceClient.js";

const router = Router();
const serviceClient = new ServiceClient({
  clientServiceUrl: process.env.CLIENT_SERVICE_URL,
  equipmentServiceUrl: process.env.EQUIPMENT_SERVICE_URL,
  notificationServiceUrl: process.env.NOTIFICATION_SERVICE_URL
});
const controller = new ReservationController(
  new ReservationService(new ReservationRepository(ReservationModel), serviceClient)
);
const asyncRoute = (handler) => async (req, res, next) => {
  try {
    await handler(req, res);
  } catch (error) {
    next(error);
  }
};

router.get("/", asyncRoute((req, res) => controller.getAll(req, res)));
router.post("/", asyncRoute((req, res) => controller.create(req, res)));
router.put("/:id/cancel", asyncRoute((req, res) => controller.cancel(req, res)));
router.patch("/:id/cancel", asyncRoute((req, res) => controller.cancel(req, res)));

router.use((error, req, res, next) => {
  if (error.status) return res.status(error.status).json({ message: error.message });
  if (error instanceof TypeError || error instanceof mongoose.Error.ValidationError) {
    return res.status(400).json({ message: error.message });
  }
  if (error instanceof mongoose.Error.CastError) {
    return res.status(400).json({ message: "Identifiant de réservation invalide." });
  }
  next(error);
});

export default router;
