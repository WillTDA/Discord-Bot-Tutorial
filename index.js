const Discord = require("discord.js")
const paginate = require("discord.js-pagination")
const bot = new Discord.Client()
const musicClient = require("distube");
const distube = new musicClient(bot, {
    searchSongs: true,
    leaveOnFinish: true,
    leaveOnEmpty: true
});

const token = require("./config.json").token
const PREFIX = require("./config.json").prefix
console.log(apikey)

bot.on("ready", () => {
    console.log("Bot is Online!")
})

distube.on("searchResult", (message, result) => {
    let i = 0;
    message.channel.send(`**Choose an option from below**\n${result.map(song => `**${++i}**. ${song.name} - \`${song.formattedDuration}\``).join("\n")}\n*Enter anything else or wait 60 seconds to cancel*`);
})

distube.on("playSong", (message, queue, song) => message.channel.send(`started playing ${song.name}`))

distube.on("initQueue", queue => {
    queue.autoplay = false
})

bot.on("message", async message => {

    let args = message.content.substring(PREFIX.length).split(" ")
    let voiceChannel = message.member.voice.channel

    if (message.content.startsWith(`${PREFIX}ping`)) {
        message.channel.send("pong!")
    }
    else if (message.content.startsWith(`${PREFIX}help`)) {
        const help1 = new Discord.MessageEmbed()
            .setTitle("Help Menu One")
            .setDescription("This is help menu one!")
            .setColor("RED")

        const help2 = new Discord.MessageEmbed()
            .setTitle("Help Menu Two")
            .setDescription("This is help menu two!")
            .setColor("RED")

        const help3 = new Discord.MessageEmbed()
            .setTitle("Help Menu Three")
            .setDescription("This is help menu three!")
            .setColor("RED")

        const help4 = new Discord.MessageEmbed()
            .setTitle("Help Menu Four")
            .setDescription("This is help menu four!")
            .setColor("RED")

        let pages = [
            help1,
            help2,
            help3,
            help4
        ]

        let emojis = [
            "⏪",
            "⏩"
        ]

        paginate(message, pages, emojis, 60000)
    }

    if (message.content.startsWith(`${PREFIX}play`)) {
        if (!voiceChannel) return message.channel.send("please join a voice channel!")
        if (!args[1]) return message.channel.send("what song do you want to play?")
        await distube.play(message, args.slice(1).join(" "))
    }
    if (message.content.startsWith(`${PREFIX}stop`)) {
        if (!voiceChannel) return message.channel.send("please join a voice channel!")
        distube.stop(message)
        message.channel.send("stopped the music!")
    }
})



bot.login(token)