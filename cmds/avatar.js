const Discord = require("discord.js");

exports.run = (aruna, message, args, prefix) => {
  const user1 = message.guild.member(
    message.mentions.users.first() || aruna.users.get(args[0]) || message.author
  );

  const user = user1.user;

  let embed = new Discord.RichEmbed()
    .setAuthor(`Avatar de ${user.username}`)
    .setDescription(`**Clique [aqui](${user.avatarURL}) para baixar a foto.**`)
    .setImage(user.avatarURL)
    .setTimestamp();
  message.channel.send(embed);
};
exports.config = {
  name: "avatar",
  aliases: [""],
  description: "Mostra o avatar próprio ou de um usuário",
  category: `🎉 Entretenimento`
};
