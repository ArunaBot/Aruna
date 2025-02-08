const path = require('path');
const fs = require('fs');

const src = path.resolve(__dirname, '..', 'resources');
const dest = path.resolve(__dirname, '..', '..', 'build', 'aruna', 'resources');

fs.cpSync(src, dest, { recursive: true, force: true, preserveTimestamps: true });
