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

            if(this.isExecuting){
                this.executeOPCode(_MemoryManager.getMemAtLocation(this.PC));
            }else{
                this.PC = _CurrPCB.PC;
                this.Acc = _CurrPCB.Accum;
                this.Xreg = _CurrPCB.Xreg;
                this.Yreg = _CurrPCB.Yreg;
                this.Zflag = _CurrPCB.Zflag;

                this.isExecuting = true;
            }
        }

        public executeOPCode(code) {
            this.instruction = code.toUpperCase();
            switch (this.instruction) {
                case "A9":
                    _StdOut.putText("A9");
                    //Load the accumulator with a constant
                    this.loadAccWithConstant();
                    break;
                case "AD":
                    _StdOut.putText("AD");
                    //Load the accumulator from memory
                    this.loadAccFromMem();
                    break;
                case "8D":
                    _StdOut.putText("8D");
                    //Store the accumulator in memory
                    this.storeAccInMem();
                    break;
                case "6D":
                    _StdOut.putText("6D");
                    //Add with carry -- Adds contents of an address to the contents of the accumulator and keeps the result in the accumulator
                    this.addWithCarry();
                    break;
                case "A2":
                    _StdOut.putText("A2");
                    //Load the X register with a constant
                    this.loadXWithConstant();
                    break;
                case "AE":
                    _StdOut.putText("AE");
                    // Load the X register from Memory
                    this.loadXFromMem();
                    break;
                case "A0":
                    _StdOut.putText("A0");
                    //Load the Y Register with a constant
                    this.loadYWithConstant();
                    break;
                case "AC":
                    _StdOut.putText("AC");
                    //Load the Y Register from memory
                    this.loadYFromMem();
                    break;
                case "EA":
                    _StdOut.putText("EA");
                    // No Operation
                    this.noOp();
                    break;
                case "EC":
                    _StdOut.putText("EC");
                    // Compare a byte in memory to the X reg --  Sets the Z (zero) flag if equal
                    this.compareXEqualTo();
                    break;
                case "D0":
                    _StdOut.putText("D0");
                    //Branch n bytes if Z flag = 0
                    this.BNE();
                    break;
                case "EE":
                    _StdOut.putText("EE");
                    // Increment the value of a byte
                    this.incrementValOfByte();
                    break;
                case "00":
                    _StdOut.putText("00");
                    //Break (which is really a system call)
                    this.breakOp();
                    break;
                case "FF":
                    _StdOut.putText("FF");
                    //System Call
                    this.SysCall();
                    break;
                default :
                    //Do Something
                    _StdOut.putText("Invalid Op Code " + this.instruction);
                    break;
            }
            this.PC++;
        }

        /*private getNextByte(): Number{
            var nextByteHex = _MemoryManager.getMe
        }*/

        public loadAccWithConstant(){
            this.Acc = this.convertToHex(_MemoryManager.getMemAtLocation((1+this.PC)));
            console.log(this.Acc);
            //_AssembleyLanguage = "LDA #$" + _MemoryManager.getMemory(this.PC);
            this.PC++;
        }

        public loadAccFromMem(){
            this.Acc = this.convertToHex(_MemoryManager.getNextTwoBytes((1+this.PC)));
            //_AssembleyLanguage = "STA $" + _MemoryManager.getMemory(this.PC);
            this.PC++;
        }

        public storeAccInMem(){
            var memory = _MemoryManager.hexToDec(_MemoryManager.getMemAtLocation(this.PC));
            var acc = this.Acc.toString(16);
            _MemoryManager.updateMemoryAtLocation(memory, acc);
            this.PC = this.PC+2;
        }

        public addWithCarry(){
            this.Acc += this.convertToHex(_MemoryManager.getNextTwoBytes(1+this.PC));
            this.PC++;
        }

        public loadXWithConstant(){
            this.Xreg = this.convertToHex(_MemoryManager.getNextSpace(1+ this.PC));
        }

        public loadXFromMem(){
            this.Xreg = this.convertToHex(_MemoryManager.getNextTwoBytes((1+this.PC)));
            this.PC++;
        }

        public loadYWithConstant(){
            this.Yreg = this.convertToHex(_MemoryManager.getNextSpace(1+this.PC));
        }

        public loadYFromMem(){
            this.Yreg = this.convertToHex(_MemoryManager.getNextTwoBytes(1+this.PC));
            this.PC++;
        }

        public compareXEqualTo(){
            if(this.convertToHex(_MemoryManager.getNextTwoBytes(1+this.PC)) == this.Xreg){
                this.Zflag = 1;
            }else{
                this.Zflag = 0;
            }
            this.PC++;
        }

        public BNE(){
            if(this.Zflag == 0){
                this.PC += this.convertToHex(_MemoryManager.getCurrMemory(1+this.PC) + 1);
                if(this.PC >= _ProgramSize){
                    this.PC -= _ProgramSize;
                }
            }else{
                this.PC++;
            }
        }

        public noOp(){}

        public incrementValOfByte(){
            var currPos = this.PC ++;
            _MemoryManager.storeInMem(currPos, this.convertToHex(_MemoryManager.getNextTwoBytes(1+this.PC))+1);
            this.PC++;
        }

        public convertToHex(num){
            var hexNum = parseInt(num, 16);
            return hexNum;
        }

        public SysCall(){
            //_KernelInterruptQueue.enqueue(new Interrupt())
        }

        public breakOp(){
            this.isExecuting = false;
        }
    }
}
