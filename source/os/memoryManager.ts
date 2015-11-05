///<reference path="../globals.ts" />

module TSOS {

    export class MemoryManager{

        baseRegister: number = 0;
        limitRegister: number = 255;

        constructor(){}

        public init(){
        }

        public loadProgram(currBlock, code) {
            if(currBlock ===0){
                this.baseRegister =0;
                this.limitRegister =255;
            }else if(currBlock ===1){
                this.baseRegister = 256;
                this.limitRegister =511;
            }else if(currBlock === 2){
                this.baseRegister = 512;
                this.limitRegister = 768;
            }
            console.log(this.baseRegister);

            for (var i = 0; i < code.length; i++) {
                this.updateMemoryAtLocation(this.baseRegister, i, code[i]);
            }
            return "pid " + _PID;
        }

        public findNextAvailMem(){
            for(var i=0; i < _ProgramSize*_NumberOfPrograms; i+=256){
                if(_Memory.memoryArray[i] == "00"){
                    return i;
                }
                return null;
            }
        }

        public getMemAtLocation(location): any {
            return _Memory.getMemAtLocation(location);
        }


       public updateMemoryAtLocation(baseRegister, memLoc, code): void {
           var startRow = 0;

          if(baseRegister==0){
               startRow =0;
           }else if(baseRegister== 256){
               startRow = 32;
           }else if(baseRegister == 512){
               startRow =64;
           }

           var hexCode = code.toString(16);

           var currBlock = _Memory.getMemory();
           if (hexCode.length < 2){
               hexCode= "0" + hexCode;
           }
           currBlock[memLoc] = hexCode;
           var currentTableRow = ((Math.floor(memLoc/8))+startRow);
           Control.updateMemTable(currentTableRow, memLoc % 8, hexCode);
           console.log(currentTableRow, memLoc%8, hexCode);
       }
    }
}