const Discord = require('discord.js');
const db = require('quick.db');
const utils = require("../utils/utils.js");

exports.run = async (client, message, args) => {
  const guild = message.guild
	
   function getUserFromMention(mention) {
        if (!mention) return;
    
        if (mention.startsWith('<@') && mention.endsWith('>')) {
            mention = mention.slice(2, -1);
    
            if (mention.startsWith('!')) {
                mention = mention.slice(1);
            }
    
            return client.users.get(mention);
        }
    }

    if (args[0]) {
		var user = getUserFromMention(args[0]);
		if (!user) {
			return message.reply('Utilize o comando `-rank` pra ver o seu rank ou `-rank <@user>` para ver o de outro usuário.');
		}


		let xp = await db.fetch(`xp_${guild.id}_${user.id}`);
        if (xp === null) xp = 0;
        let level = await db.fetch(`level_${guild.id}_${user.id}`);
        if (level === null) level = 0;
		
    
        let need = utils.need(level+1);
    
        const embed = new Discord.RichEmbed()
            .setColor([54, 57, 63])
            .setAuthor("RANK: " + user.username, user.avatarURL)
			.addField("Nível", level, true)
			.addField("Xp Atual", xp, true)
			.addField("XP Necessário", need, true)
            .setTimestamp();
        message.channel.send(embed);
    
    } else {var user = message.author


    
    let xp = await db.fetch(`xp_${guild.id}_${user.id}`);
    if (xp === null) xp = 0;
    let level = await db.fetch(`level_${guild.id}_${user.id}`);
	if (level === null) level = 0;

    let need = utils.need(level+1);

    const embed = new Discord.RichEmbed()
            .setColor([54, 57, 63])
            .setAuthor("RANK: " + user.username, user.avatarURL)
			.addField("Nível", level, true)
			.addField("Xp Atual", xp, true)
			.addField("XP Necessário", need, true)
            .setTimestamp();
        message.channel.send(embed);
};

}