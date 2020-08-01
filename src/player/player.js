const ytdl = require('ytdl-core-discord');

class Player {
    constructor() {
        // connection means the Discord connection
        this.connection = null;
        this.playlist = [];
    };

    getConnection = () => {
        return this.connection;
    };

    setConnection = (connection) => {
        this.connection = connection;
    };

    // Play Playlist
    play = () => {
        this.connection.play(ytdl(content), { type: 'opus' });
        console.log(this.playlist);
    };

    // Add Song to Playlist
    addToPlaylist = (song) => {
        this.playlist.push(song);
    };

    // Remove Song from Playlist
    removeFromPlaylist = (song) => {
        console.log('removing song...');

    };
};

module.exports = Player;

