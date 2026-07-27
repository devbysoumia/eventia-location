import { Router } from "express";
import mongoose from "mongoose";
import NotificationModel from "./NotificationModel.js";
import NotificationRepository from "./domain/NotificationRepository.js";
import NotificationService from "./domain/NotificationService.js";
import NotificationController from "./controllers/NotificationController.js";

const router = Router();
const service = new NotificationService(new NotificationRepository(NotificationModel));
const controller = new NotificationController(service);

const asyncRoute = (handler) => async (req, res, next) => {
  try {
    await handler(req, res);
  } catch (error) {
    next(error);
  }
};

router.get("/", asyncRoute((req, res) => controller.getAll(req, res)));
router.post("/", asyncRoute((req, res) => controller.create(req, res)));

router.use((error, req, res, next) => {
  if (error instanceof TypeError || error instanceof mongoose.Error.ValidationError) {
    return res.status(400).json({ message: error.message });
  }
  next(error);
});

export default router;
