# MESH

API de seguimiento de pacientes que permite gestionar perfiles, registrar eventos relacionados con la salud, consultar historiales, obtener estadísticas y administrar recordatorios. Los datos se guardan en archivos JSON.

## Endpoints

| Método | Ruta | Body / params | Respuesta |
|---|---|---|---|
| `GET` | `/health` | Sin parámetros ni body. | `200 OK`. Texto plano: `"OK"`. |
| `POST` | `/login` | Body: `email`, `contraseña`. | Si es correcto, devuelve un mensaje y los datos del usuario (`id`, `nombreYapellido`, `email`). Si los datos son incorrectos, devuelve `401` con `"Email o contraseña incorrecto"`. |
| `POST` | `/usuarios/crear` | Body: `nombreYapellido`, `email`, `contraseña`, `medicamentosHabituales`, `diagnostico`, `fechaNacimiento`, `observaciones`. | `201 Created`. Devuelve `"Usuario creado con exito"` y los datos del usuario creado. Si el email ya existe, devuelve `400`. |
| `PATCH` | `/editar-usuario/:id` | Parámetro: `id` del usuario. Body opcional: `fechaNacimiento`, `diagnostico`, `medicamentosHabituales`, `observaciones`. | Devuelve `"Perfil actualizado"` y los datos actualizados. Si el usuario no existe, devuelve `404`. |
| `GET` | `/usuarios/:id` | Parámetro: `id` del usuario. | Devuelve los datos del usuario: `id`, `nombreYapellido`, `email`, `contraseña`, `medicamentosHabituales`, `diagnostico`, `fechaNacimiento`, `observaciones`. Si no existe, devuelve `404`. |
| `DELETE` | `/usuarios/:id` | Parámetro: `id` del usuario. | Devuelve `"Perfil eliminado correctamente"`. Si no existe, devuelve `404`. |
| `GET` | `/pacientes/:id/historial` | Parámetro: `id` del paciente. | Devuelve `pacienteId`, `totalEventos`, `historial` y las listas completas de `crisis`, `menstruacion`, `estadodeanimo`, `sueno` y `medicaciones`. El historial reúne registros de las distintas categorías correspondientes al paciente. |
| `POST` | `/medicaciones` | Body: `pacienteId`, `dosis`, `horario`, `nombreMedicamento`, `fecha`, `tipoMedicacion`, `momentoDia`. | `201 Created`. Devuelve `"Medicación registrada"` y el objeto `medicacion` creado, con su `id`. |
| `POST` | `/sueno` | Body: `pacienteId`, `fechaDelDia`, `horasDormidas`, `cuantasVeces`. | `201 Created`. Devuelve `"Sueño registrada"` y el objeto `sueño` creado, con su `id`. |
| `POST` | `/crisis` | Body: `pacienteId`, `tipo`, `fecha`, `horario`, `observaciones`. | `201 Created`. Devuelve `"Crisis registrada"` y el objeto `crisis` creado, con su `id`. |
| `POST` | `/menstruacion` | Body: `pacienteId`, `fechaInicio`, `fechaTermino`, `observaciones`. | `201 Created`. Devuelve `"Menstruacion registrada"` y el objeto `menstruacion` creado, con su `id`. |
| `POST` | `/estadoDeAnimo` | Body: `pacienteId`, `emocion`, `intensidad`, `fecha`. | `201 Created`. Devuelve `"Estado de ánimo registrada"` y el objeto `estadodeanimo` creado, con su `id`. |
| `GET` | `/pacientes/:id/estadisticas` | Parámetro: `id` del paciente. | Devuelve `pacienteId` y un objeto `estadisticas` con los contadores `sueño`, `crisis`, `estadoAnimo` y `menstruacion`. |
| `POST` | `/recordatorios/crear` | Body: `usuarioEmail`, `fecha`, `hora`, `descripcion`. | `201 Created`. Devuelve `"Recordatorio guardado con éxito"` y el objeto `recordatorios` creado, con su `id`. |
| `GET` | `/recordatorios/:email` | Parámetro: `email` del usuario. | Devuelve un array con los recordatorios que coinciden con ese email. Si no hay coincidencias, devuelve un array vacío. |
| `DELETE` | `/recordatorios/:id` | Parámetro: `id` del recordatorio. | Devuelve `"Recordatorio eliminado con éxito"`. |
| `GET` | `/sincronizar` | Sin parámetros ni body. | Devuelve un objeto con las listas `usuarios`, `pacientes`, `eventos`, `recordatorios`, `medicaciones`, `sueño` y `notas`. Los usuarios se envían sin la contraseña. |

## Datos

La API guarda la información en archivos `.json` dentro de la carpeta `data/`. Cada archivo contiene una lista de objetos y se utiliza para conservar los registros entre ejecuciones del servidor.

- `usuarios.json`: perfiles de usuarios con nombre y apellido, email, contraseña, fecha de nacimiento, diagnóstico, medicamentos habituales y observaciones.
- `eventos.json`: eventos generales del historial, con campos como `id`, `pacienteId`, `categoria`, `fecha`, `hora` y `descripcion`.
- `medicaciones.json`: registros de medicación, con nombre del medicamento, dosis, horario, fecha, tipo de medicación y momento del día (`AM` o `PM`).
- `sueno.json`: registros del sueño, con fecha, horas dormidas y cantidad de veces que se despertó.
- `crisis.json`: registros de crisis, con tipo, fecha, horario y observaciones.
- `menstruacion.json`: registros del ciclo menstrual, con fecha de inicio, fecha de término y observaciones.
- `estadodeanimo.json`: registros del estado de ánimo, con emoción, intensidad y fecha.
- `recordatorios.json`: recordatorios asociados al email del usuario, con fecha, hora y descripción.


Los registros creados reciben un identificador numérico generado con `Date.now()`, salvo los datos que ya están cargados en los archivos.

## Funcionamiento general
- El backend está desarrollado con TypeScript y Express.

- El frontend se comunica con el backend mediante solicitudes HTTP (GET, POST, PATCH y DELETE).

- Los datos enviados desde el frontend viajan generalmente en formato JSON, mediante el body de la solicitud.

- El backend lee los archivos JSON, procesa la información y guarda los cambios cuando se crean, editan o eliminan registros.

- La API tiene habilitado CORS para permitir solicitudes desde el frontend.

- El servidor utiliza el puerto 3000 por defecto, aunque puede cambiar si se configura la variable de entorno PORT.

- Para comprobar que el servidor está funcionando, se puede consultar GET /health.