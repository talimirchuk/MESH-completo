const IP_BACKEND = "http://10.8.5.149:3000";

const ICONOS = {
  "sueño": `<svg width="24" height="24" viewBox="0 0 45 45" fill="none"><path d="M42.0678 25.911C40.3141 26.4281 38.5154 26.698 36.7166 26.698C26.5538 26.698 18.2797 18.4238 18.2797 8.26101C18.2797 6.46228 18.5495 4.66355 19.0666 2.90979C19.314 2.12285 19.0891 1.24597 18.5045 0.661386C17.9199 0.0767998 17.0655 -0.148041 16.2561 0.0992838C11.5426 1.52263 7.41447 4.42937 4.48559 8.38721C1.55671 12.345 -0.0164322 17.1426 0.000129438 22.0662C0.000129438 34.7023 10.2754 45 22.9339 45C33.1192 45 41.9329 38.4571 44.8784 28.7215C45.1257 27.9346 44.9008 27.0577 44.3163 26.4731C43.7317 25.8885 42.8773 25.6637 42.0678 25.911ZM22.9339 40.5032C12.7711 40.5032 4.49695 32.229 4.49695 22.0662C4.48398 18.7913 5.34894 15.5727 7.00182 12.7454C8.65471 9.91806 11.0351 7.5854 13.8953 5.99011C13.8278 6.75457 13.7829 7.51903 13.7829 8.28349C13.7829 20.9195 24.0581 31.2173 36.7166 31.2173C37.4811 31.2173 38.2456 31.1723 39.01 31.1048C35.8173 36.8608 29.7466 40.5032 22.9339 40.5032ZM31.4778 13.5223L33.5913 8.89056L38.2231 6.77706L33.5913 4.66355L31.4778 0.0318316L29.3643 4.66355L24.7326 6.77706L29.3643 8.89056L31.4778 13.5223ZM41.0336 12.3981L39.797 15.0962L37.0989 16.3328L39.797 17.5694L41.0336 20.2675L42.2702 17.5694L44.9683 16.3328L42.2702 15.0962L41.0336 12.3981Z" fill="black"/></svg>`,
  "medicación": `<svg width="24" height="24" viewBox="0 0 43 44" fill="none"><path d="M29.0604 7.47411e-05C27.2268 -0.006017 25.4103 0.360328 23.7163 1.07785C22.0223 1.79536 20.4846 2.84976 19.1923 4.17984L4.07143 19.6405C-1.35714 25.191 -1.35714 34.2472 4.07143 39.8202C6.70879 42.5169 10.2033 44 13.9396 44C17.6758 44 21.1703 42.5169 23.8077 39.8202L38.9286 24.3596C44.3571 18.809 44.3571 9.75287 38.9286 4.17984C37.6363 2.84976 36.0986 1.79536 34.4046 1.07785C32.7106 0.360328 30.894 -0.006017 29.0604 7.47411e-05ZM35.8077 21.1686L29.8077 27.3034L16.2912 13.4832L22.2912 7.34838C24.0934 5.50568 26.489 4.49445 29.0385 4.49445C31.5879 4.49445 33.9835 5.50568 35.7857 7.34838C37.5699 9.18548 38.5712 11.6695 38.5712 14.2585C38.5712 16.8475 37.5699 19.3315 35.7857 21.1686H35.8077Z" fill="black"/></svg>`,
  "crisis": `<svg width="24" height="24" viewBox="0 0 48 44" fill="none"><path d="M20.3674 4.03499L2.50745 35.2047C1.00262 37.8289 3.00026 41.031 6.13973 41.031H41.8531C44.9948 41.031 46.988 37.8289 45.4898 35.2047L27.632 4.03499C26.0656 1.29563 21.9361 1.29563 20.3674 4.03499Z" stroke="black" stroke-width="3.96" stroke-linecap="round" stroke-linejoin="round"/><path d="M24 16V26M24 32V33" stroke="black" stroke-width="3.96" stroke-linecap="round"/></svg>`,
  "estado de ánimo": `<svg width="24" height="24" viewBox="0 0 48 48" fill="none"><path d="M39.2478 39.2487C35.122 43.3745 29.5262 45.6924 23.6914 45.6924C17.8566 45.6924 12.2609 43.3745 8.13506 39.2487C4.00926 35.1229 1.69141 29.5271 1.69141 23.6924C1.69141 17.8576 4.00926 12.2618 8.13506 8.13603C12.2609 4.01023 17.8566 1.69238 23.6914 1.69238C29.5262 1.69238 35.122 4.01023 39.2478 8.13603C43.3736 12.2618 45.6914 17.8576 45.6914 23.6924C45.6914 29.5271 43.3736 35.1229 39.2478 39.2487Z" stroke="black" stroke-width="3.38" stroke-linecap="round"/><path d="M16 28C18 32 26 32 28 28" stroke="black" stroke-width="3.38" stroke-linecap="round"/><circle cx="16" cy="18" r="2" fill="black"/><circle cx="28" cy="18" r="2" fill="black"/></svg>`,
  "menstruación": `<svg width="20" height="24" viewBox="0 0 46 74" fill="none"><path d="M23 0C10.3117 0 0 9.953 0 22.2C0 33.189 8.31833 42.291 19.1667 44.067V51.8H7.66667V59.2H19.1667V74H26.8333V59.2H38.3333V51.8H26.8333V44.067C37.6817 42.291 46 33.189 46 22.2C46 9.953 35.6883 0 23 0ZM23 37C14.5283 37 7.66667 30.377 7.66667 22.2C7.66667 14.023 14.5283 7.4 23 7.4C31.4717 7.4 38.3333 14.023 38.3333 22.2C38.3333 30.377 31.4717 37 23 37Z" fill="black"/></svg>`
};

let todosLosRegistros = [];
let filtroCategoriaValor = "";
let filtroPeriodoValor = "";

const dashboardHistorial = document.getElementById("dashboard-historial");
const busqueda = document.getElementById("buscar");

async function cargarRegistros() {
    const usuarioActivo = JSON.parse(localStorage.getItem("usuarioLogueado"))
                       || JSON.parse(sessionStorage.getItem("usuarioLogueado"))
                       || {};

    const idUsuario = Number(usuarioActivo.id || usuarioActivo.pacienteId || usuarioActivo.idPaciente);

    if (!idUsuario) {
        todosLosRegistros = [];
        aplicarFiltros();
        return;
    }

    try {
        const respuesta = await fetch(`${IP_BACKEND}/pacientes/${idUsuario}/historial`);
       
        if (!respuesta.ok) {
            throw new Error(`Error en servidor: ${respuesta.status}`);
        }

        const data = await respuesta.json();
        let arrayUnificado = [];

        const esRegistroValido = (item) => Number(item.pacienteId) === idUsuario;

        if (Array.isArray(data.sueno)) {
            data.sueno.filter(esRegistroValido).forEach(item => {
                arrayUnificado.push({
                    id: item.id,
                    fechaISO: item.fechaDelDia,
                    hora: "",
                    tipo: "Sueño",
                    info: `Sueño: ${item.horasDormidas}${item.cuantasVeces ? ` (Despertó ${item.cuantasVeces} veces)` : ''}`
                });
            });
        }

        if (Array.isArray(data.estadodeanimo)) {
            data.estadodeanimo.filter(esRegistroValido).forEach(item => {
                arrayUnificado.push({
                    id: item.id,
                    fechaISO: item.fecha,
                    hora: "",
                    tipo: "Estado de ánimo",
                    info: `Ánimo: ${item.emocion} (Intensidad: ${item.intensidad})`
                });
            });
        }

        if (Array.isArray(data.crisis)) {
            data.crisis.filter(esRegistroValido).forEach(item => {
                arrayUnificado.push({
                    id: item.id,
                    fechaISO: item.fecha,
                    hora: item.horario || "",
                    tipo: "Crisis",
                    info: `Crisis: ${item.tipo}${item.observaciones ? ` - ${item.observaciones}` : ''}`
                });
            });
        }

        if (Array.isArray(data.menstruacion)) {
            data.menstruacion.filter(esRegistroValido).forEach(item => {
                if (item.fechaInicio && item.fechaTermino) {
                    let inicio = new Date(item.fechaInicio + "T00:00:00"); //T00 indica  al navegador que la fecha empieza a la medianoche en la hora local del usuario
                    let fin = new Date(item.fechaTermino + "T00:00:00");
                    let contadorDia = 1;

                    for (let d = new Date(inicio); d <= fin; d.setDate(d.getDate() + 1)) {
                        const anio = d.getFullYear();
                        const mes = String(d.getMonth() + 1).padStart(2, '0');
                        const dia = String(d.getDate()).padStart(2, '0');
                        const fechaIteracion = `${anio}-${mes}-${dia}`;

                        arrayUnificado.push({
                            id: item.id,
                            fechaISO: fechaIteracion,
                            hora: "",
                            tipo: "Menstruación",
                            info: `Menstruación (Día ${contadorDia})${item.observaciones ? ` - ${item.observaciones}` : ''}`
                        });
                        contadorDia++;
                    }
                }
            });
        }

        if (Array.isArray(data.medicaciones)) {
            data.medicaciones.filter(esRegistroValido).forEach(item => {
                arrayUnificado.push({
                    id: item.id,
                    fechaISO: item.fecha,
                    hora: item.horario && item.momentoDia ? `${item.horario} ${item.momentoDia}` : (item.horario || ""),
                    tipo: "Medicación",
                    info: `Medicación (${item.tipoMedicacion}): ${item.nombreMedicamento}${item.dosis ? ` - ${item.dosis}` : ''}`
                });
            });
        }

        todosLosRegistros = arrayUnificado;
        aplicarFiltros();

    } catch (error) {
        console.error("Error al cargar registros del backend:", error);
        if (dashboardHistorial) {
            dashboardHistorial.innerHTML = "<p style='font-size:22px; text-align:center;'>No se encontraron registros o error de conexión.</p>";
        }
    }
}

function convertirAFechaFormateada(fechaISO) {
  const partes = fechaISO.split('-');
  if (partes.length === 3) {
      return `${partes[2]}/${partes[1]}/${partes[0].slice(-2)}`;
  }
  return fechaISO;
}

function convertirHoraAMinutos(horaStr) {
  if (!horaStr) return 0;
  const match = horaStr.match(/(\d+):(\d+)\s*(AM|PM)?/i);
  if (!match) return 0;
  let horas = parseInt(match[1], 10);
  const minutos = parseInt(match[2], 10);
  const mer = match[3] ? match[3].toUpperCase() : null;

  if (mer === 'PM' && horas < 12) horas += 12;
  if (mer === 'AM' && horas === 12) horas = 0;
  return horas * 60 + minutos;
}

function mostrarHistorial(lista) {
    if (!dashboardHistorial) return;
    dashboardHistorial.innerHTML = "";

    if (lista.length === 0) {
        dashboardHistorial.innerHTML = "<p style='font-size:22px; text-align:center;'>No se encontraron registros.</p>";
        return;
    }

    // 1. AGRUPAR POR FECHA (Mantiene el mismo día en una sola tarjeta)
    const agrupado = {};
    lista.forEach(reg => {
        const fechaKey = reg.fechaISO; // Usa la string 'AAAA-MM-DD' directamente
        if (!agrupado[fechaKey]) {
            agrupado[fechaKey] = [];
        }
        agrupado[fechaKey].push(reg);
    });

    // 2. ORDENAR FECHAS CRONOLÓGICAMENTE (Más reciente arriba: 2026 primero, 2022 después)
    // Se compara como texto 'YYYY-MM-DD' para evitar problemas de zona horaria/horas desfasadas
    const fechasOrdenadas = Object.keys(agrupado).sort((a, b) => b.localeCompare(a));

    fechasOrdenadas.forEach(fechaISO => {
        const registrosDelDia = agrupado[fechaISO];
        
        // Ordenar registros internamente por hora si la tienen
        registrosDelDia.sort((a, b) => convertirHoraAMinutos(a.hora) - convertirHoraAMinutos(b.hora));

        let htmlItems = "";
        registrosDelDia.forEach(reg => {
            const tipoNormalizado = reg.tipo.toLowerCase().trim();
            const iconSvg = ICONOS[tipoNormalizado] || "";

            // SI TIENE HORA LA MUESTRA, SI ESTÁ VACÍA (Menstruación) NO GENERA EL SPAN
            const htmlHora = reg.hora && reg.hora.trim() !== "" 
                ? `<span class="registro-hora">${reg.hora}</span>` 
                : "";

            htmlItems += `
                <div class="registro-item">
                    ${htmlHora}
                    <span class="registro-categoria">
                        <span class="registro-icon">${iconSvg}</span>
                        ${reg.tipo}
                    </span>
                    <span class="registro-info">${reg.info}</span>
                </div>
            `;
        });

        dashboardHistorial.innerHTML += `
            <article class="tarjeta-dia">
                <div class="tarjeta-header">
                    <h2>${convertirAFechaFormateada(fechaISO)}</h2>
                </div>
                <div class="tarjeta-body">
                    ${htmlItems}
                </div>
            </article>
        `;
    });
}

function aplicarFiltros() {
  let resultado = todosLosRegistros.filter(reg => {
      const coincideCat = filtroCategoriaValor === "" || reg.tipo.toLowerCase().includes(filtroCategoriaValor.toLowerCase());
      
      let coincideFecha = true;
      if (filtroPeriodoValor !== "") {
          const hoy = new Date();
          const fechaReg = new Date(reg.fechaISO);
          const diffDias = (hoy - fechaReg) / (1000 * 3600 * 24);

          if (filtroPeriodoValor === "7dias") coincideFecha = diffDias <= 7;
          else if (filtroPeriodoValor === "15dias") coincideFecha = diffDias <= 15;
          else if (filtroPeriodoValor === "30dias") coincideFecha = diffDias <= 30;
      }

      const textoBusqueda = busqueda.value.toLowerCase();
      const coincideBusqueda = reg.info.toLowerCase().includes(textoBusqueda) ||
                               reg.tipo.toLowerCase().includes(textoBusqueda) ||
                               reg.hora.toLowerCase().includes(textoBusqueda);

      return coincideCat && coincideFecha && coincideBusqueda;
  });

  mostrarHistorial(resultado);
}

function inicializarDropdowns() {
  const dropdowns = document.querySelectorAll('.custom-dropdown');

  dropdowns.forEach(dropdown => {
      const btn = dropdown.querySelector('.dropdown-btn');
      const items = dropdown.querySelectorAll('.dropdown-item');
      const label = dropdown.querySelector('span');

      btn.addEventListener('click', (e) => {
          e.stopPropagation();
          dropdowns.forEach(d => {
              if (d !== dropdown) d.classList.remove('open');
          });
          dropdown.classList.toggle('open');
      });

      items.forEach(item => {
          item.addEventListener('click', (e) => {
              e.stopPropagation();
              items.forEach(i => i.classList.remove('active'));
              item.classList.add('active');

              const value = item.getAttribute('data-value');
              const text = item.innerText;

              if (dropdown.id === 'dropdown-categoria') {
                  filtroCategoriaValor = value;
                  label.innerText = value === "" ? "Categoría" : text;
              } else if (dropdown.id === 'dropdown-periodo') {
                  filtroPeriodoValor = value;
                  label.innerText = value === "" ? "Fecha" : text;
              }

              dropdown.classList.remove('open');
              aplicarFiltros();
          });
      });
  });

  document.addEventListener('click', () => {
      dropdowns.forEach(d => d.classList.remove('open'));
  });
}

busqueda.addEventListener("input", aplicarFiltros);

document.addEventListener("DOMContentLoaded", () => {
  cargarRegistros();
  inicializarDropdowns();
});