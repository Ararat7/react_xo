var Player = require('./player');
var Board = require('./board');

function Game(id, player1, player2, board) {

    this.id = id;
    this.player1 = player1;
    this.player2 = player2;
    this.board = board || new Board();
    this.state = 'new';

    this.join = function (player) {
        this.player2 = player;
        this.state = 'full';
    };

    this.play = function (playerId, point) {
        var sign = '';
        if (this.player1.id === playerId) {
            sign = 'x';
        } else if (this.player2.id === playerId) {
            sign = 'o';
        } else {
            return console.error('Invalid player!');
        }

        return this.board.markCell(point, sign);
    };
}

module.exports = Game;