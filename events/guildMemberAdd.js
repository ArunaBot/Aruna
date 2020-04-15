const Discord = require("discord.js");
var database = require("../configs/mongoose.js");

const serverStatsPrincipal = {
  guildID: "660610178009530380",
  oldGuildID: "610206821763776522"
};

exports.run = async (aruna, member) => {
  const user = database.Users.findOne(member.user.id);
  
  if (!user) {
    var saveU = await new database.Users({ _id: member.user.id });
    await saveU.save();
    console.log("New Member on database :)")
  }
  
  if (member.guild.id == serverStatsPrincipal.guildID) {
    member.addRole(`660612149009448988`, "AutoRole");
    const isOld = aruna.guilds
      .get("610206821763776522")
      .members.get(member.user.id);
    if (isOld) {
      isOld.kick("Entrou no novo Servidor");
    }
  } else if (member.guild.id == serverStatsPrincipal.oldGuildID) {
    const changingMessage = new Discord.RichEmbed()
      .setAuthor(`Oops, ${member.user.username}`, member.user.avatarURL)
      .setFooter(`Nos Vemos Em Breve :)`)
      .setDescription(
        "Olá! No momento estamos trocando de servidor. Por favor, peço que entre no nosso novo servidor clicando **[aqui](https://discord.gg/NqbBgEf)** :)"
      )
      .setTimestamp();
    member.send(changingMessage);
  }
};
