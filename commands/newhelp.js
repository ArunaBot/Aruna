const { RichEmbed } = require("discord.js");
const { readdirSync } = require("fs");
const config = require('../config.json')

module.exports.run = (client, message, args) => {
  
  if(message.author.id !== config.elevated) return message.reply("Acesso Negado!")
  
  const bot = client

	const embed = new RichEmbed()
		.setColor("#2C2F33")
		.setAuthor(`${bot.user.username} Help`, bot.user.displayAvatarURL)
		.setFooter(`Requested by ${message.author.tag} at`, message.author.displayAvatarURL)
		.setTimestamp();
	if (args[0]) {
		let command = args[0];
		let cmd;
		if (bot.commands.has(command)) {
			cmd = bot.commands.get(command);
		}
		else if (bot.aliases.has(command)) {
			cmd = bot.commands.get(bot.aliases.get(command));
		}
		if(!cmd) return message.channel.send(embed.setTitle("Invalid Command.").setDescription(`Do \`${bot.config.prefix}help\` for the list of the commands.`));
		command = cmd.help;
		embed.setTitle(`${command.name.slice(0, 1).toUpperCase() + command.name.slice(1)} command help`);
		embed.setDescription([
			`❯ **Command:** ${command.name.slice(0, 1).toUpperCase() + command.name.slice(1)}`,
			`❯ **Description:** ${command.description || "No Description provided."}`,
			`❯ **Usgae:** ${command.usage ? `\`${bot.config.prefix}${command.name} ${command.usage}\`` : "No Usage"} `,
			`❯ **Aliases:** ${command.aliases ? command.aliases.join(", ") : "None"}`,
			`❯ **Category:** ${command.category ? command.category : "General" || "Misc"}`,
		].join("\n"));

		return message.channel.send(embed);
	}
	const categories = readdirSync("./commands/");
	embed.setDescription([
		`Available commands for ${bot.user.username}.`,
		`The bot prefix is **${config.prefix}**`,
		"`<>`means needed and () it is optional but don't include those",
	].join("\n"));
	categories.forEach(category => {
		const dir = bot.commands.filter(c => c.help.category.toLowerCase() === category.toLowerCase());
		const capitalise = category.slice(0, 1).toUpperCase() + category.slice(1);

		try {
			if (dir.size === 0) return;
			if (bot.config.owners.includes(message.author.id)) embed.addField(`❯ ${capitalise}`, dir.map(c => `\`${c.help.name}\``).join(", "));
			else if (category !== "Developer") embed.addField(`❯ ${capitalise}`, dir.map(c => `\`${c.help.name}\``).join(", "));
		}
		catch (e) {
			console.log(e);
		}
	});
	return message.channel.send(embed);
};

module.exports.help = {
	name: "help",
	aliases: ["newh"],
	description: "Help command to show the commands",
	usgae: "help (command name)",
	category: "Geral",
};