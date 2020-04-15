exports.run = async (client, message, args) => {
    if(!args[0]) return message.reply("Utilize `-calc <conta>`. \nOBS: Para somar, use `+`. Para subtrair, use `-`. Para Multiplicar, use `*`. Para dividir, use `/`")
    
    if(!args[1]) return message.reply("Utilize `-calc <conta>`. \nOBS: Para somar, use `+`. Para subtrair, use `-`. Para Multiplicar, use `*`. Para dividir, use `/`")

    if(!args[2]) return message.reply("Insira outro número para efetuar a conta!")

    if(args[3]) return message.reply("Desculpe, mas faço apenas conta com 2 algarismos.")

    if(args[1] == "+") {
        var conta = "Operação indisponível no momento!"
    } else if(args[1] == "-") {
        var conta = args[0] - args[2]
    } else if(args[1] == "/") {
        var conta = args[0] / args[2]
    } else if(args[1] == "*") {
        var conta = args[0] * args[2]
    } else return message.reply("Operação matemática não identificada!")

    if(conta == "NaN") return message.reply("Isso é um número?")
    message.channel.send(conta)

}
module.exports.help = {
	name: "calc",
	aliases: [""],
	description: "Faz calculos pelo discord.",
	usage: "",
	category: "Geral",
};