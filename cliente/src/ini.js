// Es una instancia de phaser
// var game = new Phaser.Game(800, 600, Phaser.CANVAS, 'no-hay-calabazas');

// Es una instancia de phaser
// var juego = new Juego();
// var finJuego = new FinJuego();

// game.state.add('Game', juego);
// game.state.add('FinJuego', finJuego);

// var cliente = new Cliente();

// cliente.lanzarSocketSrv();
// cliente.cargarConfiguracion(); // Iniciar juego cuando carge la configuracion

var game;
var juego;
var finJuego;
var cliente;

function borrar() {
	$("#nombre").remove();
}

function mostrarIntroducirPartida() {
	var cadena;
	cadena = "<h1>Introducir partida</h1>";
	cadena = cadena + '<input type="text" id="nombre">';
	cadena = cadena + '<input type="submit" id="btn" values="Enviar">';
	$('#partida').append(cadena);
	$('#btn').on('click', function() {
		var nombre = $('#nombre').val();
		if (nombre != ""){
			borrar();
			cliente = new Cliente(nombre);
			mostrarCanvas();
		}
	});
}

function mostrarCanvas() {
	game = new Phaser.Game(800, 600, Phaser.CANVAS, 'no-hay-calabazas');
	juego = new Juego();
	finJuego = new FinJuego();
	game.state.add('Game', juego);
	game.state.add('FinJuego', finJuego);
}