/*
 Requires globals.ts
///<reference path="../globals.ts" />
*/
var TSOS;
(function (TSOS) {
    var PCB = (function () {
        function PCB(PC, Acc, Xreg, Yreg, Zflag, pid, instruction, start, max, state, location) {
            if (PC === void 0) { PC = 0; }
            if (Acc === void 0) { Acc = 0; }
            if (Xreg === void 0) { Xreg = 0; }
            if (Yreg === void 0) { Yreg = 0; }
            if (Zflag === void 0) { Zflag = 0; }
            if (pid === void 0) { pid = 0; }
            if (instruction === void 0) { instruction = ""; }
            if (start === void 0) { start = 0; }
            if (max === void 0) { max = 0; }
            if (state === void 0) { state = ""; }
            if (location === void 0) { location = ""; }
            this.PC = PC;
            this.Acc = Acc;
            this.Xreg = Xreg;
            this.Yreg = Yreg;
            this.Zflag = Zflag;
            this.pid = pid;
            this.instruction = instruction;
            this.start = start;
            this.max = max;
            this.state = state;
            this.location = location;
            this.pid = _PID;
            _PID++;
        }
        PCB.prototype.resetRegisters = function () {
            this.PC = 0;
            this.Acc = 0;
            this.Xreg = 0;
            this.Yreg = 0;
            this.Zflag = 0;
            this.pid = 0;
            this.instruction = "";
        };
        return PCB;
    })();
    TSOS.PCB = PCB;
})(TSOS || (TSOS = {}));
//# sourceMappingURL=pcbPrototype.js.map