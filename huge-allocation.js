const { Buffer } = require("buffer");

const b = Buffer.alloc(1e9);

console.log(b.length + " bytes");

for (let i = 0; i < b.length; i++) {
  b[i] = 0x22;
}
