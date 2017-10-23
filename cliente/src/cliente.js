function Cliente(){

	this.socket;
	this.id;
	this.nuevoJugador = function() {
		this.socket.emit('nuevoJugador', {id:this.id}); // El cliente se queda esperando

	} // Fin nuevoJugador
	this.enviarPosicion=function(x,y,ang, puntos){
		this.socket.emit('posicion',{"id":this.id,"x":x,"y":y,"ang":ang, "puntos":puntos})
	} // Fin enviarPosicion
	this.ini = function(){
		this.id = randomInt(1,1000);
		this.socket = io.connect();
		//this.lanzarSocketSrv(); // Se puede llamar aqui o en ini.js
	} // Fin ini
	this.lanzarSocketSrv = function(){
		this.socket.on('faltaUno', function(data) {
			console.log('Falta un jugador');
		});
		this.socket.on('aJugar', function(data) {
			for(var jug in data) {
				console.log('aJugar: ', data[jug]);
				juego.agregarJugador(data[jug].id, data[jug].x, data[jug].y, data[jug].veggie);
			}
		});
		this.socket.on('final', function(data) {
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
		    juego.moverNave(data.id,data.x,data.y,data.ang); 
		});
	} // Fin lanzarSocketSrv
	this.ini();

} // Fin Cliente

function randomInt(low, hight){
	return Math.floor(Math.random() * (hight - low) + low);
} // Fin randomInt