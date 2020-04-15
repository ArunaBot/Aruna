/*
    This File is part of ArunaBot
    Copyright (C) LoboMetalurgico (and contributors) 2019-2020

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU Affero General Public License as
    published by the Free Software Foundation, either version 3 of the
    License, or (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU Affero General Public License for more details.

    You should have received a copy of the GNU Affero General Public License
    along with this program.  If not, see <https://www.gnu.org/licenses/>.
*/

const Discord = require("discord.js");
function format(seconds) {
  function pad(s) {
    return (s < 10 ? "0" : "") + s;
  }
  var hours = Math.floor(seconds / (60 * 60));
  var minutes = Math.floor((seconds % (60 * 60)) / 60);
  var seconds = Math.floor(seconds % 60);
  var days = Math.floor(hours / 24);

  return (
    pad(days) +
    "d " +
    pad(hours) +
    "h " +
    pad(minutes) +
    "m " +
    pad(seconds) +
    "s"
  );
}

exports.run = async (aruna, message) => {
  try {
    console.log("(ARUNA) => Bot online!");
    let status = [

      { name: `Muppet Show`, type: `watching` },

      // { name: `Faz ${format(process.uptime())}`, type: `playing` },

      {
        name: `Netflix`,
        type: `watching`
      },

      {
        name: `Versão 4.0 (Testing Version)`,
        type: `streaming`,
        url: `https://www.twitch.tv/lobometalurgico`
      }
    ];
    function setStatus() {
      let randomStatus = status[Math.floor(Math.random() * status.length)];
      aruna.user.setPresence({ game: randomStatus });
    }
    setStatus();
    setInterval(() => {
      var users = aruna.users.size;
      var servers = aruna.guilds.size;
      setStatus();

     /* aruna.channels.get(`688180527491973220`).setName(`👥Usuários: ${users}`);
      aruna.channels
        .get(`688180491995578397`)
        .setName(`💻Servidores: ${servers}`);
      
      aruna.channels.get(`647590390404349952`).setName(`👥Usuários: ${users}`);
      aruna.channels
        .get(`647590426378895393`)
        .setName(`💻Servidores: ${servers}`);*/
    }, 15000);
  } catch (error) {}
};
