///<reference path="../globals.ts" />
var TSOS;
(function (TSOS) {
    var fileSystemDeviceDriver = (function () {
        function fileSystemDeviceDriver() {
            this.tracks = 4;
            this.blocks = 8;
            this.sectors = 8;
            this.metaSize = 4;
            this.fileSize = 64;
        }
        fileSystemDeviceDriver.prototype.initialize = function () {
            console.log("TRACKS");
            sessionStorage.clear();
            for (var x = 0; x < this.tracks; x++) {
                for (var y = 0; y < this.sectors; y++) {
                    for (var z = 0; z < this.blocks; z++) {
                        var blank = "";
                        for (var i = 0; i < this.fileSize; i++) {
                            blank += "~";
                        }
                        sessionStorage.setItem(this.keyGenerator(x, y, z), blank);
                    }
                }
            }
            _Formatted = true;
            this.createTable();
        };
        fileSystemDeviceDriver.prototype.findFreeDirBlock = function () {
            var freeKey;
            //Best Way to break out of nested loops according to stack overflow
            loop1: for (var x = 0; x < this.tracks; x++) {
                for (var y = 0; y < this.sectors; y++) {
                    for (var z = 0; z < this.blocks; z++) {
                        var key = this.keyGenerator(x, y, z);
                        var data = sessionStorage.getItem(key);
                        var meta = data.substr(0, 1);
                        if (meta == "~") {
                            freeKey = key;
                            break loop1;
                        }
                        else {
                            freeKey = -1;
                        }
                    }
                }
            }
            //console.log(freeKey);
            return freeKey;
        };
        fileSystemDeviceDriver.prototype.findFreeFileBlock = function () {
            var freeKey;
            //Best Way to break out of nested loops according to stack overflow
            loop1: for (var x = 1; x < this.tracks; x++) {
                for (var y = 0; y < this.sectors; y++) {
                    for (var z = 0; z < this.blocks; z++) {
                        var key = this.keyGenerator(x, y, z);
                        var value = sessionStorage.getItem(key);
                        var data = value.substr(4, 1);
                        if (data == "~") {
                            freeKey = key;
                            break loop1;
                        }
                    }
                }
            }
            //console.log(freeKey);
            return freeKey;
        };
        fileSystemDeviceDriver.prototype.createFile = function (fileName) {
            var bool = false;
            var hexFile = this.stringToHex(fileName);
            var freeDirBlock = this.findFreeDirBlock();
            var freeFileBlock = this.findFreeFileBlock();
            if (freeDirBlock == -1 || freeFileBlock == -1) {
                bool = false;
            }
            else {
                //console.log(freeDirBlock +""+freeFileBlock);
                var meta = "1" + freeFileBlock;
                var data = meta + hexFile;
                for (var i = data.length; i < this.fileSize; i++) {
                    data += "~";
                }
                var fileData = "1---";
                for (var x = fileData.length; x < this.fileSize; x++) {
                    fileData += "~";
                }
                sessionStorage.setItem(freeDirBlock, data);
                //console.log("File Name: " + data);
                sessionStorage.setItem(freeFileBlock, fileData);
                bool = true;
            }
            this.updateFileSystemTable();
            return bool;
        };
        fileSystemDeviceDriver.prototype.readFile = function (fileName) {
            var hexFile = this.stringToHex(fileName);
            for (var i = hexFile.length; i < (this.fileSize - 4); i++) {
                hexFile += "~";
            }
            var fileDirKey;
            //Best Way to break out of nested loops according to stack overflow
            loop1: for (var x = 0; x < this.tracks; x++) {
                for (var y = 0; y < this.sectors; y++) {
                    for (var z = 0; z < this.blocks; z++) {
                        var key = this.keyGenerator(x, y, z);
                        var data = sessionStorage.getItem(key);
                        var meta = data.substr(4, 64);
                        if (meta == hexFile) {
                            fileDirKey = key;
                            break loop1;
                        }
                    }
                }
            }
            if (fileDirKey != null) {
                var fileLocation = sessionStorage.getItem(fileDirKey).substr(1, 3);
                var hexFileData = sessionStorage.getItem(fileLocation);
                var stringFileData;
                if (hexFileData.substr(0, 4) == "1---") {
                    stringFileData = this.HexToString(hexFileData);
                    return stringFileData;
                }
                else {
                    var fileData = "";
                    var check = 1;
                    var nextFileLoc = fileLocation;
                    while (check != 0) {
                        var hexData = sessionStorage.getItem(nextFileLoc);
                        var meta = hexData.substr(0, 4);
                        if (meta != '1---') {
                            var getString = hexData.substr(4, (hexData.length));
                            fileData += this.HexToString(getString);
                            nextFileLoc = hexData.substr(1, 3);
                        }
                        else {
                            //console.log(nextFileLoc);
                            var getString = hexData.substr(4, (hexData.length));
                            //console.log("getString: " + getString);
                            fileData += this.HexToString(getString);
                            //console.log(fileData);
                            stringFileData = fileData;
                            check = 0;
                        }
                    }
                    stringFileData = fileData;
                }
            }
            //console.log("Read File Return: " + stringFileData);
            return stringFileData;
        };
        fileSystemDeviceDriver.prototype.writeFile = function (fileName, fileData) {
            var hexFileName = this.stringToHex(fileName);
            for (var i = hexFileName.length; i < (this.fileSize - 4); i++) {
                hexFileName += "~";
            }
            var fileDirKey;
            //Best Way to break out of nested loops according to stack overflow
            loop1: for (var x = 0; x < this.tracks; x++) {
                for (var y = 0; y < this.sectors; y++) {
                    for (var z = 0; z < this.blocks; z++) {
                        var key = this.keyGenerator(x, y, z);
                        var data = sessionStorage.getItem(key);
                        var meta = data.substr(4, 64);
                        //console.log(meta);
                        if (meta == hexFileName) {
                            fileDirKey = key;
                            break loop1;
                        }
                    }
                }
            }
            if (fileDirKey != null) {
                var fileLocation = sessionStorage.getItem(fileDirKey).substr(1, 3);
                //console.log(fileLocation);
                var hexFileData = this.stringToHex(fileData);
                //console.log(hexFileData.length);
                //console.log(hexFileData);
                if (hexFileData.length <= 60) {
                    hexFileData = "1---" + hexFileData;
                    for (var i = hexFileData.length; i < this.fileSize; i++) {
                        hexFileData += "~";
                    }
                    sessionStorage.setItem(fileLocation, hexFileData);
                }
                else {
                    while (hexFileData.length > 0) {
                        var freeFileBlock;
                        if (hexFileData.length <= 60) {
                            freeFileBlock = this.findFreeFileBlock();
                            hexFileData = "1---" + hexFileData;
                            for (var i = hexFileData.length; i < this.fileSize; i++) {
                                hexFileData += "~";
                            }
                            sessionStorage.setItem(freeFileBlock, hexFileData);
                            hexFileData = "";
                        }
                        else {
                            var firstfreeFileBlock = this.findFreeFileBlock();
                            var string = "1~~~";
                            sessionStorage.setItem(firstfreeFileBlock, string);
                            freeFileBlock = this.findFreeFileBlock();
                            //console.log(freeFileBlock);
                            var subString = hexFileData.substr(0, 60);
                            var newData = "1" + freeFileBlock + subString;
                            sessionStorage.setItem(firstfreeFileBlock, newData);
                            //console.log("Before SubString: " + newData);
                            hexFileData = hexFileData.substr(60, (hexFileData.length));
                        }
                    }
                }
            }
            this.updateFileSystemTable();
        };
        fileSystemDeviceDriver.prototype.deleteFile = function (fileName) {
            var blank = "";
            for (var i = 0; i < this.fileSize; i++) {
                blank += "~";
            }
            var hexFile = this.stringToHex(fileName);
            for (var i = hexFile.length; i < (this.fileSize - 4); i++) {
                hexFile += "~";
            }
            var fileDirKey;
            //Best Way to break out of nested loops according to stack overflow
            loop1: for (var x = 0; x < this.tracks; x++) {
                for (var y = 0; y < this.sectors; y++) {
                    for (var z = 0; z < this.blocks; z++) {
                        var key = this.keyGenerator(x, y, z);
                        var data = sessionStorage.getItem(key);
                        var meta = data.substr(4, 64);
                        //console.log(meta);
                        if (meta == hexFile) {
                            fileDirKey = key;
                            break loop1;
                        }
                    }
                }
            }
            if (fileDirKey != null) {
                var fileLocation = sessionStorage.getItem(fileDirKey).substr(1, 3);
                var hexFileData = sessionStorage.getItem(fileLocation);
                var stringFileData;
                if (fileDirKey != null) {
                    sessionStorage.setItem(fileDirKey, blank);
                }
                if (hexFileData.substr(0, 4) == "1---") {
                    //console.log(hexFileData);
                    sessionStorage.setItem(fileLocation, blank);
                }
                else {
                    var check = 1;
                    var nextFileLoc = fileLocation;
                    while (check != 0) {
                        var hexData = sessionStorage.getItem(nextFileLoc);
                        var meta = hexData.substr(0, 4);
                        if (meta != '1---') {
                            var getString = hexData.substr(4, (hexData.length));
                            sessionStorage.setItem(nextFileLoc, blank);
                            nextFileLoc = hexData.substr(1, 3);
                        }
                        else {
                            sessionStorage.setItem(nextFileLoc, blank);
                            check = 0;
                        }
                    }
                }
            }
        };
        fileSystemDeviceDriver.prototype.createTable = function () {
            var table = " <thead><tr><th> T S B  </th><th> Meta   </th><th> Data  </th></tr>";
            for (var x = 0; x < this.tracks; x++) {
                for (var y = 0; y < this.sectors; y++) {
                    for (var z = 0; z < this.blocks; z++) {
                        var data = sessionStorage.getItem(this.keyGenerator(x, y, z));
                        var meta = (data.substr(0, 4));
                        data = data.substr(4, 60);
                        var key = this.keyGenerator(x, y, z);
                        table += "<tr><td>" + key + "</td><td>" + meta + "</td><td>" + data + "</td></tr>";
                    }
                }
            }
            _HardDriveTable.innerHTML = table;
        };
        fileSystemDeviceDriver.prototype.keyGenerator = function (t, s, b) {
            return (t + "" + s + "" + b);
        };
        fileSystemDeviceDriver.prototype.stringToHex = function (loc) {
            var hexString = "";
            for (var i = 0; i < loc.length; i++) {
                hexString += loc.charCodeAt(i).toString(16);
            }
            return hexString;
        };
        fileSystemDeviceDriver.prototype.HexToString = function (hexData) {
            var string = "";
            for (var i = 0; i < hexData.length; i += 2) {
                string += String.fromCharCode(parseInt(hexData.substr(i, 2), 16));
            }
            return string;
        };
        fileSystemDeviceDriver.prototype.updateFileSystemTable = function () {
            var table = " <thead><tr><th> T S B  </th><th> Meta   </th><th> Data  </th></tr>";
            for (var x = 0; x < this.tracks; x++) {
                for (var y = 0; y < this.sectors; y++) {
                    for (var z = 0; z < this.blocks; z++) {
                        var data = sessionStorage.getItem(this.keyGenerator(x, y, z));
                        var meta = (data.substr(0, 4));
                        data = data.substr(4, 60);
                        var key = this.keyGenerator(x, y, z);
                        table += "<tr><td>" + key + "</td><td>" + meta + "</td><td>" + data + "</td></tr>";
                    }
                }
            }
            _HardDriveTable.innerHTML = table;
        };
        return fileSystemDeviceDriver;
    })();
    TSOS.fileSystemDeviceDriver = fileSystemDeviceDriver;
})(TSOS || (TSOS = {}));
