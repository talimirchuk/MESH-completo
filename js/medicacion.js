// medicacion.js

// validacion de dia (solo nros del 1 al 31)
const inputDia = document.getElementById("fecha-dia");
if (inputDia) {
    inputDia.addEventListener("input", function() {
        this.value = this.value.replace(/[^0-9]/g, "");
        if (this.value.length > 2) this.value = this.value.slice(0, 2);
        if (parseInt(this.value) > 31) this.value = "31";
        if (parseInt(this.value) === 0) this.value = "1";
    });
}

// validacion de año (solo 4 nros)
const inputAnio = document.getElementById("fecha-anio");
if (inputAnio) {
    inputAnio.addEventListener("input", function() {
        this.value = this.value.replace(/[^0-9]/g, "");
        if (this.value.length > 4) this.value = this.value.slice(0, 4);
    });
}

// carga las ultimas dosis guardadas en el datalist
function cargarHistorialDosis() {
    const datalist = document.getElementById("opciones-dosis");
    const historialDosis = JSON.parse(localStorage.getItem("historialDosis")) || [];
    
    datalist.innerHTML = "";
    historialDosis.forEach(dosis => {
        const option = document.createElement("option");
        option.value = dosis;
        datalist.appendChild(option);
    });
}

// guarda la dosis tipeada en localStorage sin duplicar y deja solo las ultimas 5
function guardarDosisEnHistorial(nuevaDosis) {
    let historialDosis = JSON.parse(localStorage.getItem("historialDosis")) || [];
    
    historialDosis = historialDosis.filter(d => d.toLowerCase() !== nuevaDosis.toLowerCase());
    historialDosis.unshift(nuevaDosis);
    
    if (historialDosis.length > 5) historialDosis.pop();
    
    localStorage.setItem("historialDosis", JSON.stringify(historialDosis));
}

// la llamo apenas abre la pantalla para cargar las opciones
cargarHistorialDosis();

// borrador guardado de medicacion (despues se cambia por el fetch del back)
async function guardarRegistro(registro) {
    const registros = JSON.parse(localStorage.getItem("registrosMedicacion")) || [];
    registros.push(registro);
    localStorage.setItem("registrosMedicacion", JSON.stringify(registros)); //Convierte la lista actualizada a texto y la vuelve a guardar en la memoria del navegador
}

// evento al tocar el boton guardar
const formMedicacion = document.getElementById("form-medicacion");

formMedicacion.addEventListener("submit", async function(e) {
    e.preventDefault(); // Al enviar un formulario el navegador por defecto recarga la página, Con e.preventDefault(), lo evito esto

    const dosisIngresada = document.getElementById("dosis").value.trim(); //.value obtiene el texto exacto que escribió el usuario adentro de esa casilla en ese momento, trim elimina todos los espacios en blanco sobrantes que haya al principio y al final

    if (dosisIngresada) {
        guardarDosisEnHistorial(dosisIngresada);
    }

    const registro = {
        tipo: "Medicación",
        hora: document.getElementById("hora").value,
        fechaDia: document.getElementById("fecha-dia").value,
        fechaMes: document.getElementById("fecha-mes").value,
        fechaAnio: document.getElementById("fecha-anio").value,
        tipoMedicacion: document.getElementById("tipo-medicacion").value,
        dosis: dosisIngresada,
        observaciones: document.getElementById("observaciones").value.trim()
    };

    await guardarRegistro(registro); //orden de esperar a que los datos se guarden del todo antes de pasar a la línea que sigue ( volver a registros.html)

    // me devuelve a la pantalla principal de registros
    window.location.href = "registros.html";
});