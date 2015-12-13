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
                            if(i==4){
                                blank+="0"
                            }else{
                                blank += "~";
                            }
                        }
                        console.log(blank);
                        sessionStorage.setItem(this.keyGenerator(x,y,z),blank);
                    }
                }
            }
            this.createTable();
        }

        public createFile(fileName){
            var hexFile = this.fileToHex(fileName);
            return hexFile;
        }

        public findFreeDir(){}

        public createTable(){
            var table = " <thead><tr><th> T S B  </th><th> Meta   </th><th> Data  </th></tr>";
            for(var x=0; x < this.tracks; x++){
                for(var y=0; y<this.sectors; y++){
                    for(var z=0; z<this.blocks; z++){
                        var data = sessionStorage.getItem(this.keyGenerator(x,y,z));
                        console.log(data);
                        var meta = (data.substr(0,4));
                        console.log(meta);
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

        public fileToHex(fileName){
            var hexString = "";
            for(var i = 0; i < fileName.length; i++){
                hexString += fileName.charCodeAt(i).toString(16);
            }
            return hexString;
        }
    }
}
