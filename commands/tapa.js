const Discord = require("discord.js");
const superagent = require("superagent");

exports.run = async (client, message, args) => {

    let slapUser = message.guild.member(message.mentions.users.first() || message.guild.members.get(args[0]));
    if(!slapUser) return message.reply("Mencione alguém para dar um tapa");
    if(message.mentions.users.first().username == message.author.username) return message.reply("Você não pode bater em si mesmo.\nAo menos, não com esse comando...")

    const {body} = await superagent
    .get(`https://nekos.life/api/v2/img/slap`);

    let slapEmbed = new Discord.RichEmbed()
    .setDescription(`**${message.author.username}** Deu um tapa em **${message.mentions.users.first().username}**. Isso deve ter doido...`)
    .setImage(body.url)
    .setColor("0x36393e")
    .setFooter(`Tapa dado por ${message.author.username}`, message.author.displayAvatarURL)

    message.channel.send(slapEmbed)

}