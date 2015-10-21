///<reference path="../globals.ts" />
var TSOS;
(function (TSOS) {
    var Memory = (function () {
        function Memory(size) {
            this.memoryBlockSize = 256;
            this.memoryBlockSize = size;
            this.initialize(this.memoryBlockSize);
        }
        Memory.prototype.initialize = function (size) {
            this.memoryArray = [size];
            var zero = "00";
            for (var i = 0; i < size; i++) {
                this.memoryArray[i] = zero;
            }
        };
        Memory.prototype.getMemoryBlock = function () {
            return this.memoryArray;
        };
        Memory.prototype.clearMem = function () { };
        return Memory;
    })();
    TSOS.Memory = Memory;
})(TSOS || (TSOS = {}));
