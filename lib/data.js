/*
    Library for storing and editing data
 */
// Dependencies
const fs = require('fs').promises;
const path = require('path');

// Conteiner for the module (to be exported)
const lib = {};

// Base direcotry of the data folder
lib.baseDir = path.join(__dirname, '/../.data/');

lib.normalizeFilePath = (dir, file) => path.join(lib.baseDir, dir, file + '.json');

// Write data to the file
// subdirectories within .data folder is going to be like the table or the collection of keys
lib.create = async (dir, file, data) => {
    // Open the file for writing
    // 'w' - Open file for writing. The file is created (if it does not exist) or truncated (if it exists).
    // 'wx' - Like 'w' but fails if the path exists.
    try {
        const fd = await fs.open(lib.normalizeFilePath(dir, file), 'wx');
        // Convert data to string
        const stringData = JSON.stringify(data);
        // Write to file and close it
        await fs.writeFile(fd, stringData);
        await fd.close();
    } catch (err) {
        throw new Error(`Could not create new file: ${err}`);
    }
};

// Read data from a file
lib.read = async (dir, file) => {
    return fs.readFile(lib.normalizeFilePath(dir, file), 'utf8');
};

// Update data inside a file
lib.update = async (dir, file, data) => {
    // Open the file for writing
    // 'r+' - Open file for reading and writing. An exception occurs if the file does not exist.
    try {
        const fd = await fs.open(lib.normalizeFilePath(dir, file), 'r+');
        const stringData = JSON.stringify(data);
        // Truncate hte file
        await fs.ftruncate(fd);
        // Write to the file and close it
        await fs.writeFile(fd, stringData);
        await fd.close();
    } catch (err) {
        throw new Error(`Could not update a file: ${err}`);
    }
};

// Delete a file
lib.delete = async (dir, file) => {
    // Unlink - remove the file from the file system
    return fs.unlink(lib.normalizeFilePath(dir, file));
};

//
module.exports = lib;


