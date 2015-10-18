


module TSOS {
    export class Memory {
        public dataArray: Array<String>
        constructor(public byte: number){
            this.byte = byte;
            this.dataArray = new Array(byte);
            this.init();
        }

        private init() : void{
            var zero = "00";
            for( var i = 0; i <this.byte; i++){
                this.dataArray[i] = zero;
            }
        }
    }
}