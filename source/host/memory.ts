///<reference path="../globals.ts" />
///<reference path="control.ts" />


module TSOS {

    export class Memory {

        public memoryArray:string [] ;
        public totalMem: number = 256;

        constructor(size:number) {
            this.totalMem = size;
            this.initialize(this.totalMem);
        }

        public initialize(size): void {
            this.memoryArray = [size];
            var zero: string = "00";
            for (var i =0; i< size; i++){
                this.memoryArray[i] = zero;
            }
        }

        public getMemory(){
            return this.memoryArray;
        }

        public getMemAtLocation(memLocation) : string{
            return this.memoryArray[memLocation];
        }
        public clearMem(): void {
            Control.resetMemoryTable();
            this.memoryArray = null;
            this.initialize(256);
        }

    }
}