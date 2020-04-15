const ytdl = require("ytdl-core");
const queue = new Map();

exports.run = async (client, message, args, command) => {
  const serverQueue = queue.get(message.guild.id);

  if (command === "play") {
    console.log("Play!");
    execute(message, serverQueue);
    return;
  } else if (command === "skip") {
    console.log("Skip");
    skip(message, serverQueue);
    return;
  } else if (command === "stop") {
    console.log("Stop");
    stop(message, serverQueue);
    return;
  }
  return;

  async function execute(message, serverQueue) {
    const voiceChannel = message.member.voiceChannel;
    if (!voiceChannel)
      return message.reply("Entre em um canal de voz primeiro!");
    const permissions = voiceChannel.permissionsFor(message.client.user);
    if (!permissions.has("CONNECT") || !permissions.has("SPEAK")) {
      return message.channel.send(
        "Eu preciso de permissão para falar e conectar neste canal!"
      );
    }

    if (!args[0]) return message.reply("Use `/play <URL>`");

    let validate = await ytdl.validateURL(args[0]);

    if (!validate)
      return message.reply(
        "Este URL não está disponível para tocar. Tente Novamente mais tarde ou use outra URL."
      );

    const songInfo = await ytdl.getInfo(args[0]);

    const song = {
      title: songInfo.title,
      url: songInfo.video_url
    };

    if (!serverQueue) {
      const queueContruct = {
        textChannel: message.channel,
        voiceChannel: voiceChannel,
        connection: null,
        songs: [],
        volume: 5,
        playing: true
      };

      queue.set(message.guild.id, queueContruct);

      queueContruct.songs.push(song);

      try {
        var connection = await voiceChannel.join();
        queueContruct.connection = connection;
        play(message.guild, queueContruct.songs[0]);
      } catch (err) {
        console.log(err);
        queue.delete(message.guild.id);
        return message.channel.send(err);
      }
    } else {
      serverQueue.songs.push(song);
      console.log(serverQueue.songs);
      return message.reply(
        `A música **${song.title}** foi adicionado a queue!`
      );
    }
  }

  function skip(message, serverQueue) {
    if (!message.member.voiceChannel)
      return message.channel.send(
        "Você precisa estar me ouvindo para pular a música :/"
      );
    if (!serverQueue)
      return message.channel.send("Não tem música para eu pular!");
    serverQueue.connection.dispatcher.end();
    message.channel.send("Música Pulada!");
  }

  function stop(message, serverQueue) {
    if (!message.member.voiceChannel)
      return message.channel.send(
        "Você precisa estar me ouvindo para parar a música :/"
      );
    if (!serverQueue)
      return message.channel.send("Não tem música para parar!!");
    serverQueue.songs = [];
    serverQueue.connection.dispatcher.end();
    message.channel.send(
      "Acabamos, senhoras e senhores. Obrigado para aqueles que participaram da sessão de música!"
    );
  }

  function play(guild, song) {
    const serverQueue = queue.get(guild.id);

    if (!song) {
      serverQueue.voiceChannel.leave();
      queue.delete(guild.id);
      return;
    }

    const dispatcher = serverQueue.connection.playStream(ytdl(song.url));
    message.channel.send(`Tocando agora **${song.title}**`);
    dispatcher.on("end", () => {
      console.log("Música Encerrada!");
      serverQueue.songs.shift();
      play(guild, serverQueue.songs[0]);
      if (!serverQueue.songs) {
        message.channel.send(
          "Acabamos, senhoras e senhores. Obrigado para aqueles que participaram da sessão de música!"
        );
      }
    });
    dispatcher.on("error", error => {
      console.error(error);
      message.channel.send(
        "Ih rapaz, sujo! Algo de errado não está certo. Por favor, entre em contato com o suporte em meu servidor oficial (https://discord.gg/8mtqyaA)."
      );
    });
    dispatcher.setVolumeLogarithmic(serverQueue.volume / 5);
  }
};
