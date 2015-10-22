///<reference path="../globals.ts" />
///<reference path="control.ts" />
var TSOS;
(function (TSOS) {
    var Memory = (function () {
        function Memory(size) {
            this.totalMem = 256;
            this.totalMem = size;
            this.initialize(this.totalMem);
        }
        Memory.prototype.initialize = function (size) {
            this.memoryArray = [size];
            var zero = "00";
            for (var i = 0; i < size; i++) {
                this.memoryArray[i] = zero;
            }
        };
        Memory.prototype.getMemory = function () {
            return this.memoryArray;
        };
        Memory.prototype.getMemAtLocation = function (memLocation) {
            return this.memoryArray[memLocation];
        };
        Memory.prototype.clearMem = function () {
            this.initialize(256);
            TSOS.Control.resetMemoryTable();
        };
        return Memory;
    })();
    TSOS.Memory = Memory;
})(TSOS || (TSOS = {}));
