///<reference path="../globals.ts" />
var TSOS;
(function (TSOS) {
    var CPUScheduler = (function () {
        function CPUScheduler() {
        }
        CPUScheduler.prototype.determineContextSwitch = function () {
            if (_CycleCounter >= _QUANTUM && _ReadyQueue.length > 0) {
                //console.log(_CycleCounter);
                this.roundRobinContextSwitch();
                _CycleCounter = 0;
            }
            _CycleCounter++;
            _CPU.cycle();
        };
        CPUScheduler.prototype.roundRobinContextSwitch = function () {
            if (_ReadyQueue.length > 1) {
                //console.log(_CurrPCB);
                if (_CurrPCB.processState == "Terminated") {
                    var term = _ReadyQueue.shift();
                    //console.log(term.pid + " HAS BEEN " + term.processState);
                    _StdOut.putText(" PID [" + term.pid + "] terminated ");
                    _CycleCounter = 0;
                    _CurrPCB = _ReadyQueue[0];
                    //console.log("NEW PCB " + _CurrPCB.base + " " + _CurrPCB.limit + " " + _CurrPCB.PC);
                    _RunningPID = parseInt(_ReadyQueue[0].pid);
                    _ReadyQueue[0].processState = "Running";
                    _CPU.PC = _ReadyQueue[0].PC - 1;
                }
                else {
                    var pcbToBePushed = _CurrPCB;
                    _ReadyQueue[0].processState = "Waiting";
                    ////console.log("PCB TO BE PUSHED " + pcbToBePushed.base + " " + pcbToBePushed.limit + " " + pcbToBePushed.PC);
                    _ReadyQueue.push(pcbToBePushed);
                    ////console.log(_CurrPCB);
                    _ReadyQueue.shift();
                    _CurrPCB = _ReadyQueue[0];
                    ////console.log("NEW PCB " + _CurrPCB.base + " " + _CurrPCB.limit + " " + _CurrPCB.PC);
                    _RunningPID = parseInt(_ReadyQueue[0].pid);
                    _ReadyQueue[0].processState = "Running";
                    _CPU.PC = _ReadyQueue[0].PC;
                }
                _CPU.Acc = _ReadyQueue[0].Acc;
                _CPU.Xreg = _ReadyQueue[0].Xreg;
                _CPU.Yreg = _ReadyQueue[0].Yreg;
                _CPU.Zflag = _ReadyQueue[0].Zflag;
                //console.log(_CPU);
                //conole.log(_CurrPCB);
                for (var i = 0; i < _ReadyQueue.length; i++) {
                    if (_ReadyQueue[i].base === 0) {
                        var pidAtFirstLocation = _ReadyQueue[i].pid;
                    }
                }
                _CurrMemBlock = _CurrPCB.baseRegister / 256;
            }
            _CPU.isExecuting = true;
        };
        return CPUScheduler;
    })();
    TSOS.CPUScheduler = CPUScheduler;
})(TSOS || (TSOS = {}));
