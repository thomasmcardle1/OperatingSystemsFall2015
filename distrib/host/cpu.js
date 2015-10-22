///<reference path="../globals.ts" />
/* ------------
     CPU.ts

     Requires global.ts.

     Routines for the host CPU simulation, NOT for the OS itself.
     In this manner, it's A LITTLE BIT like a hypervisor,
     in that the Document environment inside a browser is the "bare metal" (so to speak) for which we write code
     that hosts our client OS. But that analogy only goes so far, and the lines are blurred, because we are using
     TypeScript/JavaScript in both the host and client environments.

     This code references page numbers in the text book:
     Operating System Concepts 8th edition by Silberschatz, Galvin, and Gagne.  ISBN 978-0-470-12872-5
     ------------ */
var TSOS;
(function (TSOS) {
    var Cpu = (function () {
        function Cpu(instruction, PC, Acc, Xreg, Yreg, Zflag, isExecuting) {
            if (instruction === void 0) { instruction = ""; }
            if (PC === void 0) { PC = 0; }
            if (Acc === void 0) { Acc = 0; }
            if (Xreg === void 0) { Xreg = 0; }
            if (Yreg === void 0) { Yreg = 0; }
            if (Zflag === void 0) { Zflag = 0; }
            if (isExecuting === void 0) { isExecuting = false; }
            this.instruction = instruction;
            this.PC = PC;
            this.Acc = Acc;
            this.Xreg = Xreg;
            this.Yreg = Yreg;
            this.Zflag = Zflag;
            this.isExecuting = isExecuting;
        }
        Cpu.prototype.init = function () {
            this.PC = 0;
            this.Acc = 0;
            this.Xreg = 0;
            this.Yreg = 0;
            this.Zflag = 0;
            this.isExecuting = false;
        };
        Cpu.prototype.cycle = function () {
            _Kernel.krnTrace('CPU cycle');
            // TODO: Accumulate CPU usage and profiling statistics here.
            // Do the real work here. Be sure to set this.isExecuting appropriately.
            this.executeOPCode(_MemoryManager.getMemAtLocation(this.PC));
            if (_SingleStep) {
                this.isExecuting = false;
            }
            this.updateCPUMemoryThings();
            this.updateCPUMemoryThings();
        };
        Cpu.prototype.executeOPCode = function (code) {
            this.instruction = code.toUpperCase();
            console.log(this.instruction);
            switch (this.instruction) {
                case "A9":
                    //Load the accumulator with a constant
                    this.loadAccWithConstant();
                    break;
                case "AD":
                    //Load the accumulator from memory
                    this.loadAccFromMem();
                    break;
                case "8D":
                    //Store the accumulator in memory
                    this.storeAccInMem();
                    break;
                case "6D":
                    //Add with carry -- Adds contents of an address to the contents of the accumulator and keeps the result in the accumulator
                    this.addWithCarry();
                    break;
                case "A2":
                    //Load the X register with a constant
                    this.loadXWithConstant();
                    break;
                case "AE":
                    // Load the X register from Memory
                    this.loadXFromMem();
                    break;
                case "A0":
                    //Load the Y Register with a constant
                    this.loadYWithConstant();
                    break;
                case "AC":
                    //Load the Y Register from memory
                    this.loadYFromMem();
                    break;
                case "EA":
                    // No Operation
                    this.noOp();
                    break;
                case "EC":
                    // Compare a byte in memory to the X reg --  Sets the Z (zero) flag if equal
                    this.compareXEqualTo();
                    break;
                case "D0":
                    //Branch n bytes if Z flag = 0
                    this.BNE();
                    break;
                case "EE":
                    // Increment the value of a byte
                    this.incrementValOfByte();
                    break;
                case "00":
                    //Break (which is really a system call)
                    this.breakOp();
                    break;
                case "FF":
                    //System Call
                    this.SysCall();
                    break;
                default:
                    //Do Something
                    _StdOut.putText("Invalid Op Code " + this.instruction);
                    break;
            }
            this.PC++;
            TSOS.Control.createMemoryTable();
        };
        /*private getNextByte(): Number{
            var nextByteHex = _MemoryManager.getMe
        }*/
        Cpu.prototype.loadAccWithConstant = function () {
            this.Acc = this.getNextByte();
            console.log("ACC: " + this.Acc);
            //_AssembleyLanguage = "LDA #$" + _MemoryManager.getMemory(this.PC);
            this.PC = this.PC + 1;
        };
        Cpu.prototype.loadAccFromMem = function () {
            var loc = this.getNextTwoBytes();
            var decNum = this.hexToDec(_MemoryManager.getMemAtLocation(loc));
            //console.log("loc: " + loc +"decNum" + decNum);
            this.Acc = decNum;
            //_AssembleyLanguage = "STA $" + _MemoryManager.getMemory(this.PC);
            this.PC = this.PC + 2;
        };
        Cpu.prototype.storeAccInMem = function () {
            var nxt2 = this.getNextTwoBytes();
            //var loc = this.hexToDec(_MemoryManager.getMemAtLocation(this.PC+1)); //this.getNextByte();
            var hexNum = (this.Acc);
            console.log("location: " + nxt2 + ", hexNum:" + hexNum);
            _MemoryManager.updateMemoryAtLocation(nxt2, hexNum);
            console.log("Acc updated: " + this.Acc);
            this.PC++;
            this.PC++;
            console.log(this.PC);
        };
        Cpu.prototype.addWithCarry = function () {
            this.Acc += this.convertToHex(_MemoryManager.getMemAtLocation(this.getNextTwoBytes()));
            this.PC = this.PC + 2;
        };
        Cpu.prototype.loadXWithConstant = function () {
            this.Xreg = this.getNextByte();
            this.PC++;
        };
        Cpu.prototype.loadXFromMem = function () {
            var memLoc = this.hexToDec(_MemoryManager.getMemAtLocation(1 + this.PC));
            this.Xreg = this.hexToDec(_MemoryManager.getMemAtLocation(memLoc));
            console.log("location:" + memLoc + " XReg: " + this.Xreg);
            this.PC++;
            this.PC++;
        };
        Cpu.prototype.loadYWithConstant = function () {
            this.Yreg = this.getNextByte();
            this.PC++;
        };
        Cpu.prototype.loadYFromMem = function () {
            var memLoc = this.hexToDec(_MemoryManager.getMemAtLocation(1 + this.PC));
            //this.hexToDec(_MemoryManager.getMemAtLocation(this.PC));
            //console.log(memLoc);
            this.Yreg = this.hexToDec(_MemoryManager.getMemAtLocation(memLoc));
            console.log("location:" + memLoc + " YReg: " + this.Yreg);
            this.PC++;
            this.PC++;
        };
        Cpu.prototype.compareXEqualTo = function () {
            var memLoc = this.getNextByte();
            var hexNum = this.hexToDec(_MemoryManager.getMemAtLocation(memLoc));
            console.log("Comparre to X -- Location: " + memLoc + " memVal: " + hexNum);
            if (hexNum == this.Xreg) {
                this.Zflag = 1;
            }
            else {
                this.Zflag = 0;
            }
            this.PC++;
            this.PC++;
        };
        Cpu.prototype.BNE = function () {
            if (this.Zflag == 0) {
                var val = this.getNextByte();
                console.log("BNE Val" + val);
                this.PC++;
                this.PC += val;
                if (this.PC >= _ProgramSize) {
                    this.PC = this.PC - _ProgramSize;
                }
            }
            else {
                this.PC++;
            }
        };
        Cpu.prototype.noOp = function () { };
        Cpu.prototype.incrementValOfByte = function () {
            var memLoc = this.hexToDec(_MemoryManager.getMemAtLocation(1 + this.PC));
            var hexNumAtLocation = _MemoryManager.getMemAtLocation(memLoc);
            var decNum = this.hexToDec(hexNumAtLocation);
            decNum++;
            _MemoryManager.updateMemoryAtLocation(memLoc, decNum);
            console.log("location: " + memLoc + " dec  num: " + decNum);
            this.PC++;
            this.PC++;
        };
        Cpu.prototype.convertToHex = function (num) {
            var hexNum = parseInt(num, 16);
            return hexNum;
        };
        Cpu.prototype.SysCall = function () {
            //_KernelInterruptQueue.enqueue(new Interrupt(SYSCALL_INTERRUPT))
            //console.log("x reg" + this.Xreg);
            if (this.Xreg == 1) {
                _StdOut.putText(this.hexToDec(this.Yreg).toString());
            }
            else if (this.Xreg == 2) {
                var charString = "";
                var char = "";
                var character = _MemoryManager.getMemAtLocation(this.Yreg);
                console.log("Hex character: " + character);
                var characterCode = 0;
                while (character != "00") {
                    var decNum = this.hexToDec(character);
                    console.log("character:" + character);
                    //characterCode = parseInt(character);
                    char = String.fromCharCode(decNum);
                    console.log(char);
                    charString += char;
                    this.Yreg++;
                    character = _MemoryManager.getMemAtLocation(this.Yreg);
                }
                _StdOut.putText(charString);
            }
        };
        Cpu.prototype.getNextByte = function () {
            var nxt = _MemoryManager.getMemAtLocation(this.PC + 1);
            //console.log("getNextByte Hex : " + nxt);
            return this.hexToDec(nxt);
        };
        Cpu.prototype.getNextTwoBytes = function () {
            var nxt = _MemoryManager.getMemAtLocation(1 + this.PC);
            var nxt2 = _MemoryManager.getMemAtLocation(2 + this.PC);
            var combine = (nxt2 + nxt);
            return this.hexToDec(combine);
        };
        Cpu.prototype.hexToDec = function (hexNum) {
            return parseInt(hexNum, 16);
        };
        Cpu.prototype.breakOp = function () {
            this.isExecuting = false;
            _Console.advanceLine();
            _Console.putText(">");
        };
        Cpu.prototype.updateCPUMemoryThings = function () {
            document.getElementById("cpuElementPC").innerHTML = this.PC.toString();
            document.getElementById("cpuElementACC").innerHTML = this.Acc.toString();
            document.getElementById("cpuElementXReg").innerHTML = this.Xreg.toString();
            document.getElementById("cpuElementYReg").innerHTML = this.Yreg.toString();
            document.getElementById("cpuElementZFlag").innerHTML = this.Zflag.toString();
        };
        return Cpu;
    })();
    TSOS.Cpu = Cpu;
})(TSOS || (TSOS = {}));
