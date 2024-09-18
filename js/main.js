let contenedor = document.getElementById('contenedor-juego');
let boton = document.getElementById('iniciar-juego');
let arregloCards = [];
let arregloCardsVolteadas = [];
let arregloCardsEncontradas = [];

boton.addEventListener('click', iniciarJuego);

function iniciarJuego() {
  contenedor.innerHTML = '';
  arregloCards = [];
  arregloCardsEncontradas = [];

  // llenar arreglo de cartas
  for (let j = 0; j < 2; j++) {
    for (let i = 0; i < 6; i++) {
      let card = '<div class="card" data-card ="' + (i + 1) + '"> </div>';
      arregloCards.push(card);
    }
  }

  // desordenar el arreglo
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
      validarCartas();
    }
  }
  console.log(arregloCardsVolteadas);
}

function validarCartas() {
  if (
    arregloCardsVolteadas[0].dataset.card ==
    arregloCardsVolteadas[1].dataset.card
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
    contenedor.innerHTML = '';
    let mensaje =
      '<p id="mensaje"> ¡Felicitaciones! Juego completado</p>';
    contenedor.innerHTML = mensaje;
  }

  // Almacenar información en localStorage
  localStorage.setItem('arregloCardsEncontradas', JSON.stringify(arregloCardsEncontradas));
}

// Recuperar información del localStorage al cargar la página
window.addEventListener('load', function () {
  var arregloCardsEncontradasStorage = localStorage.getItem('arregloCardsEncontradas');
  if (arregloCardsEncontradasStorage) {
    arregloCardsEncontradas = JSON.parse(arregloCardsEncontradasStorage);
    // Actualizar la interfaz con las cartas encontradas
    arregloCardsEncontradas.forEach((card) => {
      card.style.backgroundColor = 'blue';
      card.innerHTML = '<p class ="card-value">' + card.dataset.card + '</p>';
    });
  }
});