exports.run = async (client, message, args) => {
    var add = Math.round(Math.random());
    if(add == 0){
        message.reply('Cara!')
    } else if (add == 1){
        message.reply('Coroa!')
    } else {
        message.reply('Erro!')
    }
}