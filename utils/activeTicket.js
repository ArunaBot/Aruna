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

exports.run = async (aruna, message, args) => {
  const guild = await database.Guilds.findsOne({ _id: message.guild.id });

  if (guild.ticketSupportID == null) {
    try {
      var supportRole = await message.guild
        .createRole({
          name: "Suporte",
          permissions: ["VIEW_CHANNEL", "SEND_MESSAGES", "CONNECT", "SPEAK"]
        })
        .then(async roleId => {
          await message.channel.send(
            "Foi criado o cargo <@&" +
              roleId.id +
              "> como cargo de suporte. Seu nome, cor e permissão podem ser alterados livremente."
          );
          guild.ticketSupportID = roleId.id;
        });
    } catch (e) {
      return console.log(e.stack);
    }
  } else {
    var supportRole = guild.ticketSupportID;
    if (!message.guild.roles.get(supportRole)) {
      try {
        var supportRole = await message.guild
          .createRole({
            name: "Suporte",
            permissions: ["VIEW_CHANNEL", "SEND_MESSAGES", "CONNECT", "SPEAK"]
          })
          .then(async roleId => {
            await message.channel.send(
              "Foi criado o cargo <@&" +
                roleId.id +
                "> como cargo de suporte. Seu nome, cor e permissão podem ser alterados livremente."
            );
            guild.ticketSupportID = roleId.id;
          });
      } catch (e) {
        return console.log(e.stack);
      }
    }
  }
  let ticketCategory = message.guild.channels.find(`name`, "Tickets");

  if (!ticketCategory) {
    try {
      ticketCategory = await message.guild.createChannel(`Tickets`, "category");
      message.channel.send(
        "Foi criado a categoria " +
          ticketCategory.name +
          " como categoria que conterá os tickets. Seu nome não pode ser alterado."
      );
    } catch (e) {
      console.log(e.stack);
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
        .then(async ticketId => {
          ticketLog = ticketId.id;
          guild.ticketLogID = ticketId.id;
          await ticketId.setParent(ticketCategory);
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
  await guild.save();
  
  const guild2 = await database.Guilds.findsOne({ _id: message.guild.id });

  if (guild.ticketSupportID == null) {
    try {
      var supportRole = await message.guild
        .createRole({
          name: "Suporte",
          permissions: ["VIEW_CHANNEL", "SEND_MESSAGES", "CONNECT", "SPEAK"]
        })
        .then(async roleId => {
          await message.channel.send(
            "Foi criado o cargo <@&" +
              roleId.id +
              "> como cargo de suporte. Seu nome, cor e permissão podem ser alterados livremente."
          );
          guild2.ticketSupportID = roleId.id;
        });
    } catch (e) {
      return console.log(e.stack);
    }
  } else {
    var supportRole = guild.ticketSupportID;
    if (!message.guild.roles.get(supportRole)) {
      try {
        var supportRole = await message.guild
          .createRole({
            name: "Suporte",
            permissions: ["VIEW_CHANNEL", "SEND_MESSAGES", "CONNECT", "SPEAK"]
          })
          .then(async roleId => {
            await message.channel.send(
              "Foi criado o cargo <@&" +
                roleId.id +
                "> como cargo de suporte. Seu nome, cor e permissão podem ser alterados livremente."
            );
            guild2.ticketSupportID = roleId.id;
          });
      } catch (e) {
        return console.log(e.stack);
      }
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
        .then(async ticketId => {
          ticketLog = ticketId.id;
          guild2.ticketLogID = ticketId.id;
          await ticketId.setParent(ticketCategory);
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
            guild2.ticketLogID = ticketId.id;
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
  guild2.save();
};
