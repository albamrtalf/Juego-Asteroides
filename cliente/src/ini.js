//Es una instancia de phaser
var game = new Phaser.Game(800, 600, Phaser.CANVAS, 'no-hay-calabazas');

//Es una instancia de phaser
var juego = new Juego();
//var finJuego = new FinJuego();

game.state.add('Game', juego);
//game.state.start('Game'); // Iniciar el juego
//game.state.add('FinJuego', finJuego);

var cliente = new Cliente();

cliente.lanzarSocketSrv();
cliente.cargarConfiguracion(); // Iniciar juego cuando carge la configuracion