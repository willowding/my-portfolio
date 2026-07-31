const fs = require('fs');
const path = require('path');
function walk(d) {
  for (const f of fs.readdirSync(d, { withFileTypes: true })) {
    const fp = path.join(d, f.name);
    if (f.isDirectory()) {
      if (f.name === 'node_modules' || f.name === '.next' || f.name === '.git') continue;
      walk(fp);
    } else if (f.name.endsWith('.json')) {
      const b = fs.readFileSync(fp);
      if (b[0] === 0xEF && b[1] === 0xBB && b[2] === 0xBF) {
        fs.writeFileSync(fp, b.slice(3));
        console.log('stripped:', fp);
      }
    }
  }
}
walk('.');
console.log('done');
