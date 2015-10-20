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
        MemoryManager.prototype.loadProgram = function (code) {
            this.baseRegister = 0;
            this.limitRegister = 255;
            for (var i = 0; i < code.length; i++) {
                this.updateMemoryAtLocation(i, code[i]);
            }
            return "PID " + _PID;
        };
        /* public getMemoryFromLocation(blockNum, loc): any {
             var memBeforeParse = _Memory.getMemoryBlock(blockNum)[loc];
             if (Utils.isNaNOverride(memBeforeParse)) {
                 return memBeforeParse;
             } else {
                 return parseInt(memBeforeParse);
             }
         }*/
        MemoryManager.prototype.getMemoryFromLocationInString = function (blockNum, loc) {
            var memBeforeParse = _Memory.getMemoryBlock(blockNum)[loc];
            return memBeforeParse;
        };
        MemoryManager.prototype.updateMemoryAtLocation = function (loc, newCode) {
        };
        return MemoryManager;
    })();
    TSOS.MemoryManager = MemoryManager;
})(TSOS || (TSOS = {}));
