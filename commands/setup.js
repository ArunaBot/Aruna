const Discord = require('discord.js')
const mysql = require('mysql');

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'ttnB3mzrtlSK20YX',
    database: 'aruna'
  });


exports.run = async (client, message, args) => {
    connection.query(`SELECT * FROM guilds WHERE guild_id=${message.guild.id}`, function (err, result) {
        if (err) {
            console.log(err)
            return message.reply(`Houve um erro ao realizar este comando. Entre em contato com o suporte em meu servidor (https://discord.gg/eZDhHKm) com o código ` + "`err.setup.command.query1.syslog`.")
        } else if (result == Boolean(false)) {
            connection.query("INSERT INTO `guilds` (`guild_id`, `guild_name`, `config`) VALUES (" + `'${message.guild.id}', ` + `'${message.guild.name}', ` + "'default');", function (err, result){
            if (err) {
                console.log(err)
                return message.reply(`Houve um erro ao realizar este comando. Entre em contato com o suporte em meu servidor (https://discord.gg/eZDhHKm) com o código ` + "`err.setup.command.query2.syslog`.")
            } else {
                message.reply('Sua guild foi configurada com sucesso!')
                connection.query("INSERT INTO `configs` (`guild`, `prefix`) VALUES (" + `'${message.guild.id}', ` + "'-');", function (err, result){
            });
        }
        }); 
        } else {
            message.reply('Sua guild já foi configurada. Não precisa configurar novamente :)')
            }
    });
}