const Discord = require("discord.js");
const ms = require("ms");
const config = require('../config.json')

module.exports.run = async (client, message, args) => {
  //!mute @user 1s/m/h/d
  
  if(message.author.id !== config.elevated) return message.reply('Acesso Negado!')

  let tomute = message.guild.member(
    message.mentions.users.first() || message.guild.members.get(args[0])
  );
  if (!tomute)
    return message.channel.send("Mencione um usuário para silenciar!");
  if (!message.guild.members.get(client.user.id).hasPermission("MANAGE_ROLES"))
    return message.reply(
      "Para esse comando eu preciso ter a permissão de `Gerenciar Canais` e `Gerenciar Cargos`."
    );
  if (!message.guild.members.get(client.user.id).hasPermission("MANAGE_CHANNELS"))
    return message.reply(
      "Para esse comando eu preciso ter a permissão de `Gerenciar Canais` e `Gerenciar Cargos`."
    );
  if (!message.member.hasPermission("MANAGE_MESSAGES"))
    return message.channel.send(
      "Sorry, you don't have permissions to use this!"
    );
  if (tomute.hasPermission("MANAGE_MESSAGES"))
    return message.channel.send("Eu não posso silenciar este usuário.");
  if (tomute.id === message.author.id)
    return message.channel.send(
      "Você não pode silenciar você mesmo! \nDigo, a menos que passe uma fita em sua boca..."
    );
  let muterole = message.guild.roles.find(`name`, "Silenciado");

  if (!muterole) {
    try {
      muterole = await message.guild.createRole({
        name: "Silenciado",
        color: "#000000",
        permissions: []
      });
      message.guild.channels.forEach(async (channel, id) => {
        await channel.overwritePermissions(muterole, {
          SEND_MESSAGES: false,
          ADD_REACTIONS: false
        });
      });
    } catch (e) {
      console.log(e.stack);
    }
  }

  let mutetime = args[1];
  if (!mutetime) return message.channel.send("Você deve especificar um tempo!");

  await tomute.addRole(muterole.id);
  message.reply(`<@${tomute.id}> foi silenciado por ${ms(ms(mutetime))} tempo`);

  setTimeout(function() {
    tomute.removeRole(muterole.id);
    message.channel.send(`<@${tomute.id}> foi desmutado!`);
  }, ms(mutetime));

  message.delete();
};

module.exports.help = {
  name: "mute"
};
