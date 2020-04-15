const Discord = require('discord.js')
const mysql = require('mysql');

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'ttnB3mzrtlSK20YX',
    database: 'aruna'
  });

exports.run = async (client, message, args) => {
    if(!message.member.hasPermission("MANAGE_GUILD")) return message.reply("Você precisa ter a permissão de `Gerenciar Servidor` para usar esta função.")
    const m = await message.reply('Aguarde, fazendo verificação na database...')

    const embednull = new Discord.RichEmbed()
    .setColor([104, 253, 104])
    .setAuthor("Configurações Alteráveis (-config <config_para_alterar>)")
    .addField("prefix", "Altera meu prefixo local", false)
    .setTimestamp()
    .setFooter("Utilize -config <config> para usar");

    connection.query(`SELECT * FROM guilds WHERE guild_id=${message.guild.id}`, function (err, result) {
        if (err) {
            return m.edit(`<@${message.author.id}>, Houve um erro ao realizar este comando. Entre em contato com o suporte em meu servidor (https://discord.gg/svssMPr) com o código ` + "`err.config.command.query1.syslog`.")
        } else if (result == Boolean(false)) {
            return m.edit(`<@${message.author.id}>, Sua guild não foi encontrada em nosso banco de dados. Por favor, utilize -setup para corrigir isto.`)
        } else {
            m.delete(0)
            message.reply('Sucesso!')
            if(!args[0]) return message.reply(embednull)

        }
    });
}