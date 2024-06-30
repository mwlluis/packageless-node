const fs = require("fs/promises");

(async () => {
  const CREATE_FILE = "create a file";
  const DELETE_FILE = "delete a file";
  const RENAME_FILE = "rename a file";
  const ADD_TO_FILE = "add the file";

  const createFile = async (path) => {
    // try and see if the file already exists
    try {
      const existFileHandle = await fs.open(path, "r");

      existFileHandle.close();
      return console.log("the file exists");
    } catch (e) {
      //if file doesn't exist then create it
      const newFileHandle = await fs.open(path, "w");
      console.log("new file");
      newFileHandle.close();
    }
  };

  const deleteFile = async (path) => {
    try {
      await fs.unlink(path, () => {}); //not returning my console.log
    } catch (e) {
      if (e.code === "ENOENT") {
        console.error("already gone");
        console.log(e);
        // } else {
        //   console.error;
      }
    }
    console.log("path is removed");
  };

  const renameFile = async (oldPath, newPath) => {
    try {
      await fs.rename(oldPath, newPath);
      console.log(`rename ${oldPath} to ${newPath}`);
    } catch (e) {
      if (e.code === "ENOENT") {
        console.error("name change");
        console.log(e);
      }
    }
  };

  let addedContent;

  const addToFile = async (path, content) => {
    if (addedContent === content) return;
    try {
      const fileHandle = await fs.open(path, "a");
      fileHandle.write(content);
      addedContent = content;
      console.log("content added");
    } catch (e) {
      console.log(e);
    }
  };

  const commandFileHandler = await fs.open("./text.txt", "r");

  commandFileHandler.on("change", async () => {
    //get the size of the file

    const size = (await commandFileHandler.stat()).size;

    //allocate our buffer with the size of the file
    const buff = Buffer.alloc(size);
    //the location at which we want to start filling our buffer
    const offset = 0;

    //how many bytes we want to read
    const length = buff.byteLength;
    //the position that we want to start
    const position = 0;
    // we always want to read the whole content
    const content = await commandFileHandler.read(
      buff,
      offset,
      length,
      position
    );
    const command = buff.toString("utf-8");

    if (command.includes(CREATE_FILE)) {
      const filePath = command.substring(CREATE_FILE.length + 1);

      createFile(filePath);
    }
    if (command.includes(DELETE_FILE)) {
      const filePath = command.substring(DELETE_FILE.length + 1);
      deleteFile(filePath);
    }

    if (command.includes(RENAME_FILE)) {
      const _idx = command.indexOf(" to ");
      const oldFilePath = command.substring(RENAME_FILE.length + 1, _idx);
      const newFilePath = command.substring(_idx + 4);

      renameFile(oldFilePath, newFilePath);
    }
    //add to file
    // add to the file <path> this content: <content>
    if (command.includes(ADD_TO_FILE)) {
      const _idx = command.indexOf(" this content: ");
      const filePath = command.substring(ADD_TO_FILE.length + 1, _idx);
      const content = command.substring(_idx + 15);

      addToFile(filePath, content);
    }
  });

  const watcher = fs.watch("./text.txt");

  for await (const event of watcher) {
    if (event.eventType === "change") {
      commandFileHandler.emit("change");
    }
  }
})();
