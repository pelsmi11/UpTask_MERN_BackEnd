import express from "express";
const router = express.Router();

import {
  registrar,
  autenticar,
  confirmar,
  olvidePassword,
  comprobarToken,
  nuevoPassword,
  perfil,
} from "../controllers/usuarioController.js";

import checkAuth from "../middleware/checkAuth.js";

//Creacion, registro y Confirmacion de Usuarios
router.post("/", registrar); // Crea un nuevo usuario
router.post("/login", autenticar); // Autenticar el Usuario
router.get("/confirmar/:token", confirmar); // Confirmar token de correo
router.post("/olvide-password", olvidePassword); // Password olvidado
router.get("/olvide-password/:token", comprobarToken); // Password olvidado autenticando
router.post("/olvide-password/:token", nuevoPassword); // Nuevo password

router.get("/perfil", checkAuth, perfil);

export default router;
