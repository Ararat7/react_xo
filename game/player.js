function Player(options) {
    this.id = options.id;
    this.socket = options.socket;
    this.sign = options.sign || 'x';
    this.name = options.name || this.sign;
}

module.exports = Player;