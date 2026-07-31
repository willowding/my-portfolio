var fs=require('fs');  
var root='c:/cursor/willowding-portfolio/';  
function apply(rel, find, repl){  
  var p=root+rel;  
  var s=fs.readFileSync(p,'utf8');  
  if(!s.includes(find))throw new Error('miss '+rel);  
  fs.writeFileSync(p,s.replace(find,repl),'utf8');  
  console.log('ok',rel);  
}  
global-lt-a-gt  
