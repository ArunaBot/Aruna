const Discord = require("discord.js");
const superagent = require("superagent");

exports.run = async (client, message, args) => {

    let kissUser = message.guild.member(message.mentions.users.first() || message.guild.members.get(args[0]));
    if(!kissUser) return message.reply("Mencione alguém para dar um beijo");
    if(message.mentions.users.first().username == message.author.username) return message.reply("Você não pode se beijar.\nA menos que use um espelho...")

    const {body} = await superagent
    .get(`https://nekos.life/api/v2/img/kiss`);

    let kissEmbed = new Discord.RichEmbed()
    .setDescription(`**${message.author.username}** Deu um beijo em **${message.mentions.users.first().username}**`)
    .setImage(body.url)
    .setColor("0x36393e")
    .setFooter(`Beijo dado por ${message.author.username}`, message.author.displayAvatarURL)
    .setTimestamp()

    message.channel.send(kissEmbed)

}