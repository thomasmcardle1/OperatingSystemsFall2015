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
        MemoryManager.prototype.getMemAtLocation = function (location) {
            return _Memory.getMemAtLocation(location);
        };
        MemoryManager.prototype.updateMemoryAtLocation = function (loc, code) {
            var currentTableRow = 0;
            var hexCode = code.toString(16);
            var currBlock = _Memory.getMemory();
            if (hexCode.length < 2) {
                hexCode = "0" + hexCode;
            }
            currBlock[loc] = hexCode;
            TSOS.Control.updateMemTable(Math.floor(loc / 8) + currentTableRow, loc % 8, hexCode);
        };
        return MemoryManager;
    })();
    TSOS.MemoryManager = MemoryManager;
})(TSOS || (TSOS = {}));
