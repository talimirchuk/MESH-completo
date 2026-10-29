const IP_BACKEND = "http://10.10.32.41:3000";

/* Lista inicial de prueba */
let listaRecordatorios = [
    
];

let idAEliminar = null;

document.addEventListener("DOMContentLoaded", async function() {
    await renderizarTarjetas();
    configurarEventosModal();
    configurarMascarasCampos();
});

function guardarYRefrescar() {
    localStorage.setItem("meshRecordatorios", JSON.stringify(listaRecordatorios));
    renderizarTarjetas();
}

/* Convierte string "dd/mm/aa" o "dd/mm/aaaa" en objeto Date para comparar fechas */
function parsearFecha(stringFecha) {
    const partes = stringFecha.split("/");
    if (partes.length !== 3) return new Date(0);

    const dia = parseInt(partes[0], 10);
    const mes = parseInt(partes[1], 10) - 1; // los meses en JS van de 0 a 11
    let anio = parseInt(partes[2], 10);

    // si el año viene de 2 dígitos (ej: 26) lo pasamos a 2026
    if (anio < 100) {
        anio += 2000;
    }

    return new Date(anio, mes, dia);
}

/* Convierte string "hh:mm" a minutos totales del día para comparar horas (0 a 24hs) */
function parsearHoraAMinutos(stringHora) {
    const partes = stringHora.split(":");
    if (partes.length !== 2) return 0;
    const horas = parseInt(partes[0], 10) || 0;
    const minutos = parseInt(partes[1], 10) || 0;
    return (horas * 60) + minutos;
}

async function renderizarTarjetas() {
    const contenedor = document.getElementById("contenedor-recordatorios");
    if (!contenedor) return;

    contenedor.innerHTML = "";

    // 1. Lee la sesión del usuario activo
    const usuarioActivo = JSON.parse(localStorage.getItem("usuarioLogueado"))
                       || JSON.parse(sessionStorage.getItem("usuarioLogueado"))
                       || { email: "invitado" };

    try {
        // 2. Pide los recordatorios de este usuario al Backend
        const respuesta = await fetch(`${IP_BACKEND}/recordatorios/${usuarioActivo.email}`);
        if (!respuesta.ok) return;

        const recordatoriosUsuario = await respuesta.json();

        /* Si no hay recordatorios guardados para esta cuenta */
        if (recordatoriosUsuario.length === 0) {
            contenedor.innerHTML = "<p style='font-size: 22px; color: #666;'>No hay recordatorios registrados.</p>";
            return;
        }

        /* Agrupar ítems por fecha */
        const agrupados = {};
        recordatoriosUsuario.forEach(item => {
            if (!agrupados[item.fecha]) {
                agrupados[item.fecha] = [];
            }
            agrupados[item.fecha].push(item);
        });

        /* Ordenar los días por fecha */
        const fechasOrdenadas = Object.keys(agrupados).sort((a, b) => {
            return parsearFecha(a) - parsearFecha(b);
        });

        /* Dibujar cada tarjeta */
        fechasOrdenadas.forEach(fecha => {
            const tarjeta = document.createElement("div");
            tarjeta.className = "tarjeta-dia-bloque";

            const recordatoriosDelDia = agrupados[fecha].sort((a, b) => {
                return parsearHoraAMinutos(a.hora) - parsearHoraAMinutos(b.hora);
            });

            let filasHTML = "";
            recordatoriosDelDia.forEach(rec => {
                filasHTML += `
                    <div class="fila-item-recordatorio">
                        <span class="hora-item">${rec.hora}</span>
                        <span class="texto-item">${rec.descripcion || rec.texto}</span>
                        <button class="btn-borrar-item" type="button" onclick="pedirConfirmacionBorrado(${rec.id})">
                            <svg width="40" height="40" viewBox="0 0 47 47" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M2.09961 10.4996H44.0996M18.8996 20.9996V31.4996M27.2996 20.9996V31.4996M6.29961 10.4996H39.8996L36.5816 40.3616C36.4679 41.3893 35.979 42.3389 35.2087 43.0286C34.4384 43.7183 33.4408 44.0997 32.4068 44.0996H13.7924C12.7584 44.0997 11.7608 43.7183 10.9905 43.0286C10.2202 42.3389 9.73134 41.3893 9.61761 40.3616L6.29961 10.4996ZM13.3241 4.50831C13.6638 3.78794 14.2013 3.179 14.8739 2.75252C15.5465 2.32604 16.3266 2.0996 17.123 2.09961H29.0762C29.873 2.0992 30.6535 2.32546 31.3265 2.75196C31.9995 3.17846 32.5374 3.78762 32.8772 4.50831L35.6996 10.4996H10.4996L13.3241 4.50831Z" stroke="#F95353" stroke-opacity="0.97" stroke-width="4.2" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg>
                        </button>
                    </div>
                `;
            });

            tarjeta.innerHTML = `
                <div class="encabezado-tarjeta-dia">
                    <span class="texto-fecha-header">${fecha}</span>
                </div>
                <div class="cuerpo-tarjeta-dia">
                    ${filasHTML}
                </div>
            `;

            contenedor.appendChild(tarjeta);
        });
    } catch (error) {
        console.error("Error al obtener recordatorios del servidor:", error);
    }
}

function configurarEventosModal() {
    const btnAbrir = document.getElementById("btn-abrir-modal");
    const overlayModal = document.getElementById("overlay-modal");
    const form = document.getElementById("form-nuevo-recordatorio");

    if (btnAbrir && overlayModal) {
        btnAbrir.addEventListener("click", function() {
            overlayModal.classList.remove("oculto");
        });

        /* Cierra al hacer clic en el overlay fuera del cuadrante */
        overlayModal.addEventListener("click", function(e) {
            if (e.target === overlayModal) {
                overlayModal.classList.add("oculto");
            }
        });
    }

    if (form) {
        form.addEventListener("submit", async function(e) {
            e.preventDefault();

            const texto = document.getElementById("input-descripcion").value.trim();
            const hora = document.getElementById("input-hora").value.trim();
            const fecha = document.getElementById("input-fecha").value.trim();

            if (!texto || !hora || !fecha) return;

            const usuarioActivo = JSON.parse(localStorage.getItem("usuarioLogueado"))
                               || JSON.parse(sessionStorage.getItem("usuarioLogueado"))
                               || { email: "invitado" };

            const nuevo = {
                usuarioEmail: usuarioActivo.email,
                fecha: fecha,
                hora: hora,
                descripcion: texto // Coincide con req.body.descripcion de Express
            };

            try {
                const respuesta = await fetch(`${IP_BACKEND}/recordatorios/crear`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(nuevo)
                });

                if (respuesta.ok) {
                    await renderizarTarjetas();
                }
            } catch (error) {
                console.error("Error al guardar el recordatorio en el servidor:", error);
            }

            form.reset();
            overlayModal.classList.add("oculto");
        });
    }

    /* Modal confirmación eliminar */
    const overlayConfirmar = document.getElementById("overlay-confirmar");
    const btnCancelar = document.getElementById("btn-cancelar-eliminar");
    const btnConfirmar = document.getElementById("btn-confirmar-eliminar");

    if (btnCancelar && overlayConfirmar) {
        btnCancelar.addEventListener("click", function() {
            idAEliminar = null;
            overlayConfirmar.classList.add("oculto");
        });

        overlayConfirmar.addEventListener("click", function(e) {
            if (e.target === overlayConfirmar) {
                idAEliminar = null;
                overlayConfirmar.classList.add("oculto");
            }
        });
    }

    if (btnConfirmar && overlayConfirmar) {
        if (btnConfirmar && overlayConfirmar) {
            btnConfirmar.addEventListener("click", async function() {
                if (idAEliminar !== null) {
                    try {
                        // Envia la petición DELETE al servidor 
                        const respuesta = await fetch(`http://10.8.5.215:3000/recordatorios/${idAEliminar}`, {
                            method: "DELETE"
                        });
    
                        if (respuesta.ok) {
                            // Volvemos a pedir y dibujar la lista actualizada desde el servidor
                            await renderizarTarjetas();
                        }
                    } catch (error) {
                        console.error("Error al eliminar el recordatorio:", error);
                    }
    
                    idAEliminar = null;
                }
                overlayConfirmar.classList.add("oculto");
            });
        }
    }
}

window.pedirConfirmacionBorrado = function(id) {
    idAEliminar = id;
    const overlayConfirmar = document.getElementById("overlay-confirmar");
    if (overlayConfirmar) {
        overlayConfirmar.classList.remove("oculto");
    }
};

/* Mascara de hora hh:mm y fecha con mes estricto (01 a 12) */
function configurarMascarasCampos() {
    const inputHora = document.getElementById("input-hora");
    const inputFecha = document.getElementById("input-fecha");

    if (inputHora) {
        inputHora.addEventListener("input", function(e) {
            let val = e.target.value.replace(/\D/g, "");
            if (val.length >= 3) {
                val = val.substring(0, 2) + ":" + val.substring(2, 4);
            }
            e.target.value = val;
        });
    }

    if (inputFecha) {
        inputFecha.addEventListener("input", function(e) {
            let val = e.target.value.replace(/\D/g, "");
            
            let dia = val.substring(0, 2);
            let mes = val.substring(2, 4);
            let anio = val.substring(4, 8);

            // Validación estricta de mes entre 01 y 12
            if (mes.length === 2) {
                let mesNum = parseInt(mes, 10);
                if (mesNum < 1 || mesNum > 12) {
                    mes = "12";
                }
            }

            if (val.length >= 5) {
                e.target.value = dia + "/" + mes + "/" + anio;
            } else if (val.length >= 3) {
                e.target.value = dia + "/" + mes;
            } else {
                e.target.value = val;
            }
        });
    }
}