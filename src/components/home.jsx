import React from 'react';
import {Link} from 'react-router-dom';

export default class Home extends React.Component {
    constructor() {
        super();
        this.state = {games: []};
    }

    componentDidMount() {
        let that = this;
        this.socket = this.props.socket;

        this.socket.emit('game:list');
        this.socket.on('game:list', function (games) {
            that.state.games = games || [];
            that.setState(that.state);
        });

        this.socket.on('game:created', function (game) {
            that.props.history.push('/game/' + game.id);
        });

        this.socket.on('game:list:add', function (game) {
            that.state.games.push(game);
            that.setState(that.state);
        });
    }

    componentWillUnmount() {
        this.socket.off();
    }

    onCreateGame(e) {
        e.preventDefault();
        this.socket.emit('game:create');
    }

    render() {
        let gameList = this.state.games.map((game, i) => {
            return (
                <li key={i}>
                    <Link to={'/game/' + game.id}>{game.id}</Link>
                </li>
            );
        });
        if (gameList.length === 0) {
            gameList = (
                <li key={0}>
                    Sorry there is no available game.
                </li>
            );
        }

        return (
            <div>
                <div className="new-game">
                    <a href="#" onClick={this.onCreateGame.bind(this)}>New game</a>
                </div>
                <h4>Games</h4>
                <ul>
                    {gameList}
                </ul>
            </div>
        );
    }
}