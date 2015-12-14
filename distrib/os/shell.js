///<reference path="../globals.ts" />
///<reference path="../utils.ts" />
///<reference path="shellCommand.ts" />
///<reference path="userCommand.ts" />
///<reference path="memoryManager.ts" />
///<reference path="../host/memory.ts" />
/* ------------
 Shell.ts

 The OS Shell - The "command line interface" (CLI) for the console.

 Note: While fun and learning are the primary goals of all enrichment center activities,
 serious injuries may occur when trying to write your own Operating System.
 ------------ */
// TODO: Write a base class / prototype for system services and let Shell inherit from it.
var TSOS;
(function (TSOS) {
    var Shell = (function () {
        function Shell() {
            // Properties
            this.promptStr = ">";
            this.commandList = [];
            this.curses = "[fuvg],[cvff],[shpx],[phag],[pbpxfhpxre],[zbgureshpxre],[gvgf]";
            this.apologies = "[sorry]";
        }
        Shell.prototype.init = function () {
            var sc;
            //
            // Load the command list.
            // ver
            sc = new TSOS.ShellCommand(this.shellVer, "ver", "- Displays the current version data.");
            this.commandList[this.commandList.length] = sc;
            // help
            sc = new TSOS.ShellCommand(this.shellHelp, "help", "- This is the help command. Seek help.");
            this.commandList[this.commandList.length] = sc;
            // shutdown
            sc = new TSOS.ShellCommand(this.shellShutdown, "shutdown", "- Shuts down the virtual OS but leaves the underlying host / hardware simulation running.");
            this.commandList[this.commandList.length] = sc;
            // cls
            sc = new TSOS.ShellCommand(this.shellCls, "cls", "- Clears the screen and resets the cursor position.");
            this.commandList[this.commandList.length] = sc;
            // man <topic>
            sc = new TSOS.ShellCommand(this.shellMan, "man", "<topic> - Displays the MANual page for <topic>.");
            this.commandList[this.commandList.length] = sc;
            // trace <on | off>
            sc = new TSOS.ShellCommand(this.shellTrace, "trace", "<on | off> - Turns the OS trace on or off.");
            this.commandList[this.commandList.length] = sc;
            // rot13 <string>
            sc = new TSOS.ShellCommand(this.shellRot13, "rot13", "<string> - Does rot13 obfuscation on <string>.");
            this.commandList[this.commandList.length] = sc;
            // prompt <string>
            sc = new TSOS.ShellCommand(this.shellPrompt, "prompt", "<string> - Sets the prompt.");
            this.commandList[this.commandList.length] = sc;
            //Date
            sc = new TSOS.ShellCommand(this.shellDate, "date", "- Displays the Date.");
            this.commandList[this.commandList.length] = sc;
            //whereami
            sc = new TSOS.ShellCommand(this.shellLocation, "whereami", "-Your current location");
            this.commandList[this.commandList.length] = sc;
            //Joke command
            sc = new TSOS.ShellCommand(this.shellJoke, "joke", "- Tells a funny joke");
            this.commandList[this.commandList.length] = sc;
            //Joke command
            sc = new TSOS.ShellCommand(this.shellPunchLine, "punchline", "- Punch Line!!");
            this.commandList[this.commandList.length] = sc;
            //Create New File
            sc = new TSOS.ShellCommand(this.shellCreateFile, "create", "- <filename> Creates New File");
            this.commandList[this.commandList.length] = sc;
            //Reads File
            sc = new TSOS.ShellCommand(this.shellReadFile, "read", "- <filename> reads New File");
            this.commandList[this.commandList.length] = sc;
            //Deletes Files
            sc = new TSOS.ShellCommand(this.shellDeleteFile, "delete", "- <filename> reads New File");
            this.commandList[this.commandList.length] = sc;
            //Shows Currrent Scheduling
            sc = new TSOS.ShellCommand(this.shellShowScheduleType, "getschedule", "- displays current scheuling");
            this.commandList[this.commandList.length] = sc;
            //Shows Current Status
            sc = new TSOS.ShellCommand(this.shellStatus, "status", "<string> - Sets the Status.");
            this.commandList[this.commandList.length] = sc;
            //Write to File
            sc = new TSOS.ShellCommand(this.shellWriteFile, "write", "<filename> - writes data to a file based on filename.");
            this.commandList[this.commandList.length] = sc;
            //Loads program input into mem
            sc = new TSOS.ShellCommand(this.shellLoad, "load", "<string> - loads the program.");
            this.commandList[this.commandList.length] = sc;
            //Shows avaiable PID's from resident queue
            sc = new TSOS.ShellCommand(this.shellPS, "ps", "Shows the PID's of Current Programs in Memory");
            this.commandList[this.commandList.length] = sc;
            sc = new TSOS.ShellCommand(this.shellRun, "run", "<ID> - runs the program with the given ID.");
            this.commandList[this.commandList.length] = sc;
            sc = new TSOS.ShellCommand(this.shellRunAll, "runall", " - runs all the program in the ready queue");
            this.commandList[this.commandList.length] = sc;
            sc = new TSOS.ShellCommand(this.shellSetScheduleType, "setschedule", " - sets the scheduling type [roundrobin, fcfs, priority]");
            this.commandList[this.commandList.length] = sc;
            sc = new TSOS.ShellCommand(this.shellClearMem, "clearmem", " -Clears Memory and resets Memory Table");
            this.commandList[this.commandList.length] = sc;
            sc = new TSOS.ShellCommand(this.shellSetClockPulse, "setclock", "<number> -Clears Memory and resets Memory Table");
            this.commandList[this.commandList.length] = sc;
            sc = new TSOS.ShellCommand(this.shellKillProg, "kill", "<PID> - KIlls program running");
            this.commandList[this.commandList.length] = sc;
            sc = new TSOS.ShellCommand(this.shellFormat, "format", "- Format Disk");
            this.commandList[this.commandList.length] = sc;
            sc = new TSOS.ShellCommand(this.shellBSODMsg, "bsod", "- Calls Kernel Trap Error Message.");
            this.commandList[this.commandList.length] = sc;
            this.putPrompt();
        };
        Shell.prototype.putPrompt = function () {
            _StdOut.putText(this.promptStr);
        };
        Shell.prototype.handleInput = function (buffer) {
            _Kernel.krnTrace("Shell Command~" + buffer);
            //
            // Parse the input...
            //
            var userCommand = this.parseInput(buffer);
            // ... and assign the command and args to local variables.
            var cmd = userCommand.command;
            var args = userCommand.args;
            //
            // Determine the command and execute it.
            //
            // TypeScript/JavaScript may not support associative arrays in all browsers so we have to iterate over the
            // command list in attempt to find a match.  TODO: Is there a better way? Probably. Someone work it out and tell me in class.
            var index = 0;
            var found = false;
            var fn = undefined;
            while (!found && index < this.commandList.length) {
                if (this.commandList[index].command === cmd) {
                    found = true;
                    fn = this.commandList[index].func;
                }
                else {
                    ++index;
                }
            }
            if (found) {
                this.execute(fn, args);
            }
            else {
                // It's not found, so check for curses and apologies before declaring the command invalid.
                if (this.curses.indexOf("[" + TSOS.Utils.rot13(cmd) + "]") >= 0) {
                    this.execute(this.shellCurse);
                }
                else if (this.apologies.indexOf("[" + cmd + "]") >= 0) {
                    this.execute(this.shellApology);
                }
                else {
                    this.execute(this.shellInvalidCommand);
                }
            }
        };
        // Note: args is an option parameter, ergo the ? which allows TypeScript to understand that.
        Shell.prototype.execute = function (fn, args) {
            // We just got a command, so advance the line...
            _StdOut.advanceLine();
            // ... call the command function passing in the args with some über-cool functional programming ...
            fn(args);
            // Check to see if we need to advance the line again
            if (_StdOut.currentXPosition > 0) {
                _StdOut.advanceLine();
            }
            // ... and finally write the prompt again.
            this.putPrompt();
        };
        Shell.prototype.parseInput = function (buffer) {
            var retVal = new TSOS.UserCommand();
            // 1. Remove leading and trailing spaces.
            buffer = TSOS.Utils.trim(buffer);
            // 2. Lower-case it.
            buffer = buffer.toLowerCase();
            // 3. Separate on spaces so we can determine the command and command-line args, if any.
            var tempList = buffer.split(" ");
            // 4. Take the first (zeroth) element and use that as the command.
            var cmd = tempList.shift(); // Yes, you can do that to an array in JavaScript.  See the Queue class.
            // 4.1 Remove any left-over spaces.
            cmd = TSOS.Utils.trim(cmd);
            // 4.2 Record it in the return value.
            retVal.command = cmd;
            // 5. Now create the args array from what's left.
            for (var i in tempList) {
                var arg = TSOS.Utils.trim(tempList[i]);
                if (arg != "") {
                    retVal.args[retVal.args.length] = tempList[i];
                }
            }
            return retVal;
        };
        //
        // Shell Command Functions.  Kinda not part of Shell() class exactly, but
        // called from here, so kept here to avoid violating the law of least astonishment.
        //
        Shell.prototype.shellInvalidCommand = function () {
            _StdOut.putText("Invalid Command. ");
            if (_SarcasticMode) {
                _StdOut.putText("Unbelievable. You, [subject name here],");
                _StdOut.advanceLine();
                _StdOut.putText("must be the pride of [subject hometown here].");
            }
            else {
                _StdOut.putText("Type 'help' for, well... help.");
            }
        };
        Shell.prototype.shellCurse = function () {
            _StdOut.putText("Oh, so that's how it's going to be, eh? Fine.");
            _StdOut.advanceLine();
            _StdOut.putText("Bitch.");
            _SarcasticMode = true;
        };
        Shell.prototype.shellApology = function () {
            if (_SarcasticMode) {
                _StdOut.putText("I think we can put our differences behind us.");
                _StdOut.advanceLine();
                _StdOut.putText("For science . . . You monster.");
                _SarcasticMode = false;
            }
            else {
                _StdOut.putText("For what?");
            }
        };
        Shell.prototype.shellVer = function (args) {
            _StdOut.putText(APP_NAME + " version " + APP_VERSION);
        };
        Shell.prototype.shellHelp = function (args) {
            _StdOut.putText("Commands:");
            for (var i in _OsShell.commandList) {
                _StdOut.advanceLine();
                var cmd = _OsShell.commandList[i].command;
                var descrip = _OsShell.commandList[i].description;
                _StdOut.putText("  ");
                _StdOut.putText(cmd);
                _StdOut.putText(descrip);
            }
        };
        Shell.prototype.shellShutdown = function (args) {
            _StdOut.putText("Shutting down...");
            // Call Kernel shutdown routine.
            _Kernel.krnShutdown();
            // TODO: Stop the final prompt from being displayed.  If possible.  Not a high priority.  (Damn OCD!)
        };
        Shell.prototype.shellCls = function (args) {
            _StdOut.clearScreen();
            _StdOut.resetXY();
        };
        Shell.prototype.shellMan = function (args) {
            if (args.length > 0) {
                var topic = args[0];
                switch (topic) {
                    case "help":
                        _StdOut.putText("Help displays a list of (hopefully) valid commands.");
                        break;
                    case "ver":
                        _StdOut.putText("Displays the current version");
                        break;
                    case "shutdown":
                        _StdOut.putText("Shuts down the virtual OS but leaves the OS actually running..");
                        break;
                    case "date":
                        _StdOut.putText("date displays the current date and time");
                        break;
                    case "whereami":
                        _StdOut.putText("whereami tell you your current location");
                        break;
                    case "cls":
                        _StdOut.putText("Clears the enter the screen");
                        break;
                    case "joke":
                        _StdOut.putText("Will display a hilarious joke!");
                        break;
                    case "punchline":
                        _StdOut.putText("Displays the punch line of the joke!");
                        break;
                    case "prompt":
                        _StdOut.putText("Similar to  an echo command in windows. Reiterates the string after prompt.");
                        break;
                    case "status":
                        _StdOut.putText("Will update the status box with the string after the key work STATUS ");
                        break;
                    case "load":
                        _StdOut.putText("This will load the program based on what was typed in the program input field");
                        break;
                    case "bsod":
                        _StdOut.putText("Causes the Kernel to throw a trap error");
                        _StdOut.advanceLine();
                        _StdOut.putText("OS WILL SHUT DOWN!");
                        break;
                    // TODO: Make descriptive MANual page entries for the the rest of the shell commands here.
                    default:
                        _StdOut.putText("No manual entry for " + args[0] + ".");
                }
            }
            else {
                _StdOut.putText("Usage: man <topic>  Please supply a topic.");
            }
        };
        Shell.prototype.shellTrace = function (args) {
            if (args.length > 0) {
                var setting = args[0];
                switch (setting) {
                    case "on":
                        if (_Trace && _SarcasticMode) {
                            _StdOut.putText("Trace is already on, doofus.");
                        }
                        else {
                            _Trace = true;
                            _StdOut.putText("Trace ON");
                        }
                        break;
                    case "off":
                        _Trace = false;
                        _StdOut.putText("Trace OFF");
                        break;
                    default:
                        _StdOut.putText("Invalid arguement.  Usage: trace <on | off>.");
                }
            }
            else {
                _StdOut.putText("Usage: trace <on | off>");
            }
        };
        Shell.prototype.shellRot13 = function (args) {
            if (args.length > 0) {
                // Requires Utils.ts for rot13() function.
                _StdOut.putText(args.join(' ') + " = '" + TSOS.Utils.rot13(args.join(' ')) + "'");
            }
            else {
                _StdOut.putText("Usage: rot13 <string>  Please supply a string.");
            }
        };
        Shell.prototype.shellPrompt = function (args) {
            if (args.length > 0) {
                _OsShell.promptStr = args[0];
            }
            else {
                _StdOut.putText("Usage: prompt <string>  Please supply a string.");
            }
        };
        Shell.prototype.shellDate = function (args) {
            var date = new Date();
            var currentDate = new Date().toLocaleDateString();
            _StdOut.putText("The current date is " + currentDate);
        };
        Shell.prototype.shellLocation = function (args) {
            _StdOut.putText("You are probably sitting at your desk eating donuts");
        };
        Shell.prototype.shellJoke = function (args) {
            _StdOut.putText("What do you get when you put root");
            _StdOut.advanceLine();
            _StdOut.putText("beer in a square glass?");
            _StdOut.advanceLine();
            _StdOut.putText("Now Type 'punchline'");
        };
        Shell.prototype.shellPunchLine = function (args) {
            _StdOut.putText("Beer!");
        };
        Shell.prototype.shellStatus = function (args) {
            var string = "";
            for (var i = 0; i < args.length; i++) {
                string += args[i] + " ";
            }
            var date = new Date();
            var currentDateAndTime = date.toLocaleTimeString();
            document.getElementById("statusBox2").value += "\n" + currentDateAndTime + " : " + string;
        };
        Shell.prototype.shellLoad = function (args) {
            _Priority = _DefaultPriority;
            console.log(args.length);
            if (args.length >= 1) {
                _Priority = args[0];
            }
            console.log(_Priority);
            var inputString = document.getElementById("taProgramInput").value;
            //console.log(inputString);
            var valid = true;
            var i = 0;
            // While loop to loop through all of the characters of the string to validate each character is 0-9 and a-f or a space
            while (inputString.length > i) {
                if (inputString.charAt(i) == "0") {
                }
                else if (inputString.charAt(i) == '1') {
                }
                else if (inputString.charAt(i) == '2') {
                }
                else if (inputString.charAt(i) == '3') {
                }
                else if (inputString.charAt(i) == '4') {
                }
                else if (inputString.charAt(i) == '5') {
                }
                else if (inputString.charAt(i) == '6') {
                }
                else if (inputString.charAt(i) == '7') {
                }
                else if (inputString.charAt(i) == '8') {
                }
                else if (inputString.charAt(i) == '9') {
                }
                else if (inputString.charAt(i).toLocaleUpperCase() == 'A') {
                }
                else if (inputString.charAt(i).toLocaleUpperCase() == 'B') {
                }
                else if (inputString.charAt(i).toLocaleUpperCase() == 'C') {
                }
                else if (inputString.charAt(i).toLocaleUpperCase() == 'D') {
                }
                else if (inputString.charAt(i).toLocaleUpperCase() == 'E') {
                }
                else if (inputString.charAt(i).toLocaleUpperCase() == 'F') {
                }
                else if (inputString.charAt(i) == ' ') {
                }
                else {
                    valid = false;
                }
                i++;
            }
            if (inputString.length <= 0) {
                valid = false;
            }
            if (valid == false) {
                _StdOut.putText("Code is invalid. Please try again");
            }
            else {
                var newInputString = inputString.replace(/\n/g, " ").split(" ");
                var base = 0;
                var limit = 0;
                //console.log("CurrMemBloc: " + _CurrMemBlock);
                if (_CurrMemBlock >= 2) {
                    base = -1;
                    limit = -1;
                    _CurrMemBlock++;
                }
                else if (_CurrMemBlock < 2) {
                    _CurrMemBlock++;
                    base = _CurrMemBlock * 256;
                    limit = (_CurrMemBlock * 256) + 255;
                }
                _CurrPCB = new TSOS.PCB();
                _CurrPCB.priority = _Priority;
                if (_CurrMemBlock <= 2) {
                    _CurrPCB.base = base;
                    _CurrPCB.limit = limit;
                }
                //console.log("PCB: " + _CurrPCB.base + " "+ _CurrPCB.limit);
                //console.log(_CurrPCB.base + "  " + _CurrPCB.limit);
                if (_CurrMemBlock <= 2) {
                    var pid = (_MemoryManager.loadProgram(_CurrMemBlock, newInputString));
                    _StdOut.putText(pid);
                    _CurrPCB.PC = base;
                    _RunnablePIDs.push(_CurrPCB.pid);
                    console.log(_RunnablePIDs);
                    _StdOut.advanceLine();
                    _CurrPCB.location = "Memory";
                    _ResidentList.push(_CurrPCB);
                }
                else if (_CurrMemBlock > 2 || _Formatted == true) {
                    _RunnablePIDs.push(_CurrPCB.pid);
                    _StdOut.putText("pid:" + _PID + " loaded on disk as filename:" + _DefaultProgName + _PID);
                    _StdOut.advanceLine();
                    _CurrPCB.location = "FS";
                    _ResidentList.push(_CurrPCB);
                    var fileName = _DefaultProgName + _PID;
                    _FileSystem.createFile(fileName);
                    _FileSystem.writeFile(fileName, inputString);
                }
                else {
                    _StdOut.putText("Memory full. Please Format Disk");
                }
            }
            console.log(_ResidentList);
            console.log(_Formatted);
        };
        Shell.prototype.shellPS = function (args) {
            _StdOut.putText("PIDs of Programs in memory: ");
            for (var i = 0; i < _RunnablePIDs.length; i++) {
                _StdOut.putText(_RunnablePIDs[i] + " ");
            }
        };
        Shell.prototype.shellCreateFile = function (args) {
            var filename = "";
            if (args.length == 0 || args.length > 1) {
                _StdOut.putText("Must enter a filename --- create <filename>");
            }
            else {
                filename = args[0];
                console.log(args[0]);
                _StdOut.putText(" Creating File...");
                if (_FileSystem.createFile(filename)) {
                    _StdOut.putText("Successfully Created: " + filename);
                }
                else {
                    _StdOut.putText("Failed to Create File: " + filename);
                }
            }
        };
        Shell.prototype.shellReadFile = function (args) {
            var filename = "";
            if (args.length == 0 || args.length > 1) {
                _StdOut.putText("Must enter a filename --- read <filename>");
            }
            else {
                filename = args[0];
                console.log(args[0]);
                _StdOut.putText(" Reading File...");
                var fileData = _FileSystem.readFile(filename);
                _StdOut.advanceLine();
                while (fileData.length > 50) {
                    _StdOut.putText(fileData.substr(0, 50));
                    _StdOut.advanceLine();
                    fileData = fileData.substr(50, (fileData.length));
                }
                _StdOut.putText(fileData);
            }
        };
        Shell.prototype.shellWriteFile = function (args) {
            var filename = "";
            if (args.length == 0) {
                _StdOut.putText("Must enter a filename --- write <filename> <'file data'>");
            }
            else {
                filename = args[0];
                var whatToWrite;
                var bool = false;
                for (var i = 1; i < args.length; i++) {
                    console.log(args[i]);
                    whatToWrite += args[i].toString() + " ";
                }
            }
            var splitStr = whatToWrite.split("'");
            console.log(splitStr);
            console.log(splitStr[1]);
            whatToWrite = splitStr[1];
            _StdOut.putText(" Writing to File...");
            var fileData = _FileSystem.writeFile(filename, whatToWrite);
            _StdOut.putText("Successful");
        };
        Shell.prototype.shellDeleteFile = function (args) {
            var filename = "";
            if (args.length == 0 || args.length > 1) {
                _StdOut.putText("Must enter a filename --- read <filename>");
            }
            else {
                filename = args[0];
                console.log(args[0]);
                _StdOut.putText(" Deleting File...");
                var fileData = _FileSystem.deleteFile(filename);
                _StdOut.advanceLine();
                _StdOut.putText("File '" + filename + "' Deleted");
            }
        };
        Shell.prototype.shellRun = function (args) {
            console.log(_ResidentList);
            var runningPID = args[0];
            var validPID = false;
            if (args.length <= 0) {
                _StdOut.putText("Please Enter PID with Run <string>");
            }
            else {
                for (var i = 0; i < _ResidentList.length; i++) {
                    if (runningPID == _ResidentList[i].pid) {
                        //console.log(_ResidentList[i]);
                        _CurrPCB = _ResidentList[i];
                        validPID = true;
                    }
                }
                if (validPID = true) {
                    //run program
                    //console.log("CURR PID: " + _CurrPCB.pid);
                    //console.log(_CurrPCB.base);
                    _CPU.PC = _CurrPCB.base;
                    //console.log(_CPU);
                    //console.log(_Memory.memoryArray);
                    _CPU.isExecuting = true;
                }
                else {
                    //check for valid id
                    _StdOut.putText("Invalid program id");
                }
            }
        };
        Shell.prototype.shellRunAll = function (args) {
            _StdOut.putText("RUNNING ALL");
            _ReadyQueue = [];
            for (var i = 0; i < _ResidentList.length; i++) {
                console.log("" + _ResidentList[i]);
            }
            if (_SchedType == "fcfs") {
                console.log("fcfs");
                _ResidentList.sort(function (a, b) {
                    return parseFloat(a.pid) - parseFloat(b.pid);
                });
            }
            //compare function with help from stackOverFlow//
            if (_SchedType == "priority") {
                console.log("Sort _ReadyQueue");
                _ResidentList.sort(function (a, b) {
                    return parseFloat(a.priority) - parseFloat(b.priority);
                });
            }
            console.log(_ResidentList);
            for (var i = 0; i < _ResidentList.length; i++) {
                console.log(_ResidentList[i].priority);
            }
            //console.log(_ResidentList);
            for (var i = 0; i < _ResidentList.length; i++) {
                _ReadyQueue.push(_ResidentList[i]);
                if (i > 0) {
                    _ReadyQueue[i].processState = "Waiting";
                }
            }
            console.log(_ReadyQueue);
            _CurrPCB = _ReadyQueue[0];
            _CurrPCB.processState = "Running";
            _CPU.isExecuting = true;
        };
        Shell.prototype.shellClearMem = function (args) {
            _Memory.clearMem();
        };
        Shell.prototype.shellBSODMsg = function (args) {
            _Kernel.krnTrapError("BSOD");
        };
        Shell.prototype.shellSetClockPulse = function (args) {
            var num = args.shift();
            CPU_CLOCK_INTERVAL = num;
        };
        Shell.prototype.shellFormat = function (args) {
            console.log(_FileSystem);
            _FileSystem.initialize();
        };
        Shell.prototype.shellSetScheduleType = function (args) {
            if (args.length == 0) {
                _StdOut.putText("Please Enter a Scheduling Type [roundrobin, priority, fcfs]");
            }
            else {
                _SchedType = args[0];
                console.log(_SchedType);
            }
        };
        Shell.prototype.shellShowScheduleType = function (args) {
            _StdOut.putText("Current Scheduling Algorithm: " + _SchedType);
        };
        Shell.prototype.shellKillProg = function (args) {
            var pid = args[0];
            console.log(pid);
            for (var i = 0; i < _ReadyQueue.length; i++) {
                if (pid == _ReadyQueue[i].pid) {
                    console.log(pid + "--------------------" + _ReadyQueue[i].pid + "--------------------");
                    _ReadyQueue.splice(i, 1);
                }
                console.log(_RunnablePIDs);
            }
            for (var i = 0; i < _RunnablePIDs.length; i++) {
                var int = _RunnablePIDs[i];
                if (pid == int) {
                    console.log(pid + "--------------------" + int + "--------------------");
                    _RunnablePIDs.splice(i, 1);
                }
            }
        };
        return Shell;
    })();
    TSOS.Shell = Shell;
})(TSOS || (TSOS = {}));
