function Board(size) {
    this.size = size || 20;
    this.board = createBoard(this.size);

    this.markCell = function (point, sign) {
        for (var i = 0; i < this.size * this.size; i++) {
            var currentCell = this.board[i];
            if (point.x === currentCell.point.x && point.y === currentCell.point.y && !currentCell.sign) {
                currentCell.sign = sign;
                return currentCell;
            }
        }
        return null;
    };

    function createBoard(size) {
        var board = [];
        for (var i = 0; i < size; i++) {
            for (var j = 0; j < size; j++) {
                board.push({
                    point: {x: i, y: j},
                    sign: ''
                });
            }
        }
        return board;
    }
}

module.exports = Board;