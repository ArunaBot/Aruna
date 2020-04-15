const emoji = require("../utils/emojis.js");
const Discord = require("discord.js");

exports.run = async (aruna, message) => {
  const embed = new Discord.RichEmbed().setAuthor(
    `Olá, ${message.author.username}`
  )
    .setDescription(`Fico feliz que tenha gostado de mim e queira me adicionar :) 
\nPara isso, basta clicar [aqui](
https://discordapp.com/oauth2/authorize?client_id=593303574725787657&scope=bot&permissions=2146954751), selecionar o servidor na lista, confirmar o reCaptcha e pronto, eu estarei em seu servidor! 
\nNovamente, obrigado pelo interesse e nos vemos em seu servidor!`);
  message.channel.send(embed);
};

exports.config = {
  name: "invite",
  aliases: ["convidar", "convite"],
  category: `${emoji.robot} Utilidades`
};
