let Game = require('../game/game');
let Player = require('../game/player');

let games = {};
// let players = {};

function socketHandler(socket) {
    console.log('New connection');

    socket.on('init', function () {
        socket.emit('init', {name: 'ARO'});
    });

    socket.on('game:list', function () {
        socket.emit('game:list', Object.keys(games)
            .filter(function (id) {
                return games[id].state === 'new';
            })
            .map(function (id) {
                return {id: id};
            }));
    });

    socket.on('game:create', function (data) {
        let playerName = data && data.name || 'x';
        let player1 = new Player({
            id: socket.id,
            socket: socket,
            name: playerName
        });
        games[socket.id] = new Game(socket.id, player1);
        // players[player1.id] = games[socket.id].id;

        // socket.join(socket.id); // it's done automatically

        // add game to the list
        // socket.emit('game:created', {id: socket.id});
        socket.emit('game:created', {id: socket.id});
        socket.broadcast.emit('game:list:add', {id: socket.id});
    });

    socket.on('game:join', function (data) {
        if (!data.id) {
            sendMessageToPlayer(socket, 'Invalid game id!');
            return console.error('Invalid game id!');
        }
        if (!games[data.id]) {
            sendMessageToPlayer(socket, 'Invalid game!');
            return console.error('Invalid game!');
        }

        let playerName = data && data.name || 'o';
        let player2 = new Player({
            id: socket.id,
            socket: socket,
            name: playerName,
            sign: 'o'
        });
        games[data.id].join(player2);
        // players[player2.id] = games[data.id].id;

        socket.join(data.id);
        socket.leave(socket.id);
        socket.to(data.id).emit('game:start', {id: data.id});

        // remove game from the list
        socket.emit('game:full', {id: data.id});
    });

    socket.on('game:play', function (point) {

        let gameId = Object.keys(socket.rooms)[0];
        if (!games[gameId]) {
            sendMessageToPlayer(socket, 'Invalid game id!');
            return console.error('Invalid game id!');
        }
        if (!point) {
            sendMessageToPlayer(socket, 'Invalid point!');
            return console.error('Invalid point!');
        }

        // let player = games[gameId].player1.id === socket.id ? 'x' : 'o';
        let opponent = '';
        if (games[gameId].player1.id === socket.id) {
            opponent = games[gameId].player2;
        } else {
            opponent = games[gameId].player1;
        }

        let cell = games[gameId].play(socket.id, point);

        opponent.socket.emit('game:played', cell);
    });

    socket.on('game:close', function () {
        let gameId = Object.keys(socket.rooms)[0];
        delete games[gameId];
        socket.to(gameId).emit('game:close');
    });

    socket.on('disconnect', function () {

    });
}

function sendMessageToPlayer(socket, message) {
    socket.emit('message:show', {message: message});
}

module.exports = socketHandler;