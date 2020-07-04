/* eslint-disable no-unused-vars */
/* eslint-disable max-len */
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

const pkg = require('../../package.json');
const chalk = require('chalk');
const { apiKeys, database } = require('../../Configs');

exports.run = async (aruna) => {
  log('Conectado!');

  function format(seconds) {
    function pad(s) {
      return (s < 10 ? '0' : '') + s;
    }
    seconds = Math.floor(seconds % 60);
    var hours = Math.floor(seconds / (60 * 60));
    var minutes = Math.floor((seconds % (60 * 60)) / 60);
    var days = Math.floor(seconds % (3600 * 24));
    
    if (pad(days) >= '1') {
      return (
        pad(days) +
          'd ' +
          pad(hours - 24) +
          'h ' +
          pad(minutes) +
          'm'
      );
    } else if (pad(hours) >= '1') {
      return pad(hours) + 'h ' + pad(minutes) + 'm ' + pad(seconds) + 's';
    } else if (pad(minutes) >= '1') {
      return pad(minutes) + 'm ' + pad(seconds) + 's';
    } else {
      return pad(seconds) + 's';
    }
  }

  const status = [
    { 
      name: 'Muppet Show', 
      type: 'watching' 
    },
    { 
      name: 'M83 - Midnight City', 
      type: 'listening'
    },
    { 
      name: `Faz ${format(process.uptime())}`, 
      type: 'playing' 
    },
    {
      name: 'Netflix',
      type: 'watching'
    },
    {
      name: `Versão ${pkg.version}`,
      type: 'streaming',
      url: 'https://www.twitch.tv/lobometalurgico'
    },
    {
      name: `Seu Shard é o ${aruna.shard.id}!`,
      type: 'watching'
    }
  ];
  async function setStatus() {
    var maintenance = await database.System.findOne({ _id: 1 });
    var inMaintenance = maintenance.maintenance;
    if (inMaintenance === true){
      aruna.user.setPresence({ game: { name: `🚫AVISO: MANUTENÇÃO PROGRAMADA PARA ${maintenance.date}! FICAREI INDISPONÍVEL POR ${maintenance.time}!🚫`}});
    } else {
      const randomStatus = status[Math.floor(Math.random() * status.length)];
      aruna.user.setPresence({ game: randomStatus });
    }
  }
  setStatus();
  setInterval(() => {
    setStatus();
  }, 15000);

  function logPrefix() {
    return `${chalk.gray('[')}${isSharded() ? `SHARD ${chalk.blue(aruna.shard.id)}` : 'ARUNA'}${chalk.gray(']')}`;
  }

  function log(...a) {
    return console.log(logPrefix(), ...a);
  }

  function warn(...a) {
    return console.warn(logPrefix(), chalk.yellow(...a));
  }

  function error(...a) {
    return console.error(logPrefix(), chalk.red(...a));
  }

  function debug(...a) {
    return console.debug(logPrefix(), chalk.magenta(...a));
  }

  function isSharded() {
    return !!aruna.shard;
  }

  if (apiKeys) {
    const client = aruna;
    const dbots = require('dbots');
    const poster = new dbots.Poster({
      client,
      apiKeys,
      clientLibrary: 'discord.js'
    });

    poster.startInterval();
  }
};