const Discord = require('discord.js');
const db = require('quick.db');
const sortby = require('lodash.sortby');

exports.run = async (client, message, args) => {

    let user = message.author
    let guild = message.guild

    let embed = new Discord.RichEmbed()
    .setColor([0, 24, 32])
    .setAuthor(`LEADERBOARD | ${guild.name}`, guild.iconURL)
    .setTimestamp();

    let place = "Sem Colocação!";

    function startsWith(db, str, options = { sort: undefined }) {
        let arr = [];
        for (var el of db.all()) {
            if (el.ID === null) continue;
            if (!el.ID.startsWith(str)) continue;
            const { ID, data } = el;
            arr.push({
                ID: el.ID,
                data: el.data
            });
        }
        if (typeof options.sort === 'string') {
            if (options.sort.startsWith('.')) options.sort = options.sort.slice(1);
            options.sort = options.sort.split('.');
            arr = sortby(arr, options.sort);
            arr = arr.reverse();
        }
        return arr;
    }

    await startsWith(`total_points_`, {
    sort:'.data'
  }).then(async resp => {

        resp.length = 15;

        let xp, level;

        let a = 1;
        for (var i in resp){
            let id = resp[i].ID.split('_')[2];
            let total = await db.fetch(`total_poins_${id}`);
            level = await db.fetch(`xp_${id}`);
            if (level === null) level = 0;
            xp = await db.fetch(`level_${id}`)
            if(xp === null) xp = 0
            if (total === null) total = 0;
            let name;
            try{
                name = await client.users.get(id).username;
            } catch (e) {
                name = `${id}`;
            }
            embed.addField(`[${a}] ${name}`, `Level: ${level} [XP: ${xp}]`, false);
            a++
        }
    });

    embed.setDescription(`:clipboard: Top 15`);


    embed.setFooter(`Sua posição no rank é #${place}`, user.avatarURL)

    message.channel.send(embed)
}