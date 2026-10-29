const IP_BACKEND = "http://10.8.5.149:3000";

let chartInstancia = null;

const NOMBRES_CATEGORIAS = {
    "sueno": "Sueño",
    "estado_animo": "Estado de ánimo",
    "crisis": "Crisis",
    "menstruacion": "Menstruación"
};

const NOMBRES_PERIODOS = {
    "7dias": "Últimos 7 días",
    "15dias": "Últimos 15 días",
    "30dias": "Último mes",
    "6meses": "Últimos 6 meses",
    "1ano": "Último año",
    "todo": "Desde que me registré"
};

const COLORES_EMOCIONES = {
    "feliz": "#97CCB9",          // Verde MESH suave
    "irritable": "#FFAB91",      // Coral / salmón
    "normal/calmado": "#73C798", // Verde MESH medio
    "ansioso": "#FFE082",        // Amarillo suave
    "triste": "#90CAF9"          // Azul suave
};

// Convierte "YYYY-MM-DD" a "DD/MM"
function formatearFecha(fechaISO) {
    if (!fechaISO) return "";
    const partes = fechaISO.split('-');
    return partes.length === 3 ? `${partes[2]}/${partes[1]}` : fechaISO;
}

// Calcula la fecha mínima según el filtro elegido
function calcularFechaLimite(periodo) {
    const hoy = new Date();
    let dias = 0;

    if (periodo === "7dias") dias = 7;
    else if (periodo === "15dias") dias = 15;
    else if (periodo === "30dias") dias = 30;
    else if (periodo === "6meses") dias = 180;
    else if (periodo === "1ano") dias = 365;
    else if (periodo === "todo") return null;

    const limite = new Date(hoy);
    limite.setDate(hoy.getDate() - dias);
    return limite;
}

// Extrae sólo las horas numéricas de textos como "8 hs", "7 hs y 30 min" u "8"
function extraerHorasNumericas(valor) {
    if (!valor) return 0;
    if (typeof valor === "number") return valor;

    const str = String(valor).toLowerCase().trim();

    if (str.includes("hs")) {
        const partes = str.split("hs");
        const horas = parseFloat(partes[0]) || 0;
        let minutos = 0;
        if (partes[1] && partes[1].includes("min")) {
            minutos = parseFloat(partes[1].replace("y", "").replace("min", "")) || 0;
        }
        return horas + (minutos / 60);
    }

    return parseFloat(str) || 0;
}

document.addEventListener("DOMContentLoaded", async () => {
    // 1. Obtener la selección guardada desde localStorage
    const categorias = JSON.parse(localStorage.getItem("grafico_categorias") || "[]");
    const periodo = localStorage.getItem("grafico_periodo") || "";
    const subtitulo = document.getElementById("subtitulo-grafico");

    if (categorias.length === 0 || !periodo) {
        if (subtitulo) subtitulo.textContent = "No se seleccionó ninguna categoría.";
        return;
    }

    const categoriaSeleccionada = categorias[0];
    const nombreCat = NOMBRES_CATEGORIAS[categoriaSeleccionada] || categoriaSeleccionada;
    const textoPeriodo = NOMBRES_PERIODOS[periodo] || periodo;

    if (subtitulo) subtitulo.textContent = `${nombreCat} — ${textoPeriodo}`;

    // 2. Obtener paciente activo
    const usuario = JSON.parse(localStorage.getItem("usuarioLogueado"))
                 || JSON.parse(sessionStorage.getItem("usuarioLogueado"))
                 || {};
    const idUsuario = Number(usuario.id || usuario.pacienteId || usuario.idPaciente);

    const canvas = document.getElementById("graficoCanvas");
    if (!canvas || !idUsuario) return;
    const ctx = canvas.getContext("2d");

    const fechaLimite = calcularFechaLimite(periodo);

    try {
        // Pedido al endpoint GET /pacientes/:id/historial de tu backend
        const res = await fetch(`${IP_BACKEND}/pacientes/${idUsuario}/historial`);
        if (!res.ok) throw new Error("Error al obtener historial del backend");
        const data = await res.json();

        // Destruir gráfico anterior si existía
        if (chartInstancia) chartInstancia.destroy();

        // Verificar que Chart.js esté cargado
        if (typeof Chart === 'undefined') {
            console.error("Chart.js no está cargado.");
            return;
        }

        // =========================================================
        // CATEGORÍA: SUEÑO
        // =========================================================
        if (categoriaSeleccionada === "sueno") {
            let registrosSueno = (data.sueno || []).filter(item => Number(item.pacienteId) === idUsuario);

            if (fechaLimite) {
                registrosSueno = registrosSueno.filter(r => {
                    const f = r.fechaDelDia || r.fecha;
                    return f && new Date(f + "T00:00:00") >= fechaLimite;
                });
            }

            registrosSueno.sort((a, b) => {
                const fA = a.fechaDelDia || a.fecha || "";
                const fB = b.fechaDelDia || b.fecha || "";
                return fA.localeCompare(fB);
            });

            if (registrosSueno.length === 0) {
                if (subtitulo) subtitulo.textContent = `Sueño — Sin registros en este período.`;
                return;
            }

            chartInstancia = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: registrosSueno.map(r => formatearFecha(r.fechaDelDia || r.fecha)),
                    datasets: [{
                        label: 'Horas Dormidas',
                        data: registrosSueno.map(r => extraerHorasNumericas(r.horasDormidas)),
                        borderColor: '#037ffc',
                        backgroundColor: 'rgba(102, 114, 226, 0.36)',
                        fill: true,
                        tension: 0.3,
                        pointRadius: 6,
                        pointHoverRadius: 8
                    }]
                },
                options: {
                    responsive: true,
                    scales: {
                        y: {
                            beginAtZero: true,
                            ticks: {
                                stepSize: 1,
                                callback: function(value) { return value + ' hs'; }
                            },
                            title: { display: true, text: 'Horas' }
                        }
                    }
                }
            });
        }

        // =========================================================
        // CATEGORÍA: ESTADO DE ÁNIMO
        // =========================================================
        else if (categoriaSeleccionada === "estado_animo") {
            let registrosAnimo = (data.estadodeanimo || []).filter(item => Number(item.pacienteId) === idUsuario);

            if (fechaLimite) {
                registrosAnimo = registrosAnimo.filter(r => r.fecha && new Date(r.fecha + "T00:00:00") >= fechaLimite);
            }

            if (registrosAnimo.length === 0) {
                if (subtitulo) subtitulo.textContent = `Estado de ánimo — Sin registros en este período.`;
                return;
            }

            const conteoEmociones = {};
            registrosAnimo.forEach(r => {
                const em = (r.emocion || "Otros").toLowerCase().trim();
                conteoEmociones[em] = (conteoEmociones[em] || 0) + 1;
            });

            const etiquetas = Object.keys(conteoEmociones);
            const valores = Object.values(conteoEmociones);
            const coloresFondo = etiquetas.map(e => COLORES_EMOCIONES[e] || "#BFF5E9");

            chartInstancia = new Chart(ctx, {
                type: 'pie',
                data: {
                    labels: etiquetas.map(e => (e === "normal/calmado" ? "Normal/Calmado" : e.charAt(0).toUpperCase() + e.slice(1))),
                    datasets: [{
                        data: valores,
                        backgroundColor: coloresFondo,
                        borderColor: '#FFFFFF',
                        borderWidth: 2
                    }]
                },
                options: {
                    responsive: true,
                    plugins: {
                        legend: { position: 'bottom' }
                    }
                }
            });
        }

        // CATEGORÍA: CRISIS
        else if (categoriaSeleccionada === "crisis") {
            let registrosCrisis = (data.crisis || []).filter(item => Number(item.pacienteId) === idUsuario);

            if (fechaLimite) {
                registrosCrisis = registrosCrisis.filter(r => r.fecha && new Date(r.fecha + "T00:00:00") >= fechaLimite);
            }

            if (registrosCrisis.length === 0) {
                if (subtitulo) subtitulo.textContent = `Crisis — Sin registros en este período.`;
                return;
            }

            // Crear un mapa con las fechas registradas con crisis
            const fechasConCrisis = new Set(registrosCrisis.map(r => r.fecha));

            // Generar los días del período seleccionado
            const listaFechas = [];
            const hoy = new Date();
            const diasAtras = fechaLimite ? Math.round((hoy - fechaLimite) / (1000 * 60 * 60 * 24)) : 30;

            for (let i = diasAtras; i >= 0; i--) {
                const f = new Date(hoy);
                f.setDate(hoy.getDate() - i);
                const isoStr = f.toISOString().split('T')[0];
                listaFechas.push(isoStr);
            }

            // Convertir a valores 1 (Sí hubo crisis) y 0 (No hubo crisis)
            const valoresBinarios = listaFechas.map(f => fechasConCrisis.has(f) ? 1 : 0);
            const etiquetasFechas = listaFechas.map(f => formatearFecha(f));

            chartInstancia = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: etiquetasFechas,
                    datasets: [{
                        label: 'Crisis Registrada',
                        data: valoresBinarios,
                        borderColor: '#FFAB91',        // Color coral / salmón
                        backgroundColor: 'rgba(255, 171, 145, 0.2)',
                        borderWidth: 3,
                        stepped: true,                  // 👈 Hace el trazo en forma de escalón (subida/bajada recta)
                        pointRadius: 5,
                        pointBackgroundColor: '#FFAB91'
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    layout: {
                        padding: {
                            top: 15,    //margen arriba para que el punto "Sí" no se corte
                            right: 15,
                            bottom: 5,
                            left: 5
                        }
                    },
                    scales: {
                        y: {
                            min: 0,        // 👈 Evita que el punto "No" de abajo quede pegado
                            max: 1.15, // 👈 Da aire arriba del valor 1 ("Sí")
                            ticks: {
                                stepSize: 1,
                                callback: function(value) {
                                    if (value === 1) return 'Sí';
                                    if (value === 0) return 'No';
                                    return ''; // Oculta valores fuera de 0 y 1
                                }
                            },
                            title: { display: true, text: 'Estado' }
                        },
                        x: {
                            title: { display: true, text: 'Fecha' }
                        }
                    }
                }
            });
        }

        else if (categoriaSeleccionada === "menstruacion") {
            // Traigo los registros de menstruacion que son de este paciente
            let registrosMenstruacion = (data.menstruacion || []).filter(item => Number(item.pacienteId) === idUsuario);

            if (registrosMenstruacion.length === 0) {
                if (subtitulo) subtitulo.textContent = `Menstruación — Sin registros en este período.`;
                return;
            }

            // Uso un Set para guardar cada día en el que hubo período sin repetir
            const fechasConMenstruacion = new Set();

            // Si el backend me manda fechaInicio y fechaTermino, recorro día por día para armar el rango completo
            registrosMenstruacion.forEach(r => {
                if (r.fechaInicio && r.fechaTermino) {
                    let actual = new Date(r.fechaInicio + "T00:00:00");
                    const fin = new Date(r.fechaTermino + "T00:00:00");

                    while (actual <= fin) {
                        fechasConMenstruacion.add(actual.toISOString().split('T')[0]);
                        actual.setDate(actual.getDate() + 1);
                    }
                } else if (r.fecha) {
                    fechasConMenstruacion.add(r.fecha);
                }
            });

            // Armo el listado de días que corresponden al filtro de fecha que eligió el usuario
            const listaFechas = [];
            const hoy = new Date();
            const diasAtras = fechaLimite ? Math.round((hoy - fechaLimite) / (1000 * 60 * 60 * 24)) : 30;

            for (let i = diasAtras; i >= 0; i--) {
                const f = new Date(hoy);
                f.setDate(hoy.getDate() - i);
                listaFechas.push(f.toISOString().split('T')[0]);
            }

            // Me fijo si hay al menos un día cargado en el rango seleccionado
            const hayDatosEnPeriodo = listaFechas.some(f => fechasConMenstruacion.has(f));
            if (!hayDatosEnPeriodo) {
                if (subtitulo) subtitulo.textContent = `Menstruación — Sin registros en este período.`;
                return;
            }

            // Mapeo los días: 1 para "Sí" (hubo período) y 0 para "No"
            const valoresBinarios = listaFechas.map(f => fechasConMenstruacion.has(f) ? 1 : 0);
            const etiquetasFechas = listaFechas.map(f => formatearFecha(f));

            // Genero el gráfico de línea escalonada con Chart.js
            chartInstancia = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: etiquetasFechas,
                    datasets: [{
                        label: 'Menstruación Registrada',
                        data: valoresBinarios,
                        borderColor: '#E91E63',
                        backgroundColor: 'rgba(233, 30, 99, 0.15)',
                        borderWidth: 3,
                        stepped: true, // Le da la forma de escalón para el gráfico binario
                        pointRadius: 5,
                        pointBackgroundColor: '#E91E63'
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    layout: {
                        padding: { top: 20, bottom: 10, right: 15, left: 5 } // Margen para que no se corten los puntos
                    },

                    plugins: {
                        tooltip: {
                            callbacks: {
                                // Personalizo el texto que aparece al pasar el mouse por un punto
                                label: function(context) {
                                    if (context.raw === 1) {
                                        return ' Menstruación registrada';
                                    }
                                    return null;
                                }
                            }
                        }
                    },

                    scales: {
                        y: {
                            min: 0,
                            max: 1.15,
                            ticks: {
                                stepSize: 1,
                                callback: function(value) {
                                    if (value === 1) return 'Sí';
                                    if (value === 0) return 'No';
                                    return '';
                                }
                            },
                            title: { display: true, text: 'Estado' }
                        },
                        x: {
                            title: { display: true, text: 'Fecha' }
                        }
                    }
                }
            });
        }

    } catch (error) {
        console.error("Error al obtener datos:", error);
    }

    // Si seleccionaron 2 categorías para comparar
if (categorias.length === 2) {
    const cat1 = categorias[0];
    const cat2 = categorias[1];

    // Validación: Estado de ánimo no se puede comparar en gráfico de líneas superpuestas
    if (cat1 === "estado_animo" || cat2 === "estado_animo") {
        if (subtitulo) subtitulo.textContent = "El Estado de ánimo solo se puede ver de forma individual.";
        return;
    }

    // 1. Generamos el eje X con todas las fechas del período
    const listaFechas = [];
    const hoy = new Date();
    const diasAtras = fechaLimite ? Math.round((hoy - fechaLimite) / (1000 * 60 * 60 * 24)) : 30;

    for (let i = diasAtras; i >= 0; i--) {
        const f = new Date(hoy);
        f.setDate(hoy.getDate() - i);
        listaFechas.push(f.toISOString().split('T')[0]);
    }

    const etiquetasX = listaFechas.map(f => formatearFecha(f));

    // Función auxiliar para extraer datos de una categoría específica
    function obtenerDatosCategoria(cat) {
        if (cat === "sueno") {
            const registros = (data.sueno || []).filter(item => Number(item.pacienteId) === idUsuario);
            const mapa = {};
            registros.forEach(r => {
                const f = r.fechaDelDia || r.fecha;
                if (f) mapa[f] = extraerHorasNumericas(r.horasDormidas);
            });
            return {
                tipo: 'horas',
                valores: listaFechas.map(f => mapa[f] || 0)
            };
        } else if (cat === "crisis") {
            const registros = (data.crisis || []).filter(item => Number(item.pacienteId) === idUsuario);
            const setFechas = new Set(registros.map(r => r.fecha));
            return {
                tipo: 'binario',
                valores: listaFechas.map(f => setFechas.has(f) ? 1 : 0)
            };
        } else if (cat === "menstruacion") {
            const registros = (data.menstruacion || []).filter(item => Number(item.pacienteId) === idUsuario);
            const setFechas = new Set();
            registros.forEach(r => {
                if (r.fechaInicio && r.fechaTermino) {
                    let act = new Date(r.fechaInicio + "T00:00:00");
                    const fin = new Date(r.fechaTermino + "T00:00:00");
                    while (act <= fin) {
                        setFechas.add(act.toISOString().split('T')[0]);
                        act.setDate(act.getDate() + 1);
                    }
                } else if (r.fecha) {
                    setFechas.add(r.fecha);
                }
            });
            return {
                tipo: 'binario',
                valores: listaFechas.map(f => setFechas.has(f) ? 1 : 0)
            };
        }
    }

    const res1 = obtenerDatosCategoria(cat1);
    const res2 = obtenerDatosCategoria(cat2);

    // Definición de colores para las variables
    const colores = {
        sueno: '#037ffc',        // Azul
        crisis: '#FFAB91',       // Salmón/Coral
        menstruacion: '#E91E63'  // Rosado
    };

    // Configuramos los dos datasets
    const dataset1 = {
        label: NOMBRES_CATEGORIAS[cat1],
        data: res1.valores,
        borderColor: colores[cat1] || '#037ffc',
        backgroundColor: 'transparent',
        borderWidth: 3,
        yAxisID: 'yLeft',
        stepped: res1.tipo === 'binario',
        tension: res1.tipo === 'horas' ? 0.3 : 0
    };

    const dataset2 = {
        label: NOMBRES_CATEGORIAS[cat2],
        data: res2.valores,
        borderColor: colores[cat2] || '#E91E63',
        backgroundColor: 'transparent',
        borderWidth: 3,
        yAxisID: 'yRight',
        stepped: res2.tipo === 'binario',
        tension: res2.tipo === 'horas' ? 0.3 : 0
    };

    // Configuración de escalas según el tipo de dato
    const escalaLeft = res1.tipo === 'horas' 
        ? {
            type: 'linear',
            position: 'left',
            beginAtZero: true,
            title: { display: true, text: 'Horas' },
            ticks: { callback: v => v + ' hs' }
          }
        : {
            type: 'linear',
            position: 'left',
            min: 0,
            max: 1,
            title: { display: true, text: `${NOMBRES_CATEGORIAS[cat1]} (Sí/No)` },
            ticks: { callback: v => (v === 1 ? 'Sí' : (v === 0 ? 'No' : '')) }
          };

    const escalaRight = res2.tipo === 'binario'
        ? {
            type: 'linear',
            position: 'right',
            min: 0,
            max: 1,
            grid: { drawOnChartArea: false }, // Para que no choque la grilla horizontal
            title: { display: true, text: `${NOMBRES_CATEGORIAS[cat2]} (Sí/No)` },
            ticks: { callback: v => (v === 1 ? 'Sí' : (v === 0 ? 'No' : '')) }
          }
        : {
            type: 'linear',
            position: 'right',
            beginAtZero: true,
            grid: { drawOnChartArea: false },
            title: { display: true, text: 'Horas' },
            ticks: { callback: v => v + ' hs' }
          };

    chartInstancia = new Chart(ctx, {
        type: 'line',
        data: {
            labels: etiquetasX,
            datasets: [dataset1, dataset2]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            layout: { padding: { top: 20, bottom: 10, right: 15, left: 5 } },
            interaction: { mode: 'index', intersect: false },
            scales: {
                yLeft: escalaLeft,
                yRight: escalaRight,
                x: { title: { display: true, text: 'Fecha' } }
            }
        }
    });
}
});