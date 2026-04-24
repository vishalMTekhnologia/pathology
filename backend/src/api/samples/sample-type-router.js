import express from "express";
import { sampleTypeController } from "./sample-type-controller.js"

export const sampleTypeRouter = (() => {
  const router = express.Router();

router.get("/", sampleTypeController.getSamples)

   return router;
})();
