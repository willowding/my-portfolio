const fs=require(" fs\);const b64=process.argv[2];fs.writeFileSync(process.argv[3],Buffer.from(b64,\base64\));console.log(\written\,fs.statSync(process.argv[3]).size);
