const database = require("../configs/mongoose.js");
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

    
  } else if (mode == "fechar" || mode == "close") {
    if (!ticket) return message.channel.send(error4);
  } else return message.channel.send(error);
};

exports.config = {
  name: "ticket",
  aliases: [],
  category: `${emoji.robot} Utilidades`
};
