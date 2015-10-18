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
                    public instruction: String,
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
        }

        public executeOPCode(code) {
            this.instruction = code;

            switch (this.instruction) {
                case "A9":
                    //Load the accumulator with a constant
                    break;
                case "AD":
                    //Load the accumulator from memory
                    break;
                case "8D":
                    //Store the accumulator in memory
                    break;
                case "6D":
                    //Add with carry -- Adds contents of an address to the contents of the accumulator and keeps the result in the accumulator
                    break;
                case "A2":
                    //Load the X register with a constant
                    break;
                case "AE":
                    // Load the X register from Memory
                    break;
                case "A0":
                    //Load the Y Register with a constant
                    break;
                case "AC":
                    //Load the Y Register from memory
                    break;
                case "EA":
                    // No Operation
                    break;
                case "EC":
                    // Compare a byte in memory to the X reg --  Sets the Z (zero) flag if equal
                    break;
                case "D0":
                    //Branch n bytes if Z flag = 0
                    break
                case "EE":
                    // Increment the value of a byte
                    break;
                case "00":
                    //Break (which is really a system call)
                    break;
                case "FF":
                    //System Call
                    break;
                default :
                    //Do Something
                    break;
            }
        }

        public loadAccWithConstant(){}

        public loadAccFromMem(){}

        public storeAccInMem(){}

        public addWithCarry(){}

        public loadXWithConstant(){}

        public loadXFromMem(){}

        public loadYWithConstant(){}

        public loadYFromMem(){}

        public noOp(){}

        public compareXEqualTo(){}

        public BNE(){}

        public incrementValOfByte(){}

        public breakOp(){}

        public SysCall(){}

    }
}
