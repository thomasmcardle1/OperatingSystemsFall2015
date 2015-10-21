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
            var currMem = _Memory.getMemoryBlock();
            var memAtLoc = currMem[location];
            //console.log(memAtLoc);
            return memAtLoc;
        }

        public getNextSpace(){

        }


       public updateMemoryAtLocation(loc, code): void {
           var currentTableRow = 0;
           var hexCode = code.toString(16);

           var currBlock = _Memory.getMemoryBlock();
           if (hexCode.length < 2)
               hexCode= "0" + hexCode;
           currBlock[loc] = hexCode;
           Control.updateMemTable(Math.floor(loc / 8) + currentTableRow, loc % 8, hexCode);
       }

        public getNextByte(){
            var nxt = _MemoryManager.getMemAtLocation(_CurrPCB.PC +1);
            return this.hexToDec(nxt);
        }

        public getNextTwoBytes(){
            var nxt2 = (_MemoryManager.getMemAtLocation(_CurrPCB.PC+1)) + (_MemoryManager.getMemAtLocation(_CurrPCB.PC + 2));
            return this.hexToDec(nxt2);
        }

        public hexToDec(hexNum): number{
            return parseInt(hexNum,16);
        }
    }
}