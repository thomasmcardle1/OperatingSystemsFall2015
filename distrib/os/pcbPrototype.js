/*
 Requires globals.ts
 */
///<reference path="../globals.ts" />
var TSOS;
(function (TSOS) {
    var PCB = (function () {
        function PCB(PC, Acc, Xreg, Yreg, Zflag, pid, instructionRegister, base, max, location) {
            if (PC === void 0) { PC = 0; }
            if (Acc === void 0) { Acc = 0; }
            if (Xreg === void 0) { Xreg = 0; }
            if (Yreg === void 0) { Yreg = 0; }
            if (Zflag === void 0) { Zflag = 0; }
            if (pid === void 0) { pid = ++_PID; }
            if (instructionRegister === void 0) { instructionRegister = ""; }
            if (base === void 0) { base = 0; }
            if (max === void 0) { max = 0; }
            if (location === void 0) { location = null; }
            this.PC = PC;
            this.Acc = Acc;
            this.Xreg = Xreg;
            this.Yreg = Yreg;
            this.Zflag = Zflag;
            this.pid = pid;
            this.instructionRegister = instructionRegister;
            this.base = base;
            this.max = max;
            this.location = location;
        }
        return PCB;
    })();
    TSOS.PCB = PCB;
})(TSOS || (TSOS = {}));
