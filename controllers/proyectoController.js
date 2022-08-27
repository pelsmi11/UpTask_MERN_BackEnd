import Proyecto from "../models/Proyecto.js";
import Tareas from "../models/Tarea.js";
import Usuario from "../models/Usuario.js";

const obtenerProyectos = async (req, res) => {
  try {
    const proyectos = await Proyecto.find({
      $or: [
        { colaboradores: { $in: req.usuario } },
        { creador: { $in: req.usuario } },
      ],
    }).select("-tareas");
    res.json(proyectos);
  } catch (error) {
    console.log(error);
  }
};

const nuevoProyecto = async (req, res) => {
  const proyecto = new Proyecto(req.body);
  proyecto.creador = req.usuario._id;
  // console.log(proyecto);
  try {
    const proyectoAlmacenado = await proyecto.save();
    res.json(proyectoAlmacenado);
  } catch (e) {
    console.log(e);
  }
};

const obtenerProyecto = async (req, res) => {
  try {
    const { id } = req.params;
    const _id = id.trim();

    const proyecto = await Proyecto.findById(_id)
      .populate({
        path: "tareas",
        populate: { path: "completado", select: " nombre " },
      })
      .populate("colaboradores", "nombre email");

    if (!proyecto) {
      const error = new Error("Proyecto not found");
      return res.status(404).json({ msg: error.message });
    }

    if (
      proyecto.creador.toString() !== req.usuario._id.toString() &&
      !proyecto.colaboradores.some(
        (colaborador) =>
          colaborador._id.toString() === req.usuario._id.toString()
      )
    ) {
      const error = new Error("Accion no Valida");
      return res.status(401).json({ msg: error.message });
    }

    // const tareas = await Tareas.find().where("proyecto").equals(proyecto._id);
    // res.json(tareas);

    return res.json(
      proyecto
      // , tareas
    );
  } catch (error) {
    console.log(error);
    return res.status(403).json({ msg: error });
  }
};

const editarProyecto = async (req, res) => {
  try {
    const { id } = req.params;
    const _id = id.trim();

    const proyecto = await Proyecto.findById(_id);

    if (!proyecto) {
      const error = new Error("Proyecto not found");
      return res.status(404).json({ msg: error.message });
    }

    if (!proyecto.creador.toString() === req.usuario._id.toString()) {
      const error = new Error("Accion no Valida");
      return res.status(401).json({ msg: error.message });
    }
    proyecto.nombre = req.body.nombre || proyecto.nombre;
    proyecto.descripcion = req.body.descripcion || proyecto.descripcion;
    proyecto.fechaEntrega = req.body.fechaEntrega || proyecto.fechaEntrega;
    proyecto.cliente = req.body.cliente || proyecto.cliente;

    const proyectoAlmacenado = await proyecto.save();
    return res.json(proyectoAlmacenado);
  } catch (error) {
    console.log(error);
    return res.status(403).json({ msg: error });
  }
};

const eliminarProyecto = async (req, res) => {
  try {
    const { id } = req.params;
    const _id = id.trim();

    const proyecto = await Proyecto.findById(_id);

    if (!proyecto) {
      const error = new Error("Proyecto not found");
      return res.status(404).json({ msg: error.message });
    }

    if (!proyecto.creador.toString() === req.usuario._id.toString()) {
      const error = new Error("Accion no Valida");
      return res.status(401).json({ msg: error.message });
    }

    const proyectoEliminado = await proyecto.deleteOne();
    return res.json({
      proyectoEliminado,
      msg: `El Proyecto Se Elimino`,
    });
  } catch (error) {
    console.log(error);
    return res.status(403).json({ msg: error });
  }
};

const buscarColaborador = async (req, res) => {
  const { email } = req.body;
  try {
    const usuario = await Usuario.findOne({ email }).select(
      "-confirmado -createdAt -token -updatedAt -__v -password"
    );
    if (!usuario) {
      const error = new Error("Usuario no encontrado");
      return res.status(404).json({ msg: error.message });
    }

    res.json(usuario);
  } catch (error) {
    console.log(error);
    return res.status(403).json({ msg: error });
  }
};

const agregarColaborador = async (req, res) => {
  try {
    const proyecto = await Proyecto.findById(req.params.id);
    if (!proyecto) {
      const error = new Error("Proyecto No Encontrado");
      return res.status(404).json({ msg: error.message });
    }

    if (proyecto.creador.toString() !== req.usuario._id.toString()) {
      const error = new Error("Accion no Valida");
      return res.status(404).json({ msg: error.message });
    }
    const { email } = req.body;
    const usuario = await Usuario.findOne({ email }).select(
      "-confirmado -createdAt -token -updatedAt -__v -password"
    );
    if (!usuario) {
      const error = new Error("Usuario no encontrado");
      return res.status(404).json({ msg: error.message });
    }

    // El Colaborador no es el Admin del proyecto
    if (proyecto.creador.toString() === usuario._id.toString()) {
      const error = new Error(
        "El Creador del Proyecto no Puede ser Colaborador"
      );
      return res.status(404).json({ msg: error.message });
    }

    // Revisar que no este ya agregado al proyecto
    if (proyecto.colaboradores.includes(usuario._id)) {
      const error = new Error("El Usuario ya Pertenece al Proyecto");
      return res.status(404).json({ msg: error.message });
    }

    // Esta bien, se puede agregar
    proyecto.colaboradores.push(usuario._id);
    const colaboradorAgregado = await proyecto.save();
    res.json({ msg: `El Colaborador ${usuario?.nombre} ha Sido Agregado` });
  } catch (error) {
    console.log(error);
    return res.status(403).json({ msg: error });
  }
};

const eliminarColaborador = async (req, res) => {
  try {
    const proyecto = await Proyecto.findById(req.params.id);
    if (!proyecto) {
      const error = new Error("Proyecto No Encontrado");
      return res.status(404).json({ msg: error.message });
    }

    if (proyecto.creador.toString() !== req.usuario._id.toString()) {
      const error = new Error("Accion no Valida");
      return res.status(404).json({ msg: error.message });
    }

    // Esta bien, se puede eliminar
    proyecto.colaboradores.pull(req.body.id);
    const colaboradorEliminado = await proyecto.save();
    res.json({ msg: `El Colaborador ha Sido Eliminado` });
  } catch (error) {
    console.log(error);
    return res.status(403).json({ msg: error });
  }
};

const obtenerTareas = async (req, res) => {
  try {
    const { id } = req.params;

    const existeProyecto = await Proyecto.findById(id);

    if (!existeProyecto) {
      const error = new Error("Proyecto No Encontrado");
      return res.status(404).json({ msg: error.message });
    }

    // Tienes que ser el creador del proyecto

    const tareas = await Tareas.find().where("proyecto").equals(id);
    return res.json(tareas);
  } catch (error) {
    console.error(error);
  }
};

export {
  obtenerProyectos,
  nuevoProyecto,
  obtenerProyecto,
  editarProyecto,
  eliminarProyecto,
  buscarColaborador,
  agregarColaborador,
  eliminarColaborador,
  obtenerTareas,
};
