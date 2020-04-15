const emoji = require("../utils/emojis.js");
const Discord = require("discord.js");

exports.run = async (aruna, message) => {
  const embed = new Discord.RichEmbed().setAuthor(
    `Olá, ${message.author.username}`
  )
    .setDescription(`Encontrou algum erro esquisito, tem alguma reclamação ou sugestões para mim?
\nPara isso, basta clicar [aqui](
https://discord.gg/NqbBgEf) e venha conversar com meus desenvolvedores!`);
  message.channel.send(embed);
};

exports.config = {
  name: "suporte",
  aliases: ["support"],
  category: `${emoji.robot} Utilidades`
};
