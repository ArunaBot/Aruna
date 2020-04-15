exports.run = async (client, message, db, cooldown, utils, Discord) => {

  let user = message.author;
  const guild = message.guild

  let xp = await db.fetch(`xp_${guild.id}_${user.id}`);
  if (xp === null) xp = 0;
  let level = await db.fetch(`level_${guild.id}_${user.id}`);
  if (level === null) level = 0;
  
  if (!cooldown.is(user.id)) {
    cooldown.add(user.id)
    var add = Math.floor(Math.random() * 20) + 5;
    db.add(`xp_${guild.id}_${user.id}`, add);
    setTimeout(() => {
      cooldown.remove(user.id);}, 1000 * 60);
  }
  while (xp >= utils.need(level+1)) {
    if (xp >= utils.need(level+1)) {
      db.subtract(`xp_${guild.id}_${user.id}`, utils.need(level+1));
      db.add(`level_${guild.id}_${user.id}`, 1)
      xp = await db.fetch(`xp_${guild.id}_${user.id}`);
      level = await db.fetch(`level_${guild.id}_${user.id}`);
      let embed = new Discord.RichEmbed()
        .setAuthor("Novo Nível!")
        .setDescription(user.username + " está agora no **Nível " + level + "**! Parabéns!")
        .setColor([15, 15, 250])
        .setTimestamp();
      message.channel.send(embed);
    }
  }
}