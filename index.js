require('dotenv').config();
const tmi = require('tmi.js');

const botUsername = process.env.BOT_USERNAME;
const oauthToken = process.env.OAUTH_TOKEN;
const channelName = process.env.CHANNEL_NAME;

// Define configuration options
const opts = {
    identity: {
        username: botUsername,
        password: oauthToken
    },
    channels: [channelName]
};
// Create a client with our options
const client = new tmi.client(opts);

// Called every time a message comes in
const onMessageHandler = (target, context, msg, self) => {
    if (self) { return; } // Ignore messages from the bot

    // Remove whitespace from chat message and split it in an array
    const message = msg.trim().split(' ');
    // Get command by shifting it from the array
    const commandName = msg.shift();

    // If the command is known, let's execute it
    if (commandName === '!play') {
        const result = sendCommandToDiscord();
        if (result) {
            client.say(target, `Tu canción fué agregada al playlist`);
            console.log(`* Executed ${commandName} command`);
        } else {
            client.say(target, `Oops! Algo ocurrió y tu canción no pudo ser
                agregada al Playlist`);
            console.log(`* Command ${commandName} failed`);
        }

    } else {
        client.say(target, `Comando desconocido, para conocer la lista de
            comandos escribe !help`);
        console.log(`* Unknown command ${commandName}`);
    }
}
// Function called when the "play" command is issued
const sendCommandToDiscord = () => {
    console.log('sendingCommand to Discord');
    return true;
}
// Called every time the bot connects to Twitch chat
const onConnectedHandler = (addr, port) => {
    console.log(`* Connected to ${addr}:${port}`);
}

// Register our event handlers (defined below)
client.on('message', onMessageHandler);
client.on('connected', onConnectedHandler);

// Connect to Twitch:
client.connect();

