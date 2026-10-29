const IP_BACKEND = "http://10.10.32.41:3000";

document.addEventListener("DOMContentLoaded", () => {
    // Botones principales
    const btnVerContrasena = document.getElementById("btn-ver-contrasena");
    const btnEliminarPerfil = document.getElementById("btn-eliminar-perfil");

    // Modales
    const modalContrasena = document.getElementById("modal-contrasena");
    const modalEliminar = document.getElementById("modal-eliminar");

    // Elementos internos modal contraseña
    const valorEmailUsuario = document.getElementById("valor-email-usuario");
    const valorPassUsuario = document.getElementById("valor-pass-usuario");

    // Botones modal eliminar
    const btnCancelarEliminar = document.getElementById("btn-cancelar-eliminar");
    const btnConfirmarEliminar = document.getElementById("btn-confirmar-eliminar");

    // Obtener usuario activo
    const usuarioActivo = JSON.parse(localStorage.getItem("usuarioLogueado"))
                       || JSON.parse(sessionStorage.getItem("usuarioLogueado"))
                       || { email: "", password: "" };

    // Abrir modal Ver Contraseña
    // Abrir modal Ver Contraseña pidiendo los datos al backend
    if (btnVerContrasena && modalContrasena) {
        btnVerContrasena.addEventListener("click", async () => {
            if (usuarioActivo && usuarioActivo.id) {
                try {
                    // Petición GET al backend Express
                    const respuesta = await fetch(`${IP_BACKEND}/usuarios/${usuarioActivo.id}`);
                    if (respuesta.ok) {
                        const datosBackend = await respuesta.json();
                        valorEmailUsuario.textContent = datosBackend.email || "--";
                        valorPassUsuario.textContent = datosBackend.contraseña || datosBackend.contrasena || "--";
                    } else {
                        valorEmailUsuario.textContent = usuarioActivo.email || "--";
                        valorPassUsuario.textContent = usuarioActivo.contraseña || usuarioActivo.contrasena || "--";
                    }
                } catch (error) {
                    console.error("Error al obtener los datos del usuario:", error);
                    valorEmailUsuario.textContent = usuarioActivo.email || "--";
                    valorPassUsuario.textContent = usuarioActivo.contraseña || usuarioActivo.contrasena || "--";
                }
            } else {
                valorEmailUsuario.textContent = usuarioActivo ? (usuarioActivo.email || "--") : "--";
                valorPassUsuario.textContent = "--";
            }
            modalContrasena.classList.add("activo");
        });
    }

    // Abrir modal Eliminar Perfil
    if (btnEliminarPerfil && modalEliminar) {
        btnEliminarPerfil.addEventListener("click", () => {
            modalEliminar.classList.add("activo");
        });
    }

    // Cancelar/Cerrar modal eliminar
    if (btnCancelarEliminar && modalEliminar) {
        btnCancelarEliminar.addEventListener("click", () => {
            modalEliminar.classList.remove("activo");
        });
    }

    // Confirmar eliminación -> Borrar usuario en Backend e ir a primera.html
    if (btnConfirmarEliminar) {
        btnConfirmarEliminar.addEventListener("click", async () => {
            if (usuarioActivo && usuarioActivo.id) {
                try {
                    // Petición DELETE a la Ruta 17 (/usuarios/:id) deExpress
                    const respuesta = await fetch(`${IP_BACKEND}/usuarios/${usuarioActivo.id}`, {
                        method: "DELETE"
                    });

                    if (!respuesta.ok) {
                        alert("No se pudo eliminar el usuario en el servidor.");
                        return;
                    }
                } catch (error) {
                    console.error("Error al intentar eliminar el usuario:", error);
                    alert("Error de conexión al eliminar el perfil.");
                    return;
                }
            }

            // borra la sesión local del navegador
            localStorage.removeItem("usuarioLogueado");
            sessionStorage.removeItem("usuarioLogueado");

            window.location.href = "primera.html";
        });
    }

    // Cerrar los modales al hacer clic fuera de la tarjeta blanca
    [modalContrasena, modalEliminar].forEach(modal => {
        if (modal) {
            modal.addEventListener("click", (e) => {
                if (e.target === modal) {
                    modal.classList.remove("activo");
                }
            });
        }
    });
});