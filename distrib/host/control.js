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
var TSOS;
(function (TSOS) {
    var Control = (function () {
        function Control() {
        }
        Control.hostInit = function () {
            // This is called from index.html's onLoad event via the onDocumentLoad function pointer.
            // Get a global reference to the canvas.  TODO: Should we move this stuff into a Display Device Driver?
            _Canvas = document.getElementById('display');
            // Get a global reference to the drawing context.
            _DrawingContext = _Canvas.getContext("2d");
            // Enable the added-in canvas text functions (see canvastext.ts for provenance and details).
            TSOS.CanvasTextFunctions.enable(_DrawingContext); // Text functionality is now built in to the HTML5 canvas. But this is old-school, and fun, so we'll keep it.
            // Clear the log text box.
            // Use the TypeScript cast to HTMLInputElement
            document.getElementById("taHostLog").value = "";
            // Set focus on the start button.
            // Use the TypeScript cast to HTMLInputElement
            document.getElementById("btnStartOS").focus();
            //Init Memory
            _Memory = new TSOS.Memory(_MemorySize);
            _MemoryManager = new TSOS.MemoryManager();
            this.createMemoryTable();
            // Check for our testing and enrichment core, which
            // may be referenced here (from index.html) as function Glados().
            if (typeof Glados === "function") {
                // function Glados() is here, so instantiate Her into
                // the global (and properly capitalized) _GLaDOS variable.
                _GLaDOS = new Glados();
                _GLaDOS.init();
            }
        };
        Control.hostLog = function (msg, source) {
            if (source === void 0) { source = "?"; }
            // Note the OS CLOCK.
            var clock = _OSclock;
            // Note the REAL clock in milliseconds since January 1, 1970.
            var now = new Date().getTime();
            // Build the log string.
            var str = "({ clock:" + clock + ", source:" + source + ", msg:" + msg + ", now:" + now + " })" + "\n";
            // Update the log console.
            var taLog = document.getElementById("taHostLog");
            taLog.value = str + taLog.value;
            // TODO in the future: Optionally update a log database or some streaming service.
        };
        //
        // Host Events
        //
        Control.hostBtnStartOS_click = function (btn) {
            // Disable the (passed-in) start button...
            btn.disabled = true;
            // .. enable the Halt and Reset buttons ...
            document.getElementById("btnHaltOS").disabled = false;
            document.getElementById("btnReset").disabled = false;
            // .. set focus on the OS console display ...
            document.getElementById("display").focus();
            // ... Create and initialize the CPU (because it's part of the hardware)  ...
            _CPU = new TSOS.Cpu(); // Note: We could simulate multi-core systems by instantiating more than one instance of the CPU here.
            _CPU.init(); //       There's more to do, like dealing with scheduling and such, but this would be a start. Pretty cool.
            // ... then set the host clock pulse ...
            _hardwareClockID = setInterval(TSOS.Devices.hostClockPulse, CPU_CLOCK_INTERVAL);
            // .. and call the OS Kernel Bootstrap routine.
            _Kernel = new TSOS.Kernel();
            _Kernel.krnBootstrap(); // _GLaDOS.afterStartup() will get called in there, if configured.
            document.getElementById("taProgramInput").value = "A9 00 8D 00 00 A9 00 8D 4B 00 A9 00 8D 4B 00 A2 03 EC 4B 00 D0 07 A2 01 EC 00 00 D0 05 A2 00 EC 00 00 D0 26 A0 4C A2 02 FF AC 4B 00 A2 01 FF A9 01 6D 4B 00 8D 4B 00 A2 02 EC 4B 00 D0 05 A0 55 A2 02 FF A2 01 EC 00 00 D0 C5 00 00 63 6F 75 6E 74 69 6E 67 00 68 65 6C 6C 6F 20 77 6F 72 6C 64 00";
        };
        Control.hostBtnHaltOS_click = function (btn) {
            Control.hostLog("Emergency halt", "host");
            Control.hostLog("Attempting Kernel shutdown.", "host");
            // Call the OS shutdown routine.
            _Kernel.krnShutdown();
            // Stop the interval that's simulating our clock pulse.
            clearInterval(_hardwareClockID);
            // TODO: Is there anything else we need to do here?
        };
        Control.hostBtnSingleStep_click = function (btn) {
            if (_SingleStep) {
                _SingleStep = false;
                _OsShell.shellStatus("OFF");
            }
            else {
                _SingleStep = true;
                _OsShell.shellStatus("ON");
            }
        };
        Control.hostBtnSingleStepNext_click = function (btn) {
            _CPU.isExecuting = true;
        };
        Control.hostBtnReset_click = function (btn) {
            // The easiest and most thorough way to do this is to reload (not refresh) the document.
            location.reload(true);
            // That boolean parameter is the 'forceget' flag. When it is true it causes the page to always
            // be reloaded from the server. If it is false or not specified the browser may reload the
            // page from its cache, which is not what we want.
        };
        Control.updateMemTable = function (tableRow, tableCel, newCode) {
            _MemoryTable.rows[tableRow].cells[tableCel + 1].innerHTML = newCode;
        };
        Control.createMemoryTable = function () {
            _MemoryTable = document.getElementById("memTable");
            var counter = 0;
            for (var j = 0; j < (_MemorySize / 8); j++) {
                if (j === _MemorySize / 8) {
                    var tr = document.createElement("tr");
                    tr.id = "botRow";
                    _MemoryTable.appendChild(tr);
                }
                else {
                    var tr = document.createElement("tr");
                    _MemoryTable.appendChild(tr);
                }
                for (var k = 0; k < 9; k++) {
                    if (k == 0) {
                        var td = document.createElement("td");
                        td.id = "hexLabel";
                        td.innerHTML = "00";
                        tr.appendChild(td);
                    }
                    else {
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
                        }
                        else {
                            if (hexNum.length < 2) {
                                _MemoryTable.rows[i].cells[h].innerHTML = "0x00" + hexNum.toUpperCase();
                            }
                            else if (hexNum.length < 3) {
                                _MemoryTable.rows[i].cells[h].innerHTML = "0x0" + hexNum.toUpperCase();
                            }
                            else {
                                _MemoryTable.rows[i].cells[h].innerHTML = "0x" + hexNum.toUpperCase();
                            }
                        }
                        _TableRow += 8;
                    }
                }
            }
        };
        Control.resetMemoryTable = function () {
            _TableRow = 0;
            for (var i = 0; i < (_MemorySize / 8); i++) {
                for (var h = 0; h < 9; h++) {
                    if (h == 0) {
                        var hexNum = _TableRow.toString(16);
                        if (_TableRow == 0) {
                            _MemoryTable.rows[i].cells[h].innerHTML = "0x000";
                        }
                        else {
                            if (hexNum.length < 2) {
                                _MemoryTable.rows[i].cells[h].innerHTML = "0x00" + hexNum.toUpperCase();
                            }
                            else if (hexNum.length < 3) {
                                _MemoryTable.rows[i].cells[h].innerHTML = "0x0" + hexNum.toUpperCase();
                            }
                            else {
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
        };
        return Control;
    })();
    TSOS.Control = Control;
})(TSOS || (TSOS = {}));
