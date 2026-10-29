let categoriasSeleccionadas = [];

document.addEventListener("DOMContentLoaded", () => {
    const botonesOpcion = document.querySelectorAll(".btn-opcion-registro");

    // Permitir seleccionar HASTA 2 opciones
    botonesOpcion.forEach(btn => {
        btn.addEventListener("click", () => {
            const valor = btn.getAttribute("data-valor");

            if (btn.classList.contains("seleccionado")) {
                // Si ya estaba seleccionado, se desmarca
                btn.classList.remove("seleccionado");
                categoriasSeleccionadas = categoriasSeleccionadas.filter(c => c !== valor);
            } else {
                // Si intenta marcar más de 2, no lo deja
                if (categoriasSeleccionadas.length >= 2) {
                    alert("Solo podés seleccionar hasta 2 categorías para comparar.");
                    return;
                }
                btn.classList.add("seleccionado");
                categoriasSeleccionadas.push(valor);
            }
        });
    });

    // Al hacer clic en "realizar gráfico"
    const btnRealizar = document.getElementById("btn-realizar-grafico");
    if (btnRealizar) {
        btnRealizar.addEventListener("click", () => {
            const periodoSeleccionado = document.getElementById("periodo")?.value;

            if (categoriasSeleccionadas.length === 0) {
                alert("Por favor, seleccioná al menos una categoría.");
                return;
            }

            if (!periodoSeleccionado) {
                alert("Por favor, seleccioná un período de tiempo.");
                return;
            }

            // Guardamos las selecciones en localStorage para usarlas en la otra vista
            localStorage.setItem("grafico_categorias", JSON.stringify(categoriasSeleccionadas));
            localStorage.setItem("grafico_periodo", periodoSeleccionado);

            // Redirige a la pantalla donde se cargará el gráfico
            window.location.href = "graficocreado.html";
        });
    }
});