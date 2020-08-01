const ytdl = require('ytdl-core-discord');

class Player {
    constructor() {
        // connection means the Discord connection
        this.connection = null;
        this.playlist = [];
        this.playing = false;
    };

    getConnection = () => {
        return this.connection;
    };

    setConnection = (connection) => {
        this.connection = connection;
    };

    // Play Playlist
    play = () => {
        this.playlist.forEach(async (song) => {
            console.log('Playing: ', song.url);
            this.connection.play(await ytdl(song.url), { type: 'opus' });
        });
        console.log(this.playlist);
    };

    // Add Song to Playlist
    addToPlaylist = (song) => {
        this.playlist.push(song);
        console.log('Playlist: ', this.playlist);
    };

    // Remove Song from Playlist
    removeFromPlaylist = (song) => {
        console.log('removing song...');

    };
};

module.exports = Player;

