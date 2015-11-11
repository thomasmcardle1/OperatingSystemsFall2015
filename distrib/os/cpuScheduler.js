///<reference path="../globals.ts" />
var TSOS;
(function (TSOS) {
    var CPUScheduler = (function () {
        function CPUScheduler() {
        }
        CPUScheduler.prototype.determineContextSwitch = function () {
            if (_CycleCounter >= _QUANTUM && _ReadyQueue.length > 0) {
                this.roundRobinContextSwitch();
                _CycleCounter = 0;
            }
            _CycleCounter++;
            console.log(_CycleCounter);
            _CPU.cycle();
        };
        CPUScheduler.prototype.roundRobinContextSwitch = function () {
            console.log(_ReadyQueue);
            _ReadyQueue[0].processState = "Waiting";
            var pcbToBeMoved = _CurrPCB;
            console.log("curr base " + _CurrPCB.base);
            _ReadyQueue.push(pcbToBeMoved);
            _ReadyQueue.shift();
            console.log(_ReadyQueue);
            _CurrPCB = _ReadyQueue[0];
            _RunningPID = parseInt(_ReadyQueue[0].pid);
            _ReadyQueue[0].processState = "Running";
            _CPU.PC = _CurrPCB.PC;
            _CPU.Acc = _CurrPCB.Acc;
            _CPU.Xreg = _CurrPCB.Xreg;
            _CPU.Yreg = _CurrPCB.Yreg;
            _CPU.Zflag = _CurrPCB.Zflag;
            _CurrMemBlock = 0;
            _CurrPCB.base = 0;
            _CurrPCB.limit = 255;
            for (var i = 0; i < _ReadyQueue.length; i++) {
                if (_ReadyQueue[i].base === 0) {
                    var pidAtFirstLocation = _ReadyQueue[i].pid;
                }
            }
            _CurrMemBlock = _CurrPCB.baseRegister / 256;
            _CPU.isExecuting = true;
        };
        return CPUScheduler;
    })();
    TSOS.CPUScheduler = CPUScheduler;
})(TSOS || (TSOS = {}));
