/* funcion para mostrar u ocultar la contrasena al hacer clic en el ojo */
function activarOcultarMostrarContrasena(idDelInput, idDelBoton) {
    const casillaTexto = document.getElementById(idDelInput);
    const botonOjo = document.getElementById(idDelBoton);

    if (casillaTexto && botonOjo) {
        const dibujoPestana = botonOjo.querySelector(".svg-pestana");
        const dibujoOjo = botonOjo.querySelector(".svg-ojo");

        botonOjo.addEventListener("click", function() {
            if (casillaTexto.type === "password") {
                casillaTexto.type = "text";
                dibujoPestana.classList.add("oculto");
                dibujoOjo.classList.remove("oculto");
            } else {
                casillaTexto.type = "password";
                dibujoPestana.classList.remove("oculto");
                dibujoOjo.classList.add("oculto");
            }
        });
    }
}

activarOcultarMostrarContrasena("contrasena", "ojo-contrasena");
activarOcultarMostrarContrasena("confirmar-contrasena", "ojo-confirmar-contrasena");

async function guardarUsuario(datosFrontend) {
    // Mapea las propiedades al formato EXACTO que pide tu server.ts
    const datosParaBackend = {
        nombreYapellido: datosFrontend.nombreCompleto,
        email: datosFrontend.email,
        contraseña: datosFrontend.contrasena,
        medicamentosHabituales: Array.isArray(datosFrontend.medicamentosHabituales) 
                                ? datosFrontend.medicamentosHabituales.join(" - ") 
                                : datosFrontend.medicamentosHabituales,
        diagnostico: datosFrontend.diagnostico,
        fechaNacimiento: datosFrontend.fechaNacimiento,
        observaciones: datosFrontend.observaciones || ""
    };

    //  Petición POST al endpoint de server.ts
    const respuesta = await fetch("http://10.8.5.149:3000/usuarios/crear", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(datosParaBackend)
    });

    const resultado = await respuesta.json();

    //  Si backend responde con error 400 (ej. email repetido)
    if (!respuesta.ok) {
        throw new Error(resultado.mensaje || "Error al crear la cuenta.");
    }

    // Si fue exitoso (201), tu backend devuelve el objeto 'usuario' dentro de la respuesta
    localStorage.setItem("usuarioLogueado", JSON.stringify(resultado.usuario));
    sessionStorage.setItem("usuarioLogueado", JSON.stringify(resultado.usuario));
}

/* capturo el formulario */
const formRegistro = document.getElementById("form-registro");

formRegistro.addEventListener("submit", async function(e) {
    e.preventDefault();

    /* limpios los textos de error anteriores */
    const listaTextosError = document.querySelectorAll(".texto-error");
    listaTextosError.forEach(function(span) {
        span.textContent = "";
    });

    let hayErrores = false;

    /* lista de campos obligatorios */
    const campos = [
        { id: "nombre-completo", errorId: "error-nombre-completo" },
        { id: "email", errorId: "error-email" },
        { id: "contrasena", errorId: "error-contrasena" },
        { id: "confirmar-contrasena", errorId: "error-confirmar-contrasena" },
        { id: "fecha-nacimiento", errorId: "error-fecha-nacimiento" },
        { id: "diagnostico", errorId: "error-diagnostico" },
        { id: "medicamentos-habituales", errorId: "error-medicamentos-habituales" }
    ];

    /* valido que no haya ninguna casilla vacia */
    campos.forEach(function(campo) {
        const inputElemento = document.getElementById(campo.id);
        const errorElemento = document.getElementById(campo.errorId);

        if (!inputElemento.value.trim()) {
            errorElemento.textContent = "Por favor, completá esta casilla";
            hayErrores = true;
        }
    });

    const campoNombre = document.getElementById("nombre-completo");
    const errorNombre = document.getElementById("error-nombre-completo");

    if (campoNombre && campoNombre.value.trim()) {
        const palabras = campoNombre.value.trim().split(" ").filter(function(p) {
            return p.length > 0;
        });

        if (palabras.length < 2) {
            if (errorNombre) {
                errorNombre.textContent = "Ingresá tanto tu nombre como tu apellido";
            }
            hayErrores = true;
        }
    }
    
    /* valido coincidencia de contrasenas */
    const valorContrasena = document.getElementById("contrasena").value;
    const valorConfirmar = document.getElementById("confirmar-contrasena").value;

    if (valorContrasena && valorConfirmar && valorContrasena !== valorConfirmar) {
        document.getElementById("error-confirmar-contrasena").textContent = "Las contraseñas no coinciden";
        hayErrores = true;
    }

    if (hayErrores) {
        return;
    }

   /* armo el objeto con los datos del usuario nuevo */
   const medicamentosTexto = document.getElementById("medicamentos-habituales").value;

   /* separo por guion '-' y quito espacios sobrantes */
   const listaMedicamentos = medicamentosTexto
       .split("-")
       .map(function(med) { return med.trim(); })
       .filter(function(med) { return med.length > 0; });

   const nuevoUsuario = {
       nombreCompleto: document.getElementById("nombre-completo").value.trim(),
       email: document.getElementById("email").value.trim(),
       contrasena: valorContrasena,
       fechaNacimiento: document.getElementById("fecha-nacimiento").value,
       diagnostico: document.getElementById("diagnostico").value.trim(),
       medicamentosHabituales: listaMedicamentos
   };

   try {
    await guardarUsuario(nuevoUsuario);

    /* me manda a la pantalla de confirmacion de cuenta creada */
    window.location.href = "../html/cuentacreada.html";
} catch (error) {
    alert(error.message);
}
});