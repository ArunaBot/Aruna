/*
    This File is part of ArunaBot
    Copyright (C) LoboMetalurgico 2019-2020

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
  
  let kuser = message.guild.member(
    message.mentions.users.first() || message.guild.members.get(args[0])
  );
  
  const error1 = new Discord.RichEmbed()
    .setAuthor(`Oops, ${message.author.username}`, message.author.avatarURL)
    .setFooter(`Algo deu errado, ${message.author.username}`)
    .setDescription(`Você não possui a permissão de \`Kickar Membros\`!`)
    .setTimestamp();
  
  const error2 = new Discord.RichEmbed()
    .setAuthor(`Oops, ${message.author.username}`, message.author.avatarURL)
    .setFooter(`Algo deu errado, ${message.author.username}`)
    .setDescription(`Eu não possuo a permissão de \`Kickar Membros\`!`)
    .setTimestamp();
  
  const error3 = new Discord.RichEmbed()
    .setAuthor(`Oops, ${message.author.username}`, message.author.avatarURL)
    .setFooter(`Algo deu errado, ${message.author.username}`)
    .setDescription(`Você deve inserir um usuário para ser punido!`)
    .setTimestamp();
  const error4 = new Discord.RichEmbed()
    .setAuthor(`Oops, ${message.author.username}`, message.author.avatarURL)
    .setFooter(`Algo deu errado, ${message.author.username}`)
    .setDescription(`Você não pode kickar ${kuser.user.username} pois este é o(a) dono(a) do servidor!`)
    .setTimestamp();
  const error5 = new Discord.RichEmbed()
    .setAuthor(`Oops, ${message.author.username}`, message.author.avatarURL)
    .setFooter(`Algo deu errado, ${message.author.username}`)
    .setDescription(`Você não pode kickar este usuário pois seu cargo é igual ou inferior ao de ${kuser.user.username}.`)
    .setTimestamp();
  const error6 = new Discord.RichEmbed()
    .setAuthor(`Oops, ${message.author.username}`, message.author.avatarURL)
    .setFooter(`Algo deu errado, ${message.author.username}`)
    .setDescription(`Eu não posso kickar este usuário pois meu cargo é igual ou inferior ao de ${kuser.user.username}`)
    .setTimestamp();
  
  if (!message.member.hasPermission("KICK_MEMBERS"))
    return message.channel.send(error1)
  if (!message.guild.members.get(aruna.user.id).hasPermission("KICK_MEMBERS"))
    return message.channel.send(error2)
  
  if (!kuser) return message.channel.send(error3);
  
  if(message.guild.owner.id == kuser.user.id)
    return message.channel.send(error4)
  if (kuser.highestRole.position >= message.guild.members.get(message.author.id).highestRole.position && message.guild.owner.id !== message.author.id)
    return message.channel.send(error6);
  if (kuser.highestRole.position >= message.guild.members.get(aruna.user.id).highestRole.position)
    return message.channel.send(error5);

  if (args.join(" ").slice(22) == undefined) {
    var kreason = `Punido por: ${message.author.username}`;
  } else if (args.join(" ").slice(22) == false) {
    var kreason = `Punido por: ${message.author.username}`;
  } else if (args.join(" ").slice(22) == null) {
    var kreason = `Punido por: ${message.author.username}`;
  } else if (args.join(" ").slice(22) == "") {
    var kreason = `Punido por: ${message.author.username}`;
  } else {
    var kreason =
      `Punido por: ${message.author.username} Com o Motivo: ` +
      args.join(" ").slice(22);
  }

  let embed = new Discord.RichEmbed()
    .setAuthor("Kick Efetuado!")
    .setDescription(`Kick efetuado por ${message.author.username}`)
    .addField("Usuário kickado: ", `${kuser} id ${kuser.id}`, false)
    .addField("Kickado por: ", `<@${message.author.id}>`, false)
    .addField("Data do kick: ", message.createdAt, false)
    .addField("Motivo: ", `${kreason}`, false)
    .setTimestamp();

  message.channel.send(embed);
  message.guild.member(kuser).kick(kreason);
};

exports.config = {
  name: "kick",
  aliases: ["kickar"],
  category: `👮‍♂️ Moderação`
};