const Discord = require('discord.js');
const ytdl = require('ytdl-core-discord');
const client = new Discord.Client();
const { token, prefix } = require('./config.json');

console.log('prefix', prefix);

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', async message => {
    // Voice only works in guilds, if the message does not come from a guild,
    // we ignore it
    if (!message.guild) return;

    if (message.content === `${prefix}tc-join`) {
        // Only try to join the sender's voice channel if they are in one themselves
        if (message.member.voice.channel) {
            const connection = await message.member.voice.channel.join();
            console.log('Connection', connection);
        } else {
            message.reply('You need to join a voice channel first!');
        }
    }

    if (message.content === `${prefix}tc-leave`) {
        if (message.member.voice.channel) {
            const connection = await message.member.voice.channel.leave();
        } else {
            message.reply('You need to join a voice channel first!');
        }
    }

    // Play music
    if (message.content === `${prefix}tc-play`) {
        if (message.member.voice.channel) {
            const connection = await message.member.voice.channel.join();
            connection.play(await ytdl('https://www.youtube.com/watch?v=XP_mZ0GMqgg'), { type: 'opus' });
        } else {
            message.reply('You need to join a voice channel first!');
        }
    }
});

client.login(token);
