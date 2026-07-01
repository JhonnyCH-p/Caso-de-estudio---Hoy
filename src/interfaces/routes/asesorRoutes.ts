
import { Router } from "express";
import { AsesorController } from "../controllers/AsesorController.js";
import { AsesorService } from "../../application/services/AsesorService.js";
import { AsesorRepositoryImpl } from "../../infrastructure/repositories/AsesorRepositoryImpl.js";

const repository = new AsesorRepositoryImpl();
const service = new AsesorService(repository);
const controller = new AsesorController(service);

const router = Router();

// ─── RUTAS CRUD ────────────────────────────────────────
router.post("/", controller.create);
router.get("/", controller.getAll);
router.get("/:id", controller.getById);
router.put("/:id", controller.update);
router.delete("/:id", controller.delete);

// ─── RUTAS DE NEGOCIO ──────────────────────────────────
router.post("/:id/comision", controller.calcularComision);
router.get("/buscar/especialidad/:especialidad", controller.getByEspecialidad);
router.get("/buscar/experiencia/:anios", controller.getByExperiencia);

export { router as AsesorRoutes };
