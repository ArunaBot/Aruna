const Discord = require("discord.js");
const database = require("../configs/mongoose.js");
const emoji = require("../utils/emojis.js");
const config = require("../configs/cf.js");

exports.run = (aruna, message, args) => {
  database.Users.findOne({ _id: message.author.id }, function(erro, user) {
    
  const errored = new Discord.RichEmbed()
    .setAuthor(`Oops, ${message.author.username}`, message.author.avatarURL)
    .setDescription(`Você não tem permissão para executar esse comando!`)
    .setFooter(`Algo deu errado, ${message.author.username}`);
    
  if(user.SUPER !== true) return message.channel.send(errored)
  const util = require("util");
  let code = args.join(" ");
  let embed = new Discord.RichEmbed()
    .setAuthor(`Oops, ${message.author.username}`, message.author.avatarURL)
    .setDescription(`Você precisa digitar um código!`)
    .setFooter(`Algo deu errado, ${message.author.username}`);
  if (!code) return message.channel.send(embed);
  
  try {
    let ev = eval(code);
    let str = util.inspect(ev, { depth: 1 });

    str = `${str.replace(
      new RegExp(`${aruna.token}|${process.env.TOKEN}|${config.token}`, "g"),
      "Erro! Você não pode exibir esta informação!"
    )}`;

    if (str.length > 1800) {
      str = str.substr(0, 1800);
      str = str + "...";
    }
    let embed = new Discord.RichEmbed()
      .setAuthor("Console")
      .addField(
        `(<:uploaduisvgrepocom:637027335173832727>) Entrada`,
        `\`\`\`js\n${code}\`\`\``
      )
      .addField(
        `(<:developmentsvgrepocom:637027334553337896>) Saida`,
        `\`\`\`js\n${str}\`\`\``
      )
      .setColor([54, 57, 63]);
    message.channel.send(embed);
  } catch (err) {
    message.channel.send(err.stack, { code: "js" });
  }
}).catch(e => {})
};

exports.config = {
  name: "eval",
  aliases: [],
  category: `🧰 Administração`
};
