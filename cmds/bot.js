const Discord = require("discord.js");
function format(seconds) {
  function pad(s) {
    return (s < 10 ? "0" : "") + s;
  }
  var hours = Math.floor(seconds / (60 * 60));
  var minutes = Math.floor((seconds % (60 * 60)) / 60);
  var seconds = Math.floor(seconds % 60);
  var days = Math.floor(hours / 24);

  return (
    pad(days) +
    "d " +
    pad(hours) +
    "h " +
    pad(minutes) +
    "m " +
    pad(seconds) +
    "s"
  );
}

const config = require("../configs/cf.js");

const pak = require("../package.json");

const emoji = require("../utils/emojis.js");

exports.run = (aruna, message, args, prefix) => {
  let user = message.guild.member(aruna.user);

  let name = user.nickname !== null ? user.nickname : aruna.user.username;

  let embed = new Discord.RichEmbed()
    .setAuthor(aruna.user.username, `${aruna.user.avatarURL}`)
    .addField(`(${emoji.robot}) Nome na Guild`, `**${name}**`, true)
    .addField(`(📡) Versão`, `**${pak.version}**`, true)
    .addField(`(🏓) Ping`, `**${Math.round(aruna.ping)}** ms`, true)
    .addField(`(📃) Canais`, `**${aruna.channels.size}**`, true)
    .addField(`(🖥️) Servidores`, `**${aruna.guilds.size}**`, true)
    .addField(`(🕹️) Usuários`, `**${aruna.users.size}**`, true)
  .addField(`Convite`, `**[Link](https://discordapp.com/api/oauth2/authorize?client_id=593303574725787657&permissions=37604422&scope=bot)**`, true)
  .addField(`Meu Site`, `**Em Breve™️**`, true)
  .addField(`Servidor de Suporte`, `**[Link](https://discordapp.com/api/oauth2/authorize?client_id=593303574725787657&permissions=37604422&scope=bot)**`, true)
    .setThumbnail(`${aruna.user.displayAvatarURL}`);
  message.channel.send(embed);
};

exports.config = {
  name: "bot",
  aliases: ["botinfo"],
  description: "Lista as Principais informações do bot",
  category: `${emoji.robot} Utilidades`
};
