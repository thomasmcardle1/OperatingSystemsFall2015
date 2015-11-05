/*
 Requires globals.ts
 */

///<reference path="../globals.ts" />


module TSOS {
     export class PCB{
         constructor(
             public PC: number=0,
             public Acc: number=0,
             public Xreg: number=0,
             public Yreg: number=0,
             public Zflag: number=0,
             public pid:number = ++_PID,
             public instructionRegister:string ="",

             public base: number=0,
             public limit: number =0,
             public location: any = null
         ){}
     }
}