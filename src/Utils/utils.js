/* eslint-disable max-len */
/*
    This File is part of ArunaBot
    Copyright (C) LoboMetalurgico (and contributors) 2019-2021

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
const path = require('path');
const fs = require('fs-extra');
const fetch = require('node-fetch');

function need(level) {
  const xp = [50, 100, 150, 200, 250, 300, 350, 400, 450, 500, 550, 600, 650, 700, 750, 850, 900, 950, 
    1000, 1050, 1100, 1150, 1200, 1250, 1300, 1350, 1400, 1450, 1500, 1550, 1600, 1650, 1700, 1750, 1800, 1850, 1900, 1950, 2000, 2050, 999999999999999];
  return xp[level];
}

/**
 * Download a file to disk
 * @param {string} fileUrl - url of file to download
 * @param {string} destPath - destination path
 * @returns {Promise} resolves once complete, otherwise rejects
 */
async function downloadFile(fileUrl, destPath) {
  var genStr = false;

  if (!fileUrl) return Promise.reject(new Error('Invalid fileUrl'));

  if (!destPath) {
    destPath = path.resolve(__dirname, '..', '..', 'tmp');
    genStr = true;
  }

  if (!fs.existsSync(destPath)) {
    fs.mkdirSync(path.resolve(destPath), { recursive: true });
  }

  if (genStr) {
    destPath = path.join(destPath, `${randomStringGenerator(6)}.mp3`);
  }

  return new Promise(function(resolve, reject) {
    fetch(fileUrl).then(function(res) {
      var fileStream = fs.createWriteStream(destPath);
      res.body.on('error', reject);
      fileStream.on('finish', () => {
        resolve(destPath);
      });
      res.body.pipe(fileStream);
    }).catch((err) => {
      console.log(err);
    });
  });
}

function randomStringGenerator(length = 10) {
  var result = '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}


module.exports = {
  randomStringGenerator:randomStringGenerator,
  downloadFile:downloadFile,
  need:need
};
