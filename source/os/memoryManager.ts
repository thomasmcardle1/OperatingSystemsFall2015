///<reference path="../globals.ts" />

module TSOS {

    export class MemoryManager{

        baseRegister: number = 0;
        limitRegister: number = 255;

        constructor(){}

        public init(){
        }

        public loadProgram(code) {
                this.baseRegister = 0;
                this.limitRegister = 255;
            for (var i = 0; i < code.length; i++) {
                this.updateMemoryAtLocation(i, code[i]);
            }
            return "PID " + _PID
        }

        public getMemAtLocation(location): any {
            return _Memory.getMemAtLocation(location);
        }


       public updateMemoryAtLocation(loc, code): void {
           var currentTableRow = 0;
           var hexCode = code.toString(16);

           var currBlock = _Memory.getMemory();
           if (hexCode.length < 2){
               hexCode= "0" + hexCode;
           }
           currBlock[loc] = hexCode;
           Control.updateMemTable(Math.floor(loc / 8) + currentTableRow, loc % 8, hexCode);
       }
    }
}