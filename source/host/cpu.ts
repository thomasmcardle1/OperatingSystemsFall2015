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

module TSOS {

    export class Cpu {

        constructor(
            public instruction: string = "",
            public PC: number = 0,
            public Acc: number = 0,
            public Xreg: number = 0,
            public Yreg: number = 0,
            public Zflag: number = 0,
            public isExecuting: boolean = false) {
        }

        public init(): void {
            this.PC = 0;
            this.Acc = 0;
            this.Xreg = 0;
            this.Yreg = 0;
            this.Zflag = 0;
            this.isExecuting = false;
        }

        public cycle(): void {
            _Kernel.krnTrace('CPU cycle');
            // TODO: Accumulate CPU usage and profiling statistics here.
            // Do the real work here. Be sure to set this.isExecuting appropriately.

            //console.log("MEM AT LOC: " + _MemoryManager.getMemAtLocation(this.PC));
            if(this.isExecuting){
                console.log("Curr PC:" + _CPU.PC);
                console.log("Curr base:" + _CurrPCB.base);
                console.log("Is Executing: " + this.PC + " PC_1: " +(this.PC-1));
                this.executeOPCode(_MemoryManager.getMemAtLocation(this.PC));
                TSOS.Control.updateReadyQueueTable();
            }

            if(_SingleStep){
                this.isExecuting = false;
            }
            this.updateCPUMemoryThings();
        }

        public executeOPCode(code) {
            this.instruction = code.toUpperCase();
            console.log("instrucion " + this.instruction);
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
                default :
                    //Do Something
                    _StdOut.putText("Invalid Op Code " + this.instruction);
                    break;
            }
            this.PC++;
            _CurrPCB.PC =  this.PC;
            _CurrPCB.Acc = this.Acc;
            _CurrPCB.Xreg = this.Xreg;
            _CurrPCB.Yreg = this.Yreg ;
            _CurrPCB.Zflag = this.Zflag;
        }

        public loadAccWithConstant(){
            this.Acc = this.getNextByte();
            //_AssembleyLanguage = "LDA #$" + _MemoryManager.getMemory(this.PC);
            this.PC = this.PC+1;
        }

        public loadAccFromMem(){
            var loc = this.getNextTwoBytes();
            if(_CurrPCB.base > 0){
                loc += _CurrPCB.base;
            }
            var decNum = this.hexToDec(_MemoryManager.getMemAtLocation(loc));
            this.Acc = decNum;
            //_AssembleyLanguage = "STA $" + _MemoryManager.getMemory(this.PC);
            this.PC = this.PC+2;
        }

        public storeAccInMem(){
            var nxt2 = this.getNextTwoBytes();
            //console.log("Location:" +  nxt2);
            var hexNum = (this.Acc);
            //console.log(_CurrPCB.base + " " + nxt2 + " " + hexNum);
            _MemoryManager.updateMemoryAtLocation(_CurrPCB.base, nxt2, hexNum);
            //console.log("Mem @ 256: "+_MemoryManager.getMemAtLocation(256));
            this.PC++;
            this.PC++;
        }

        public addWithCarry(){
            var memLoc = this.getNextTwoBytes();
            if(_CurrPCB.base > 0){
                memLoc += _CurrPCB.base;
            }
            //console.log(memLoc);
            this.Acc += this.convertToHex(_MemoryManager.getMemAtLocation(memLoc));
            this.PC = this.PC+ 2;
        }

        public loadXWithConstant(){
            //console.log("next byte "+this.getNextByte());
            this.Xreg = this.getNextByte();
            this.PC++;
        }
        public loadXFromMem(){
            var memLoc = this.hexToDec(_MemoryManager.getMemAtLocation(1+this.PC));
            if(_CurrPCB.base >0){
                memLoc += _CurrPCB.base;
            }
            //console.log("Load X Mem location:" +  memLoc);
            this.Xreg = this.hexToDec(_MemoryManager.getMemAtLocation(memLoc));
            this.PC++;
            this.PC++;
        }

        public loadYWithConstant(){
            //console.log("Load Y: " + this.getNextByte());
            this.Yreg = this.getNextByte();
            //console.log("YReg :" + this.Yreg);
            this.PC++;
        }

        public loadYFromMem(){
            var memLoc = this.hexToDec(_MemoryManager.getMemAtLocation(1+this.PC));
            if(_CurrPCB.base >0){
                memLoc += _CurrPCB.base;
            }
            //console.log("Load Y From Mem Location:" +  memLoc);
            this.Yreg = this.hexToDec(_MemoryManager.getMemAtLocation(memLoc));
            this.PC++;
            this.PC++;
        }

        public compareXEqualTo(){
            var memLoc = this.getNextByte();
            if(_CurrPCB.base >0){
                memLoc += _CurrPCB.base;
            }
            //console.log("Comapre X Equal To Mem Location:" +  memLoc);
            //console.log("Hex At Location MemLoc :" + _MemoryManager.getMemAtLocation(memLoc));
            var hexNum = this.hexToDec(_MemoryManager.getMemAtLocation(memLoc));
            //console.log("hexNum " + hexNum);
            if(hexNum == this.Xreg){
                this.Zflag = 1;
            }else{
                this.Zflag = 0;
            }
            this.PC++;
            this.PC++;
        }

        public BNE(){
            if(this.Zflag == 0){
                var val = this.getNextByte();
                console.log("Val before added with PC: " + val);

                /*    if(_CurrPCB.base > 0){
                 val += _CurrPCB.base;
                 }

                 console.log("Val " + val);*/
                this.PC += val;
                this.PC++;

                var combined = (_ProgramSize+_CurrPCB.base);
                if(this.PC >= combined){
                    this.PC -=_ProgramSize;
                }

            }else{
                this.PC++;
            }
            console.log("PC After BNE: " + this.PC);
        }

        public noOp(){}

        public incrementValOfByte(){
            var memLoc = this.hexToDec(_MemoryManager.getMemAtLocation(1+this.PC));
            if(_CurrPCB.base >0){
                memLoc += _CurrPCB.base;
            }
            //console.log("Increment Val Of Byte Location:" +  memLoc);
            var hexNumAtLocation = _MemoryManager.getMemAtLocation(memLoc);
            var decNum = this.hexToDec(hexNumAtLocation);
            decNum++;
            _MemoryManager.updateMemoryAtLocation(_CurrPCB.base, memLoc, decNum);
            this.PC++;
            this.PC++;
        }

        public SysCall(){
            //_KernelInterruptQueue.enqueue(new Interrupt(SYSCALL_INTERRUPT))
            if(this.Xreg == 1){
                _StdOut.putText(this.hexToDec(this.Yreg).toString());
            }else if(this.Xreg == 2){
                var charString = "";
                var char = "";
                var loc = this.Yreg;
                if(_CurrPCB.base > 0){
                    loc += _CurrPCB.base;
                }
                //console.log("SYSCALL : " + loc);
                var character = _MemoryManager.getMemAtLocation(loc);
                var characterCode = 0;
                while(character != "00"){
                    var decNum = this.hexToDec(character);
                    char = String.fromCharCode(decNum);
                    charString += char;
                    this.Yreg++;
                    var loc2 = this.Yreg;
                    if(_CurrPCB.base > 0){
                        loc2 += _CurrPCB.base;
                    }
                    character = _MemoryManager.getMemAtLocation(loc2);
                }
                _StdOut.putText(charString);
            }
        }

        public getNextByte(){
            var nxt = _MemoryManager.getMemAtLocation(this.PC +1);
            return this.hexToDec(nxt);
        }

        public getNextTwoBytes(){
            var nxt = _MemoryManager.getMemAtLocation(1+this.PC);
            var nxt2 = _MemoryManager.getMemAtLocation(2+this.PC);
            var combine = (nxt2 + nxt);
            return this.hexToDec(combine);
        }

        public convertToHex(num){
            var hexNum = parseInt(num, 16);
            return hexNum;
        }
        public hexToDec(hexNum): number{
            return parseInt(hexNum,16);
        }

        public breakOp() {
            if (_ReadyQueue.length > 1) {
                this.programFinished();
            }else{
                _StdOut.putText(" -- PID [" + _CurrPCB.pid +"] Has Terminated -- ");
                _StdOut.advanceLine();
                _StdOut.putText(">");
                this.isExecuting = false;
            }
        }

        private programFinished(){
            this.updateCPUMemoryThings();
            _ReadyQueue[0].processState = "Terminated";
            _Scheduler.roundRobinContextSwitch();
        }

        public updateCPUMemoryThings(){
            document.getElementById("cpuElementPC").innerHTML = this.PC.toString();
            document.getElementById("cpuElementACC").innerHTML = this.Acc.toString();
            document.getElementById("cpuElementXReg").innerHTML = this.Xreg.toString();
            document.getElementById("cpuElementYReg").innerHTML = this.Yreg.toString();
            document.getElementById("cpuElementZFlag").innerHTML = this.Zflag.toString();
        }

        public resetCPUMemoryThings(){
            document.getElementById("cpuElementPC").innerHTML = "0";
            document.getElementById("cpuElementACC").innerHTML = "0";
            document.getElementById("cpuElementXReg").innerHTML = "0";
            document.getElementById("cpuElementYReg").innerHTML = "0";
            document.getElementById("cpuElementZFlag").innerHTML = "0";
        }
    }
}
