require('dotenv').config(); // Remove later when app runs from index.js
const Discord = require('discord.js');
const { Player } = require("discord-player");
const { commandPrefix } = require('./config.json');
const {
    JOIN,
    LEAVE,
    STOP,
    PLAY,
    PAUSE
} = require('./constants');

// Instantiate Discord Client
const client = new Discord.Client();

// Instantiate Discord Player
const player = new Player(client);

const token = process.env.DISCORD_BOT_TOKEN;

// VoiceConnection to be use in every command
let connection = null;

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', async (message) => {
    // Remove whitespace from chat message and split it in an array
    const arrMessage = message.content.trim().split(' ');
    // Get command by shifting it from the array
    const commandName = arrMessage.shift();
    // Get content of the message (after command)
    const content = arrMessage.join(' ');

    // Voice only works in guilds, if the message does not come from a guild,
    // we ignore it
    if (!message.guild) return;

    if (commandName === (commandPrefix + JOIN)) {
        // Only try to join the sender's voice channel if they are in one themselves
        if (message.member.voice.channel) {
            connection = await message.member.voice.channel.join();
            message.channel.send('Que comience la fiesta!');
        } else {
            message.reply('Necesitas unirte a un canal de voz primero');
        }
    }

    if (commandName === (commandPrefix + LEAVE)) {
        if (message.member.voice.channel) {
           await message.member.voice.channel.leave();
        } else {
            message.reply('You need to join a voice channel first!');
        }
    }

    // Play music
    if (commandName === (commandPrefix + PLAY)) {
        if (connection) {
        } else {
            message.channel.send('Para que comience la fiesta, primero debes invitarme. Escribe $join para comenzar');
        }
        if (message.member.voice.channel) {
            const result = await player.play(message.member.voice.channel, content, message.member.user.tag);
            console.log(result);
            if(result.type === 'playlist'){
                message.channel.send(`${result.tracks.length} canciones agregadas a la lista!\nAhora sonando: **${result.tracks[0].name}**...`);
            } else {
                message.channel.send(`Reproduciendo ${result.name}, agregado por ${result.requestedBy}`);
            }
        } else {
            message.reply('You need to join a voice channel first!');
        }
    }

    // Stop music
    if (commandName === (commandPrefix + STOP)) {
        if (message.member.voice.channel) {
           await message.member.voice.channel.leave();
        } else {
            message.reply('You need to join a voice channel first!');
        }
    }
});

client.login(token);
