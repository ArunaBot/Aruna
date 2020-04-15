/*
    This File is part of ArunaBot
    Copyright (C) LoboMetalurgico (and contributors) 2019-2020

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU Affero General Public License as
    published by the Free Software Foundation, either version 3 of the
    License, or (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU Affero General Public License for more details.

    You should have received a copy of the GNU Affero General Public License
    along with this program.  If not, see <https://www.gnu.org/licenses/>.
*/

function verify(messages, args, message) {
  if (args[0] == messages.size)
    return (
      "Foram deletadas `" +
      messages.size +
      "` mensagens por " +
      `<@${message.author.id}>`
    );
  else
    return (
      `<@${message.author.id}> deletou apenas \`${messages.size}\`` +
      " mensagens das " +
      `\`${args[0]} requisitadas\`` +
      " por não existirem outras ou serem mais antigas que 2 semanas."
    );
}

const Discord = require('discord.js')

exports.run = async (client, message, args) => {
  
  const error1 = new Discord.RichEmbed()
    .setAuthor(`Oops, ${message.author.username}`, message.author.avatarURL)
    .setFooter(`Algo deu errado, ${message.author.username}`)
    .setDescription(`Você não possui a permissão de \`Gerenciar Mensagens\`!`)
    .setTimestamp();
  
  const error2 = new Discord.RichEmbed()
    .setAuthor(`Oops, ${message.author.username}`, message.author.avatarURL)
    .setFooter(`Algo deu errado, ${message.author.username}`)
    .setDescription(`Eu não possuo a permissão de \`Gerenciar Mensagens\`!`)
    .setTimestamp();
  
  const error3 = new Discord.RichEmbed()
    .setAuthor(`Oops, ${message.author.username}`, message.author.avatarURL)
    .setFooter(`Algo deu errado, ${message.author.username}`)
    .setDescription(`Você deve inserir a quantidade de mensagens a ser apagada!`)
    .setTimestamp();
  
  const error4 = new Discord.RichEmbed()
    .setAuthor(`Oops, ${message.author.username}`, message.author.avatarURL)
    .setFooter(`Algo deu errado, ${message.author.username}`)
    .setDescription(`Eu só posso apagar entre 2 e 100 mensagens.`)
    .setTimestamp();
  
  if (
    !message.guild.members.get(client.user.id).hasPermission("MANAGE_MESSAGES")
  )
    return message.channel.send(error2)
  if (!message.member.hasPermission("MANAGE_MESSAGES"))
    return message.channel.send(error1)
  if (!args[0])
    return message.channel.send(error3)
  if (args[0] > 100 || args[0] <= 1)
    return message.channel.send(error4)
  
  await message.delete();
  await message.channel.bulkDelete(args[0]).then(messages => {
    message.channel
      .send(verify(messages, args, message))
      .then(msg => msg.delete(10000));
  });
};
exports.config = {
  name: "clear",
  aliases: [],
  category: `👮‍♂️ Moderação`
};
