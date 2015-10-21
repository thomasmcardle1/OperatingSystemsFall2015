///<reference path="../globals.ts" />


module TSOS {

    export class Memory {

        public memoryArray:string [] ;
        public memoryBlockSize: number = 256;

        constructor(size:number) {
            this.memoryBlockSize = size;
            this.initialize(this.memoryBlockSize);
        }

        public initialize(size): void {
            this.memoryArray = [size];
            var zero: string = "00";
            for (var i =0; i< size; i++){
                this.memoryArray[i] = zero;
            }
        }

        public getMemoryBlock(){
            return this.memoryArray;
        }

        public clearMem(): void {}

    }
}