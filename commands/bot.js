const Discord = require('discord.js');
function format(seconds){
  function pad(s){
      return (s < 10 ? '0' : '') + s;
  }
var hours = Math.floor(seconds / (60*60));
var minutes = Math.floor(seconds % (60*60) / 60);
var seconds = Math.floor(seconds % 60);
var days = Math.floor(hours / 24)

return pad(days) + 'd ' + pad(hours) + 'h ' + pad(minutes) + 'm ' + pad(seconds) + 's'
}

const config = require('../config.json')

const pak = require('../package.json')

exports.run = (client, message, args) => {

  const ram = process.memoryUsage().heapUsed / 1024 / 1024;

  let embed = new Discord.RichEmbed()
    .setColor([130, 160, 253])
    .setAuthor("Informações do Bot")
    .setDescription("Aruna bot, sua amiga")
    .addField("Servidores", ":desktop: " + client.guilds.size, true)
    .addField("Usuários", ":joystick: " + client.users.size, true)
    .addField("Canais", `:page_with_curl: ${client.channels.size - client.channels.filter(chn => chn.type === "dm").size}`, true)
    .addField("Uso de RAM", `:pager: ${Math.round(ram)} mb's usados`, true)
    .addField("Versão do Bot", `:satellite: ${pak.version}`, true)
    .addField("Prefixo Padrão", `${config.prefix}`,true)
    .addField(`Tempo Online`,`:clock12: ${format(process.uptime())}`,true)
    .addField(`Links Úteis`, "Coming Soon", true)
    .setFooter("Bot Criado pelo Lobo Metalúrgico", client.user.avatarURL)
    .setTimestamp();

  message.channel.send(embed);

}

module.exports.help = {
	name: "bot",
	aliases: ["botinfo"],
	description: "Lista as Principais informações do bot",
	usage: "",
	category: "Geral",
};