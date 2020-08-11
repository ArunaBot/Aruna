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
const { apiKeys, config, database } = require('../../Configs');

const language = require(`../../languages/bot/${config.language}/internal.json`);

exports.run = async (aruna) => {
  log('Conectado!');

  let totalSeconds = (aruna.uptime / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor(totalSeconds / 3600);
  totalSeconds %= 3600;
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = Math.floor(totalSeconds % 60);

  var uptime = '';

  if (days >= 1) {
    uptime = `${days}d, ${hours}h, ${minutes}m`;
  } else if (hours >= 1) {
    uptime = `${hours}h, ${minutes}m, ${seconds}s`;
  } else if (minutes >= 1) {
    uptime = `${minutes}m, ${seconds}s`;
  } else {
    uptime = `${seconds}s`;
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
      name: `Faz ${uptime}`, 
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
    return `${chalk.gray('[')}${isSharded() ? `${language.generic.shard} ${chalk.blue(aruna.shard.id)}` : aruna.user.username}${chalk.gray(']')}`;
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