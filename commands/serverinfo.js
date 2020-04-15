const Discord = require("discord.js");

const status = {
  online: "<:online:637026750408294460> Online",
  idle: "<:idle:637026749540204586> Ausente",
  dnd: "<:dnd:637026749401530369> Não Pertube",
  offline: "<:offline:637026750295048223> Offline"
};

exports.run = (client, message, args) => {
  var region = message.guild.region;

  if (region === "brazil") region = `:flag_br: Brasil`;

  let embed = new Discord.RichEmbed()
    .setColor([130, 160, 200])
    .setAuthor(`${message.guild.name}`)
    .setThumbnail(
      `https://cdn.discordapp.com/icons/${message.guild.id}/${message.guild.icon}.png`
    )
    .addField(":computer: ID da Guild", message.guild.id, true)
    .addField(":crown: Dono", `${message.guild.owner}`, true)
    .addField(":earth_americas: Região", `${region}`, true)
    .addField(
      `:speech_balloon: Canais (${message.guild.channels.filter(
        chn => chn.type === "text"
      ).size +
        message.guild.channels.filter(chn => chn.type === "voice").size})`,
      `:pencil: **Texto: ${
        message.guild.channels.filter(chn => chn.type === "text").size
      }** \n :speaking_head: **Voz: ${
        message.guild.channels.filter(chn => chn.type === "voice").size
      }**`,
      false
    )
    .addField(
      `:busts_in_silhouette: Membros (${message.guild.members.size})`,
      `${status["online"]}: ${
        message.guild.members.filter(m => m.presence.status === "online").size
      }|${status["idle"]}: ${
        message.guild.members.filter(m => m.presence.status === "away").size
      }|${status["dnd"]}: ${
        message.guild.members.filter(m => m.presence.status === "dnd").size
      }|${status["offline"]}: ${
        message.guild.members.filter(m => m.presence.status === "offline").size
      }\n 
    :raising_hand: Pessoas: ${
      message.guild.members.filter(m => !m.user.bot).size
    }\n 
    :robot: Bots: ${message.guild.members.filter(m => m.user.bot).size}`,
      false
    )
    .setFooter("Bot Criado pelo Lobo Metalúrgico", client.user.avatarURL)
    .setTimestamp();

  message.reply(embed);
};
