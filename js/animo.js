document.addEventListener("DOMContentLoaded", () => {
   
    const botonesAnimo = document.querySelectorAll(".btn-circulo-animo");
    const inputAnimo = document.getElementById("animo-seleccionado");
    const rangeIntensidad = document.getElementById("range-intensidad");
    const formAnimo = document.getElementById("form-animo");


    const valoresIntensidad = {
        "1": "Moderada",
        "2": "Media",
        "3": "Intensa"
    };


    // 1. Selección de estado de ánimo mediante los botones circulares
    botonesAnimo.forEach(btn => {
        btn.addEventListener("click", () => {
            botonesAnimo.forEach(b => b.classList.remove("seleccionado"));
            btn.classList.add("seleccionado");
            inputAnimo.value = btn.dataset.valor;
        });
    });


    // 2. Guardar registro y validar completeness
    formAnimo.addEventListener("submit", (e) => {
        e.preventDefault();


        // Validar que se seleccionó un estado de ánimo
        if (!inputAnimo.value) {
            alert("Por favor, selecciona un estado de ánimo para poder guardar.");
            return;
        }


        const intensidadTexto = valoresIntensidad[rangeIntensidad.value] || "Media";


        const nuevoRegistro = {
            tipo: "Ánimo",
            emocion: inputAnimo.value,
            intensidad: intensidadTexto,
            info: `${inputAnimo.value}, ${intensidadTexto}`,
            fecha: new Date().toLocaleDateString("es-AR"),
            hora: new Date().toLocaleTimeString("es-AR", { hour: "2-digit", minute: "2-digit" })
        };


        // Guardar en localStorage
        const registros = JSON.parse(localStorage.getItem("registrosAnimo")) || [];
        registros.push(nuevoRegistro);
        localStorage.setItem("registrosAnimo", JSON.stringify(registros));


        // Redireccionar a registros.html solo cuando está completo
        window.location.href = "registros.html";
    });
});

