var Client = {}
Client.socket = io.connect();

Client.askNewPlayer = function(){
    Client.socket.emit('newplayer');
}

$('#input1').keydown(function(e) {
    if(e.which === 13) {
        var text = $('#input1').val();
        text = text.substr(0,1).toUpperCase()+text.substr(1)
        Client.socket.emit('chat', {text: text});
        event.preventDefault();
        $('#input1').val("")
    }
});

Client.socket.on('sentChat', function(data) {
    var x;
    var y = data.y - 50;
    if(data.text.length > 5 && data.text.length < 8) {
        x = data.x + 15;
    } else if( data.text.length >= 8 && data.text.length < 12) {
        x = data.x + 3;
    } else if(data.text.length >= 12) {
        x = data.x - 20;
    } else {
        x = data.x + 5;
    }
    var chat = game.add.text(0, 0, data.text, {
        font: "17px",
        align: "center",
        fill: 'yellow'
    });
    Game.playerMap[data.id].addChild(chat)
    chat.x = (Game.playerMap[data.id].width - chat.width - 30) / 2.5;
    chat.y = (Game.playerMap[data.id].height - chat.height - 105);
    setInterval(function() {
        chat.destroy();
    }, 3000);
});

Client.socket.on('newPlayerCamera', function(data) {
    Game.prototype.welcomeScreen(data.id)
    Game.prototype.newPlayerCamera(data.id, data.x, data.y);
});

Client.socket.on('newplayer', function(data) {
    Game.prototype.addNewPlayer(data.id, data.x, data.y, data.name);
});

Client.socket.on('allplayers', function(data) {
    for(var i = 0; i < data.length; i++) {
        Game.prototype.addNewPlayer(data[i].id, data[i].x, data[i].y, data[i].name);
    }
});

Client.socket.on('remove', function(id) {
    Game.removePlayer(id);
});

Client.socket.on('camera', function(data) {
    Game.prototype.followPlayer(data.id);
})

Client.sendClick = function(x,y, id) {
    Client.socket.emit('click', {x:x, y:y});
}

Client.socket.on('move', function(data) {
    Game.prototype.findPathTo(data.id, data.x, data.y);
});