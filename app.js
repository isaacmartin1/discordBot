// token: MTAyMjY1NzQxOTkzNzA2MjkxMg.GTejNm.WX299B-X3mAk2jAt5QIS8yXPFM5aLwkj2NxxFA
// client id: 1022657419937062912

const { Client, GatewayIntentBits } = require('discord.js');
const token = "MTAyMjY1NzQxOTkzNzA2MjkxMg.GTejNm.WX299B-X3mAk2jAt5QIS8yXPFM5aLwkj2NxxFA"

// Initialize discord bot
const bot = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages
    ]
});

// Print to console when online
bot.on('ready', () => {
    console.log('This bot is online!')
});

// Send message when someone types 'when!'
bot.on('message', message => {
    if (message.substring(0, 1) == '!') {
        var args = message.substring(1).split(' ');
        var cmd = args[0];

        args = args.splice(1);
        if (cmd === 'when') {
            bot.sendMessage({
                to: 812873174382411790,
                message: '13 days to overwatch 2!'
            })
        }
    }
});

bot.login("MTAyMjY1NzQxOTkzNzA2MjkxMg.GTejNm.WX299B-X3mAk2jAt5QIS8yXPFM5aLwkj2NxxFA")
