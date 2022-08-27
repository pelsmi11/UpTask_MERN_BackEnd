import express from "express";

import {
  obtenerProyectos,
  nuevoProyecto,
  obtenerProyecto,
  editarProyecto,
  eliminarProyecto,
  buscarColaborador,
  agregarColaborador,
  eliminarColaborador,
  obtenerTareas,
} from "../controllers/proyectoController.js";

import checkAuth from "../middleware/checkAuth.js";
import comprobarIdMongo from "../middleware/comprobarIdMongo.js";

const router = express.Router();

router
  .route("/")
  .get(checkAuth, obtenerProyectos)
  .post(checkAuth, nuevoProyecto);

router
  .route("/:id")
  .get(checkAuth, comprobarIdMongo, obtenerProyecto)
  .put(checkAuth, comprobarIdMongo, editarProyecto)
  .delete(checkAuth, comprobarIdMongo, eliminarProyecto);

router.get("/tareas/:id", checkAuth, comprobarIdMongo, obtenerTareas);

router.post("/colaboradores", checkAuth, buscarColaborador);
router.post(
  "/colaboradores/:id",
  checkAuth,
  comprobarIdMongo,
  agregarColaborador
);
router.post(
  "/eliminar-colaborador/:id",
  checkAuth,
  comprobarIdMongo,
  eliminarColaborador
);

export default router;
