///<reference path="../globals.ts" />

module TSOS {
    export class MemoryManager {
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

       /* public getMemoryFromLocation(blockNum, loc): any {
            var memBeforeParse = _Memory.getMemoryBlock(blockNum)[loc];
            if (Utils.isNaNOverride(memBeforeParse)) {
                return memBeforeParse;
            } else {
                return parseInt(memBeforeParse);
            }
        }*/

        public getMemoryFromLocationInString(blockNum, loc): string {
            var memBeforeParse = _Memory.getMemoryBlock(blockNum)[loc];
            return memBeforeParse;
        }

       public updateMemoryAtLocation(loc, newCode): void {
       }
    }
}