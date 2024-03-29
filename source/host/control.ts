///<reference path="../globals.ts" />
///<reference path="../os/memoryManager.ts"/>
///<reference path="../os/canvastext.ts" />
///<reference path="../host/Memory.ts" />

/* ------------
     Control.ts

     Requires globals.ts.

     Routines for the hardware simulation, NOT for our client OS itself.
     These are static because we are never going to instantiate them, because they represent the hardware.
     In this manner, it's A LITTLE BIT like a hypervisor, in that the Document environment inside a browser
     is the "bare metal" (so to speak) for which we write code that hosts our client OS.
     But that analogy only goes so far, and the lines are blurred, because we are using TypeScript/JavaScript
     in both the host and client environments.

     This (and other host/simulation scripts) is the only place that we should see "web" code, such as
     DOM manipulation and event handling, and so on.  (Index.html is -- obviously -- th
     e only place for markup.)

     This code references page numbers in the text book:
     Operating System Concepts 8th edition by Silberschatz, Galvin, and Gagne.  ISBN 978-0-470-12872-5
     ------------ */

//
// Control Services
//
module TSOS {

    export class Control {

        public static hostInit():void {
            // This is called from index.html's onLoad event via the onDocumentLoad function pointer.

            // Get a global reference to the canvas.  TODO: Should we move this stuff into a Display Device Driver?
            _Canvas = <HTMLCanvasElement>document.getElementById('display');

            // Get a global reference to the drawing context.
            _DrawingContext = _Canvas.getContext("2d");

            // Enable the added-in canvas text functions (see canvastext.ts for provenance and details).
            CanvasTextFunctions.enable(_DrawingContext);   // Text functionality is now built in to the HTML5 canvas. But this is old-school, and fun, so we'll keep it.

            // Clear the log text box.
            // Use the TypeScript cast to HTMLInputElement
            (<HTMLInputElement> document.getElementById("taHostLog")).value = "";

            // Set focus on the start button.
            // Use the TypeScript cast to HTMLInputElement
            (<HTMLInputElement> document.getElementById("btnStartOS")).focus();

            //Init Memory
            _Memory = new Memory(_MemorySize);
            _MemoryManager = new MemoryManager();
            _FileSystem = new fileSystemDeviceDriver();

            this.createMemoryTable();
            this.createHardDriveTable();

            _Scheduler = new TSOS.CPUScheduler();

            // Check for our testing and enrichment core, which
            // may be referenced here (from index.html) as function Glados().
            if (typeof Glados === "function") {
                // function Glados() is here, so instantiate Her into
                // the global (and properly capitalized) _GLaDOS variable.
                _GLaDOS = new Glados();
                _GLaDOS.init();
            }
        }

        public static hostLog(msg:string, source:string = "?"):void {
            // Note the OS CLOCK.
            var clock:number = _OSclock;

            // Note the REAL clock in milliseconds since January 1, 1970.
            var now:number = new Date().getTime();

            // Build the log string.
            var str:string = "({ clock:" + clock + ", source:" + source + ", msg:" + msg + ", now:" + now + " })" + "\n";

            // Update the log console.
            var taLog = <HTMLInputElement> document.getElementById("taHostLog");
            taLog.value = str + taLog.value;

            // TODO in the future: Optionally update a log database or some streaming service.
        }


        //
        // Host Events
        //
        public static hostBtnStartOS_click(btn):void {
            // Disable the (passed-in) start button...
            btn.disabled = true;

            // .. enable the Halt and Reset buttons ...
            (<HTMLButtonElement>document.getElementById("btnHaltOS")).disabled = false;
            (<HTMLButtonElement>document.getElementById("btnReset")).disabled = false;

            // .. set focus on the OS console display ...
            document.getElementById("display").focus();

            // ... Create and initialize the CPU (because it's part of the hardware)  ...
            _CPU = new Cpu(); // Note: We could simulate multi-core systems by instantiating more than one instance of the CPU here.
            _CPU.init();       //       There's more to do, like dealing with scheduling and such, but this would be a start. Pretty cool.

            // ... then set the host clock pulse ...
            _hardwareClockID = setInterval(Devices.hostClockPulse, CPU_CLOCK_INTERVAL);
            // .. and call the OS Kernel Bootstrap routine.
            _Kernel = new Kernel();
            _Kernel.krnBootstrap();  // _GLaDOS.afterStartup() will get called in there, if configured.

            (<HTMLInputElement>document.getElementById("taProgramInput")).value = "A9 00 8D 7B 00 A9 00 8D 7B 00 A9 00 8D 7C 00 A9 00 8D 7C 00 A9 01 8D 7A 00 A2 00 EC 7A 00 D0 39 A0 7D A2 02 FF AC 7B 00 A2 01 FF AD 7B 00 8D 7A 00 A9 01 6D 7A 00 8D 7B 00 A9 03 AE 7B 00 8D 7A 00 A9 00 EC 7A 00 D0 02 A9 01 8D 7A 00 A2 01 EC 7A 00 D0 05 A9 01 8D 7C 00 A9 00 AE 7C 00 8D 7A 00 A9 00 EC 7A 00 D0 02 A9 01 8D 7A 00 A2 00 EC 7A 00 D0 AC A0 7F A2 02 FF 00 00 00 00 61 00 61 64 6F 6E 65 00";
        }

        public static hostBtnHaltOS_click(btn):void {
            Control.hostLog("Emergency halt", "host");
            Control.hostLog("Attempting Kernel shutdown.", "host");
            // Call the OS shutdown routine.
            _Kernel.krnShutdown();
            // Stop the interval that's simulating our clock pulse.
            clearInterval(_hardwareClockID);
            // TODO: Is there anything else we need to do here?
        }

        public static hostBtnSingleStep_click(btn):void {
            if (_SingleStep) {
                _SingleStep = false;
                _OsShell.shellStatus("OFF");
            } else {
                _SingleStep = true;
                _OsShell.shellStatus("ON");
            }
        }

        public static hostBtnSingleStepNext_click(btn):void {
            _CPU.isExecuting = true;
        }

        public static hostBtnReset_click(btn):void {
            // The easiest and most thorough way to do this is to reload (not refresh) the document.
            location.reload(true);
            // That boolean parameter is the 'forceget' flag. When it is true it causes the page to always
            // be reloaded from the server. If it is false or not specified the browser may reload the
            // page from its cache, which is not what we want.
        }

        public static updateMemTable(tableRow, tableCel, newCode):void {
            _MemoryTable.rows[tableRow].cells[tableCel + 1].innerHTML = newCode;
        }

        public static createMemoryTable():void {
            _MemoryTable = <HTMLTableElement>document.getElementById("memTable");
            var counter:number = 0;
            for (var j = 0; j < (_MemorySize / 8); j++) {
                if (j === _MemorySize / 8) {
                    var tr = document.createElement("tr");
                    tr.id = "botRow";
                    _MemoryTable.appendChild(tr);
                } else {
                    var tr = document.createElement("tr");
                    _MemoryTable.appendChild(tr);
                }
                for (var k = 0; k < 9; k++) {
                    if (k == 0) {
                        var td = document.createElement("td");
                        td.id = "hexLabel";
                        td.innerHTML = "00";
                        tr.appendChild(td);
                    } else {
                        var td = document.createElement("td");
                        td.innerHTML = "00";
                        td.id = counter.toString();
                        tr.appendChild(td);
                    }
                    counter++;
                }
            }

            for (var i = 0; i < (_MemorySize / 8); i++) {
                for (var h = 0; h < 9; h++) {
                    if (h == 0) {
                        var hexNum = _TableRow.toString(16);
                        if (_TableRow == 0) {
                            _MemoryTable.rows[i].cells[h].innerHTML = "0x000";
                        } else {
                            if (hexNum.length < 2) {
                                _MemoryTable.rows[i].cells[h].innerHTML = "0x00" + hexNum.toUpperCase();
                            } else if (hexNum.length < 3) {
                                _MemoryTable.rows[i].cells[h].innerHTML = "0x0" + hexNum.toUpperCase();
                            } else {
                                _MemoryTable.rows[i].cells[h].innerHTML = "0x" + hexNum.toUpperCase();
                            }
                        }
                        _TableRow += 8;
                    }
                }
            }
        }

        public static resetMemoryTable():void {
            _TableRow = 0;
            for (var i = 0; i < (_MemorySize / 8); i++) {
                for (var h = 0; h < 9; h++) {
                    if (h == 0) {
                        var hexNum = _TableRow.toString(16);
                        if (_TableRow == 0) {
                            _MemoryTable.rows[i].cells[h].innerHTML = "0x000";
                        } else {
                            if (hexNum.length < 2) {
                                _MemoryTable.rows[i].cells[h].innerHTML = "0x00" + hexNum.toUpperCase();
                            } else if (hexNum.length < 3) {
                                _MemoryTable.rows[i].cells[h].innerHTML = "0x0" + hexNum.toUpperCase();
                            } else {
                                _MemoryTable.rows[i].cells[h].innerHTML = "0x" + hexNum.toUpperCase();
                            }
                        }
                        _TableRow += 8;
                    }
                    else {
                        _MemoryTable.rows[i].cells[h].innerHTML = "00";
                    }
                }
            }
        }

        public static updateReadyQueueTable() {
            var output="<thead style='font-weight:bold'>";
            output += "<th>PID</th>";
            output += "<th>Base</th>";
            output += "<th>Limit</th>";
            output += "<th>PC</th>";
            output += "<th>ACC</th>";
            output += "<th>X- Reg</th>";
            output += "<th>Y - Reg</th>";
            output += "<th>Z - Flag</th>";
            output += "<th>State</th>";
            output += "<th>Priority</th>";
            output += "<th>Location</th>";
            output += "</thead>";
            for (var i=0; i<_ReadyQueue.length; i++){
                output += "<tr>";
                output += "<td> "+_ReadyQueue[i].pid+"</td>";
                output += "<td> "+_ReadyQueue[i].base+"</td>";
                output += "<td> "+_ReadyQueue[i].limit+"</td>";
                output += "<td> "+ _ReadyQueue[i].PC+"</td>";
                output += "<td> "+_ReadyQueue[i].Acc+"</td>";
                output += "<td> "+_ReadyQueue[i].Xreg+"</td>";
                output += "<td> "+_ReadyQueue[i].Yreg+"</td>";
                output += "<td> "+_ReadyQueue[i].Zflag+"</td>";
                output += "<td> "+_ReadyQueue[i].processState+"</td>";
                output += "<td> "+_ReadyQueue[i].priority+"</td>";
                output += "<td> "+_ReadyQueue[i].location+"</td>";
                output += "</tr>";
            }
            document.getElementById("ReadyQueueDisplayTable").innerHTML = output;
        }

        public static createHardDriveTable():void {
            sessionStorage.clear();
            _HardDriveTable = <HTMLTableElement>document.getElementById("hdTable");
            console.log(_HardDriveTable);

        }
    }
}
