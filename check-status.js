const http = require('http');

const paths = ['/', '/experience', '/en', '/en/experience'];
const host = 'localhost';
const port = 3001;

let completed = 0;
paths.forEach(path => {
  const req = http.request({ host, port, path, method: 'GET' }, res => {
    console.log(`${path}: ${res.statusCode}`);
    completed++;
    if (completed === paths.length) process.exit(0);
  });
  req.on('error', e => {
    console.log(`${path}: ERROR - ${e.message}`);
    completed++;
    if (completed === paths.length) process.exit(0);
  });
  req.end();
});
