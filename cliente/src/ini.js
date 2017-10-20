//Es una instancia de phaser
var game = new Phaser.Game(800, 600, Phaser.CANVAS, 'Juego-Asteroide');

//Es una instancia de phaser
var juego = new Juego();

game.state.add('Game', juego);
game.state.start('Game');

var cliente = new Cliente();

cliente.lanzarSocketSrv();