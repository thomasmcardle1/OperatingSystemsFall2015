/*
 Requires globals.ts
 */
///<reference path="../globals.ts" />
var TSOS;
(function (TSOS) {
    var PCB = (function () {
        function PCB(PC, Acc, Xreg, Yreg, Zflag, pid, instructionRegister, base, limit, processState, location, priority) {
            if (PC === void 0) { PC = 0; }
            if (Acc === void 0) { Acc = 0; }
            if (Xreg === void 0) { Xreg = 0; }
            if (Yreg === void 0) { Yreg = 0; }
            if (Zflag === void 0) { Zflag = 0; }
            if (pid === void 0) { pid = (_PID + 1); }
            if (instructionRegister === void 0) { instructionRegister = ""; }
            if (base === void 0) { base = (_CurrMemBlock * 256); }
            if (limit === void 0) { limit = ((_CurrMemBlock * 256) + 255); }
            if (processState === void 0) { processState = ""; }
            if (location === void 0) { location = null; }
            if (priority === void 0) { priority = null; }
            this.PC = PC;
            this.Acc = Acc;
            this.Xreg = Xreg;
            this.Yreg = Yreg;
            this.Zflag = Zflag;
            this.pid = pid;
            this.instructionRegister = instructionRegister;
            this.base = base;
            this.limit = limit;
            this.processState = processState;
            this.location = location;
            this.priority = priority;
        }
        return PCB;
    })();
    TSOS.PCB = PCB;
})(TSOS || (TSOS = {}));
