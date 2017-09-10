var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var path = require('path');
var errorHandler = require('errorhandler');
var socket = require('./routes/socket');

var PORT = process.env.PORT || 3000;
var ENV = process.env.NODE_ENV || 'development';

app.use('/', express.static(path.join(__dirname, 'public')));

if (ENV === 'development') {
    app.use(errorHandler({ dumpExceptions: true, showStack: true }));
}

app.get(['/', '/game/*'], function (req, res) {
    res.sendFile(path.join(__dirname, 'src', 'index.html'));
});

server.listen(PORT);

io.on('connection', socket);

module.exports = app;