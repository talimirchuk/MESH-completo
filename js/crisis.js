//solo enteros positivos) 
function soloEnteros(input, maxDigitos, maximo) {
    // bloquea las teclas que type  number deja pasar
    input.addEventListener("keydown", function (e) { 
        if (["-", "+", "e", "E", ".", ","].includes(e.key)) {
            e.preventDefault();
        }
    });

    // limpia lo pegado o escrito y corta el largo
    input.addEventListener("input", function () {
        let valor = input.value.replace(/\D/g, "").slice(0, maxDigitos); //borra todo lo que no sea un dígito, corta el texto para que no pase del largo permitido
        if (maximo && Number(valor) > maximo) { //Si el número ingresado supera el max, lo reemplaza por el máximo
            valor = String(maximo);
        }
        input.value = valor;
    });
}

const inputDia = document.getElementById("dia");
const inputAnio = document.getElementById("anio");

soloEnteros(inputDia, 2, 31);    // día: hasta 2 dígitos, máximo 31
soloEnteros(inputAnio, 4, null); // año: hasta 4 dígitos

// TIPOS DE CRISIS RECIENTES 
const CLAVE_TIPOS = "tiposCrisis";
const MAX_TIPOS = 10; // cuántos tipos recientes se recuerdan

const inputTipo = document.getElementById("tipo-crisis");
const listaTipos = document.getElementById("lista-tipos");

// función de datos hoy lee de localStorage, después cambio por un fetch
function obtenerTiposRecientes() {
    const guardados = localStorage.getItem(CLAVE_TIPOS);
    return guardados ? JSON.parse(guardados) : [];
}

// función de render limpia las opciones viejas y arma las nuevas
function renderTipos() {
    listaTipos.innerHTML = "";

    obtenerTiposRecientes().forEach(function (tipo) {
        const opcion = document.createElement("option");
        opcion.value = tipo;
        listaTipos.appendChild(opcion);
    });
}

function recordarTipo(tipo) {
    // saca el tipo si ya estaba, para no duplicarlo
    let tipos = obtenerTiposRecientes().filter(function (t) {
        return t.toLowerCase() !== tipo.toLowerCase();
    });

    tipos.unshift(tipo);               // el último usado va primero
    tipos = tipos.slice(0, MAX_TIPOS); // corta a los últimos N

    localStorage.setItem(CLAVE_TIPOS, JSON.stringify(tipos));
    renderTipos();
}

renderTipos(); // al cargar la página

// ---------- GUARDAR ----------
//cuando llegue el backend, solo cambia la forma de esta función
async function guardarRegistro(registro) {
    console.log("Registro de crisis:", registro);
    // acá después va el fetch
}

const botonGuardar = document.getElementById("guardar");

botonGuardar.addEventListener("click", async function () {
    const registro = {
        tipo: inputTipo.value.trim(),
        dia: Number(inputDia.value),
        mes: Number(document.getElementById("mes").value),
        anio: Number(inputAnio.value),
        observaciones: document.getElementById("observaciones").value.trim()
    };

    // validaciones nros y año
    if (registro.tipo === "") {
        alert("Escribí o elegí el tipo de crisis.");
        return;
    }
    if (registro.dia < 1 || registro.dia > 31 || registro.mes === 0 || registro.anio < 1000) {
        alert("Revisá la fecha: día (1 a 31), mes y año de 4 dígitos.");
        return;
    }

    await guardarRegistro(registro);
    recordarTipo(registro.tipo); // recién se recuerda si el guardado salió bien

    // Redirige directamente a la pantalla de registros
    window.location.href = "registros.html";
});