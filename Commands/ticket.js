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

const { database } = require("../configs");
const emoji = require("../utils/emojis.js");
const Discord = require("discord.js");

exports.run = async (aruna, message, args) => {
  const user = await database.Users.findOne({ _id: message.author.id });
  const guild = await database.Guilds.findOne({ _id: message.guild.id });
  const ticket = await database.Tickets.findOne({
    _id: `${message.author.id}-${message.guild.id}`
  });

  const prefix = guild.prefix;

  const noperm = new Discord.RichEmbed()
    .setAuthor(`Oops, ${message.author.username}`, message.author.avatarURL)
    .setFooter(`Algo deu errado, ${message.author.username}`)
    .setDescription(`Este comando não está disponível no momento!`)
    .setTimestamp();

  const error = new Discord.RichEmbed()
    .setAuthor(`Oops, ${message.author.username}`, message.author.avatarURL)
    .setFooter(`Algo deu errado, ${message.author.username}`)
    .setDescription(
      `Insira \`criar\` para criar um ticket ou \`fechar\` para fechar o ticket.`
    )
    .setTimestamp();

  const error2 = new Discord.RichEmbed()
    .setAuthor(`Oops, ${message.author.username}`, message.author.avatarURL)
    .setFooter(`Algo deu errado, ${message.author.username}`)
    .setDescription(
      `Este comando não está ativado em seu servidor. Peça para algum ADM ativar com o comando \`${prefix}config\``
    )
    .setTimestamp();
  const error4 = new Discord.RichEmbed()
    .setAuthor(`Oops, ${message.author.username}`, message.author.avatarURL)
    .setFooter(`Algo deu errado, ${message.author.username}`)
    .setDescription(
      `Você não possui tickets abertos. Para abrir, use o comando \`\`${guild.prefix}ticket criar\`\``
    )
    .setTimestamp();

  if (user.SUPER !== true) return message.channel.send(noperm);

  if (guild.ticketEnable !== true) return message.channel.send(error2);

  if (!args[0]) return message.channel.send(error);

  const mode = args[0].toLowerCase();

  if (mode == "criar" || mode == "create" || mode == "new") {
    if (ticket) {
      const error3 = new Discord.RichEmbed()
        .setAuthor(`Oops, ${message.author.username}`, message.author.avatarURL)
        .setFooter(`Algo deu errado, ${message.author.username}`)
        .setDescription(
          `Você já possui um ticket aberto! Para visualiza-lo, acesse o canal <#${ticket.channel}>.`
        )
        .setTimestamp();
      return message.channel.send(error3);
    }

    const m = await message.channel.send(
      "Criando Ticket. Por favor, aguarde um momento..."
    );

    if (guild.ticketSupportID == null) {
      try {
        var supportRole = await message.guild
          .createRole({
            name: "Suporte",
            permissions: []
          })
          .then(roleId => {
            supportRole = roleId.id;
            guild.ticketSupportID = roleId.id;
          });
      } catch (e) {
        return console.log(e.stack);
      }
      message.channel.send(
        "Foi criado o cargo <@&" +
          supportRole +
          "> como cargo de suporte. Seu nome, cor e permissão podem ser alterados livremente."
      );
    } else {
      var supportRole = guild.ticketSupportID;
      if (!message.guild.roles.get(supportRole)) {
        try {
          var supportRole = await message.guild
            .createRole({
              name: "Suporte",
              permissions: []
            })
            .then(roleId => {
              supportRole = roleId.id;
              guild.ticketSupportID = roleId.id;
            });
        } catch (e) {
          return console.log(e.stack);
        }
        message.channel.send(
          "Foi criado o cargo <@&" +
            supportRole +
            "> como cargo de suporte. Seu nome, cor e permissão podem ser alterados livremente."
        );
      }
    }

    if (guild.ticketCategoryID == null) {
      try {
        var ticketCategory = await message.guild
          .createChannel(`Tickets`, "category", [
            {
              id: message.guild.defaultRole.id,
              deny: ["VIEW_CHANNEL"]
            }
          ])
          .then(catId => {
            console.log(catId);
            console.log("--------");
            console.log(ticketCategory);
            ticketCategory = catId;
            guild.ticketCategoryID = catId.id;
          });
      } catch (e) {
        console.log(e.stack);
      }
      console.log(ticketCategory);
      message.channel.send(
        "Foi criado a categoria " +
          ticketCategory.name +
          " como categoria que conterá os tickets. Seu nome pode ser alterado livremente."
      );
    } else {
      var ticketCategory = guild.ticketCategoryID;
      if (!aruna.channels.get(ticketCategory)) {
        try {
          var ticketCategory = await message.guild
            .createChannel(`Tickets`, "category", [
              {
                id: message.guild.defaultRole.id,
                deny: ["VIEW_CHANNEL"]
              }
            ])
            .then(catId => {
              console.log(catId);
              console.log("--------");
              console.log(ticketCategory);
              ticketCategory = catId;
              guild.ticketCategoryID = catId.id;
            });
        } catch (e) {
          console.log(e.stack);
        }
        console.log(ticketCategory);
        message.channel.send(
          "Foi criado a categoria " +
            ticketCategory.name +
            " como categoria que conterá os tickets. Seu nome pode ser alterado livremente."
        );
      }
    }
    if (guild.ticketLogID == null) {
      try {
        var ticketLog = await message.guild
          .createChannel(`ticket-log`, "text", [
            {
              id: message.guild.defaultRole.id,
              deny: ["VIEW_CHANNEL"]
            },
            {
              id: message.guild.roles.get(supportRole),
              allow: ["VIEW_CHANNEL"],
              deny: ["SEND_MESSAGES"]
            }
          ])
          .then(ticketId => {
            ticketLog = ticketId.id;
            guild.ticketLogID = ticketId.id;
            ticketId.setParent(ticketCategory);
          });
        message.channel.send(
          "Foi criado o canal " +
            ticketLog +
            " como canal de log dos tickets. Seu nome pode ser alterado livremente."
        );
      } catch (e) {
        console.log(e.stack);
      }
    } else {
      var ticketLog = guild.ticketLogID;
      if (!aruna.channels.get(ticketLog)) {
        try {
          var ticketLog = await message.guild
            .createChannel(`ticket-log`, "text", [
              {
                id: message.guild.defaultRole.id,
                deny: ["VIEW_CHANNEL"]
              },
              {
                id: message.guild.roles.get(supportRole),
                allow: ["VIEW_CHANNEL"],
                deny: ["SEND_MESSAGES"]
              }
            ])
            .then(ticketId => {
              ticketLog = ticketId.id;
              guild.ticketLogID = ticketId.id;
              ticketId.setParent(ticketCategory);
            });
          message.channel.send(
            "Foi criado o canal " +
              ticketLog +
              " como canal de log dos tickets. Seu nome pode ser alterado livremente."
          );
        } catch (e) {
          console.log(e.stack);
        }
      }
    }
    guild.save();
  } else if (mode == "fechar" || mode == "close") {
    if (!ticket) return message.channel.send(error4);
  } else return message.channel.send(error);
};

exports.config = {
  name: "ticket",
  aliases: [],
  category: `${emoji.robot} Utilidades`
};
