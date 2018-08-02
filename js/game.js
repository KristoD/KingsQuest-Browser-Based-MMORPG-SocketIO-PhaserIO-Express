var pathfinder;
var map;
function Game() {
    this.game = game;
    this.pathfinder;
    this.layer;
    this.currentTweens = [];
    this.map;
    this.moving = false;
    this.tweenInProgress = false;
    this.playClicked;
    this.king;
}

Game.prototype.init = function() {
    this.game.stage.disableVisibilityChange = true;
}

Game.prototype.preload = function() {
    this.load.tilemap('map', 'assets/map/example_map.json', null, Phaser.Tilemap.TILED_JSON);
    this.load.spritesheet('tileset', 'assets/map/tilesheet.png', 32,32);
    game.load.atlasJSONHash('atlas1', 'assets/sprites/atlas1.png', 'assets/sprites/atlas1.json');
    game.load.atlasJSONHash('atlas3', 'assets/sprites/atlas3.png', 'assets/sprites/atlas3.json');
    game.load.atlasJSONHash('atlas4', 'assets/sprites/atlas4.png', 'assets/sprites/atlas4.json');
    this.load.image('sprite', 'assets/sprites/sprite.png', 32,32);
    this.load.image('walkables', 'assets/map/walkable.png', 32,32);
}

Game.prototype.create = function() {
    Game.playerMap = {};
    game.physics.startSystem(Phaser.Physics.ARCADE);
    this.game.world.setBounds(game.world.x,game.world.y);
    map = this.game.add.tilemap('map');
    map.addTilesetImage('tilesheet', 'tileset');
    map.addTilesetImage('walkable', 'walkables');
    this.layer = map.createLayer('collision')
    map.createLayer('ground');
    map.createLayer('mud');
    map.createLayer('grass');
    map.createLayer('stone');
    map.createLayer('river');
    map.createLayer('Houses');
    map.createLayer('Trees2');
    this.layer.resizeWorld();
    this.layer.inputEnabled = true;
    game.physics.arcade.enable([this.layer]);
    pathfinder = this.game.plugins.add(Phaser.Plugin.PathFinderPlugin);
    pathfinder.setGrid(map.layers[7].data, [1961]);
    Game.king = game.add.sprite(3072, 192, 'atlas1', 'king_0')
    Game.king.anchor.setTo(0, 0.5)
    Client.askNewPlayer();
    this.initCursor();
}

Game.prototype.findPathTo = function(id, tilex, tiley) {
    // var player = Game.playerMap[id];
    var me = this;
    pathfinder.setCallbackFunction(function(path) {
        path = path || [];
        for(var i = 0, ilen = path.length; i < ilen; i++) {
            map.putTile(path[i].x, path[i].y);
        }
        blocked = false;
        me.onReadyToMove(path, id)
    });

    pathfinder.preparePathCalculation([Math.floor(Game.playerMap[id].x / 32), Math.floor(Game.playerMap[id].y / 32)], [tilex / 32,tiley / 32])
    pathfinder.calculatePath();
}

Game.prototype.onReadyToMove = function(path,id) {
    this.resetCurrentTweens(id);
    this.prepareMovement(path, id);
    this.moveInPath(id);
}

Game.prototype.resetCurrentTweens = function(id){
    var me = this;
    if(Game.playerMap[id].path) {
        Game.playerMap[id].path.map(function(tween){
            game.tweens.remove(tween);
        });
        // this.currentTweens = [];
        this.moving = false;
        CharacterSpr.prototype.stopAnimation(id);
    }
};
 
Game.prototype.prepareMovement = function(path, id){
    path = path || [];
    Game.playerMap[id].path = [];
    var me = this;
 
    path.map(function(point){
        Game.playerMap[id].path.push(me.getTweenToCoordinate(point.x, point.y, id));
    });
};

Game.prototype.getTweenToCoordinate = function(x, y, id){
    var tween = game.add.tween(Game.playerMap[id]);
    x = (x * 32);
    y = (y * 32);
    tween.to({ x:x, y:y }, 150);
    return tween;

};

Game.prototype.moveInPath = function(id) {
    if(Game.playerMap[id].path.length === 0){
        var collision = game.add.text(0, 0, "Huh?", {
            font: "17px",
            align: "center",
            fill: 'yellow'
        });
        Game.playerMap[id].addChild(collision);
        collision.x = (Game.playerMap[id].width - collision.width - 30) / 2.5;
        collision.y = (Game.playerMap[id].height - collision.height - 105);
        setInterval(function() {
            collision.destroy();
        }, 3000)
        return;
    }
    var index = 1, me = this;
    this.moving = true;
 
    moveToNext(Game.playerMap[id].path[index]);
 
    function moveToNext(tween){
 
        index ++;
        var nextTween = Game.playerMap[id].path[index];
        if(nextTween != null){
 
            tween.onComplete.add(function(){
                me.tweenInProgress = false;
                moveToNext(nextTween);
            });
        }else{
            // if i am the last tween
            tween.onComplete.add(function(){
                me.onStopMovement(id);
                if(Game.playerMap[id].position.x == 1344 && Game.playerMap[id].position.y == 384) {
                    Game.playerMap[id].position.x = 3104;
                    Game.playerMap[id].position.y = 896;
                }
                if(Game.playerMap[id].position.x == 3104 && Game.playerMap[id].position.y == 928) {
                    Game.playerMap[id].position.x = 1344;
                    Game.playerMap[id].position.y = 416;
                }
                if(Game.playerMap[id].position.x == 640 && Game.playerMap[id].position.y == 448) {
                    Game.playerMap[id].position.x = 3072;
                    Game.playerMap[id].position.y = 320;
                }
                if(Game.playerMap[id].position.x == 3072 && Game.playerMap[id].position.y == 352) {
                    Game.playerMap[id].position.x = 640;
                    Game.playerMap[id].position.y = 480;
                }
                if(Game.playerMap[id].position.x == 2944 && Game.playerMap[id].position.y == 96) {
                    Game.playerMap[id].position.x = 1856;
                    Game.playerMap[id].position.y = 544;
                }
                if(Game.playerMap[id].position.x == 1920 && Game.playerMap[id].position.y == 480) {
                    Game.playerMap[id].position.x = 3072;
                    Game.playerMap[id].position.y = 256;
                }
                if(Game.playerMap[id].position.x == 3072 && Game.playerMap[id].position.y == 224) {
                    let text = game.add.text(0,0, "Greetings traveler. I have a quest for you.", {
                        font: "17px",
                        align: "center",
                        fill: 'yellow'
                    });
                    Game.king.addChild(text);
                    text.x = (Game.king.width - text.width - 30) / 2.5;
                    text.y = (Game.king.height - text.height - 60);
                    setInterval(function() {
                        text.destroy();
                    }, 3000)
                }
            });
        }
        tween.start();
        me.faceNextTile(tween, id);
        me.tweenInProgress = true;
    }
};

Game.prototype.onStopMovement = function(){
    this.resetCurrentTweens();
};

Game.prototype.faceNextTile = function(tween, id){
 
    var isVerticalMovement = tween.properties.y == Game.playerMap[id].position.y;
 
    if(isVerticalMovement) {
        if(tween.properties.x > Game.playerMap[id].position.x){
            CharacterSpr.prototype.walkRight(id);
        } else {
            CharacterSpr.prototype.walkLeft(id);
        }
    } else {
        if(tween.properties.y > Game.playerMap[id].position.y){
            CharacterSpr.prototype.walkDown(id);
        } else {
            CharacterSpr.prototype.walkUp(id);
        }
 
    }
};
 

Game.prototype.onStopMovement = function(id){
    this.resetCurrentTweens(id);
};

Game.prototype.initCursor = function() {
    this.cursors = this.game.input.keyboard.createCursorKeys();
    this.marker = this.game.add.graphics();
    this.marker.lineStyle(2, 0x000000, 1);
    this.marker.drawRect(0, 0, 32, 32);
    this.input.onDown.add(function(event){
        this.updateCursorPosition();
        console.log(this.marker.x, this.marker.y)
        if(this.playClicked == true) {
            Client.sendClick(this.marker.x, this.marker.y);
        }
    }, this);
}

Game.prototype.updateCursorPosition = function() {
    this.marker.x = this.layer.getTileX(game.input.activePointer.worldX) * 32;
    this.marker.y = this.layer.getTileY(game.input.activePointer.worldY) * 32;
}

Game.prototype.welcomeScreen = function(id) {
    // Game.playerMap[id].;
    var scroll = game.add.sprite(game.camera.x + 80, game.camera.y + 100, 'atlas1', 'achievements');
    this.scroll = scroll;
    scroll.bringToTop();
    // game.world.sendToTop(scroll);
    var instruc = game.add.text(0, 0, "Welcome to KingsQuest.\n Controls: Click around to move your character.\n Gameplay: Barely any.\n Click Play to play!", {
        font: "30px",
        align: "center",
        fill: 'black',
    });
    scroll.addChild(instruc);
    var button = game.add.button(0, 0, 'atlas1');
    button.frameName = 'play_0';
    button.input.useHandCursor = false;
    var me = this;
    button.onInputDown.add(function(event) {
        me.onPlayClick(scroll, button, instruc);
    });
    instruc.x = scroll.x + 60;
    instruc.y = scroll.y - 20;
    instruc.addChild(button)
    button.x = instruc.x + 30;
    button.y = instruc.y + 90;
}

Game.prototype.onPlayClick = function(button, scroll, instruc) {
    button.kill();
    scroll.kill();
    instruc.kill();
    this.playClicked = true;
}


Game.prototype.addNewPlayer = function(id, x, y, name) {
    Game.playerMap[id] = game.add.sprite(x,y, 'atlas4', 'deathknight_30');
    Game.playerMap[id].anchor.setTo(0.25, 0.5)
    Game.playerMap[id].path = []
    Game.playerMap[id].name = name;
    if(this.scroll) {
        this.scroll.bringToTop();
    }
    CharacterSpr.prototype.setupAnimations(id)
    var text = game.add.text(0, 0, Game.playerMap[id].name, {
        font: "15px",
        align: "center",
        fill: 'green',
    });
    Game.playerMap[id].addChild(text)
    text.x = (Game.playerMap[id].width - text.width - 30) / 2.5;
    text.y = (Game.playerMap[id].height - text.height) / 2.5;
}

Game.prototype.followPlayer = function(id) {
    this.scroll.bringToTop();
    game.camera.follow(Game.playerMap[id]);
}

Game.prototype.newPlayerCamera = function(id,x,y) {
    game.camera.x = x - 490;
    game.camera.y = y - 250;
}

Game.removePlayer = function(id) {
    Game.playerMap[id].destroy();
    delete Game.playerMap[id];
}

Game.prototype.update = function() {
    this.updateCursorPosition();
}
