///<reference path="../globals.ts" />
/* ------------
     Console.ts

     Requires globals.ts

     The OS Console - stdIn and stdOut by default.
     Note: This is not the Shell. The Shell is the "command line interface" (CLI) or interpreter for this console.
     ------------ */
var TSOS;
(function (TSOS) {
    var Console = (function () {
        function Console(currentFont, currentFontSize, currentXPosition, currentYPosition, buffer) {
            if (currentFont === void 0) { currentFont = _DefaultFontFamily; }
            if (currentFontSize === void 0) { currentFontSize = _DefaultFontSize; }
            if (currentXPosition === void 0) { currentXPosition = 0; }
            if (currentYPosition === void 0) { currentYPosition = _DefaultFontSize; }
            if (buffer === void 0) { buffer = ""; }
            this.currentFont = currentFont;
            this.currentFontSize = currentFontSize;
            this.currentXPosition = currentXPosition;
            this.currentYPosition = currentYPosition;
            this.buffer = buffer;
        }
        Console.prototype.init = function () {
            this.clearScreen();
            this.resetXY();
            document.getElementById("statusBox2").value = "Enter status <string> to update";
        };
        Console.prototype.clearScreen = function () {
            _DrawingContext.clearRect(0, 0, _Canvas.width, _Canvas.height);
        };
        Console.prototype.resetXY = function () {
            this.currentXPosition = 0;
            this.currentYPosition = this.currentFontSize;
        };
        Console.prototype.handleInput = function () {
            while (_KernelInputQueue.getSize() > 0) {
                // Get the next character from the kernel input queue.
                var chr = _KernelInputQueue.dequeue();
                // Check to see if it's "special" (enter or ctrl-c) or "normal" (anything else that the keyboard device driver gave us).
                if (chr === String.fromCharCode(13)) {
                    // The enter key marks the end of a console command, so ...
                    // ... tell the shell ...
                    _LineCount = 0;
                    var buf = this.buffer;
                    _ExecutedCMDs.push(buf);
                    // ... and reset our buffer.
                    _OsShell.handleInput(buf);
                    this.buffer = "";
                    _TabHitCount = 0;
                    _CurrCMDArrayPos = 0;
                }
                else if (chr == String.fromCharCode(9)) {
                    var availableCMDs = new Array();
                    for (var x = 0; x < _OsShell.commandList.length; x++) {
                        if (_OsShell.commandList[x].command.search(_cmdEntered) == 0) {
                            availableCMDs.push(_OsShell.commandList[x].command);
                        }
                    }
                    if (availableCMDs.length > 1) {
                        this.clearCMDLine();
                        if (_TabHitCount > availableCMDs.length - 1) {
                            _TabHitCount = 0;
                        }
                        _Console.buffer = availableCMDs[_TabHitCount];
                        this.putText(this.buffer);
                        _TabHitCount += 1;
                    }
                    else if (availableCMDs.length == 1) {
                        this.clearCMDLine();
                        this.buffer = availableCMDs[0];
                        this.putText(this.buffer);
                    }
                }
                else {
                    // This is a "normal" character, so ...
                    // ... draw it on the screen...
                    this.putText(chr);
                    // ... and add it to our buffer.
                    this.buffer += chr;
                }
            }
        };
        Console.prototype.clearCMDLine = function () {
            var inputString = _Console.buffer;
            var cursorPos = _Console.currentXPosition;
            var newBuffer = "";
            var length = TSOS.CanvasTextFunctions.measure(_DefaultFontFamily, _DefaultFontSize, inputString);
            _Console.currentXPosition = cursorPos - length;
            _DrawingContext.fillStyle = "#DFDBC3";
            _DrawingContext.fillRect(_Console.currentXPosition, _Console.currentYPosition - _DefaultFontSize - 2, length, _DefaultFontSize + _FontHeightMargin + 4);
            _Console.currentXPosition = cursorPos - length;
            _Console.buffer = newBuffer;
        };
        Console.prototype.handleBackspace = function () {
            var inputString = _Console.buffer;
            var cursorPos = _Console.currentXPosition;
            var newBuffer = "";
            var lastChar = inputString[inputString.length - 1];
            _TabHitCount = 0;
            for (var i = 0; i < inputString.length - 1; i++) {
                newBuffer += inputString[i];
            }
            if (_Console.buffer.length != 0) {
                if (_Console.currentXPosition > TSOS.CanvasTextFunctions.measure(_DefaultFontFamily, _DefaultFontSize, ">")) {
                    _Console.currentXPosition = cursorPos - TSOS.CanvasTextFunctions.measure(_DefaultFontFamily, _DefaultFontSize, _Console.buffer.charAt(_Console.buffer.length - 1));
                    _DrawingContext.fillStyle = "#DFDBC3";
                    _DrawingContext.fillRect(_Console.currentXPosition, _Console.currentYPosition - _DefaultFontSize - 2, TSOS.CanvasTextFunctions.measure(_DefaultFontFamily, _DefaultFontSize, _Console.buffer.charAt(_Console.buffer.length - 1)), _DefaultFontSize + _FontHeightMargin + 4);
                    _Console.currentXPosition = cursorPos - TSOS.CanvasTextFunctions.measure(_DefaultFontFamily, _DefaultFontSize, _Console.buffer.charAt(_Console.buffer.length - 1));
                }
                else if (_LineCount > 0) {
                    _LineCount--;
                    var ypos;
                    _Console.currentXPosition = _LastCursorPos;
                    _Console.currentYPosition = _Console.currentYPosition - _DefaultFontSize - _FontHeightMargin;
                    ypos = _Console.currentYPosition;
                    _Console.currentXPosition = _Console.currentXPosition - TSOS.CanvasTextFunctions.measure(_DefaultFontFamily, _DefaultFontSize, _Console.buffer.charAt(_Console.buffer.length - 1));
                    this.drawRec();
                    _Console.currentYPosition = ypos - _FontHeightMargin + 1;
                }
            }
            else {
                if (_Console.buffer.length == 0) {
                    _cmdEntered = "";
                    _TabHitCount = 0;
                }
            }
            //Shows it works
            _Console.buffer = newBuffer;
        };
        Console.prototype.drawRec = function () {
            _DrawingContext.fillStyle = "#DFDBC3";
            _DrawingContext.fillRect(_Console.currentXPosition, _Console.currentYPosition - _DefaultFontSize - 2, TSOS.CanvasTextFunctions.measure(_DefaultFontFamily, _DefaultFontSize, _Console.buffer.charAt(_Console.buffer.length - 1)), _DefaultFontSize + _FontHeightMargin + 4);
        };
        Console.prototype.putText = function (text) {
            // My first inclination here was to write two functions: putChar() and putString().
            // Then I remembered that JavaScript is (sadly) untyped and it won't differentiate
            // between the two.  So rather than be like PHP and write two (or more) functions that
            // do the same thing, thereby encouraging confusion and decreasing readability, I
            // decided to write one function and use the term "text" to connote string or char.
            //
            // UPDATE: Even though we are now working in TypeScript, char and string remain undistinguished.
            //         Consider fixing that.
            var charWidth = TSOS.CanvasTextFunctions.measure(_DefaultFontFamily, _DefaultFontSize, text);
            if (text !== "") {
                // Draw the text at the current X and Y coordinates.
                if ((this.currentXPosition + charWidth) < _Canvas.width) {
                    _DrawingContext.drawText(this.currentFont, this.currentFontSize, this.currentXPosition, this.currentYPosition, text);
                    // Move the current X position.
                    var offset = _DrawingContext.measureText(this.currentFont, this.currentFontSize, text);
                    this.currentXPosition = this.currentXPosition + offset;
                    _LastCharOnLine = text;
                }
                else {
                    _LastCursorPos = _Console.currentXPosition;
                    this.advanceLine();
                    _LineCount += 1;
                    this.currentXPosition = TSOS.CanvasTextFunctions.measure(_DefaultFontFamily, _DefaultFontSize, ">");
                    _DrawingContext.drawText(this.currentFont, this.currentFontSize, this.currentXPosition, this.currentYPosition, text);
                    // Move the current X position.
                    var offset = _DrawingContext.measureText(this.currentFont, this.currentFontSize, text);
                    this.currentXPosition = this.currentXPosition + offset;
                }
            }
        };
        Console.prototype.advanceLine = function () {
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
            var canvas = document.getElementById("display");
            var ctx = canvas.getContext("2d");
            if (this.currentYPosition >= canvas.height) {
                var shiftDown = 13 + TSOS.CanvasTextFunctions.descent(this.currentFont, this.currentFontSize) + 4;
                var currCanvas = ctx.getImageData(0, shiftDown, canvas.width, canvas.height);
                ctx.putImageData(currCanvas, 0, 0);
                this.currentYPosition = canvas.height - this.currentFontSize;
            }
        };
        Console.prototype.UpArrow = function () {
            if (_CurrCMDArrayPos <= _ExecutedCMDs.length) {
                this.clearCMDLine();
                var command = _ExecutedCMDs[_CurrCMDArrayPos + 1];
                _Console.buffer = command;
                this.putText(command);
                _CurrCMDArrayPos++;
            }
        };
        Console.prototype.DownArrow = function () {
            if (_CurrCMDArrayPos >= 1) {
                this.clearCMDLine();
                var command = _ExecutedCMDs[_CurrCMDArrayPos - 1];
                _Console.buffer = command;
                this.putText(command);
                _CurrCMDArrayPos = _CurrCMDArrayPos - 1;
            }
        };
        return Console;
    })();
    TSOS.Console = Console;
})(TSOS || (TSOS = {}));
