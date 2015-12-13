/*
 Requires globals.ts
 */

///<reference path="../globals.ts" />


module TSOS {
     export class PCB {
         constructor(public PC:number = 0,
                     public Acc:number = 0,
                     public Xreg:number = 0,
                     public Yreg:number = 0,
                     public Zflag:number = 0,
                     public pid:number = (_PID + 1),
                     public instructionRegister:string = "",
                     public base:number = (_CurrMemBlock*256),
                     public limit:number = ((_CurrMemBlock*256)+255),
                     public processState: string = "",
                     public location:any = null,
                     public priority:number = null) {
         }
     }

}
