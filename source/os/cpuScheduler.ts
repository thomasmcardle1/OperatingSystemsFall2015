///<reference path="../globals.ts" />

module TSOS {
    export class CPUScheduler {
        constructor() {
        }

        public roundRobinCycle(): void {
            if(_CycleCounter >= _QUANTUM && _ReadyQueue.length > 0){
                //console.log(_CycleCounter);
                this.roundRobin();
                _CycleCounter = 0;
            }else if(_SchedType == "FCFS"){
                this.FCFS();
            }else if(_SchedType == "Priority"){
                this.Priority();
            }
            _CycleCounter++;
            _CPU.cycle();
        }

        public roundRobin(): void {
            if (_ReadyQueue.length > 1) {
                //console.log(_CurrPCB);
                if(_CurrPCB.processState == "Terminated"){
                    var term = _ReadyQueue.shift();
                    //console.log(term.pid + " HAS BEEN " + term.processState);
                    _StdOut.putText(" PID [" + term.pid +"] terminated ");

                    _CycleCounter = 0;

                    _CurrPCB = _ReadyQueue[0];
                    //console.log("NEW PCB " + _CurrPCB.base + " " + _CurrPCB.limit + " " + _CurrPCB.PC);

                    _RunningPID = parseInt(_ReadyQueue[0].pid);
                    _ReadyQueue[0].processState = "Running";

                    _CPU.PC = _ReadyQueue[0].PC -1;
                }else{
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
        }

        public FCFS(): void {

        }

        public Priority():void {
        }
    }
}