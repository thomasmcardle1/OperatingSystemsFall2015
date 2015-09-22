///<reference path="../globals.ts" />

/* ------------
     Console.ts

     Requires globals.ts

     The OS Console - stdIn and stdOut by default.
     Note: This is not the Shell. The Shell is the "command line interface" (CLI) or interpreter for this console.
     ------------ */

module TSOS {

    export class Console {

        constructor(public currentFont = _DefaultFontFamily,
                    public currentFontSize = _DefaultFontSize,
                    public currentXPosition = 0,
                    public currentYPosition = _DefaultFontSize,
                    public _ExecutedCMDs = new Array<string>(),
                    public buffer = "") {
        }


        public init(): void {
            this.clearScreen();
            this.resetXY();
            (<HTMLInputElement>document.getElementById("statusBox2")).value = "Enter status <string> to update";
        }

        private clearScreen(): void {
            _DrawingContext.clearRect(0, 0, _Canvas.width, _Canvas.height);
        }

        private resetXY(): void {
            this.currentXPosition = 0;
            this.currentYPosition = this.currentFontSize;
        }

        public handleInput(): void {
            while (_KernelInputQueue.getSize() > 0) {
                // Get the next character from the kernel input queue.
                var chr = _KernelInputQueue.dequeue();
                // Check to see if it's "special" (enter or ctrl-c) or "normal" (anything else that the keyboard device driver gave us).

                if (chr === String.fromCharCode(13)) { //     Enter key
                    // The enter key marks the end of a console command, so ...
                    // ... tell the shell ...
                    var buf = this.buffer;
                    this._ExecutedCMDs[_NumOfCMDs]=buf;
                    console.log(this._ExecutedCMDs[_NumOfCMDs]);
                    _NumOfCMDs +=1;
                    // ... and reset our buffer.
                    _OsShell.handleInput(buf);
                    this.buffer = "";
                    _TabHitCount =0;

                } else if (chr == String.fromCharCode(9)){
                    console.log(_TabHitCount);
                    console.log(_cmdEntered);
                    var availableCMDs = new Array<string>();
                    for (var x = 0; x < _OsShell.commandList.length; x++){
                        if (_OsShell.commandList[x].command.search(_cmdEntered) == 0){
                            availableCMDs.push(_OsShell.commandList[x].command);
                        }
                    }
                    console.log(availableCMDs);
                    if(availableCMDs.length > 1){
                        this.clearCMDLine();
                        if(_TabHitCount > availableCMDs.length-1){
                            _TabHitCount=0;
                        }
                        _Console.buffer= availableCMDs[_TabHitCount];
                        this.putText(this.buffer);
                        _TabHitCount +=1;
                    }
                    else if(availableCMDs.length == 1){
                        this.clearCMDLine();
                        this.buffer = availableCMDs[0];
                        this.putText(this.buffer);
                    }} else {
                    // This is a "normal" character, so ...
                    // ... draw it on the screen...
                    this.putText(chr);
                    // ... and add it to our buffer.
                    this.buffer += chr;
                }
                // TODO: Write a case for Ctrl-C.
            }
        }

        private clearCMDLine(): void{
            var inputString = _Console.buffer;
            var cursorPos = _Console.currentXPosition;
            var newBuffer= "";
            var length =  CanvasTextFunctions.measure(_DefaultFontFamily,_DefaultFontSize,inputString);
            _Console.currentXPosition = cursorPos - length;
            _DrawingContext.fillStyle= "#DFDBC3";
            _DrawingContext.fillRect(_Console.currentXPosition, _Console.currentYPosition-_DefaultFontSize - 2, length, _DefaultFontSize + _FontHeightMargin +4);
            _Console.currentXPosition = cursorPos - length;

            _Console.buffer=newBuffer;
        }

        public handleBackspace(): void{
           var inputString = _Console.buffer;
            var cursorPos = _Console.currentXPosition;
            var newBuffer= "";
            var lastChar = inputString[inputString.length-1];
            var charWidth = CanvasTextFunctions.measure(_DefaultFontFamily,_DefaultFontSize,lastChar);


            for(var i=0; i<inputString.length-1; i++){
                newBuffer += inputString[i];
            }

            _Console.buffer = newBuffer;
            if(_Console.currentXPosition > CanvasTextFunctions.measure(_DefaultFontFamily, _DefaultFontSize, ">")){
                _Console.currentXPosition = cursorPos - charWidth;
                _DrawingContext.fillStyle= "#DFDBC3";
                _DrawingContext.fillRect(_Console.currentXPosition, _Console.currentYPosition-_DefaultFontSize - 2, charWidth, _DefaultFontSize + _FontHeightMargin + 4);
                _Console.currentXPosition = cursorPos - CanvasTextFunctions.measure(_DefaultFontFamily,_DefaultFontSize,lastChar);
            }
            if(_Console.buffer.length == 0){
                _cmdEntered = "";
                _TabHitCount =0;
            }
            //Shows it works
            console.log(_Console.buffer);
        }

        public putText(text): void {
            // My first inclination here was to write two functions: putChar() and putString().
            // Then I remembered that JavaScript is (sadly) untyped and it won't differentiate
            // between the two.  So rather than be like PHP and write two (or more) functions that
            // do the same thing, thereby encouraging confusion and decreasing readability, I
            // decided to write one function and use the term "text" to connote string or char.
            //
            // UPDATE: Even though we are now working in TypeScript, char and string remain undistinguished.
            //         Consider fixing that.
            if (text !== "") {
                // Draw the text at the current X and Y coordinates.
                _DrawingContext.drawText(this.currentFont, this.currentFontSize, this.currentXPosition, this.currentYPosition, text);
                // Move the current X position.
                var offset = _DrawingContext.measureText(this.currentFont, this.currentFontSize, text);
                this.currentXPosition = this.currentXPosition + offset;
            }
         }

        public advanceLine(): void {
            this.currentXPosition = 0;
            /*
             * Font size measures from the baseline to the highest point in the font.
             * Font descent measures from the baseline to the lowest point in the font.
             * Font height margin is extra spacing between the lines.
             */
            this.currentYPosition += _DefaultFontSize + 
                                     _DrawingContext.fontDescent(this.currentFont, this.currentFontSize) +
                                     _FontHeightMargin;


            // TODO: Handle scrolling. (iProject 1)
            //Get Canvas From HTML Element
            var canvas = <HTMLCanvasElement> document.getElementById("display");
            var ctx = canvas.getContext("2d");

            if(this.currentYPosition >= canvas.height){
                var shiftDown = 13 + CanvasTextFunctions.descent(this.currentFont,this.currentFontSize) + 4;
                var currCanvas = ctx.getImageData(0, shiftDown, canvas.width, canvas.height);
                ctx.putImageData(currCanvas, 0, 0);
                this.currentYPosition = canvas.height - this.currentFontSize;
            }


        }
    }
 }
