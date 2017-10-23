function Juego() {
	this.estado = new Inicial();
	this.jugadores = {}; // Inicializado como un objeto json
	this.veggie = 16;
	this.socket;
	this.agregarJugador = function(id, socket) {
		this.socket = socket;
		this.estado.agregarJugador(id, this);
	}
	this.puedeAgregarJugador = function(id) {
		this.jugadores[id] = new Jugador(id, this.veggie);
		this.veggie++;
		if (Object.keys(this.jugadores).length >= 2) {
			this.estado = new Jugar();
			this.enviarAJugar();
		} else {
			this.enviarFaltaUno();
		}
	}
	this.enviarFaltaUno = function() {
		this.socket.emit('faltaUno');
	}
	this.enviarAJugar = function() {
		this.socket.broadcast.emit('aJugar',this.jugadores);
        this.socket.emit('aJugar',this.jugadores);
	}
	this.movimiento = function (data, socket) {
		this.socket = socket;
		this.estado.movimiento(data, this);
	}
	this.puedeMover = function(data) {
		if (data.puntos >= 5) {
			this.enviarFinal(data.id);
			this.estado = new Final();
		} else {
			this.socket.broadcast.emit('movimiento', data);
		}
	} 
	this.enviarFinal = function (id) {
		this.socket.broadcast.emit('final', id);
		this.socket.emit('final', id);
	}
} // Fin Juego
function randomInt(low, hight){
	return Math.floor(Math.random() * (hight - low) + low);
} // Fin randomInt
function Jugador(id, veggie) {
	this.id = id;
	this.x = randomInt(100,400);
	this.y = randomInt(100,400);
	this.veggie = veggie;
} // Fin Jugador
function Inicial() {
	this.agregarJugador = function(id, juego) {
		juego.puedeAgregarJugador(id);
	}
	this.movimiento = function (data, juego) {
		console.log('No se puede mover la nave');
	}
} // Fin Inicial
function Jugar() {
	this.agregarJugador = function(id, juego) { // Si se esta jugando ya
		console.log('No se pueden agregar jugadores');
	}
	this.movimiento = function (data, juego) {
		juego.puedeMover(data);
	}
} // Fin Jugar
function Final() {
	this.agregarJugador = function(id, juego) { // Si se ha terminado ya la partida
		console.log('No se pueden agregar jugadores');
	}
	this.movimiento = function (data, juego) {
		console.log('No se puede mover la nave');
	}
} // Fin Fial

module.exports.Juego = Juego;