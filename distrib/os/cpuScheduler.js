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
                    //_StdOut.putText(" PID [" + term.pid +"] terminated ");
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
                    console.log("PID && Loaction: " + _CurrPCB.pid + " " + _CurrPCB.location + " " + _CurrPCB.base);
                    var loc = _CurrPCB.location;
                    if (loc === "FS") {
                        this.SwapinToMemRunAll();
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
                    console.log("PID && Loaction: " + _CurrPCB.pid + " " + _CurrPCB.location + " " + _CurrPCB.base);
                    var loc = _CurrPCB.location;
                    if (loc === "FS") {
                        this.SwapinToMemRunAll();
                    }
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
        CPUScheduler.prototype.SwapinToMem = function () {
            var currentPCBPID = _CurrPCB.pid;
            _CurrPCB.location = "Memory";
            var memDataToBeMoved = "";
            for (var i = 0; i < 255; i++) {
                memDataToBeMoved += _Memory.getMemAtLocation(i);
                _MemoryManager.updateMemoryAtLocation(0, i, "00");
                memDataToBeMoved += " ";
            }
            console.log(memDataToBeMoved);
            var pidOfProgAtBase0;
            for (var i = 0; i < _ResidentList.length; i++) {
                if (_ResidentList[i].base == 0) {
                    _ResidentList[i].location = "FS";
                    _ResidentList[i].base = -1;
                    _ResidentList[i].limit = -1;
                    pidOfProgAtBase0 = _ResidentList[i].pid;
                    console.log("PID OF PROGRAM AT BASE 0: " + pidOfProgAtBase0);
                }
            }
            var fileName = _DefaultProgName + pidOfProgAtBase0;
            var fileToFS = _FileSystem.readFile(fileName);
            if (fileToFS === "undefined") {
                _FileSystem.createFile(fileName);
            }
            else {
                _FileSystem.deleteFile(fileName);
                _FileSystem.createFile(fileName);
            }
            _FileSystem.writeFile(fileName, memDataToBeMoved);
            console.log("-------------FILE ON FS --------------------------");
            console.log(_FileSystem.readFile(fileName));
            console.log("^^^^^^^^^^^^^^^^^^FILE ON FS ^^^^^^^^^^^^^^^^^^^^^^^^^^");
            var getFilewithName = _DefaultProgName + currentPCBPID;
            var fileOnFS = _FileSystem.readFile(getFilewithName);
            fileOnFS = fileOnFS.split(" ");
            console.log(fileOnFS);
            for (var i = 0; i < fileOnFS.length; i++) {
                var code = fileOnFS[i];
                _MemoryManager.updateMemoryAtLocation(0, i, code);
            }
            _CurrPCB.base = 0;
            _CurrPCB.limit = 255;
            console.log(_ResidentList);
        };
        CPUScheduler.prototype.SwapinToMemRunAll = function () {
            var currentPCBPID = _CurrPCB.pid;
            _CurrPCB.location = "Memory";
            var memDataToBeMoved = "";
            for (var i = 0; i < 255; i++) {
                memDataToBeMoved += _Memory.getMemAtLocation(i);
                _MemoryManager.updateMemoryAtLocation(0, i, "00");
            }
            console.log("MEM DATA TO BE MOVED: " + memDataToBeMoved);
            console.log("Supposed to be running: " + _CurrPCB.pid + " Location " + _CurrPCB.location);
            var pidOfProgAtBase0;
            for (var i = 0; i < _ReadyQueue.length; i++) {
                if (_ReadyQueue[i].base === 0) {
                    _ReadyQueue[i].location = "FS";
                    pidOfProgAtBase0 = _ReadyQueue[i].pid;
                    console.log("PID OF PROGRAM AT BASE 0: " + pidOfProgAtBase0);
                }
            }
            _ResidentList[pidOfProgAtBase0].base = -1;
            _ResidentList[pidOfProgAtBase0].limit = -1;
            console.log("Supposed to be running: " + _CurrPCB.pid + " Location " + _CurrPCB.location);
            var fileName = _DefaultProgName + pidOfProgAtBase0;
            var fileToFS = _FileSystem.readFile(fileName);
            if (fileToFS === "undefined") {
                _FileSystem.createFile(fileName);
            }
            else {
                _FileSystem.deleteFile(fileName);
                _FileSystem.createFile(fileName);
            }
            memDataToBeMoved = this.stringToHex(memDataToBeMoved);
            _FileSystem.writeFile(fileName, memDataToBeMoved);
            console.log("-------------FILE TO BE MOVED ONTO FS --------------------------");
            console.log(_FileSystem.readFile(fileName));
            console.log("^^^^^^^^^^^^^^^^^^FILE ON FS ^^^^^^^^^^^^^^^^^^^^^^^^^^");
            var getFilewithName = _DefaultProgName + currentPCBPID;
            var fileOnFS = _FileSystem.readFile(getFilewithName);
            console.log("Supposed to be running: " + _CurrPCB.pid + " Location " + _CurrPCB.location);
            fileOnFS = this.HexToString(fileOnFS);
            //stack overflow solution to remove spaces from string
            fileOnFS = fileOnFS.replace(/\s+/g, '');
            console.log(fileOnFS);
            var fileOnFSArray = [];
            while (fileOnFS.length > 0) {
                var subStr = fileOnFS.substr(0, 2);
                fileOnFSArray.push(subStr);
                var newlength = fileOnFS.length - 2;
                fileOnFS = fileOnFS.substr(2, newlength);
            }
            console.log(fileOnFSArray);
            for (var i = 0; i < fileOnFSArray.length; i++) {
                var code = fileOnFSArray[i];
                _MemoryManager.updateMemoryAtLocation(0, i, code);
            }
            _CurrPCB.base = 0;
            _CurrPCB.limit = 255;
        };
        CPUScheduler.prototype.HexToString = function (hexData) {
            var string = "";
            for (var i = 0; i < hexData.length; i += 2) {
                string += String.fromCharCode(parseInt(hexData.substr(i, 2), 16));
            }
            return string;
        };
        CPUScheduler.prototype.stringToHex = function (string) {
            var hexString = "";
            for (var i = 0; i < string.length; i++) {
                hexString += string.charCodeAt(i).toString(16);
            }
            return hexString;
        };
        return CPUScheduler;
    })();
    TSOS.CPUScheduler = CPUScheduler;
})(TSOS || (TSOS = {}));
