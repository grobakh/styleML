exports.fileToBase64 = function (filePath) {
    var fs = require("fs");
    var stats = fs.statSync(filePath);
    if(stats.size > 32 * 1024)   //32Kb max
    {
        return;
    }
    var fd = fs.openSync(filePath, "r");
    var buffer = new Buffer(stats.size);

    fs.readSync(fd, buffer, 0, buffer.length, null)
    fs.close(fd);
    var data = buffer.toString("base64");//, 0, buffer.length);

    return data;
}
