const ytdl = require("ytdl-core");
const sound = "https://www.youtube.com/watch?v=hqnCrYsVGyQ";
const queue = new Map();

exports.run = async (client, user, message, end) => {
  const serverQueue = queue.get(message.guild.id);
  message.reply("[TETRIS] Game Initialized");
  message.reply("[TETRIS] Initializing SoundCore");
  const voiceChannel = message.member.voiceChannel;
  if (!voiceChannel)
    return (
      message.reply("Entre em um canal de voz para poder iniciar o Jogo."),
      message.reply("[TETRIS] Game Has Stopped")
    );
  const permissions = voiceChannel.permissionsFor(message.client.user);
  if (!permissions.has("CONNECT") || !permissions.has("SPEAK")) {
    return (
      message.channel.send(
        "Eu preciso de permissão para falar e conectar no canal de voz que você está."
      ),
      message.reply("[TETRIS] Game Has Stopped")
    );
  }
  const songInfo = await ytdl.getInfo(sound);

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
  }

  if (end === true)
    return (
      (serverQueue.songs = []),
      serverQueue.connection.dispatcher.end(),
      message.reply("Jogo Finalizado!"),
      message.reply("[SOUNDCORE] Ended"),
      message.reply("[TETRIS] Ended")
    );

  function play(guild, song) {
    const serverQueue = queue.get(guild.id);

    if (!song) {
      serverQueue.voiceChannel.leave();
      queue.delete(guild.id);
      return;
    }

    const dispatcher = serverQueue.connection.playStream(ytdl(sound));
    dispatcher.on("end", () => {
      serverQueue.songs.shift();
      play(guild, serverQueue.songs[0]);
    });
    message.reply("[TETRIS] Game Has Stopped");
  }
};
