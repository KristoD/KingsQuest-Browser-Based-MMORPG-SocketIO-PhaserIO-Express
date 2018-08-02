var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var server = require('http').Server(app);
var io = require('socket.io').listen(server);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
// app.use('/css', express.static(__dirname + '/css'));
app.use('/js', express.static(__dirname + '/js'));
app.use('/assets', express.static(__dirname + '/assets'));
app.use('/login', express.static(__dirname + '/login'));

app.get('/', (req,res) => {
    res.sendFile(__dirname + '/login/login.html');
});

app.post('/username', (req,res) => {
    server.playerName = req.body.username;
    res.redirect('/kingsquest');
})

app.get('/kingsquest', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

server.listen(8000, () => {
    console.log('Server listening on ' + server.address().port);
});

server.lastPlayerID = 0;

io.on('connection', (socket) => {
    socket.on('newplayer', function() {
        socket.player = {
            id: server.lastPlayerID++,
            // x: randomInt(600,620),
            // y: randomInt(7300,7350)
            x: randomInt(350,300),
            y: randomInt(350,300),
            name: server.playerName
        }
        socket.broadcast.emit('newplayer', socket.player);
        socket.emit('allplayers', getAllPlayers());
        socket.emit('newPlayerCamera', socket.player);

        socket.on('click', function(data) {
            // socket.player.id = data.id
            socket.player.x = data.x;
            socket.player.y = data.y;
            io.emit('move', socket.player);
            socket.emit('camera', socket.player);
        });

        socket.on('chat', function(data) {
            io.emit('sentChat', {text : data.text, x: socket.player.x, y: socket.player.y, id: socket.player.id})
        });

        socket.on('disconnect', function() {
            io.emit('remove', socket.player.id);
        });
    });
});

function getAllPlayers(){
    var players = [];
    Object.keys(io.sockets.connected).forEach(function(socketID){
        var player = io.sockets.connected[socketID].player;
        if(player) players.push(player);
    });
    return players;
}

function randomInt(low, high) {
    return Math.floor(Math.random() * (high - low) + low);
}