///<reference path="../globals.ts" />

module TSOS {
    export class fileSystemDeviceDriver {
        constructor() {}
        public tracks = 4;
        public blocks = 8;
        public sectors = 8;
        public metaSize = 4;
        public fileSize = 64;

        public initialize(){
            console.log("TRACKS");
            sessionStorage.clear();
            for(var x=0; x < this.tracks; x++){
                for(var y=0; y<this.sectors; y++){
                    for(var z=0; z<this.blocks; z++){
                        var blank="";
                        for(var i=0; i<this.fileSize;i++){
                            blank += "~";
                        }
                        sessionStorage.setItem(this.keyGenerator(x,y,z),blank);
                    }
                }
            }
            _Formatted = true;
            this.createTable();
        }

        public findFreeDirBlock(){
            var freeKey;
            //Best Way to break out of nested loops according to stack overflow
            loop1:
                for(var x=0; x < this.tracks; x++){
                    for(var y=0; y<this.sectors; y++){
                        for(var z=0; z<this.blocks; z++){
                            var key = this.keyGenerator(x,y,z);
                            var data = sessionStorage.getItem(key);
                            var meta = data.substr(0,1);
                            if(meta == "~"){
                                freeKey = key;
                                break loop1;
                            }else{
                                freeKey =-1;
                            }
                        }
                    }
                }
            //console.log(freeKey);
            return freeKey;
        }

        public findFreeFileBlock(){
            var freeKey;

            //Best Way to break out of nested loops according to stack overflow
            loop1:
                for(var x=1; x < this.tracks; x++){
                    for(var y=0; y<this.sectors; y++){
                        for(var z=0; z<this.blocks; z++){
                            var key = this.keyGenerator(x,y,z);
                            var value = sessionStorage.getItem(key);
                            var data = value.substr(4,1);
                            if(data == "~"){
                                freeKey = key;
                                break loop1;
                            }
                        }
                    }
                }
            //console.log(freeKey);
            return freeKey;
        }

        public createFile(fileName):boolean{
            var bool = false;
            var hexFile = this.stringToHex(fileName);
            var freeDirBlock = this.findFreeDirBlock();
            var freeFileBlock = this.findFreeFileBlock();
            if(freeDirBlock == -1 || freeFileBlock == -1){
                bool = false;
            }else{
                //console.log(freeDirBlock +""+freeFileBlock);
                var meta = "1"+freeFileBlock;
                var data = meta+hexFile;
                for(var i=data.length; i<this.fileSize;i++){
                    data+="~";
                }
                var fileData = "1---";
                for(var x=fileData.length; x<this.fileSize; x++){
                    fileData += "~";
                }
                sessionStorage.setItem(freeDirBlock, data);
                //console.log("File Name: " + data);
                sessionStorage.setItem(freeFileBlock, fileData);
                bool = true;
            }

            this.updateFileSystemTable();
            _ListOfFileNames.push(fileName);
            return bool;

        }

        public readFile(fileName): string{
            var hexFile = this.stringToHex(fileName);
            for(var i=hexFile.length; i<(this.fileSize-4);i++){
                hexFile+="~";
            }
            var fileDirKey;
            //Best Way to break out of nested loops according to stack overflow
            loop1:
                for(var x=0; x < this.tracks; x++){
                    for(var y=0; y<this.sectors; y++){
                        for(var z=0; z<this.blocks; z++){
                            var key = this.keyGenerator(x,y,z);
                            var data = sessionStorage.getItem(key);
                            var meta = data.substr(4,64);
                            if(meta == hexFile){
                                fileDirKey = key;
                                break loop1;
                            }
                        }
                    }
                }
            if(fileDirKey!=null) {
                var fileLocation = sessionStorage.getItem(fileDirKey).substr(1, 3);
                var hexFileData = sessionStorage.getItem(fileLocation);
                var stringFileData;
                if (hexFileData.substr(0, 4) == "1---") {
                    stringFileData = this.HexToString(hexFileData);
                    return stringFileData;
                } else {
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
                            //console.log(nextFileLoc);
                        } else {
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
        }

        public writeFile(fileName, fileData){
            var hexFileName = this.stringToHex(fileName);
            for(var i=hexFileName.length; i<(this.fileSize-4);i++){
                hexFileName+="~";
            }
            var fileDirKey;
            //Best Way to break out of nested loops according to stack overflow
            loop1:
                for(var x=0; x < this.tracks; x++){
                    for(var y=0; y<this.sectors; y++){
                        for(var z=0; z<this.blocks; z++){
                            var key = this.keyGenerator(x,y,z);
                            var data = sessionStorage.getItem(key);
                            var meta = data.substr(4,64);
                            //console.log(meta);
                            if(meta == hexFileName){
                                fileDirKey = key;
                                break loop1;
                            }
                        }
                    }
                }
            if(fileDirKey != null){
                var fileLocation = sessionStorage.getItem(fileDirKey).substr(1,3);
                //console.log(fileLocation);
                var hexFileData = this.stringToHex(fileData);
                //console.log(hexFileData.length);
                //console.log(hexFileData);
                if(hexFileData.length <= 60){
                    hexFileData = "1---"+hexFileData;
                    for(var i=hexFileData.length; i<this.fileSize;i++){
                        hexFileData+="~";
                    }
                    sessionStorage.setItem(fileLocation, hexFileData);
                }else {
                    while (hexFileData.length > 0) {
                        var freeFileBlock;
                        if(hexFileData.length<=60){
                            freeFileBlock = this.findFreeFileBlock();
                            hexFileData = "1---"+hexFileData;
                            for(var i=hexFileData.length; i<this.fileSize;i++){
                                hexFileData+="~";
                            }
                            sessionStorage.setItem(freeFileBlock, hexFileData);
                            hexFileData = "";
                        }else{
                            var firstfreeFileBlock = this.findFreeFileBlock();
                            var string = "1~~~";
                            sessionStorage.setItem(firstfreeFileBlock,string);
                            freeFileBlock = this.findFreeFileBlock();
                            //console.log(freeFileBlock);
                            var subString = hexFileData.substr(0,60);
                            var newData = "1" + freeFileBlock + subString;
                            sessionStorage.setItem(firstfreeFileBlock, newData);
                            //console.log("Before SubString: " + newData);
                            hexFileData = hexFileData.substr(60, (hexFileData.length));
                            //console.log("hex file: " + hexFileData);
                            //console.log(hexFileData.length);
                        }
                    }
                }
            }

            this.updateFileSystemTable();
        }

        public deleteFile(fileName){
            var blank="";
            for(var i=0; i<this.fileSize;i++){
                blank += "~";
            }

            var hexFile = this.stringToHex(fileName);
            for(var i=hexFile.length; i<(this.fileSize-4);i++){
                hexFile+="~";
            }
            var fileDirKey;
            //Best Way to break out of nested loops according to stack overflow
            loop1:
                for(var x=0; x < this.tracks; x++){
                    for(var y=0; y<this.sectors; y++){
                        for(var z=0; z<this.blocks; z++){
                            var key = this.keyGenerator(x,y,z);
                            var data = sessionStorage.getItem(key);
                            var meta = data.substr(4,64);
                            //console.log(meta);
                            if(meta == hexFile){
                                fileDirKey = key;
                                break loop1;
                            }
                        }
                    }
                }

            if(fileDirKey != null){
                var fileLocation =sessionStorage.getItem(fileDirKey).substr(1,3);
                var hexFileData = sessionStorage.getItem(fileLocation);
                var stringFileData;
                //Remove from List of file names
                for(var i=0; i<_ListOfFileNames.length;i++){
                    if(_ListOfFileNames[i] == fileName){
                        _ListOfFileNames.splice(i, 1);
                    }
                }

                if(fileDirKey!=null) {
                    sessionStorage.setItem(fileDirKey, blank);
                }
                if(hexFileData.substr(0,4) == "1---"){
                    //console.log(hexFileData);
                    sessionStorage.setItem(fileLocation, blank);
                }else{
                    var check = 1;
                    var nextFileLoc = fileLocation;
                    while(check != 0){
                        var hexData = sessionStorage.getItem(nextFileLoc);
                        var meta = hexData.substr(0,4);
                        if(meta != '1---'){
                            var getString = hexData.substr(4,(hexData.length));
                            sessionStorage.setItem(nextFileLoc, blank);
                            nextFileLoc = hexData.substr(1,3);
                            //console.log(nextFileLoc);
                        }else{
                            sessionStorage.setItem(nextFileLoc, blank);
                            check =0;
                        }
                    }
                }
            }

        }

        public createTable(){

            var table = " <thead><tr><th> T S B  </th><th> Meta   </th><th> Data  </th></tr>";
            for(var x=0; x < this.tracks; x++){
                for(var y=0; y<this.sectors; y++){
                    for(var z=0; z<this.blocks; z++){
                        var data = sessionStorage.getItem(this.keyGenerator(x,y,z));
                        var meta = (data.substr(0,4));
                        data = data.substr(4,60);
                        var key = this.keyGenerator(x,y,z);
                        table += "<tr><td>"+key+"</td><td>"+meta+"</td><td>"+data+"</td></tr>";
                    }
                }
            }
            _HardDriveTable.innerHTML = table;
        }

        public keyGenerator(t,s,b){
            return (t+""+s+""+b);
        }

        public stringToHex(loc){
            var hexString = "";
            for(var i = 0; i < loc.length; i++){
                hexString += loc.charCodeAt(i).toString(16);
            }
            return hexString;
        }

        public HexToString(hexData){
            var string = "";
            for (var i = 0; i < hexData.length; i+=2){
                string += String.fromCharCode(parseInt(hexData.substr(i, 2), 16));
            }
            return string;
        }

        public updateFileSystemTable(){
            var table = " <thead><tr><th> T S B  </th><th> Meta   </th><th> Data  </th></tr>";
            for(var x=0; x < this.tracks; x++){
                for(var y=0; y<this.sectors; y++){
                    for(var z=0; z<this.blocks; z++){
                        var data = sessionStorage.getItem(this.keyGenerator(x,y,z));
                        var meta = (data.substr(0,4));
                        data = data.substr(4,60);
                        var key = this.keyGenerator(x,y,z);
                        table += "<tr><td>"+key+"</td><td>"+meta+"</td><td>"+data+"</td></tr>";
                    }
                }
            }
            _HardDriveTable.innerHTML = table;

        }
    }
}
