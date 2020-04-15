exports.run = async (aruna, message, args) => {
    var add = Math.round(Math.random());
    if(add == 0){
        message.channel.send('Cara!')
    } else if (add == 1){
        message.channel.send('Coroa!')
    } else {
        message.reply('Erro!')
    }
}

exports.config = {
  name: "flip",
  aliases: ["moeda", "girar"],
  category: `🎉 Entretenimento`
};