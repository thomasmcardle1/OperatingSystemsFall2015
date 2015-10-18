/*
 Requires globals.ts
 */

module TSOS {
     export class PCBP{
         constructor(
             public PC: number,
             public Acc: number,
             public Xreg: number,
             public Yreg: number,
             public Zflag: number,
             public pid: number,
             public intruction: string,

             public start: number,
             public max: number,
             public state: string = "",
             public location: string = ""
         ){
             this.pid = _PID;
             _PID++;
         }
     }
}