const db = require("../configs/mongoose.js");

exports.run = async (aruna, message, args) => {
  const guild = await db.Guilds.findsOne({ _id: message.guild.id });

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
  
  const guild2 = await db.Guilds.findsOne({ _id: message.guild.id });

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
