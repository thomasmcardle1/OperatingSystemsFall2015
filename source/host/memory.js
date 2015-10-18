var TSOS;
(function (TSOS) {
    var Memory = (function () {
        function Memory(byte) {
            this.byte = byte;
            this.byte = byte;
            this.dataArray = new Array(byte);
            this.init();
        }
        Memory.prototype.init = function () {
            var zero = "00";
            for (var i = 0; i < this.byte; i++) {
                this.dataArray[i] = zero;
            }
        };
        return Memory;
    })();
    TSOS.Memory = Memory;
})(TSOS || (TSOS = {}));
//# sourceMappingURL=memory.js.map