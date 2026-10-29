// Manejo de la seleccion para los botones Si y No
const btnSi = document.getElementById("btn-si");
const btnNo = document.getElementById("btn-no");

if (btnSi && btnNo) {
    btnSi.addEventListener("click", function() {
        btnSi.classList.add("seleccionado");
        btnNo.classList.remove("seleccionado");
    });

    btnNo.addEventListener("click", function() {
        btnNo.classList.add("seleccionado");
        btnSi.classList.remove("seleccionado");
    });
}

// Manejo de botones AM/PM para cada campo de hora
const cajasHora = document.querySelectorAll(".campo-hora-caja");

cajasHora.forEach(function(caja) {
    const botonesPeriodo = caja.querySelectorAll(".btn-periodo");
    
    botonesPeriodo.forEach(function(btn) {
        btn.addEventListener("click", function() {
            // Desmarco los demas de la misma caja y marco solo el que cliquee
            botonesPeriodo.forEach(b => b.classList.remove("seleccionado"));
            btn.classList.add("seleccionado");
        });
    });
});

// Restricciones para el input de cuantas veces se desperto
const inputCantVeces = document.getElementById("cant-veces");

if (inputCantVeces) {
    // Bloqueo signos, letras de notacion cientifica, comas y puntos al escribir
    inputCantVeces.addEventListener("keydown", function(e) {
        if (["-", "+", "e", "E", ",", "."].includes(e.key)) {
            e.preventDefault();
        }
    });

    // Filtro para asegurarme de que solo haya numeros y maximo 2 digitos
    inputCantVeces.addEventListener("input", function() {
        this.value = this.value.replace(/[^0-9]/g, "");

        if (this.value.length > 2) {
            this.value = this.value.slice(0, 2);
        }
    });
}

// Validacion y guardado al hacer clic en Guardar Registro
const btnGuardar = document.getElementById("guardar");

btnGuardar.addEventListener("click", function(e) {
    e.preventDefault();

    // Capturo los elementos que necesito validar
    const despertoSeleccionado = document.querySelector(".opciones-si-no .btn-opcion.seleccionado");
    const cantVecesVal = inputCantVeces ? inputCantVeces.value.trim() : "";

    const horaDurmioInput = document.getElementById("hora-durmio");
    const horaDespertoInput = document.getElementById("hora-desperto");

    // Busco las dos cajas contenedoras de las horas
    const cajas = document.querySelectorAll(".campo-hora-caja");
    const periodoDurmioBtn = cajas[0] ? cajas[0].querySelector(".btn-periodo.seleccionado") : null;
    const periodoDespertoBtn = cajas[1] ? cajas[1].querySelector(".btn-periodo.seleccionado") : null;

    // Valido que no falte responder ninguna pregunta
    if (!despertoSeleccionado) {
        alert("Por favor, indicá si se despertó durante la noche.");
        return;
    }

    if (despertoSeleccionado.textContent.trim() === "Sí" && cantVecesVal === "") {
        alert("Por favor, ingresá cuántas veces se despertó.");
        return;
    }

    if (!horaDurmioInput || !horaDurmioInput.value || !periodoDurmioBtn) {
        alert("Por favor, completá la hora en que se durmió y elegí AM o PM.");
        return;
    }

    if (!horaDespertoInput || !horaDespertoInput.value || !periodoDespertoBtn) {
        alert("Por favor, completá la hora en que se despertó y elegí AM o PM.");
        return;
    }

    // Armo el objeto con la informacion cargada
    const nuevoRegistroSueno = {
        tipo: "Sueño",
        fechaGuardado: new Date().toLocaleDateString("es-AR"),
        despertoNoche: despertoSeleccionado.textContent.trim(),
        cantVeces: despertoSeleccionado.textContent.trim() === "Sí" ? cantVecesVal : 0,
        horaDurmio: `${horaDurmioInput.value} ${periodoDurmioBtn.textContent.trim()}`,
        horaDesperto: `${horaDespertoInput.value} ${periodoDespertoBtn.textContent.trim()}`
    };

    // Guardo en el almacenamiento local del navegador
    const registrosExistentes = JSON.parse(localStorage.getItem("registrosSueno")) || [];
    registrosExistentes.push(nuevoRegistroSueno);
    localStorage.setItem("registrosSueno", JSON.stringify(registrosExistentes));

    // Redirijo a la pantalla de registros
    window.location.href = "registros.html";
});