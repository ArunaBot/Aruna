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
  
  let unbuser = await aruna.fetchUser(args[0]);
  
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
    .setDescription(`Você deve inserir o id do usuário que será desbanido!`)
    .setTimestamp();
  const error4 = new Discord.RichEmbed()
    .setAuthor(`Oops, ${message.author.username}`, message.author.avatarURL)
    .setFooter(`Algo deu errado, ${message.author.username}`)
    .setDescription(`Infelizmente não sei informar qual o erro. Sinto muito ${message.author.username} :(`)
    .setTimestamp();
  
  if (!message.member.hasPermission("BAN_MEMBERS"))
    return message.channel.send(error1)
  if (!message.guild.members.get(aruna.user.id).hasPermission("BAN_MEMBERS"))
    return message.channel.send(error2)
  
  if (!unbuser) return message.channel.send(error3);
  
  if (!args.join(" ").slice(19)) {
    var reason = `Desbanido por: ${message.author.username}`;
  } else {
    var reason =
      `Desbanido por: ${message.author.username} com o Motivo: ` +
      args.join(" ").slice(19);
  }

  let embed = new Discord.RichEmbed()
    .setAuthor("Desbanimento Efetuado!")
    .setDescription(`Desbanimento efetuado por ${message.author.username}`)
    .addField("Usuário Desbanido: ", `${unbuser.id}`, false)
    .addField("Desbanido por: ", `<@${message.author.id}>`, false)
    .addField("Motivo: ", `${reason}`, false)
    .setTimestamp();

    message.channel.send(embed).then(async msg => {
        await message.guild.unban(unbuser, reason).catch(err => {
            console.log(err)
            msg.edit(error4);
        })
    })
};

exports.config = {
  name: "desbanir",
  aliases: ["unban"],
  category: `👮‍♂️ Moderação`
};