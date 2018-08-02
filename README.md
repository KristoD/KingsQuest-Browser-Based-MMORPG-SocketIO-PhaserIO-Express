# About KingsQuest

KingsQuest is a 8-bit MMORPG using BrowserQuests open source sprites. 

### Tools Used

- Frontend: The project uses Angular for the main page and Phaser, an HTML5 framework, for the game.

- Backend: The project uses Express for the backend and SocketIO for the multiplayer gameplay.

### Features

- User creation (No database entries yet)
- Welcome page that disables user input until the player clicks a play button
- Basic chat system for players to interact with one another (similar to Runescape's chat system)
- Basic NPC interaction
- Click-based player movement system with an A* pathfinding algorithm library for Phaser with collision detection
- Basic zone teleportation (by checking if a player's end-path is a certain coordinate to teleport him to another coordinate)
- Map generated by BrowserQuest open source sprites with Tiled
- Map generating application