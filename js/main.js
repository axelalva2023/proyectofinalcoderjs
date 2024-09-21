let contenedor = document.getElementById('contenedor-juego');
let boton = document.getElementById('iniciar-juego');
let puntajeDisplay = document.getElementById('puntaje');
let arregloCards = [];
let arregloCardsVolteadas = [];
let arregloCardsEncontradas = [];
let intentos = 0;
let usuarioActual = null;

// Función para iniciar sesión
document.getElementById('login-button').addEventListener('click', function () {
    let username = document.getElementById('username').value;
    if (username) {
        usuarioActual = username;
        localStorage.setItem('usuarioActual', usuarioActual);

        // Mostrar el juego y el botón de iniciar juego
        document.getElementById('login').style.display = 'none';
        contenedor.style.display = 'block';
        boton.style.display = 'block';
        puntajeDisplay.style.display = 'block';

        actualizarPuntaje();
    }
});

// Función para actualizar el puntaje en pantalla
function actualizarPuntaje() {
    let puntajes = JSON.parse(localStorage.getItem('puntajes')) || {};
    let puntajeUsuario = puntajes[usuarioActual] || 0;
    puntajeDisplay.textContent = `Puntaje de ${usuarioActual}: ${puntajeUsuario}`;
}

boton.addEventListener('click', iniciarJuego);

function iniciarJuego() {
    contenedor.innerHTML = '';
    arregloCards = [];
    arregloCardsEncontradas = [];
    intentos = 0; // Reiniciar el conteo de intentos

    for (let j = 0; j < 2; j++) {
        for (let i = 0; i < 6; i++) {
            let card = '<div class="card" data-card ="' + (i + 1) + '"> </div>';
            arregloCards.push(card);
        }
    }

    arregloCards.sort(function () {
        return Math.random() - 0.5;
    });

    arregloCards.forEach((card) => {
        contenedor.innerHTML += card;
    });

    let cards = document.querySelectorAll('.card');
    cards.forEach((card) => {
        card.addEventListener('click', voltearCarta);
    });
}

function voltearCarta() {
    let valor = this.dataset.card;
    let html = '<p class ="card-value">' + valor + '</p>';
    this.innerHTML = html;

    if (
        arregloCardsVolteadas.length < 2 &&
        !arregloCardsVolteadas.includes(this) &&
        !arregloCardsEncontradas.includes(this)
    ) {
        this.style.backgroundColor = 'blue';
        arregloCardsVolteadas.push(this);

        if (arregloCardsVolteadas.length == 2) {
            intentos++;  // Incrementamos los intentos
            validarCartas();
        }
    }
}

function validarCartas() {
    if (
        arregloCardsVolteadas[0].dataset.card == arregloCardsVolteadas[1].dataset.card
    ) {
        arregloCardsEncontradas.push(...arregloCardsVolteadas);
        arregloCardsVolteadas = [];
    } else {
        setTimeout(() => {
            arregloCardsVolteadas.forEach((card) => {
                card.style.backgroundColor = 'gray';
                card.innerHTML = '';
            });
            arregloCardsVolteadas = [];
        }, 1000);
    }

    if (arregloCardsEncontradas.length == arregloCards.length) {
        finalizarJuego();
    }
}

function finalizarJuego() {
    // Guardar puntaje del usuario
    let puntajes = JSON.parse(localStorage.getItem('puntajes')) || {};
    let puntajeUsuario = puntajes[usuarioActual] || 0;
    puntajeUsuario += Math.max(0, 12 - intentos);  // Se suma un puntaje basado en los intentos (a menos intentos, más puntaje)
    puntajes[usuarioActual] = puntajeUsuario;
    localStorage.setItem('puntajes', JSON.stringify(puntajes));

    actualizarPuntaje();

    // Mostrar un mensaje de felicitaciones con SweetAlert
    Swal.fire({
        title: '¡Felicidades!',
        text: `Juego completado en ${intentos} intentos`,
        icon: 'success',
        confirmButtonText: 'Aceptar',
        willClose: reiniciarLogin  // Reiniciar el login cuando se cierra la alerta
    });
}

// Función para reiniciar el login después de cada partida
function reiniciarLogin() {
    // Limpiar el usuario actual
    usuarioActual = null;
    localStorage.removeItem('usuarioActual');

    // Mostrar nuevamente el formulario de login
    document.getElementById('login').style.display = 'block';
    contenedor.style.display = 'none';
    boton.style.display = 'none';
    puntajeDisplay.style.display = 'none';

    // Limpiar el contenido del contenedor
    contenedor.innerHTML = '';
}

// Recuperar el usuario si existe (esto ahora solo se usa al cargar la página inicial)
window.addEventListener('load', function () {
    usuarioActual = localStorage.getItem('usuarioActual');
    if (usuarioActual) {
        document.getElementById('login').style.display = 'none';
        contenedor.style.display = 'block';
        boton.style.display = 'block';
        puntajeDisplay.style.display = 'block';

        actualizarPuntaje();
    }
});
