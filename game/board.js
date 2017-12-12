function Board(size) {
    this.size = size || 20;
    this.board = createBoard(this.size);

    this.markCell = function (point, sign) {
        for (let i = 0; i < this.size * this.size; i++) {
            let currentCell = this.board[i];
            if (point.x === currentCell.point.x && point.y === currentCell.point.y && !currentCell.sign) {
                currentCell.sign = sign;
                return currentCell;
            }
        }
        return null;
    };

    function createBoard(size) {
        let board = [];
        for (let i = 0; i < size; i++) {
            for (let j = 0; j < size; j++) {
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