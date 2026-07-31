const fs = require('fs');
const path = 'C:\\cursor\\willowding-portfolio\\data\\picreview-dau.json';
let c = fs.readFileSync(path, 'utf-8');
if (c.charCodeAt(0) === 0xFEFF) {
  fs.writeFileSync(path, c.slice(1), 'utf-8');
  console.log('BOM removed, new first 3 bytes:', fs.readFileSync(path).slice(0, 3).toString('hex'));
} else {
  console.log('no BOM, first 3 bytes:', fs.readFileSync(path).slice(0, 3).toString('hex'));
}
