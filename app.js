// token: MTAyMjY1NzQxOTkzNzA2MjkxMg.GTejNm.WX299B-X3mAk2jAt5QIS8yXPFM5aLwkj2NxxFA
// client id: 1022657419937062912
// `https://www.googleapis.com/customsearch/v1?key=AIzaSyA7GRPCFbW788AkDMKWeXi_Ar1pU0pas-w&cx=12b24cf7d9fde4174:omuauf_lfve&q=overwatch`;
const fs = require("fs")
const Discord = require('discord.io');
const { EmbedBuilder, Client, GatewayIntentBits, SlashCommandBuilder } = require('discord.js');
const token = "MTAyMjY1NzQxOTkzNzA2MjkxMg.GTejNm.WX299B-X3mAk2jAt5QIS8yXPFM5aLwkj2NxxFA";
const moment = require('moment')

// Initialize discord bot
const bot = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

// Print to console when online
bot.on('ready', () => {
    console.log('This bot is online!');
});

setInterval(updateFollowers, 1000) // fire every half hour

function updateFollowers() {
    let current_hour = moment().format()
    if (parseInt(current_hour.slice(11,13)) === 0) {
        fs.readFile('./followObject.json', {encoding: 'utf-8'}, function(err, data) {
            let file = JSON.parse(data);
            for (let i = 0; i < file['users'].length; i++){
                let date = moment().format();
                let current_day = parseInt(date.slice(8,10))
                let current_month = parseInt(date.slice(6,8))
                let current_year = parseInt(date.slice(0,4))
                console.log(current_day, current_month, current_year, current_hour)
                if (current_day < 4 && current_month === 10 && current_year === 2022) {
                    let octoberDays = 3 - current_day
                    let person = bot.users.cache.get(file['users'][i]);
                    person.send(`${octoberDays} days left until overwatch 2... :sunglasses: :eyes:`);
                }
                else if (current_month === 9 && current_year === 2022) {
                    let remainingDays = 31 - current_day + 3
                    console.log(bot.users.cache.get(file['users'][i]))
                    let person = bot.users.cache.get(file['users'][i]);
                    person.send(`${remainingDays} days left until overwatch 2... :sunglasses: :eyes:`);
                }
            }
        })
    }
}

// Send message when someone types 'when!' or 'news!'
bot.on('messageCreate', message => {
    console.log(message.content.toString())
    if (message.content === "!follow") {
        console.log(message.author);
        fs.readFile('./followObject.json', {encoding: 'utf-8'}, function(err, data) {
            let file = JSON.parse(data);
            for (let x = 0; x < file['users'].length; x++) {
                // Don't add to list if they're already there
                if (file['users'][x] === message.author.id) {
                    console.log('this user is already in the list')
                    return;
                }
            }
            file['users'].push(message.author.id);
            data = JSON.stringify(file)
            
            fs.writeFile('./followObject.json', data, function(err) {
                if(err) {return console.error(err)}
                console.log('done')
            })
        })
        message.author.send("Hello! You've subscribed for notifications regarding overwatch 2 release date");
    }
    if (message.content === "!when") {
        let date = moment().format();
        let current_day = parseInt(date.slice(9,11))
        let current_month = parseInt(date.slice(7,9))
        let current_year = parseInt(date.slice(0,4))
        let current_hour = parseInt(date.slice(11,13))
        let current_minutes = parseInt(date.slice(14,16))
        console.log(current_day, current_month, current_year, current_hour, date)
        if (current_day < 4 && current_month === 10 && current_year === 2022) {
            let remainingDays = 3 - current_day
            let remainingHours = 24 - current_hour - 1
            let remainingMinutes = 60 - current_minutes
            if (remainingMinutes === 60) {
                remainingHours += 1;
                message.reply(`${remainingDays} days and ${remainingHours} hours left until overwatch 2... :eyes:`)
            }
            else {
                message.reply(`${remainingDays} days ${remainingHours} hours and ${remainingMinutes} minutes left until overwatch 2... :eyes:`)
            }        
        }
        else if (current_month === 9 && current_year === 2022) {
            let remainingDays = 31 - current_day + 2
            let remainingHours = 24 - current_hour - 1
            let remainingMinutes = 60 - current_minutes
            if (remainingMinutes === 60) {
                if (remainingHours === 24) {
                    remainingDays += 1
                    message.reply(`${remainingDays} days left until overwatch 2... :eyes:`)
                }
                else {
                    remainingHours += 1;
                    message.reply(`${remainingDays} days ${remainingHours} hours left until overwatch 2... :eyes:`)
                }
            }
            else {
                message.reply(`${remainingDays} days ${remainingHours} hours and ${remainingMinutes} minutes left until overwatch 2... :eyes:`)
            }
        }
        else {
            message.reply(`What are you doing typing? Overwatch 2 is out! :confetti_ball:`)
        }
    }
    else{
        return;
    }
})

bot.login("MTAyMjY1NzQxOTkzNzA2MjkxMg.GTejNm.WX299B-X3mAk2jAt5QIS8yXPFM5aLwkj2NxxFA");