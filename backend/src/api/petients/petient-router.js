import express from "express";
import { patientController } from "./petient-controller.js"

export const petientRouter = (() => {
  const router = express.Router();
// Create
router.post("/add",  patientController.createPatient);

// Get by Lab
router.get("/get",  patientController.getPatientsByLab);

// Update
router.put("/update/:patient_id",  patientController.updatePatient);

// Delete
router.delete("/delete/:patient_id",  patientController.deletePatient);

 return router;
})();
