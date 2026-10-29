import express from 'express';
import type { Express, Request, Response } from 'express';
import { readFileSync, writeFileSync } from 'node:fs';

const app: Express = express();
const PUERTO: number = Number(process.env.PORT ?? 3000);

app.use(express.json());

app.use((req: Request, res: Response, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PATCH, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.sendStatus(204);
    return;
  }

  next();
});


/** Ruta de control: responde 200 con el texto OK. */
app.get('/health', (req: Request, res: Response): void => {
  res.status(200).type('text/plain').send('OK');
});


//                            A PARTIR DE ACA EMPECE A PROGRAMAR YO

const leerJSON = (archivo: string): any[] => {
  try {
    const contenido = readFileSync(`data/${archivo}.json`, 'utf-8');
    return JSON.parse(contenido);
  } catch (error) {
    console.log(`Error al leer ${archivo}.json:`, error);
    return [];
  }
};


const guardarJSON = (archivo: string, datos: any): void => {   
  writeFileSync(`data/${archivo}.json`, JSON.stringify(datos, null, 2), 'utf-8');
};

type Eventos = {
  id: number;
  pacienteId: number;
  categoria: string;
  fecha: string;
  hora: string;
  descripcion: string;
};

type RegistroHistorial = {
  id: number;
  pacienteId: number;
  categoria: string;
  fecha?: string;
  hora?: string;
  descripcion?: string;
  [campo: string]: string | number | undefined;
};

// 1. iniciar sesión ✔ funciona con frontend 
app.post('/login', (req: Request, res: Response) => {
  const email = req.body.email;
  const contraseña = req.body.contraseña;
  const guardado: string = readFileSync('data/usuarios.json', 'utf-8');
  const usuarios = JSON.parse(guardado);

  for (let i = 0; i < usuarios.length; i++) {
    if (email === usuarios[i].email && contraseña === usuarios[i].contraseña) {
      res.json({
        mensaje: "Inicio de sesión correcto",
        usuario: {
          id: usuarios[i].id,
          nombreYapellido: usuarios[i].nombreYapellido,
          email: usuarios[i].email
        }
      });
      return;
    }
  }
  
  res.status(401).send("Email o contraseña incorrecto");
});



// 2. Crear usuario ✔ funciona con frontend 
app.post('/usuarios/crear', (req: Request, res: Response): void => {
  const nombreYapellido = req.body.nombreYapellido;
  const email = req.body.email;
  const contraseña = req.body.contraseña;
  const medicamentosHabituales = req.body.medicamentosHabituales; 
  const diagnostico = req.body.diagnostico; 
  const fechaNacimiento = req.body.fechaNacimiento; 
  const observaciones = req.body.observaciones
  const usuarios = leerJSON("usuarios");

  let existeElusuaio = false;

  for (let i = 0; i < usuarios.length; i++) {
    if (usuarios[i].email === email) {
      existeElusuaio = true;
    }
  }

  if (existeElusuaio) {
    res.status(400).json({ mensaje: "El email ya esta registrado"});
    return;
  }

const nuevoUsuario = { 
    id: Date.now(),
    nombreYapellido: String(nombreYapellido),
    email: String(email),
    contraseña: String(contraseña),
    medicamentosHabituales: String(medicamentosHabituales),
    diagnostico: String(diagnostico),
    fechaNacimiento: String(fechaNacimiento),
    observaciones: String(observaciones)
  };

  usuarios.push(nuevoUsuario);
  guardarJSON("usuarios", usuarios);

  res.status(201).json({
    mensaje: "Usuario creado con exito",
    usuario: {
      id: nuevoUsuario.id,
      nombreYapellido: nuevoUsuario.nombreYapellido,
      contraseña: nuevoUsuario.contraseña,
      email: nuevoUsuario.email,
      medicamentosHabituales: nuevoUsuario.medicamentosHabituales,
      diagnostico: nuevoUsuario.diagnostico,
      fechaNacimiento: nuevoUsuario.fechaNacimiento,
      observaciones: nuevoUsuario.observaciones
    }
  });
});


// 3. editar perfil del paciente ✔ funciona con frontend 
app.patch('/editar-usuario/:id', (req: Request, res: Response): void => {
  const id = Number(req.params.id);
  const fechaNacimiento = req.body.fechaNacimiento;
  const diagnostico = req.body.diagnostico;
  const medicamentosHabituales = req.body.medicamentosHabituales;
  const observaciones = req.body.observaciones

  const usuarios = leerJSON("usuarios");

  let indice = -1;

  for (let i = 0; i < usuarios.length; i++) {
    if (usuarios[i].id === id) {
      indice = i;
    }
  }

  if (indice === -1) {
    res.status(404).json({ mensaje: "Usuario no encontrado"});
    return;
  }
  if (fechaNacimiento) {
    usuarios[indice].fechaNacimiento = String(fechaNacimiento);
  }
  if (observaciones) {
    usuarios[indice].observaciones = String(observaciones);
  }
  if (diagnostico) {
    usuarios[indice].diagnostico = String(diagnostico);
  }
  if (medicamentosHabituales) {
    usuarios[indice].medicamentosHabituales = String(medicamentosHabituales);
  }

  guardarJSON("usuarios", usuarios);

  res.json({
    mensaje: "Perfil actualizado",
    usuario: {
      id: usuarios[indice].id,
      nombreYapellido: usuarios[indice].nombreYapellido,
      email: usuarios[indice].email,
      medicamentosHabituales: usuarios[indice].medicamentosHabituales,
      diagnostico: usuarios[indice].diagnostico,
      fechaNacimiento: usuarios[indice].fechaNacimiento,
      observaciones: usuarios[indice].observaciones
    }
  });
});



// 4. obtener datos del perfil ✔ funciona con frontend 
app.get('/usuarios/:id', (req: Request, res: Response): void => {
  const id = Number(req.params.id);
  const usuarios = leerJSON("usuarios");

  let usuarioEncontrado = null;

  for (let i = 0; i < usuarios.length; i++) {
    if (usuarios[i].id === id) {
      usuarioEncontrado = usuarios[i];
    }
  }

  if (usuarioEncontrado) {
    res.json({
      id: usuarioEncontrado.id,
      nombreYapellido: usuarioEncontrado.nombreYapellido,
      contraseña: usuarioEncontrado.contraseña,
      email: usuarioEncontrado.email,
      medicamentosHabituales: usuarioEncontrado.medicamentosHabituales,
      diagnostico: usuarioEncontrado.diagnostico,
      fechaNacimiento: usuarioEncontrado.fechaNacimiento,
      observaciones: usuarioEncontrado.observaciones
    });
    return;
  }

  res.status(404).json({ mensaje: "Usuario no encontrado"});
});


// 5. obtener historial cronológico ✔ funciona con frontend 
app.get('/pacientes/:id/historial', (req: Request, res: Response): void => {
  const pacienteId = Number(req.params.id);

  const eventos: Eventos[] = leerJSON('eventos');
  const medicaciones = leerJSON('medicaciones');
  const sueno = leerJSON('sueno');
  const crisis = leerJSON('crisis');
  const menstruacion = leerJSON('menstruacion');
  const estadodeanimo = leerJSON('estadodeanimo');



  const historial: Eventos[] = []; 

  for (let i = 0; i < eventos.length; i++) {
    if (eventos[i].pacienteId === pacienteId) {
      historial.push(eventos[i]);
    }
  }

  for (let i = 0; i < medicaciones.length; i++) {
    if (Number(medicaciones[i].pacienteId) === pacienteId) {
      historial.push({
        ...medicaciones[i],
        categoria: 'medicacion'
      });
    }
  }

  for (let i = 0; i < sueno.length; i++) {
    if (Number(sueno[i].pacienteId) === pacienteId) {
      historial.push({
        ...sueno[i],
        categoria: 'sueno'
      });
    }
  }

  for (let i = 0; i < crisis.length; i++) {
    if (Number(crisis[i].pacienteId) === pacienteId) {
      historial.push({
        ...crisis[i],
        categoria: 'crisis'
      });
    }
  }

  for (let i = 0; i < menstruacion.length; i++) {
    if (Number(menstruacion[i].pacienteId) === pacienteId) {
      historial.push({
        ...menstruacion[i],
        categoria: 'menstruacion'
      });
    }
  }

  for (let i = 0; i < estadodeanimo.length; i++) {
    if (Number(estadodeanimo[i].pacienteId) === pacienteId) {
      historial.push({
        ...estadodeanimo[i],
        categoria: 'estado de ánimo'
      });
    }
  }

  res.json({
    pacienteId,
    totalEventos: historial.length,
    historial: historial,
    crisis: crisis,
    menstruacion: menstruacion,
    estadodeanimo: estadodeanimo,
    sueno: sueno,
    medicaciones: medicaciones
  });
});


// 6. registrar medicación ✔ funciona con frontend 
app.post('/medicaciones', (req: Request, res: Response): void => {
  const pacienteId = Number(req.body.pacienteId);
  const dosis = String(req.body.dosis);
  const horario = String(req.body.horario);
  const nombreMedicamento = String(req.body.nombreMedicamento);
  const fecha = String(req.body.fecha);  
  const tipoMedicacion = String(req.body.tipoMedicacion);
  const momentoDia = String(req.body.momentoDia);

  const medicaciones = leerJSON('medicaciones');

  const nuevaMedicacion = {
    id: Date.now(),
    pacienteId: pacienteId,
    dosis: dosis,
    horario: horario,
    nombreMedicamento: nombreMedicamento,
    fecha: fecha,
    tipoMedicacion: tipoMedicacion,
    momentoDia: momentoDia
  };

  medicaciones.push(nuevaMedicacion);
  guardarJSON('medicaciones', medicaciones);

  res.status(201).json({
    mensaje:'Medicación registrada',
    medicacion: nuevaMedicacion
  });
});


// 7. registar sueño ✔ funciona con frontend 
app.post('/sueno', (req: Request, res: Response): void => {
  const pacienteId = Number(req.body.pacienteId);
  const fechaDelDia = String (req.body.fechaDelDia);
  const horasDormidas = String(req.body.horasDormidas);
  const cuantasVeces = String (req.body.cuantasVeces);

  const sueno = leerJSON('sueno');

  const nuevoSueno = {
    id: Date.now(),
    pacienteId: pacienteId,
    fechaDelDia: fechaDelDia,
    horasDormidas: horasDormidas,
    cuantasVeces: cuantasVeces
  };
  sueno.push(nuevoSueno);
  guardarJSON('sueno', sueno);

  res.status(201).json({
    mensaje:'Sueño registrada',
    sueño: nuevoSueno
  });
});

// 8. registrar crisis ✔ funciona con frontend 
app.post('/crisis', (req: Request, res: Response): void => {
  const pacienteId = Number(req.body.pacienteId);
  const tipo = String(req.body.tipo);
  const fecha =  String(req.body.fecha);
  const horario = String(req.body.horario);
  const observaciones = String(req.body.observaciones)

  const crisis = leerJSON('crisis');

  const nuevaCrisis = {
    id: Date.now(),
    pacienteId: pacienteId,
    tipo: tipo,
    fecha: fecha,
    horario: horario,
    observaciones: observaciones
  };
  crisis.push(nuevaCrisis);
  guardarJSON('crisis', crisis);

  res.status(201).json({
    mensaje: 'Crisis registrada',
    crisis: nuevaCrisis
  });
});

// 9. registar menstruacion ✔ funciona con frontend 
app.post('/menstruacion', (req: Request, res: Response): void => {
  const pacienteId = Number(req.body.pacienteId);
  const fechaInicio = String(req.body.fechaInicio);
  const fechaTermino = String(req.body.fechaTermino);
  const observaciones = String(req.body.observaciones)

  const menstruacion = leerJSON('menstruacion');

  const nuevaMenstruacion = {
    id: Date.now(),
    pacienteId: pacienteId,
    fechaInicio: fechaInicio,
    fechaTermino: fechaTermino,
    observaciones: observaciones
  }
  menstruacion.push(nuevaMenstruacion);
  guardarJSON('menstruacion', menstruacion);

res.status(201).json({
  mensaje: 'Menstruacion registrada',
  menstruacion: nuevaMenstruacion
});
});


// 10. registrar estado de animo ✔ funciona con frontend 
app.post('/estadoDeAnimo', (req: Request, res: Response): void => {
  const pacienteId = Number(req.body.pacienteId);
  const emocion = String(req.body.emocion);
  const intensidad = String(req.body.intensidad);
  const fecha = String(req.body.fecha)

  const estadodeanimo = leerJSON('estadodeanimo');

  const nuevoEstadoeanimo = {
    id: Date.now(),
    pacienteId: pacienteId,
    emocion: emocion,
    intensidad: intensidad,
    fecha: fecha,
  }
  estadodeanimo.push(nuevoEstadoeanimo);
  guardarJSON('estadodeanimo', estadodeanimo);

  res.status(201).json({
    mensaje: 'Estado de ánimo registrada',
    estadodeanimo: nuevoEstadoeanimo
  });
  });



// 11. obtener estadísticas de los graficos ✔ funciona con frontend 
app.get('/pacientes/:id/estadisticas', (req: Request, res: Response): void => {
  const pacienteId = Number(req.params.id);
  const eventos = leerJSON('eventos');

  let sueño = 0; 
  let menstruacion = 0;
  let crisis = 0;
  let estadoAnimo = 0;

  for (let i = 0; i < eventos.length; i++) {
    if (eventos[i].pacienteId === pacienteId) {

  if (eventos[i].categoria === 'sueño') {
        sueño++;
  }

  if (eventos[i].categoria === 'crisis') {
        crisis++;
   }

   if (eventos[i].categoria === 'menstruacion') {
        menstruacion++;
   }

   if (eventos[i].categoria === 'estado de ánimo') {
        estadoAnimo++;
  }
    }
  }

  res.json({
    pacienteId: pacienteId,
    estadisticas: {
      sueño: sueño,
      crisis: crisis,
      estadoAnimo: estadoAnimo,
      menstruacion: menstruacion
    }
  });
});

// 12. crear nuevo recordatorio ✔ funciona con frontend 
app.post('/recordatorios/crear', (req: Request, res: Response): void => { 
  const usuarioEmail = req.body.usuarioEmail;
  const fecha = req.body.fecha;
  const hora = req.body.hora;
  const descripcion = req.body.descripcion

  const recordatorios = leerJSON("recordatorios");

  const nuevoRecordatorio = {
    id: Date.now(),
    usuarioEmail: String(usuarioEmail),
    fecha: String(fecha),
    hora: String(hora),
    descripcion: String(descripcion)
  };

  recordatorios.push(nuevoRecordatorio);
  guardarJSON("recordatorios", recordatorios);
   res.status(201).json({
    mensaje: "Recordatorio guardado con éxito",
    recordatorios: nuevoRecordatorio
   });
  });


// 13. obtener los recordatorios de un usuario por su email ✔ funciona con frontend 
app.get('/recordatorios/:email', (req: Request, res: Response): void => {
  const emailUsuario = req.params.email;
  const recordatorios = leerJSON('recordatorios');
  const recordatoriosFiltrados: Eventos[] = [];

  for (let i = 0; i < recordatorios.length; i++) {
    if (recordatorios[i].usuarioEmail === emailUsuario) {
      recordatoriosFiltrados.push(recordatorios[i]);
    }
  }

  res.json(recordatoriosFiltrados);
});

// 14. eliminar un recordatorio por id ✔ funciona con frontend
app.delete('/recordatorios/:id', (req: Request, res: Response): void => {
  const idBorrar = Number(req.params.id);
  const recordatorios = leerJSON('recordatorios');
  const listaNueva: { [campo: string]: string | number | boolean }[] = [];

  for (let i = 0; i < recordatorios.length; i++) {
    if (Number(recordatorios[i].id) !== idBorrar) {
      listaNueva.push(recordatorios[i]);
    }
  }

  guardarJSON('recordatorios', listaNueva);

  res.json({ mensaje: 'Recordatorio eliminado con éxito' });
});

// 15. Eliminar perfil de usuario ✔ funciona con frontend
app.delete('/usuarios/:id', (req: Request, res: Response): void => {
  const idBorrar = Number(req.params.id);
  const usuarios = leerJSON('usuarios');
  let indice = -1;

  for (let i = 0; i < usuarios.length; i++) {
    if (Number(usuarios[i].id) === idBorrar) {
      indice = i;
    }
  }

  if (indice === -1) {
    res.status(404).json({ mensaje: 'Usuario no encontrado' });
    return;
  }

  usuarios.splice(indice, 1);
  guardarJSON('usuarios', usuarios);

  res.json({ mensaje: 'Perfil eliminado correctamente' });
});



// 16. sincronizar información al iniciar la aplicación ✔ funciona con frontend 
app.get('/sincronizar', (req: Request, res: Response): void => {
  const usuarios = leerJSON('usuarios');
  const usuariosSinContraseña = [];

  for (let i = 0; i < usuarios.length; i++) {
    usuariosSinContraseña.push({
      id: usuarios[i].id,
      nombreYapellido: usuarios[i].nombreYapellido,
      email: usuarios[i].email,
      medicamentosHabituales: usuarios[i].medicamentosHabituales,
      diagnostico: usuarios[i].diagnostico,
      fechaNacimiento: usuarios[i].fechaNacimiento,
      observaciones: usuarios[i].observaciones
    });
  }

  const pacientes = leerJSON('pacientes');
  const eventos = leerJSON('eventos');
  const recordatorios  = leerJSON('recordatorios');
  const medicaciones = leerJSON('medicaciones');
  const sueño = leerJSON('sueño');
  const notas = leerJSON('notas');


  res.json({
    usuarios: usuariosSinContraseña,
    pacientes: pacientes,
    eventos: eventos,
    recordatorios: recordatorios ,
    medicaciones: medicaciones,
    sueño: sueño,
    notas: notas

  });
});


// Iniciar servidor
app.listen(PUERTO,"0.0.0.0", () => {
  console.log(`Servidor abierto en http:// 10.8.5.149:${PUERTO}`);
});

