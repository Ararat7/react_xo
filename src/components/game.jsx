import React from 'react';

export default class Game extends React.Component {
    constructor() {
        super();
        this.boardSize = 20;
        this.state = {
            board: Game.createBoard(this.boardSize),
            enabled: false
        };
    }
    componentDidMount() {
        let that = this;
        this.socket = this.props.socket;

        if (this.props.match.params.id !== this.socket.id) {
            this.socket.emit('game:join', {id: this.props.match.params.id});
            this.sign = 'o';
        } else {
            this.sign = 'x';
        }

        this.socket.on('game:start', function (data) {
            // enable board
            that.state.enabled = true;
            that.setState(that.state);
        });

        this.socket.on('game:played', function (cell) {
            if (!cell) {
                return;
            }
            let markedCell = that.findCell(cell.point);
            if (!markedCell) {
                return;
            }
            markedCell.sign = cell.sign;
            that.state.enabled = true;
            that.setState(that.state);
        });

        this.socket.on('game:close', function (data) {
            that.props.history.push('/');
        });
    }
    componentWillUnmount() {
        this.socket.emit('game:close');
        this.socket.off();
    }
    findCell(point) {
        for (let i = 0; i < this.boardSize * this.boardSize; i++) {
            let currentCell = this.state.board[i];
            if (point.x === currentCell.point.x && point.y === currentCell.point.y) {
                return currentCell;
            }
        }
        return null;
    }
    static createBoard(size) {
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
    onBoardClick(e) {
        e.preventDefault();
        if (e.currentTarget.className.indexOf('disabled') > -1) {
            return;
        }
        if (e.target.textContent.trim()) {
            return;
        }

        this.state.enabled = false;
        this.setState(this.state);

        let point = {
            x: +e.target.dataset.x,
            y: +e.target.dataset.y
        };
        e.target.textContent = this.sign;
        this.socket.emit('game:play', point);
    }
    render() {
        return (
            <div>
                <p><strong>Game: </strong>{this.props.match.params.id}</p>
                <div className={'board ' + (this.state.enabled ? 'enabled' : 'disabled')} onClick={this.onBoardClick.bind(this)}>
                    {
                        this.state.board.map((cell, i) => {
                            return (
                                <div key={i} className="cell" data-x={cell.point.x} data-y={cell.point.y}>{cell.sign}</div>
                            );
                        })
                    }
                </div>
            </div>
        );
    }
}