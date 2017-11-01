var fs=require("fs");
var exp=require("express");
var app=exp(); // El tutorial indicaba exp.createServer()
var http = require('http').Server(app);
var io = require('socket.io').listen(http); // Socket.io server listens to our app
var modelo = require('./servidor/modelo.js');
var juego = new modelo.Juego(); // Importo juego

app.use(exp.static(__dirname + "/cliente"));

app.set('port', (process.env.PORT || 5000));

// El get() que hace el navegador al servidor
app.get("/",function(request,response){
	var contenido = fs.readFileSync("./cliente/index.html");
	response.setHeader("Content-Type", "text/html");
	response.send(contenido);
});
/**
app.get('/obtenerPartidas', function(request, response) {
    juego.obtenerPartidas(function(lista){
        response.send(lista);        
    });
});
**/

http.listen(app.set('port'), function(){
    console.log('Servidor escuchando en ', app.get('port'));
});

io.on('connection',function(socket){
    socket.on('room', function(room) {
        console.log('nuevo cliente: ', room);
        juego.nuevaPartida(room, socket);
    });
    /**socket.on('unirme',function(room){
        //console.log(juego.partidas);
        juego.unirme(room,socket);
    });**/
    socket.on('configuracion',function(room){
        // console.log(juego.partidas);
       juego.partidas[room].iniciar(socket,io);
    })
    socket.on('nuevoJugador', function(data){
       // juego.agregarJugador(data.id, socket);
       juego.partidas[data.room].agregarJugador(data.id, socket);
    });
    socket.on('posicion', function(room, data){
        // juego.movimiento(data, socket);
        juego.partidas[room].movimiento(data, socket);
    });
    socket.on('volverAJugar', function(room){
        // juego.volverAJugar(socket)
        console.log(juego.partidas[room]);
        juego.partidas[room].volverAJugar(socket);
    });
}); // Fin io.on

// function obtenerTodos(){
//     var jugadores = [];
//     Object.keys(io.sockets.connected).forEach(function(socketID){
//         var jugador = io.sockets.connected[socketID].jugador;
//         if(jugador) jugadores.push(jugador);
//     });
//     return jugadores;
// }