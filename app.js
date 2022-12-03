const fs = require("fs")
require("dotenv").config()
const { EmbedBuilder, Client, GatewayIntentBits, SlashCommandBuilder, discordSort, MembershipScreeningFieldType } = require('discord.js');
const moment = require('moment')

// Initialize discord bot
const bot = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildPresences,
    ]
});

// Print to console when online
bot.on('ready', () => {
    console.log('This bot is online!');
});

setInterval(updateFollowers, 1000*60*30) // fire every half hour

function updateFollowers() {
    let current_hour = moment().format()
    if (parseInt(current_hour.slice(11,13)) === 1) {
        fs.readFile('./followObject.json', {encoding: 'utf-8'}, function(err, data) {
            let file = JSON.parse(data);
            for (let i = 0; i < file['users'].length; i++){
                let date = moment().format();
                let current_day = parseInt(date.slice(8,10))
                let current_month = parseInt(date.slice(5,7))
                let current_year = parseInt(date.slice(0,4))
                console.log(current_day, current_month, current_year, current_hour)
                if (current_day < 4 && current_month === 10 && current_year === 2022) {
                    let octoberDays = 3 - current_day
                    let person = bot.users.cache.get(file['users'][i]);
                    person.send(`${octoberDays} days left until overwatch 2... :sunglasses: :eyes:`);
                }
                else if (current_month === 9 && current_year === 2022) {
                    let remainingDays = 31 - current_day + 3
                    console.log('october_registered')
                    //console.log(bot.users.cache.get(file['users'][i]))
                    let person = bot.users.cache.get(file['users'][i]);
                    person.send(`${remainingDays} days left until overwatch 2... :sunglasses: :eyes:`);
                }
            }
        })
    }
}

// run every hour
setInterval(findOneUserPresence, 1000*60*60)

async function findOneUserPresence() {
    // get server
    const guild = await bot.guilds.cache.get(process.env.SERVER_ID).members.cache

    // get list of online users
    // three settings here: online, idle, dnd
    const onlineUsersList = guild.filter((online) => online.presence?.status === 'online')

    // check if specific username is in list
    const specificUserStatus = onlineUsersList.filter((member) => member.user.username === process.env.SPECIFIC_USERNAME)

    // if they exists, post to channel
    if (specificUserStatus.size === 1) {
        const channel = bot.channels.cache.find(channel => channel.id === process.env.CHANNEL_ID)
        channel.send(`${process.env.SPECIFIC_USERNAME} is online!`)
    }
}

// Send message when someone types 'when!' or 'news!'
bot.on('messageCreate', message => {
    //console.log(message.content.toString())
    if (message.content === "!follow") {
        //console.log(message.author);
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
        let current_day = parseInt(date.slice(8,10))
        let current_month = parseInt(date.slice(5,7))
        let current_year = parseInt(date.slice(0,4))
        let current_hour = parseInt(date.slice(11,13))
        let current_minutes = parseInt(date.slice(14,16))
        //console.log(current_day, current_month, current_year, current_hour, date)
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

bot.login(process.env.TOKEN);