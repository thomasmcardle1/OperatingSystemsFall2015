///<reference path="../globals.ts" />


module TSOS {
    export class Memory {
        public memoryArray:string [] ;
        public memoryBlockSize: number;
        constructor(size:number) {
            this.memoryBlockSize = size;
            this.init();
        }

        public init(): void {
            _Memory = new Memory(256);
            var zero: string = "00";
            for (var i =0; i< this.memoryBlockSize; i++){
                this.memoryArray[i] = zero;
            }
        }

        public getMemoryBlock(){
            return this.memoryBlockSize;
        }

        public clearMem(): void {}

    }
}