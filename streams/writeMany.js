const fs = require("fs/promises");

// const fs = require("node:fs");

// (async () => {
//   console.time("writeMany");

//   fs.open("test.txt", "w", (err, fd) => {

//     for (let i = 0; i < 1000000; i++) {
//       fs.writeSync(fd, buff);
//     }

//     console.timeEnd("writeMany");
//   });
// })();

(async () => {
  console.time("writeMany");

  //open the file
  //store the state of a file as a variable so it can be changed
  const fileHandle = await fs.open("test.txt", "w");

  const stream = fileHandle.createWriteStream();

  console.log(stream.writableHighWaterMark);

  //   const buff = Buffer.alloc(16383, 10);
  //   console.log(buff);
  //   console.log(stream.write(buff));
  //   console.log(stream.write(Buffer.alloc(1, "a")));
  //   console.log(stream.write(Buffer.alloc(1, "a")));
  //   console.log(stream.write(Buffer.alloc(1, "a")));

  //   console.log(stream.writableLength);

  //   stream.on("drain", () => {
  //     console.log(stream.write(Buffer.alloc(1, "a")));
  //     console.log(stream.writableLength);

  //     console.log("we are now safe to write more");
  //   });

  //   setInterval(() => {}, 1000);

  //   stream.write(buff);

  //   console.log(buff);

  //   console.log(stream.writableLength);

  //   //write to the file

  let i = 0;

  const writeMany = () => {
    while (i < 10000000) {
      const buff = Buffer.from(` ${i} `, "utf-8");

      if (i === 999999) {
        return stream.end(buff);
      }
      if (!stream.write(buff)) {
        i++;
        break;
      }
    }
  };
  writeMany();
  stream.on("drain", () => {
    console.log("drain");
    writeMany();
  });

  stream.on("finish", () => {
    console.timeEnd("writeMany");
  });
  fileHandle.close();
})();
