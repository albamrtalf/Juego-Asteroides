var fs=require("fs");
//var config=JSON.parse(fs.readFileSync("config.json"));
//var host=config.host;
//var port=config.port;
var exp=require("express");
var app=exp(); // El tutorial indicaba exp.createServer()
var http = require('http').Server(app);
var io = require('socket.io').listen(http); // Socket.io server listens to our app
var modelo = require('./servidor/modelo.js');
var juego = new modelo.Juego(); // Importo juego

app.use(exp.static(__dirname + "/cliente"));

app.set('port', (process.env.PORT || 5000));
http.listen(app.set('port'), function(){
    console.log('Servidor escuchando en ', app.get('port'));
});

// El get() que hace el navegador al servidor
app.get("/",function(request,response){
	var contenido = fs.readFileSync("./cliente/index.html");
	response.setHeader("Content-Type", "text/html");
	response.send(contenido);
});

//console.log("Servidor escuchando en "+host+":"+port);
//http.listen(port,host);

// function randomInt(low, hight){
// 	return Math.floor(Math.random() * (hight - low) + low);
// } 

io.on('connection',function(socket){
    socket.on('configuracion', function() {
        juego.iniciar(socket);
    });
    socket.on('nuevoJugador', function(data){
       juego.agregarJugador(data.id, socket);
    });
    socket.on('posicion', function(data){
        juego.movimiento(data, socket);
    });
    socket.on('volverAJugar', function(data){
        juego.volverAJugar(socket);
    })
}); // Fin io.on

// function obtenerTodos(){
//     var jugadores = [];
//     Object.keys(io.sockets.connected).forEach(function(socketID){
//         var jugador = io.sockets.connected[socketID].jugador;
//         if(jugador) jugadores.push(jugador);
//     });
//     return jugadores;
// }