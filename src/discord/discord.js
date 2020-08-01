require('dotenv').config(); // Remove later when app runs from index.js
const Discord = require('discord.js');
const { Player } = require("discord-player");
const { commandPrefix } = require('./config.json');
const {
    JOIN,
    LEAVE,
    STOP,
    PLAY,
    GET_QUEUE,
    SKIP,
    PAUSE,
    RESUME
} = require('./constants');

// Instantiate Discord Client
const client = new Discord.Client();

// Instantiate Discord Player
const player = new Player(client);
client.player = player;

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
            if (message.member.voice.channel) {
                let trackPlaying = client.player.isPlaying(message.guild.id);
                // If there's already a track being played
                if(trackPlaying){
                    const result = await client.player.addToQueue(
                        message.guild.id, content, message.member.user.tag
                    );
                    if(result.type === 'playlist'){
                        message.channel.send(
                            `${result.tracks.length} canciones agregadas al Playlist`
                        );
                    } else {
                        message.channel.send(
                            `${result.name} agregada al Playlist`
                        );
                    }
                } else {
                    // Else, play the track
                    const result = await client.player.play(
                        message.member.voice.channel, content, message.member.user.tag
                    );
                    if(result.type === 'playlist') {
                        message.channel.send(
                            `${result.tracks.length} canciones agregadas a la lista!\nAhora sonando: **${result.tracks[0].name}**...`
                        );
                    } else {
                        message.channel.send(
                            `Reproduciendo ${result.name}, agregado por ${result.requestedBy}`
                        );
                    }
                }

            } else {
                message.reply('You need to join a voice channel first!');
            }
        } else {
            message.channel.send('Para que comience la fiesta, primero debes invitarme. Escribe $join para comenzar');
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

    // Get queue
    if (commandName === (commandPrefix + GET_QUEUE)) {
        if (message.member.voice.channel) {
            const queue = await client.player.getQueue(message.guild.id);
            const currentTrack = await client.player.nowPlaying(message.guild.id);

            message.channel.send(
                `Ahora sonando - ${currentTrack.name} | ${currentTrack.author}\n` +
                'Playlist:\n' +
                (queue.tracks.map((track, i) => {
                     return `#${i+1} - ${track.name} | ${track.author}`;
                }).join('\n'))
            );
        } else {
            message.reply('You need to join a voice channel first!');
        }
    }

    // Skip Song
    if (commandName === (commandPrefix + SKIP)) {
        if (message.member.voice.channel) {
            const track = await client.player.skip(message.guild.id);
            message.channel.send(`${track.name} saltada!`);
        } else {
            message.reply('You need to join a voice channel first!');
        }
    }

    // Pause
    if (commandName === (commandPrefix + PAUSE)) {
        if (message.member.voice.channel) {
            const track = await client.player.pause(message.guild.id);
            message.channel.send(`${track.name} pausada!`);
        } else {
            message.reply('You need to join a voice channel first!');
        }
    }

    // Resume
    if (commandName === (commandPrefix + RESUME)) {
        if (message.member.voice.channel) {
            const track = await client.player.resume(message.guild.id);
            message.channel.send(`${track.name} resumiendo!`);
        } else {
            message.reply('You need to join a voice channel first!');
        }
    }
});

client.login(token);
