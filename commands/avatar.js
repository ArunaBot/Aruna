const Discord = require('discord.js');

exports.run = async (client, message, args) => {
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

     if(args[0]) {
		var user = getUserFromMention(args[0]);
		if (!user) {
			var mentionuser = message.author
		} else {var mentionuser = getUserFromMention(args[0])}
} else {var mentionuser = message.author}

    let embed = new Discord.RichEmbed()
    .setColor([0, 83, 255])
    .setAuthor(`${mentionuser.username}`)
    .setDescription(`**Clique [aqui](${mentionuser.avatarURL}) para baixar a foto.**`)
    .setImage(mentionuser.avatarURL)
    message.channel.send(embed)
}

module.exports.help = {
	name: "Avatar",
	aliases: ["avatar"],
	description: "Veja o seu avatar ou de outro mebro da guild",
	usage: "[@UserMention]",
	category: "Geral",
};