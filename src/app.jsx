// Libs
import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Route, Link } from 'react-router-dom';
// Stylesheets
import "./stylesheets/styles.scss";
// Components
import Home from './components/home.jsx';
import Game from './components/game.jsx';

const socket = io();

class App extends React.Component {
    constructor() {
        super();
        this.state = {name: 'Ararat'};
    }
    componentDidMount() {
        // let that = this;
        // socket.on('init', function (state) {});

        socket.on('message:show', function (data) {
            console.log(data);
        });
    }
    render() {
        const {name} = this.state;
        return (
            <div>
                <header>
                    <h2 className="title">{name}</h2>
                </header>
                <nav>
                    <ul>
                        <li><Link to="/">Home</Link></li>
                    </ul>
                </nav>
                <main>
                    {this.props.children}
                </main>
            </div>
        );
    }
}

ReactDOM.render((
    <BrowserRouter>
        <App>
            <Route exact path="/" component={(props) => <Home socket={socket} {...props} />} />
            <Route path="/game/:id" component={(props) => <Game socket={socket} {...props} />} />
        </App>
    </BrowserRouter >
), document.querySelector('#app'));

export default App;