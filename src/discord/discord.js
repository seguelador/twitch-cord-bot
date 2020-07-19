require('dotenv').config(); // Remove later
const Discord = require('discord.js');
const ytdl = require('ytdl-core-discord');
const client = new Discord.Client();

const token = process.env.DISCORD_BOT_TOKEN;
console.log(token);

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

    if (commandName === '$join') {
        // Only try to join the sender's voice channel if they are in one themselves
        if (message.member.voice.channel) {
            connection = await message.member.voice.channel.join();
        } else {
            message.reply('You need to join a voice channel first!');
        }
    }

    if (commandName === '$leave') {
        if (message.member.voice.channel) {
           await message.member.voice.channel.leave();
        } else {
            message.reply('You need to join a voice channel first!');
        }
    }

    // Play music
    if (commandName === '$play' || commandName === '$p') {
        if (message.member.voice.channel) {
            connection.play(await ytdl(content), { type: 'opus' });
        } else {
            message.reply('You need to join a voice channel first!');
        }
    }
});

client.login(token);
