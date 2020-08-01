require('dotenv').config(); // Remove later when app runs from index.js
const Discord = require('discord.js');
const Player = require('../player/player');
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

const soultrainPlayer = new Player();

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

    // Join Channel
    if (commandName === (commandPrefix + JOIN)) {
        // Only try to join the sender's voice channel if they are in one themselves
        if (message.member.voice.channel) {
            connection = await message.member.voice.channel.join();
            message.channel.send('Que comience la fiesta!');

            // Set Connection to SoultrainPlayer
            soultrainPlayer.setConnection(connection);
        }
    }

    // Leave Channel
    if (commandName === (commandPrefix + LEAVE)) {
        if (message.member.voice.channel) {
            await message.member.voice.channel.leave();
        }
    }

    // Play music
    if (commandName === (commandPrefix + PLAY)) {
        if (soultrainPlayer.getConnection()) {
            if (message.member.voice.channel) {
                const song = { 
                    title: "Song's name",
                    song: content,
                    requested_by: message.member.nickname
                };

                player.addToPlaylist(song);
                player.play();
            } else {
                message.reply('You need to join a voice channel first!');
            }
        } else {
            message.reply(
                `Para que Soultrain comience la fiesta, primero debes invitarlo :). Usa ${commandPrefix + JOIN} para comenzar`
            );
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
