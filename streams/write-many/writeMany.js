const fs = require("fs/promises");

(async () => {
  console.time("writeMany");

  //open the file
  //store the state of a file as a variable so it can be changed
  const fileHandle = await fs.open("test.txt", "w");

  const stream = fileHandle.createWriteStream();

  console.log(stream.writableHighWaterMark);

  let i = 0;

  const numberOfWrites = 1000000;

  const writeMany = () => {
    while (i < numberOfWrites) {
      const buff = Buffer.from(` ${i} `, "utf-8");

      if (i === numberOfWrites - 1) {
        return stream.end(buff);
      }
      if (!stream.write(buff)) {
        break;
      }
      i++;
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
  stream.on("close", () => {
    console.log("stream was closed");
  });
  //   });
})();
