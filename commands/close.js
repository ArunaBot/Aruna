const db = require("quick.db");
const Discord = require("discord.js");

exports.run = async (client, message, args) => {
  const channelID = message.channel.id;
  const userID = message.author.id;
  const guild = message.guild;

  let motivo = "**Sem Motivo Informado!**";

  if (args) motivo = args;

  let vendaativa = await db.fetch(`ticket.${guild.id}.${userID}`);
  
  let otherticket = await db.fetch(`ticket.${guild.id}.*`);

  let embed = new Discord.RichEmbed()

    .setColor([249, 218, 0])
    .setThumbnail(message.author.avatarURL)
    .setAuthor(`Log do Ticket ${channelID}`)
    .setDescription(`Clique [aqui](https://www.youtube.com/watch?v=dQw4w9WgXcQ) para ver o histórico do chat.

            O ticket foi fechado por: ${message.author.username}
            Motivo do Fechamento: ${motivo}`);

  if (vendaativa === null) {
    message.channel.send("Você não tem um ticket aberto para fechar.");
  } else if (vendaativa === channelID) {
    message.channel.send("Este ticket será fechado em 10 segundos.");
    db.delete(`ticket.${guild.id}.${userID}`);
    message.channel.delete(100000);

    message.guild.channels.find(`name`, "ticket-log").send(embed);
  } else {
    message.channel.send(
      "Você não pode usar este comando aqui. Apenas no seu prórpio ticket."
    );
  }
};
