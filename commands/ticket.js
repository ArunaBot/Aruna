const config = require("../config.json");

exports.run = async (client, message, args) => {
  if (!message.guild.members.get(client.user.id).hasPermission("MANAGE_ROLES"))
    return message.reply(
      "Para esse comando eu preciso ter a permissão de `Gerenciar Canais` e `Gerenciar Cargos`."
    );
  if (
    !message.guild.members.get(client.user.id).hasPermission("MANAGE_CHANNELS")
  )
    return message.reply(
      "Para esse comando eu preciso ter a permissão de `Gerenciar Canais` e `Gerenciar Cargos`."
    );

  let rMember = message.guild.member(message.author);
  const userID = message.author.id;
  var add = Math.floor(Math.random() * 999999999) + 1;
  const ticketID = add;

  const m = await message.channel.send(
    `Um canal de ajuda está sendo criado, <@${userID}>. Aguarde um momento...`
  );

  let muterole = message.guild.roles.find(`name`, "Suporte");

  if (!muterole) {
    try {
      muterole = await message.guild.createRole({
        name: "Suporte",
        permissions: []
      });
    } catch (e) {
      console.log(e.stack);
    }
  }

  let ticketcategory = message.guild.channels.find(`name`, "Tickets");

  if (!ticketcategory) {
    try {
      ticketcategory = await message.guild.createChannel(`Tickets`, "category");
    } catch (e) {
      console.log(e.stack);
    }
  }

  let ticketlog = message.guild.channels.find(`name`, "ticket-log");

  if (!ticketlog) {
    try {
      ticketlog = await message.guild.createChannel(`ticket-log`, "text", [
        {
          id: message.guild.defaultRole.id,
          deny: ["VIEW_CHANNEL"]
        },
        {
          id: message.guild.roles.find(`name`, "Suporte"),
          allow: ["VIEW_CHANNEL"],
          deny: ["SEND_MESSAGES"]
        }
      ]);
      ticketlog.setParent(ticketcategory);
    } catch (e) {
      console.log(e.stack);
    }
  }

  message.guild
    .createChannel(`ticket-${ticketID}`, "text", [
      {
        id: message.guild.defaultRole.id,
        deny: ["VIEW_CHANNEL"]
      },
      {
        id: userID,
        allow: ["VIEW_CHANNEL"]
      },
      {
        id: message.guild.roles.find(`name`, "Suporte"),
        allow: ["VIEW_CHANNEL"]
      }
    ])
    .then(channelT => {
      const channelID = channelT.id;
      let core = require(`../extrafunction/ticketcore.js`);
      core.run(client, message, channelID, m, ticketcategory, ticketlog, add);
    });
};
