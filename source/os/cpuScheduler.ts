///<reference path="../globals.ts" />

module TSOS {
    export class CPUScheduler {
        constructor() {
        }

        public roundRobinCycle():void {
            if (_CycleCounter >= _QUANTUM && _ReadyQueue.length > 0 && _SchedType == "roundrobin") {
                this.roundRobin();
                _CycleCounter = 0;
            } else if (_SchedType == "fcfs") {
                this.FCFS();
            } else if (_SchedType == "priority") {
                this.Priority();
            }
            _CycleCounter++;
            _CPU.cycle();
        }

        public roundRobin():void {

            if (_ReadyQueue.length > 1) {
                if (_CurrPCB.processState == "Terminated") {
                    var term = _ReadyQueue.shift();
                    //_StdOut.putText(" PID [" + term.pid +"] terminated ");
                    _CycleCounter = 0;
                    _CurrPCB = _ReadyQueue[0];
                    _RunningPID = parseInt(_ReadyQueue[0].pid);
                    _ReadyQueue[0].processState = "Running";
                    _CPU.PC = _ReadyQueue[0].PC - 1;
                } else {
                    var pcbToBePushed = _CurrPCB;
                    _ReadyQueue[0].processState = "Waiting";
                    _ReadyQueue.push(pcbToBePushed);
                    _ReadyQueue.shift();
                    _CurrPCB = _ReadyQueue[0];
                    if (_CurrPCB.location === "FS") {
                        this.Swap();
                    }

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
        }

        public FCFS():void {

            if (_ReadyQueue.length > 1) {
                if (_CurrPCB.processState == "Terminated") {
                    var term = _ReadyQueue.shift();
                    _StdOut.putText(" PID [" + term.pid + "] terminated ");
                    _CycleCounter = 0;
                    _CurrPCB = _ReadyQueue[0];
                    _RunningPID = parseInt(_ReadyQueue[0].pid);
                    _ReadyQueue[0].processState = "Running";
                    _CPU.PC = _ReadyQueue[0].PC - 1;
                } else {
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
        }

        public Priority():void {
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
                } else {
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
        }

        private Swap() {
            var memDataToBeMoved = "";
            for (var i = 0; i < 255; i++) {
                memDataToBeMoved += _Memory.getMemAtLocation(i);
                memDataToBeMoved += " ";
            }

            console.log("Data To Be Swapped to FS: " + memDataToBeMoved);
            var pidToMove;
            for (var i = 0; i < _ReadyQueue.length; i++) {
                if (_ReadyQueue[i].base === 0) {
                    var pcb = _ReadyQueue[i];
                    pidToMove = pcb.pid;
                    pcb.location = "FS";
                   console.log(_ReadyQueue[i].location);
                }
            }

            _CurrPCB.location = "Memory";
            console.log("CURRENT PCB ID: " + _CurrPCB.pid);
            var pid = _CurrPCB.pid;
            var filename = ""+_DefaultProgName + pid;
            var programFromDiskHex = _FileSystem.readFile(filename);
            console.log(programFromDiskHex);
            var splitCode = programFromDiskHex.split(" ");

            for (var i = 0; i < 255; i++) {
                _MemoryManager.updateMemoryAtLocation(0, i, "00");
            }

            for (var i = 0; i < splitCode.length - 1; i++) {
                _MemoryManager.updateMemoryAtLocation(0, i, splitCode[i]);
            }


            var filenameToBeMoved = ""+_DefaultProgName+pidToMove;
            if(_FileSystem.readFile(filenameToBeMoved) === "undefined"){
                _FileSystem.createFile(filenameToBeMoved);
                console.log("File To Be Created : " + filenameToBeMoved);
            }else{
                _FileSystem.deleteFile(filenameToBeMoved);
                _FileSystem.createFile(filenameToBeMoved);
                console.log("File To Be Created : " + filename);
            }
            console.log("writing file Name: " + filenameToBeMoved + " File Data: " + memDataToBeMoved);
            _FileSystem.writeFile(filenameToBeMoved, memDataToBeMoved);
            TSOS.Control.updateReadyQueueTable();
        }

        private HexToString(hexData){
            var string = "";
            for (var i = 0; i < hexData.length; i+=2){
                string += String.fromCharCode(parseInt(hexData.substr(i, 2), 16));
            }
            return string;
        }

        public stringToHex(string){
            var hexString = "";
            for(var i = 0; i < string.length; i++){
                hexString += string.charCodeAt(i).toString(16);
            }
            return hexString;
        }

    }
}