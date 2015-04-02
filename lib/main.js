(function () {
    var fs = require('fs');
    var less = require('../../less');
    var processor = require('./styleML');

    var path = require('path');
    var pathSep = path.sep;

    var lessFilePath = process.argv[2];
    var cssFilePath = process.argv[3];

    var dirPath = lessFilePath.replace(new RegExp('\\' + pathSep + "[\\w-]*(.less)"), "");

    if (!lessFilePath) {
        console.error("Error: Provide less filename");
        process.exit(1);
    }

    if (!cssFilePath) {
        console.error("Error: Provide css filename");
        process.exit(1);
    }

    var lessData = fs.readFileSync(lessFilePath, 'utf8');

    less.render(lessData, {paths: [dirPath]}, function (err, cssData) {
        if(err) {
            console.error('Less compile error: ' + lessFilePath);
            console.error(err.message);
            process.exit(1);
        }

        var result = processor.styleML(cssData, cssFilePath);
        fs.writeFile(cssFilePath, result, function(err){
            if(err) {
                console.error(err.message);
            }
        });
    });

}).call(this);