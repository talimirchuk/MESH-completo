// Obtener datos iniciales desde el Backend
async function obtenerDatosPaciente() {
    const usuarioSesion = JSON.parse(localStorage.getItem("usuarioLogueado")) 
                       || JSON.parse(localStorage.getItem("usuarioRegistrado"))
                       || JSON.parse(sessionStorage.getItem("usuarioLogueado"));

    if (!usuarioSesion || !usuarioSesion.id) {
        return {
            nombreCompleto: "",
            fechaNacimiento: "",
            diagnostico: "",
            email: "",
            medicamentosHabituales: [],
            observaciones: ""
        };
    }

    try {
        const respuesta = await fetch(`http://10.8.5.149:3000/usuarios/${usuarioSesion.id}`);
        if (respuesta.ok) {
            const datosUsuario = await respuesta.json();

            datosUsuario.nombreCompleto = datosUsuario.nombreYapellido || datosUsuario.nombreCompleto;
            // Si el backend devuelve medicamentos como string "Med1 - Med2", los convierte a Array
            if (typeof datosUsuario.medicamentosHabituales === "string") {
                datosUsuario.medicamentosHabituales = datosUsuario.medicamentosHabituales
                    .split("-")
                    .map(m => m.trim())
                    .filter(m => m.length > 0);
            }

            return datosUsuario;
        }
    } catch (error) {
        console.error("Error al obtener los datos del paciente:", error);
    }

    // si falla el pedido
    return {
        nombreCompleto: "--",
        fechaNacimiento: "",
        diagnostico: "",
        email: usuarioSesion ? usuarioSesion.email : "",
        medicamentosHabituales: [],
        observaciones: ""
    };
}

let pacienteDatos = {};

// Guardar los datos de forma permanente
// Guardar los datos de forma permanente en el Backend mediante PATCH
async function guardarDatos() {
    const usuarioSesion = JSON.parse(localStorage.getItem("usuarioLogueado")) 
                       || JSON.parse(localStorage.getItem("usuarioRegistrado"))
                       || JSON.parse(sessionStorage.getItem("usuarioLogueado"));

    if (!usuarioSesion || !usuarioSesion.id) {
        return;
    }

    // Convertimos el Array de medicamentos a String "Med1 - Med2" para enviar al Backend
    const medicamentosFormateados = Array.isArray(pacienteDatos.medicamentosHabituales)
        ? pacienteDatos.medicamentosHabituales.join(" - ")
        : pacienteDatos.medicamentosHabituales;

    const datosAEnviar = {
        fechaNacimiento: pacienteDatos.fechaNacimiento,
        diagnostico: pacienteDatos.diagnostico,
        medicamentosHabituales: medicamentosFormateados,
        observaciones: pacienteDatos.observaciones
    };

    try {
        const respuesta = await fetch(`http://10.8.5.149:3000/editar-usuario/${usuarioSesion.id}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(datosAEnviar)
        });

        if (respuesta.ok) {
            const resultado = await respuesta.json();
            if (resultado.usuario) {
                if (localStorage.getItem("usuarioLogueado")) {
                    localStorage.setItem("usuarioLogueado", JSON.stringify(resultado.usuario));
                }
                if (sessionStorage.getItem("usuarioLogueado")) {
                    sessionStorage.setItem("usuarioLogueado", JSON.stringify(resultado.usuario));
                }
            }
        }
    } catch (error) {
        console.error("Error al actualizar la ficha del paciente:", error);
    }
}

function mostrarPaciente() {
    document.getElementById("paciente-nombre").textContent = pacienteDatos.nombreCompleto || "--";
    document.getElementById("paciente-nacimiento").textContent = pacienteDatos.fechaNacimiento || "";
    document.getElementById("paciente-diagnostico").textContent = pacienteDatos.diagnostico || "";
    document.getElementById("paciente-contacto").textContent = pacienteDatos.email || "";
    document.getElementById("paciente-observaciones").textContent = pacienteDatos.observaciones || "";

    // Renderizar tarjetas de medicamentos habituales
    const contenedorMed = document.getElementById("contenedor-medicamentos");
    contenedorMed.innerHTML = "";

    let listaMed = pacienteDatos.medicamentosHabituales;

    if (typeof listaMed === "string") {
        listaMed = listaMed.split("-").map(m => m.trim()).filter(m => m.length > 0);
    }

    if (!listaMed || listaMed.length === 0) {
        contenedorMed.innerHTML = `<div class="tarjeta-pildora-med"><span class="valor">Sin medicamentos</span></div>`;
    } else {
        listaMed.forEach((med, index) => {
            const tarjeta = document.createElement("div");
            tarjeta.className = "tarjeta-pildora-med";
            tarjeta.innerHTML = `
                <div class="info-pildora-med">
                    <svg class="svg-pildora" width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M20.7687 3.55772L12.4807 11.8457L27.1813 26.5462L35.4692 18.2583C39.528 14.1985 39.529 7.61645 35.4692 3.55772C31.4095 -0.50101 24.8284 -0.50101 20.7687 3.55772Z" fill="#CA4040"/>
                        <path d="M3.5581 35.4689C7.61786 39.5276 14.1989 39.5276 18.2587 35.4689L27.1813 26.5462L12.4807 11.8457L3.5581 20.7683C-0.500625 24.828 -0.501652 31.4101 3.5581 35.4689Z" fill="#D4DA33"/>
                        <path d="M20.7687 3.55772L3.5581 20.7683C-0.500625 24.828 -0.501652 31.4101 3.5581 35.4689C7.61786 39.5276 14.1989 39.5276 18.2587 35.4689L27.1813 26.5462L35.4692 18.2583C39.528 14.1985 39.529 7.61645 35.4692 3.55772C31.4095 -0.50101 24.8284 -0.50101 20.7687 3.55772ZM18.2587 35.4689L35.4692 18.2583M3.5581 20.7683L12.4807 11.8457M20.7687 3.55772L12.4807 11.8457M27.1813 26.5462L12.4807 11.8457" stroke="black" stroke-width="1.02701" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                    <span class="valor" id="med-val-${index}">${med}</span>
                </div>
                <div class="btn-lapiz btn-edit-med" data-index="${index}">
                    <svg class="svg-lapiz" width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M30.6239 3.83512C30.8727 4.08466 31.0123 4.42265 31.0123 4.775C31.0123 5.12735 30.8727 5.46534 30.6239 5.71488L27.8469 8.49458L22.5218 3.16948L25.2988 0.389779C25.5484 0.140204 25.887 0 26.24 0C26.593 0 26.9316 0.140204 27.1812 0.389779L30.6239 3.83246V3.83512ZM25.9644 10.3743L20.6393 5.04924L2.49938 23.1919C2.35284 23.3384 2.24252 23.5171 2.17721 23.7137L0.0338564 30.1411C-0.00501469 30.2583 -0.0105338 30.384 0.0179166 30.5041C0.0463669 30.6242 0.107666 30.7341 0.194961 30.8214C0.282257 30.9087 0.392109 30.97 0.51224 30.9984C0.632372 31.0269 0.758047 31.0214 0.875222 30.9825L7.30262 28.8391C7.49902 28.7746 7.67769 28.6652 7.82448 28.5196L25.9644 10.3743Z" fill="black"/>
                    </svg>
                </div>
            `;
            contenedorMed.appendChild(tarjeta);
        });
    }

    asignarEventosEdicionPuntual();
}

// Edición puntual de campos
function habilitarEdicionCampo(elementId, propiedadData) {
    const el = document.getElementById(elementId);
    const valorActual = pacienteDatos[propiedadData] || "";
    
    // Si ya existe un input y tocamos el lapiz de nuevo, guardamos
    const inputExistente = el.querySelector("input");
    if (inputExistente) {
        pacienteDatos[propiedadData] = inputExistente.value.trim();
        guardarDatos();
        mostrarPaciente();
        return;
    }

    el.innerHTML = `<input type="text" id="input-temp-${propiedadData}" value="${valorActual}">`;
    const inputTemp = document.getElementById(`input-temp-${propiedadData}`);
    inputTemp.focus();

    // Guardar al presionar Enter
    inputTemp.addEventListener("keypress", (e) => {
        if (e.key === "Enter") {
            pacienteDatos[propiedadData] = inputTemp.value.trim();
            guardarDatos();
            mostrarPaciente();
        }
    });

    // Guardar al hacer clic fuera del campo
    inputTemp.addEventListener("blur", () => {
        pacienteDatos[propiedadData] = inputTemp.value.trim();
        guardarDatos();
        mostrarPaciente();
    });
}

function asignarEventosEdicionPuntual() {
    document.getElementById("btn-edit-nacimiento").onclick = () => habilitarEdicionCampo("paciente-nacimiento", "fechaNacimiento");
    document.getElementById("btn-edit-diagnostico").onclick = () => habilitarEdicionCampo("paciente-diagnostico", "diagnostico");
    document.getElementById("btn-edit-contacto").onclick = () => habilitarEdicionCampo("paciente-contacto", "email");
    document.getElementById("btn-edit-observaciones").onclick = () => habilitarEdicionCampo("paciente-observaciones", "observaciones");

    // Edición de medicamentos
    const btnsMed = document.querySelectorAll(".btn-edit-med");
    btnsMed.forEach(btn => {
        btn.onclick = () => {
            const index = btn.getAttribute("data-index");
            const spanMed = document.getElementById(`med-val-${index}`);
            
            const inputExistente = spanMed.querySelector("input");
            if (inputExistente) {
                pacienteDatos.medicamentosHabituales[index] = inputExistente.value.trim();
                guardarDatos();
                mostrarPaciente();
                return;
            }

            const valActual = pacienteDatos.medicamentosHabituales[index];
            spanMed.innerHTML = `<input type="text" id="input-med-${index}" value="${valActual}">`;
            const inputMed = document.getElementById(`input-med-${index}`);
            inputMed.focus();

            inputMed.addEventListener("keypress", (e) => {
                if (e.key === "Enter") {
                    pacienteDatos.medicamentosHabituales[index] = inputMed.value.trim();
                    guardarDatos();
                    mostrarPaciente();
                }
            });

            inputMed.addEventListener("blur", () => {
                pacienteDatos.medicamentosHabituales[index] = inputMed.value.trim();
                guardarDatos();
                mostrarPaciente();
            });
        };
    });
}

// Carga inicial asíncrona desde  Back
async function inicializarPaciente() {
    pacienteDatos = await obtenerDatosPaciente();
    mostrarPaciente();
}

inicializarPaciente();