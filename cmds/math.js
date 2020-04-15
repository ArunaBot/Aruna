const emoji = require("../utils/emojis.js");
const Discord = require("discord.js");
const math = require("mathjs");

exports.run = (aruna, message, args) => {
  const error1 = new Discord.RichEmbed()
    .setAuthor(`Oops, ${message.author.username}`, message.author.avatarURL)
    .setFooter(`Algo deu errado, ${message.author.username}`)
    .setDescription(`Você deve inserir o cálculo a ser feito.`)
    .setTimestamp();
  const error2 = new Discord.RichEmbed()
    .setAuthor(`Oops, ${message.author.username}`, message.author.avatarURL)
    .setFooter(`Algo deu errado, ${message.author.username}`)
    .setDescription(
      `Desculpe, mas não consegui efetuar o cálculo. Tente inserir outra conta.`
    )
    .setTimestamp();

  if (!args[0]) return message.channel.send(error1);

  var response;

  try {
    response = math.eval(args.join(" "));
  } catch (e) {
    return message.channel.send(error2);
  }
  
  let embed = new Discord.RichEmbed()
      .setAuthor("Calculadora V2")
      .addField(
        `(${emoji.upload}) Entrada`,
        `\`\`\`js\n${args.join(' ')}\`\`\``
      )
      .addField(
        `(${emoji.dev}) Saida`,
        `\`\`\`js\n${response}\`\`\``
      )
      .setColor([54, 57, 63]);
    message.channel.send(embed);
};

exports.config = {
  name: "calc",
  aliases: ["calculadora", "math", "matematica", "calcular", "calculator"],
  category: `${emoji.robot} Utilidades`
};
