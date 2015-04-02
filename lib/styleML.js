exports.styleML = function (css, cssFilePath) {
    var fs = require('fs');
    var rootToRemove = "static";
    var rootToSearch = "client";
    var pathSep = require('path').sep;
    var base64Converter = require("./base64Converter");
    var matches = css.match(/url\('[^']*'\)|url\("[^"]*"\)/g);



    if (!matches) {
        return css;
    }

    for (var i = 0; i < matches.length; i++) {
        var path = matches[i].match(/'[^']*'|"[^"]*"/)[0].slice(1, -1);

        if (path.match(/^data:/)) {
            continue;
        }

        if (path.match(/^http:\/\//) || path.match(/^https:\/\//)) {
            continue;
        }

        path = path.replace( /\//g, pathSep);

        var extensionMatches = path.match(/\.([^.]*)/);
        if (!extensionMatches) {
            throw "image file extension can not be omitted. image path =  " + path;
        }
        var extension = extensionMatches[1];

        var fullPath = path;
        var realRootToRemove = pathSep + rootToRemove + pathSep;
        var realRootToSearch = pathSep + rootToSearch + pathSep;

        if (path.indexOf(realRootToRemove) == 0) {
            path = path.replace(realRootToRemove, realRootToSearch);
        }

        if (path.indexOf(realRootToSearch) == 0) {
            fullPath = path;
            fullPath = cssFilePath.substring(0, cssFilePath.indexOf(realRootToSearch) + realRootToSearch.length) +
                path.replace(realRootToSearch, pathSep);
        }

        if(!fs.existsSync(fullPath)) {
            css = css.replace(matches[i], matches[i] + " /*File " + fullPath + " doesn't exist. Check path*/");
            continue;
        }

        var base64str = base64Converter.fileToBase64(fullPath);

        if (!base64str) {
            css = css.replace(matches[i], matches[i] + " /* Maybe too large */");
            continue;
        }

        var mimeType;

        if (extension === 'png') {
            mimeType = 'image/png';
        }
        else if (extension === 'jpg' || extension === 'jpeg') {
            mimeType = 'image/jpeg';
        }

        var dataUrl = "url('data:" + mimeType + ";base64," + base64str + "')";
        css = css.replace(matches[i], dataUrl);
    }
    return css;
};
