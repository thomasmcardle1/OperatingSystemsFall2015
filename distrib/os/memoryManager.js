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
            var currMem = _Memory.getMemoryBlock();
            var memAtLoc = currMem[location];
            //console.log(memAtLoc);
            return memAtLoc;
        };
        MemoryManager.prototype.getNextSpace = function () {
        };
        MemoryManager.prototype.updateMemoryAtLocation = function (loc, code) {
            var currentTableRow = 0;
            var hexCode = code.toString(16);
            var currBlock = _Memory.getMemoryBlock();
            if (hexCode.length < 2)
                hexCode = "0" + hexCode;
            currBlock[loc] = hexCode;
            TSOS.Control.updateMemTable(Math.floor(loc / 8) + currentTableRow, loc % 8, hexCode);
        };
        MemoryManager.prototype.getNextByte = function () {
            var nxt = _MemoryManager.getMemAtLocation(_CurrPCB.PC + 1);
            return this.hexToDec(nxt);
        };
        MemoryManager.prototype.getNextTwoBytes = function () {
            var nxt2 = (_MemoryManager.getMemAtLocation(_CurrPCB.PC + 1)) + (_MemoryManager.getMemAtLocation(_CurrPCB.PC + 2));
            return this.hexToDec(nxt2);
        };
        MemoryManager.prototype.hexToDec = function (hexNum) {
            return parseInt(hexNum, 16);
        };
        return MemoryManager;
    })();
    TSOS.MemoryManager = MemoryManager;
})(TSOS || (TSOS = {}));
