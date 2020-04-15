const Discord = require("discord.js");
const emoji = require("../utils/emojis.js");

exports.run = async (aruna, message) => {
  let embed = new Discord.RichEmbed()
    .setAuthor(`${aruna.user.username}`, `${aruna.user.displayAvatarURL}`)
    .setColor("#f5ebeb")
    .setDescription(`Calculando...`);

  message.channel.send(embed).then(async msg => {
    let latencia = Math.round(message.createdTimestamp);
    let api = Math.round(aruna.ping);
    //let heartbeat = Date.now() - message.createdTimestamp;
    let embed2 = new Discord.RichEmbed().setColor("#33def5")
      .setDescription(`:hourglass: | Tempo de resposta: **${msg.createdTimestamp - message.createdTimestamp}** ms
      :satellite: | Api: **${api}** ms`);
    msg.edit(embed2);
  });
};
exports.config = {
  name: "ping",
  aliases: ["pong"],
  category: `${emoji.robot} Utilidades`
};
