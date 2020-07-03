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

const Discord = require("discord.js");

exports.run = async (aruna, message, args) => {
  
  let buser = await aruna.fetchUser(message.mentions.users.first() || args[0]);
  
  const error1 = new Discord.RichEmbed()
    .setAuthor(`Oops, ${message.author.username}`, message.author.avatarURL)
    .setFooter(`Algo deu errado, ${message.author.username}`)
    .setDescription(`Você não possui a permissão de \`Banir Membros\`!`)
    .setTimestamp();
  
  const error2 = new Discord.RichEmbed()
    .setAuthor(`Oops, ${message.author.username}`, message.author.avatarURL)
    .setFooter(`Algo deu errado, ${message.author.username}`)
    .setDescription(`Eu não possuo a permissão de \`Banir Membros\`!`)
    .setTimestamp();
  
  const error3 = new Discord.RichEmbed()
    .setAuthor(`Oops, ${message.author.username}`, message.author.avatarURL)
    .setFooter(`Algo deu errado, ${message.author.username}`)
    .setDescription(`Você deve inserir um usuário para ser punido!`)
    .setTimestamp();
  const error4 = new Discord.RichEmbed()
    .setAuthor(`Oops, ${message.author.username}`, message.author.avatarURL)
    .setFooter(`Algo deu errado, ${message.author.username}`)
    .setDescription(`Você não pode banir ${buser.username} pois este é o(a) dono(a) do servidor!`)
    .setTimestamp();
  const error5 = new Discord.RichEmbed()
    .setAuthor(`Oops, ${message.author.username}`, message.author.avatarURL)
    .setFooter(`Algo deu errado, ${message.author.username}`)
    .setDescription(`Você não pode banir este usuário pois seu cargo é igual ou inferior ao de ${buser.username}.`)
    .setTimestamp();
  const error6 = new Discord.RichEmbed()
    .setAuthor(`Oops, ${message.author.username}`, message.author.avatarURL)
    .setFooter(`Algo deu errado, ${message.author.username}`)
    .setDescription(`Eu não posso banir este usuário pois meu cargo é igual ou inferior ao de ${buser.username}`)
    .setTimestamp();
  const error7 = new Discord.RichEmbed()
    .setAuthor(`Oops, ${message.author.username}`, message.author.avatarURL)
    .setFooter(`Algo deu errado, ${message.author.username}`)
    .setDescription(`Infelizmente não sei informar qual o erro. Sinto muito ${message.author.username} :(`)
    .setTimestamp();
  
  if (!message.member.hasPermission("BAN_MEMBERS"))
    return message.channel.send(error1)
  if (!message.guild.members.get(aruna.user.id).hasPermission("BAN_MEMBERS"))
    return message.channel.send(error2)
  
  if (!buser) return message.channel.send(error3);
  
  const guildBuser = message.guild.member(
    message.mentions.users.first() || message.guild.members.get(args[0])
  );

  if(guildBuser) {
    if(message.guild.owner.id == buser.id)
      return message.channel.send(error4)
    if(guildBuser.highestRole.position >= message.guild.members.get(message.author.id).highestRole.position && message.guild.owner.id !== message.author.id)
      return message.channel.send(error5);
    if(guildBuser.highestRole.position >= message.guild.members.get(aruna.user.id).highestRole.position)
      return message.channel.send(error6);
  }
  
  if (!args.join(" ").slice(19)) {
    var reason = `Punido por: ${message.author.username}`;
  } else {
    var reason =
      `Punido por: ${message.author.username} com o Motivo: ` +
      args.join(" ").slice(19);
  }

  let embed = new Discord.RichEmbed()
    .setAuthor("Banimento Efetuado com Sucesso!")
    .setDescription(`Banimento efetuado por ${message.author.username}`)
    .addField("Usuário Banido: ", `${buser} id ${buser.id}`, false)
    .addField("Banido por: ", `<@${message.author.id}>`, false)
    .addField("Data do Banimento: ", message.createdAt, false)
    .addField("Motivo: ", `${reason}`, false)
    .setTimestamp();

    message.channel.send(embed).then(async msg => {
      await message.guild.ban(buser, reason).catch(err => {
          console.log(err)
          msg.edit(error7);
      })
  })
};

exports.config = {
  name: "banir",
  aliases: ["ban"],
  category: `👮‍♂️ Moderação`
};