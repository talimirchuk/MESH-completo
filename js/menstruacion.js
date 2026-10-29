//que Día sea un número entre 1 y 31
const inputsDia = [document.getElementById("inicio-dia"), document.getElementById("fin-dia")];
inputsDia.forEach(function(input) {
    if (input) {
        input.addEventListener("input", function() {
            this.value = this.value.replace(/[^0-9]/g, ""); // Solo deja ponern números
            if (this.value.length > 2) this.value = this.value.slice(0, 2);
            if (parseInt(this.value) > 31) this.value = "31";
            if (parseInt(this.value) === 0) this.value = "1";
        });
    }
});

// que Año sea un número de máximo 4 dígitos
const inputsAnio = [document.getElementById("inicio-anio"), document.getElementById("fin-anio")];
inputsAnio.forEach(function(input) {
    if (input) {
        input.addEventListener("input", function() {
            this.value = this.value.replace(/[^0-9]/g, ""); // Solo permite números
            if (this.value.length > 4) this.value = this.value.slice(0, 4);
        });
    }
});

//simulación de enviar a Bakend 
async function guardarRegistroMenstruacion(registro) {
    // historial guardado del navegador
    const registros = JSON.parse(localStorage.getItem("registrosMenstruacion")) || [];
    registros.push(registro);// registro nuevo
    localStorage.setItem("registrosMenstruacion", JSON.stringify(registros));// Guardar lista actualizada
}

const formMenstruacion = document.getElementById("form-menstruacion");

if (formMenstruacion) {
    formMenstruacion.addEventListener("submit", async function(e) {
        e.preventDefault(); // Evitar que recargue la página automaticamente

        // objeto con la info cargada
        const registro = {
            tipo: "Menstruación",
            fechaInicio: {
                dia: document.getElementById("inicio-dia").value,
                mes: document.getElementById("inicio-mes").value,
                anio: document.getElementById("inicio-anio").value
            },
            fechaFin: {
                dia: document.getElementById("fin-dia").value,
                mes: document.getElementById("fin-mes").value,
                anio: document.getElementById("fin-anio").value
            },
            observaciones: document.getElementById("observaciones").value.trim()
        };
        await guardarRegistroMenstruacion(registro);

        window.location.href = "registros.html";
    });
}