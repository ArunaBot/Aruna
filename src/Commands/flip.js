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

exports.run = async (aruna, message, args) => {
  var add = Math.round(Math.random());
  if (add == 0){
    message.channel.send('Cara!');
  } else if (add == 1){
    message.channel.send('Coroa!');
  } else {
    message.reply('Erro!');
  }
};

exports.config = {
  name: 'flip',
  aliases: ['moeda', 'girar'],
  category: '🎉 Entretenimento'
};