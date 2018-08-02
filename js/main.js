var game = new Phaser.Game(980, 500, Phaser.AUTO, document.getElementById('game'), null, true, false);
game.state.add('Game',Game);
game.state.start('Game');
