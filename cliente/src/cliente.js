function Cliente(nombre){
	this.socket;
	this.nombre = nombre;
	this.id = null;
	this.veg;
	this.coord;
	this.cargarConfiguracion = function() {
		this.socket.emit('configuracion', this.nombre);
	};
	this.nuevoJugador = function() {
		this.socket.emit('nuevoJugador', {room:this.nombre, id:this.id}); // El cliente se queda esperando
	}; // Fin nuevoJugador
	this.enviarPosicion=function(x,y,ang, puntos){
		this.socket.emit('posicion', this.nombre, {"id":this.id,"x":x,"y":y,"ang":ang, "puntos":puntos});
	}; // Fin enviarPosicion
	this.ini = function(){
		this.id = randomInt(1,1000);
		this.socket = io.connect();
		this.lanzarSocketSrv(); // Se puede llamar aqui o en ini.js
	}; // Fin ini
	this.volverAJugar = function() {
		this.socket.emit('volverAJugar',this.nombre);
	};
	this.reset=function(){
		this.id=randomInt(1,10000);
	};
	this.lanzarSocketSrv = function(){
		var cli = this;
		this.socket.on('connect', function() {
			cli.socket.emit('room', cli.nombre);
			cli.cargarConfiguracion();
		});
		this.socket.on('coord', function(data) {
			this.coord = data;
			game.state.start('Game', true, false, this.coord);
			//game.state.start('Game', true, false, data);
		});
		this.socket.on('faltaUno', function(data) {
			console.log('Falta un jugador');
		});
		this.socket.on('aJugar', function(data) {
			for(var jug in data) {
				console.log('aJugar: ', data[jug]);
				juego.agregarJugador(data[jug].id, data[jug].x, data[jug].y, data[jug].veg);
			}
		});
		this.socket.on('final', function(data) { // data = idGanador
			juego.finalizar(data);
		});
		this.socket.on('crearJugador', function(data){
			juego.agregarJugador(data.id, data.x, data.y);
		});
		this.socket.on('todos', function(data){
			console.log(data);
			for(var i = 0; i < data.length; i++){
					juego.agregarJugador(data[i].id, data[i].x, data[i].y);
			}
		});
		this.socket.on('movimiento',function(data){ 
		    juego.moverNave(data); 
		});
		this.socket.on('reset',function(data){ 
		    juego.volverAJugar(data);
		});
	} // Fin lanzarSocketSrv
	this.ini();

} // Fin Cliente

function randomInt(low, hight){
	return Math.floor(Math.random() * (hight - low) + low);
} // Fin randomInt