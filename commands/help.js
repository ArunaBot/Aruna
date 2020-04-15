const Discord = require('discord.js');
const config = require("../config.json")
const db = require('quick.db')

exports.run = async (client, message, args) => {
  
  const guild = message.guild

  var prefix = await db.fetch(`prefix_${guild.id}`);
  
  if (prefix === null) {
    prefix = config.prefix
  }
  
  else if (prefix === "default" || prefix === "Default") {
    prefix = config.prefix
  }
  
    let embed = new Discord.RichEmbed()
    .setColor([3, 160, 11])
    .setAuthor(`Exibindo comandos para a guild ${message.guild.name}`)
    .setDescription(`Conheça agora mesmos meus comandos. Eles estão logo aí em baixo.`)
    .addField(`${prefix}prefix`, `Altera ou exibe meu prefixo na guild.`, false)
    .addField(`${prefix}help`, `Lista os Comandos do Bot.`, false)
    .addField(`${prefix}rank`, `Exibe seu Ranking.`, false)
    .addField(`${prefix}ping`, `Lista o ping do bot e da API.`, false)
    .addField(`${prefix}kick`, `Kicka um usuário do servidor.`, false)
    .addField(`${prefix}clear`, `Limpa até 100 mensagens de uma vez.`, false)
    .addField(`${prefix}bot`, `lista as informações do bot.`, false)
    .addField(`${prefix}ban`, `Bani um usuário do servidor.`, false)
    .addField(`${prefix}say`, `O bot fala algo por você.`, false)
    .addField(`${prefix}calc`, `Faça contas pelo discord.`, false)
    .addField(`${prefix}flip`, `Gira a moeda no Cara ou Coroa.`, false)
    .addField(`${prefix}ship`, `Será que temos um casal?`, false)
    .addField(`${prefix}kiss`, `Beije um outro usuário <3`, false)
    .addField(`${prefix}tapa`, `Bata em algum usuário que incomoda!`, false)
    .addField(`${prefix}ticket`, `Crie um Ticket para falar com o Suporte.`, false)
    .addField(`${prefix}close`, `Fecha um ticket próprio e aberto.`, false)
    .addField(`${prefix}avatar`, `Mostra seu avatar ou de outro user.`, false)
    .addField(`${prefix}userinfo`, `Lista as informações de um usuário.`, false)
    .addField(`${prefix}play`, `Toca uma música no seu servidor.`, false)
    .addField(`${prefix}skip`, `Pula a música atual da queue.`, false)
    .addField(`${prefix}stop`, `Para uma música que está tocando em seu servidor.`, false)
    .addField(`${prefix}serverinfo`, `Verifica as informações do servidor em que está.`, false)
    .setFooter(`Criada pelo Lobo Metalúrgico e Splored`, client.user.avatarURL)
    .setTimestamp();

  message.author.send(embed);
  message.reply(`Enviei os comandos em seu privado :)`)
  };