const config = require("../config.json");
const db = require("quick.db");
const Discord = require("discord.js");
const embed = new Discord.RichEmbed()

exports.run = async (client, message, args) => {
  const guild = message.guild;
  function clean(text) {
    if (typeof text === "string")
      return text
        .replace(/`/g, "`" + String.fromCharCode(8203))
        .replace(/@/g, "@" + String.fromCharCode(8203));
    else return text;
  }

  if (message.author.id !== config.elevated)
    return message.reply("Não Autorizado!");

  try {
    const code = args.join(" ");
    let evaled = eval(code);

    if (typeof evaled !== "string") evaled = require("util").inspect(evaled);

    message.channel.send(clean(evaled), { code: "xl" });
  } catch (err) {
    message.channel.send(`\`ERROR\` \`\`\`xl\n${clean(err)}\n\`\`\``);
  }
};
