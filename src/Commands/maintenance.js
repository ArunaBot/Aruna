/* eslint-disable no-unused-vars */
const Discord = require('discord.js');
const { database, config } = require('../../Configs');

exports.run = (aruna, message, args) => {
  const user = database.Users.findOne({ _id: message.author.id });

  const errored = new Discord.RichEmbed()
    .setAuthor(`Oops, ${message.author.username}`, message.author.avatarURL)
    .setDescription('Você não tem permissão para executar esse comando!')
    .setFooter(`Algo deu errado, ${message.author.username}`);
    
  if (user.SUPER !== true) return message.channel.send(errored);
};

exports.config = {
  name: 'manutenção',
  aliases: [],
  category: '🧰 Administração'
};