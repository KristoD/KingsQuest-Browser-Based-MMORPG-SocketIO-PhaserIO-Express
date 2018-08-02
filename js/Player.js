function CharacterSpr() {}
CharacterSpr.prototype.setupAnimations = function(id) { 
    Game.playerMap[id].animations.add('walk_down', [
        "deathknight_30", "deathknight_31"
    ], 60, true);

    Game.playerMap[id].animations.add('walk_up', [
        "deathknight_19", "deathknight_20"

    ], 60, true);
 
    Game.playerMap[id].animations.add('walk_right', [
        "deathknight_8", "deathknight_9"


    ], 60, true);
    Game.playerMap[id].animations.add('walk_left', [
        "deathknight_39", "deathknight_40"

    ], 60, true);
    
};
 
CharacterSpr.prototype.walkDown = function(id){
    Game.playerMap[id].animations.play("walk_down",6,true);
};
 
CharacterSpr.prototype.walkUp = function(id){
    Game.playerMap[id].animations.play("walk_up",6,true);
};
 
CharacterSpr.prototype.walkLeft = function(id){
    // Game.playerMap[id].scale.x = 1;
    Game.playerMap[id].animations.play("walk_left",6,true);
};
 
CharacterSpr.prototype.walkRight = function(id){
    // Game.playerMap[id].scale.x = -1;
    Game.playerMap[id].animations.play("walk_right",6,true);
};
 
CharacterSpr.prototype.stopAnimation = function(id){
    Game.playerMap[id].animations.stop();
};