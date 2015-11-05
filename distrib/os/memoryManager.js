///<reference path="../globals.ts" />
var TSOS;
(function (TSOS) {
    var MemoryManager = (function () {
        function MemoryManager() {
            this.baseRegister = 0;
            this.limitRegister = 255;
        }
        MemoryManager.prototype.init = function () {
        };
        MemoryManager.prototype.loadProgram = function (currBlock, code) {
            if (currBlock === 0) {
                this.baseRegister = 0;
                this.limitRegister = 255;
            }
            else if (currBlock === 1) {
                this.baseRegister = 256;
                this.limitRegister = 511;
            }
            else if (currBlock === 2) {
                this.baseRegister = 512;
                this.limitRegister = 768;
            }
            console.log(this.baseRegister);
            for (var i = 0; i < code.length; i++) {
                this.updateMemoryAtLocation(i, code[i]);
            }
            return "pid " + _PID;
        };
        MemoryManager.prototype.findNextAvailMem = function () {
            for (var i = 0; i < _ProgramSize * _NumberOfPrograms; i += 256) {
                if (_Memory.memoryArray[i] == "00") {
                    return i;
                }
                return null;
            }
        };
        MemoryManager.prototype.getMemAtLocation = function (location) {
            return _Memory.getMemAtLocation(location);
        };
        MemoryManager.prototype.updateMemoryAtLocation = function (memLoc, code) {
            var startRow = 0;
            /* if(currBlock ==0){
                 startRow =0;
             }else if(currBlock == 1){
                 startRow = 32;
             }else if(currBlock ==2){
                 startRow =64;
             }*/
            var hexCode = code.toString(16);
            var currBlock = _Memory.getMemory();
            if (hexCode.length < 2) {
                hexCode = "0" + hexCode;
            }
            currBlock[memLoc] = hexCode;
            var currentTableRow = ((Math.floor(memLoc / 8)));
            TSOS.Control.updateMemTable(currentTableRow, memLoc % 8, hexCode);
        };
        return MemoryManager;
    })();
    TSOS.MemoryManager = MemoryManager;
})(TSOS || (TSOS = {}));
