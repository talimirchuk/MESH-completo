const IP_BACKEND = "http://10.10.32.41:3000";

document.addEventListener("DOMContentLoaded", async () => {
    establecerSaludoUsuario();
    await cargarUltimosRegistrosDelBackend();
    await cargarProximosRecordatoriosDelBackend();
});

function obtenerUsuarioSesion() {
    return JSON.parse(localStorage.getItem("usuarioLogueado")) || 
           JSON.parse(sessionStorage.getItem("usuarioLogueado"));
}

function establecerSaludoUsuario() {
    const usuarioLogueado = obtenerUsuarioSesion();
    const elSaludo = document.getElementById("saludo-usuario");

    if (usuarioLogueado && usuarioLogueado.nombre) {
        elSaludo.textContent = `¡Hola ${usuarioLogueado.nombre}!`;
    } else {
        elSaludo.textContent = "¡Hola!";
    }
}

async function cargarUltimosRegistrosDelBackend() {
    const usuarioLogueado = obtenerUsuarioSesion();
    if (!usuarioLogueado || !usuarioLogueado.id) return;

    try {
        const respuesta = await fetch(`${IP_BACKEND}/registros/ultimos/${usuarioLogueado.id}`);
        
        if (!respuesta.ok) return;

        const datos = await respuesta.json();

        if (datos.sueno && datos.sueno.horas) {
            document.getElementById("valor-sueno").textContent = `${datos.sueno.horas} hs`;
        } else {
            document.getElementById("valor-sueno").textContent = "-- hs";
        }

        if (datos.medicacion) {
            document.getElementById("linea-med-hora").textContent = `Última ${datos.medicacion.hora || '--:--'}hs:`;
            document.getElementById("linea-med-dosis").textContent = `${datos.medicacion.medicamento || ''} ${datos.medicacion.dosis || ''}`.trim();
        } else {
            document.getElementById("linea-med-hora").textContent = "Última --:--hs:";
            document.getElementById("linea-med-dosis").textContent = "--";
        }

        if (datos.animo) {
            document.getElementById("linea-animo-tipo").textContent = datos.animo.estado || datos.animo.emocion || '--';
            document.getElementById("linea-animo-intensidad").textContent = datos.animo.intensidad || '--';
        } else {
            document.getElementById("linea-animo-tipo").textContent = "--";
            document.getElementById("linea-animo-intensidad").textContent = "--";
        }

        if (datos.crisis && datos.crisis.fecha) {
            document.getElementById("linea-crisis-fecha").textContent = datos.crisis.fecha;
        } else {
            document.getElementById("linea-crisis-fecha").textContent = "--/--/--";
        }

    } catch (error) {
        console.error("Error al obtener los últimos registros:", error);
    }
}

async function cargarProximosRecordatoriosDelBackend() {
    const usuarioLogueado = obtenerUsuarioSesion();
    const contenedor = document.getElementById("lista-recordatorios-inicio");
    if (!usuarioLogueado || !usuarioLogueado.id) return;

    try {
        const respuesta = await fetch(`${IP_BACKEND}/recordatorios/proximos/${usuarioLogueado.id}`);

        if (!respuesta.ok) return;

        const recordatorios = await respuesta.json();

        contenedor.innerHTML = "";

        if (!recordatorios || recordatorios.length === 0) {
            contenedor.innerHTML = `<p class="sin-registros-texto">No hay recordatorios próximos.</p>`;
            return;
        }

        recordatorios.slice(0, 3).forEach(rec => {
            const itemDiv = document.createElement("div");
            itemDiv.className = "item-recordatorio-inicio";
            itemDiv.innerHTML = `
                <span class="hora-rec">${rec.hora}</span>
                <span class="desc-rec">${rec.descripcion}</span>
            `;
            contenedor.appendChild(itemDiv);
        });

    } catch (error) {
        console.error("Error al cargar los recordatorios:", error);
    }
}