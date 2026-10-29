/* funcion para mostrar u ocultar la contrasena al hacer clic en el ojo */
function activarOcultarMostrarContrasena(idDelInput, idDelBoton) {
    const casillaTexto = document.getElementById(idDelInput);
    const botonOjo = document.getElementById(idDelBoton);

    if (casillaTexto && botonOjo) {
        const dibujoPestana = botonOjo.querySelector(".svg-pestana");
        const dibujoOjo = botonOjo.querySelector(".svg-ojo");

        botonOjo.addEventListener("click", function() {
            if (casillaTexto.type === "password") {
                casillaTexto.type = "text";
                if (dibujoPestana && dibujoOjo) {
                    dibujoPestana.classList.add("oculto");
                    dibujoOjo.classList.remove("oculto");
                }
            } else {
                casillaTexto.type = "password";
                if (dibujoPestana && dibujoOjo) {
                    dibujoPestana.classList.remove("oculto");
                    dibujoOjo.classList.add("oculto");
                }
            }
        });
    }
}

/* activo la funcion para el ojito del inicio de sesion */
activarOcultarMostrarContrasena("password", "ojo-contrasena");

/*  el botón de continuar en iniciar sesión */
/* Botón de ingresar / continuar */
const continuar = document.getElementById("continuar");

if (continuar) {
    continuar.addEventListener("click", async function(e) {
        e.preventDefault();

        const emailInput = document.getElementById("email");
        const passwordInput = document.getElementById("password");
        const textoayuda = document.getElementById("texto-ayuda");

        if (!emailInput || !passwordInput) return;

        const email = emailInput.value.trim();
        const password = passwordInput.value.trim();

        if (textoayuda) textoayuda.textContent = "";

        if (!email || !password) {
            if (textoayuda) textoayuda.textContent = "Por favor, completá todos los campos.";
            return;
        }

        try {
            // Petición POST enviando credenciales a la IP del backend por Wi-Fi
            const respuesta = await fetch("http://10.8.5.149:3000/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ 
                    email: email, 
                    contraseña: password // coincide con req.body.contraseña en tu server.ts
                })
            });

            if (!respuesta.ok) {
                // Si el servidor responde 401 (Credenciales incorrectas)
                if (textoayuda) textoayuda.textContent = "Email o contraseña incorrectos.";
                return;
            }

            const resultado = await respuesta.json();

            // Guardamos la sesión del usuario devuelto por el servidor
            localStorage.setItem("usuarioLogueado", JSON.stringify(resultado.usuario));
            sessionStorage.setItem("usuarioLogueado", JSON.stringify(resultado.usuario));

            // Redirigimos a inicio.html
            window.location.href = "../html/inicio.html";

        } catch (error) {
            if (textoayuda) textoayuda.textContent = "Error de conexión con el servidor.";
        }
    });
}