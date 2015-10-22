///<reference path="../globals.ts" />

module TSOS {

    export class MemoryManager{

        baseRegister: number = 0;
        limitRegister: number = 255;

        constructor(){}

        public init(){
        }

        public loadProgram(code) {
            _Memory.clearMem();
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


       public updateMemoryAtLocation(memLoc, code): void {
           var hexCode = code.toString(16);

           var currBlock = _Memory.getMemory();
           if (hexCode.length < 2){
               hexCode= "0" + hexCode;
           }
           currBlock[memLoc] = hexCode;
           var currentTableRow = Math.floor(memLoc/8);
           Control.updateMemTable(currentTableRow, memLoc % 8, hexCode);
       }
    }
}