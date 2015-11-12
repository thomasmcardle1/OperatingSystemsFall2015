///<reference path="../globals.ts" />
var TSOS;
(function (TSOS) {
    var CPUScheduler = (function () {
        function CPUScheduler() {
        }
        CPUScheduler.prototype.determineContextSwitch = function () {
            if (_CycleCounter >= _QUANTUM && _ReadyQueue.length > 0) {
                console.log(_CycleCounter);
                this.roundRobinContextSwitch();
                _CycleCounter = 0;
            }
            _CycleCounter++;
            _CPU.cycle();
        };
        CPUScheduler.prototype.roundRobinContextSwitch = function () {
            _ReadyQueue[0].processState = "Waiting";
            var pcbToBePushed = _CurrPCB;
            console.log("PCB TO BE PUSHED " + pcbToBePushed.base + " " + pcbToBePushed.limit + " " + pcbToBePushed.PC);
            _ReadyQueue.push(pcbToBePushed);
            console.log(_CurrPCB);
            _ReadyQueue.shift();
            _CurrPCB = _ReadyQueue[0];
            console.log("NEW PCB " + _CurrPCB.base + " " + _CurrPCB.limit + " " + _CurrPCB.PC);
            _RunningPID = parseInt(_ReadyQueue[0].pid);
            _ReadyQueue[0].processState = "Running";
            _CPU.PC = _CurrPCB.PC;
            _CPU.Acc = _CurrPCB.Acc;
            _CPU.Xreg = _CurrPCB.Xreg;
            _CPU.Yreg = _CurrPCB.Yreg;
            _CPU.Zflag = _CurrPCB.Zflag;
            console.log(_CPU);
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
