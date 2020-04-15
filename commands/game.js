const Discord = require("discord.js");
const config = require("../config.json");
var end = false

var validGames = ["tetris", "Tetris", "TETRIS", "Tétris", "tétris", "TÉTRIS"];
var totalgames = [6]

exports.run = async (client, message, args) => {
  
  const user = message.author
  
  if(args[1] === "stop") end = true
  
  if (message.author.id !== config.elevated)
    return message.reply("Acesso negado!");
  const embednull = new Discord.RichEmbed()
    .setAuthor(
      "Bem Vindo a Minha Central de jogos, " + message.author.username + "!",
      message.author.avatarURL
    )
    .setDescription(`**Jogos Disponíveis:**`)
    .addField(
      "Tétris (WIP)",
      "Está com aquela nostalgia deste magnífico jogo? Aproveite para jogá-lo agora mesmo!"
    )
    .setTimestamp();
  if (!args[0]) return message.channel.send(embednull);
  for (var i = 0; i < validGames.length; i++) {
    if (message.content.includes(validGames[i])) {
      const game = require(`./games/${validGames[i]}.js`)
      return message.channel.send(
        "Aviso: o jogo **" +
          validGames[3] +
          "** está em desenvolvimento. Tenha cuidado, bugs e crashes podem ocorrer!"
      ), game.run(client, user, message, end)
    } else {totalgames = totalgames - 1; if(totalgames <= 0) return message.channel.send(embednull);} 
  }
};
