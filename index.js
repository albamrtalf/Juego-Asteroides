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

//[16:41, 20/10/2017] Leo IS uni: 
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
    socket.on('nuevoJugador',function(data){
       juego.agregarJugador(data.id, socket);
    });
    socket.on('posicion',function(data){
        // socket.jugador = {
        //     id: data.id,
        //     x: data.x,
        //     y: data.y,
        //     ang:data.ang
        // };
        // console.log("movimiento id:",socket.jugador.id," ",socket.jugador.x," ",socket.jugador.y);
        // socket.broadcast.emit('movimiento',socket.jugador); 
        juego.movimiento(data, socket);
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