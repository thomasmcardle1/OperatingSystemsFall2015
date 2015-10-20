///<reference path="../globals.ts" />
var TSOS;
(function (TSOS) {
    var Memory = (function () {
        function Memory(size) {
            this.memoryBlockSize = size;
            this.init();
        }
        Memory.prototype.init = function () {
            _Memory = new Memory(256);
            var zero = "00";
            for (var i = 0; i < this.memoryBlockSize; i++) {
                this.memoryArray[i] = zero;
            }
        };
        Memory.prototype.getMemoryBlock = function () {
            return this.memoryBlockSize;
        };
        Memory.prototype.clearMem = function () { };
        return Memory;
    })();
    TSOS.Memory = Memory;
})(TSOS || (TSOS = {}));
