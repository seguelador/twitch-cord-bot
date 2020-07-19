require('dotenv').config(); // Remove later when app runs from index.js
const Discord = require('discord.js');
const ytdl = require('ytdl-core-discord');
const { commandPrefix } = require('./config.json');
const {
    JOIN,
    LEAVE,
    STOP,
    PLAY,
    PAUSE
} = require('./constants');


const client = new Discord.Client();

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
        } else {
            message.reply('You need to join a voice channel first!');
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
        if (message.member.voice.channel) {
            connection.play(await ytdl(content), { type: 'opus' });
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

    // Pause music
    if (commandName === (commandPrefix + PAUSE)) {
        if (message.member.voice.channel) {
            connection.end();
        } else {
            message.reply('You need to join a voice channel first!');
        }
    }
    console.log(connection.player);
});

client.login(token);
