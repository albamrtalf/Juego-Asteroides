function Juego() {
	this.estado = new Inicial();
	this.jugadores = {}; // Inicializado como un objeto json
	//this.veggie = 16;
	this.veg; //random(0,35)
	this.socket;
	this.coord=[];
	this.iniciar = function(socket) {
		this.socket = socket;
		this.socket.emit('coord', this.coord);
	}
	this.ini = function(){
	    this.veg = randomInt(0,35);
	    var otra = this.veg + 1;
	    //console.log(this.veg,"--",otra);
	    for(var i =0; i<20; i++){
            this.coord.push({'veg':this.veg,'x':randomInt(10,770),'y':randomInt(25,570)});
	    }
	    for(var i=0; i<20; i++){
            this.coord.push({'veg':otra,'x':randomInt(10,770),'y':randomInt(25,570)});
	    }
	    for(var i=0; i<50; i++){
            var alea = randomInt(0,otra-2)
            this.coord.push({'veg':alea,'x':randomInt(10,770),'y':randomInt(25,570)});
   		}
	    for(var i=0; i<50; i++){
	        var alea = randomInt(otra++,35);
	        this.coord.push({'veg':alea,'x':randomInt(10,770),'y':randomInt(25,570)});
	    }
    }
    this.ini();
	this.agregarJugador = function(id, socket) {
		this.socket = socket;
		this.estado.agregarJugador(id, this);
	}
	this.puedeAgregarJugador = function(id) {
		this.jugadores[id] = new Jugador(id, this.veg);
		this.veg++;
		console.log(this.jugadores);
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
	this.volverAJugar=function(socket){
	  this.socket=socket;
	  this.estado.volverAJugar(this);
	}
	this.reiniciar=function(){
	  this.jugadores={};
	  this.coord=[];
	  this.ini();
	  this.estado=new Inicial();
	  this.socket.broadcast.emit('reset',this.coord);
	  this.socket.emit('reset',this.coord);
	}
} // Fin Juego
function randomInt(low, hight){
	return Math.floor(Math.random() * (hight - low) + low);
} // Fin randomInt
function Jugador(id, veg) {
	this.id = id;
	this.x = randomInt(100,400);
	this.y = randomInt(100,400);
	this.veg = veg;
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
	this.volverAJugar=function(juego){
	  juego.reiniciar();
	}
} // Fin Jugar
function Final() {
	this.agregarJugador = function(id, juego) { // Si se ha terminado ya la partida
		console.log('No se pueden agregar jugadores');
	}
	this.movimiento = function (data, juego) {
		console.log('No se puede mover la nave');
	}
	this.volverAJugar=function(juego){
	  juego.reiniciar();
	}
} // Fin Fial

module.exports.Juego = Juego;