///<reference path="../globals.ts" />
var TSOS;
(function (TSOS) {
    var CPUScheduler = (function () {
        function CPUScheduler() {
        }
        CPUScheduler.prototype.roundRobinCycle = function () {
            if (_CycleCounter >= _QUANTUM && _ReadyQueue.length > 0 && _SchedType == "roundrobin") {
                this.roundRobin();
                _CycleCounter = 0;
            }
            else if (_SchedType == "fcfs") {
                this.FCFS();
            }
            else if (_SchedType == "priority") {
                this.Priority();
            }
            _CycleCounter++;
            _CPU.cycle();
        };
        CPUScheduler.prototype.roundRobin = function () {
            if (_ReadyQueue.length > 1) {
                if (_CurrPCB.processState == "Terminated") {
                    var term = _ReadyQueue.shift();
                    _StdOut.putText(" PID [" + term.pid + "] terminated ");
                    _CycleCounter = 0;
                    _CurrPCB = _ReadyQueue[0];
                    _RunningPID = parseInt(_ReadyQueue[0].pid);
                    _ReadyQueue[0].processState = "Running";
                    _CPU.PC = _ReadyQueue[0].PC - 1;
                }
                else {
                    var pcbToBePushed = _CurrPCB;
                    _ReadyQueue[0].processState = "Waiting";
                    _ReadyQueue.push(pcbToBePushed);
                    _ReadyQueue.shift();
                    _CurrPCB = _ReadyQueue[0];
                    _RunningPID = parseInt(_ReadyQueue[0].pid);
                    _ReadyQueue[0].processState = "Running";
                    _CPU.PC = _ReadyQueue[0].PC;
                }
                _CPU.Acc = _ReadyQueue[0].Acc;
                _CPU.Xreg = _ReadyQueue[0].Xreg;
                _CPU.Yreg = _ReadyQueue[0].Yreg;
                _CPU.Zflag = _ReadyQueue[0].Zflag;
                for (var i = 0; i < _ReadyQueue.length; i++) {
                    if (_ReadyQueue[i].base === 0) {
                        var pidAtFirstLocation = _ReadyQueue[i].pid;
                    }
                }
                _CurrMemBlock = _CurrPCB.baseRegister / 256;
            }
            _CPU.isExecuting = true;
        };
        CPUScheduler.prototype.FCFS = function () {
            if (_ReadyQueue.length > 1) {
                if (_CurrPCB.processState == "Terminated") {
                    var term = _ReadyQueue.shift();
                    _StdOut.putText(" PID [" + term.pid + "] terminated ");
                    _CycleCounter = 0;
                    _CurrPCB = _ReadyQueue[0];
                    _RunningPID = parseInt(_ReadyQueue[0].pid);
                    _ReadyQueue[0].processState = "Running";
                    _CPU.PC = _ReadyQueue[0].PC - 1;
                }
                else {
                    var pcbToBePushed = _CurrPCB;
                    _ReadyQueue[0].processState = "Waiting";
                    _CurrPCB = _ReadyQueue[0];
                    _RunningPID = parseInt(_ReadyQueue[0].pid);
                    _ReadyQueue[0].processState = "Running";
                    _CPU.PC = _ReadyQueue[0].PC;
                }
                _CPU.Acc = _ReadyQueue[0].Acc;
                _CPU.Xreg = _ReadyQueue[0].Xreg;
                _CPU.Yreg = _ReadyQueue[0].Yreg;
                _CPU.Zflag = _ReadyQueue[0].Zflag;
                _CurrMemBlock = _CurrPCB.baseRegister / 256;
            }
            _CPU.isExecuting = true;
        };
        CPUScheduler.prototype.Priority = function () {
            console.log("Priority" + _ReadyQueue[0].priority);
            if (_ReadyQueue.length > 1) {
                if (_CurrPCB.processState == "Terminated") {
                    var term = _ReadyQueue.shift();
                    _StdOut.putText(" PID [" + term.pid + "] terminated ");
                    _CycleCounter = 0;
                    _CurrPCB = _ReadyQueue[0];
                    _RunningPID = parseInt(_ReadyQueue[0].pid);
                    _ReadyQueue[0].processState = "Running";
                    _CPU.PC = _ReadyQueue[0].PC - 1;
                }
                else {
                    var pcbToBePushed = _CurrPCB;
                    _ReadyQueue[0].processState = "Waiting";
                    _CurrPCB = _ReadyQueue[0];
                    _RunningPID = parseInt(_ReadyQueue[0].pid);
                    _ReadyQueue[0].processState = "Running";
                    _CPU.PC = _ReadyQueue[0].PC;
                }
                _CPU.Acc = _ReadyQueue[0].Acc;
                _CPU.Xreg = _ReadyQueue[0].Xreg;
                _CPU.Yreg = _ReadyQueue[0].Yreg;
                _CPU.Zflag = _ReadyQueue[0].Zflag;
                /*  for (var i = 0; i < _ReadyQueue.length; i++) {
                 if (_ReadyQueue[i].base === 0) {
                 var pidAtFirstLocation = _ReadyQueue[i].pid;
                 }
                 }*/
                _CurrMemBlock = _CurrPCB.baseRegister / 256;
            }
            _CPU.isExecuting = true;
        };
        return CPUScheduler;
    })();
    TSOS.CPUScheduler = CPUScheduler;
})(TSOS || (TSOS = {}));
