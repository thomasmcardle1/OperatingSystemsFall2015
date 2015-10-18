/*
 Requires globals.ts
 */
var TSOS;
(function (TSOS) {
    var PCBP = (function () {
        function PCBP(PC, Acc, Xreg, Yreg, Zflag, pid, intruction, start, max, state, location) {
            if (state === void 0) { state = ""; }
            if (location === void 0) { location = ""; }
            this.PC = PC;
            this.Acc = Acc;
            this.Xreg = Xreg;
            this.Yreg = Yreg;
            this.Zflag = Zflag;
            this.pid = pid;
            this.intruction = intruction;
            this.start = start;
            this.max = max;
            this.state = state;
            this.location = location;
            this.pid = _PID;
            _PID++;
        }
        return PCBP;
    })();
    TSOS.PCBP = PCBP;
})(TSOS || (TSOS = {}));
