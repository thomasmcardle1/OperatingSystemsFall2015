/* ------------
   Globals.ts

   Global CONSTANTS and _Variables.
   (Global over both the OS and Hardware Simulation / Host.)

   This code references page numbers in the text book:
   Operating System Concepts 8th edition by Silberschatz, Galvin, and Gagne.  ISBN 978-0-470-12872-5
   ------------ */
//
// Global CONSTANTS (TypeScript 1.5 introduced const. Very cool.)
//
var APP_NAME = "TOMS OS"; // 'cause Bob and I were at a loss for a better name.
var APP_VERSION = "17.38"; // What did you expect?
var CPU_CLOCK_INTERVAL = 100; // This is in ms (milliseconds) so 1000 = 1 second.
var TIMER_IRQ = 0; // Pages 23 (timer), 9 (interrupts), and 561 (interrupt priority).
// NOTE: The timer is different from hardware/host clock pulses. Don't confuse these.
var KEYBOARD_IRQ = 1;
//
// Global Variables
// TODO: Make a global object and use that instead of the "_" naming convention in the global namespace.
//
var _CPU; // Utilize TypeScript's type annotation system to ensure that _CPU is an instance of the Cpu class.
var _OSclock = 0; // Page 23.
var _Mode = 0; // (currently unused)  0 = Kernel Mode, 1 = User Mode.  See page 21.
var _Canvas; // Initialized in Control.hostInit().
var _DrawingContext; // = _Canvas.getContext("2d");  // Assigned here for type safety, but re-initialized in Control.hostInit() for OCD and logic.
var _DefaultFontFamily = "sans"; // Ignored, I think. The was just a place-holder in 2008, but the HTML canvas may have use for it.
var _DefaultFontSize = 13;
var _FontHeightMargin = 4; // Additional space added to font size when advancing a line.
var _Trace = true; // Default the OS trace to be on.
// The OS Kernel and its queues.
var _Kernel;
var _KernelInterruptQueue; // Initializing this to null (which I would normally do) would then require us to specify the 'any' type, as below.
var _KernelInputQueue = null; // Is this better? I don't like uninitialized variables. But I also don't like using the type specifier 'any'
var _KernelBuffers = null; // when clearly 'any' is not what we want. There is likely a better way, but what is it?
// Standard input and output
var _StdIn; // Same "to null or not to null" issue as above.
var _StdOut;
//CPU Things
var _PID = -1;
var _ProgramSize = 256;
var _CurrPCB = null;
var _Program = 1;
var _ProgramEXE = null;
var _NumberOfPrograms = 3;
//Memory Things
var _ResidentList = [];
var _ReadyQueue = [];
var _Priority = 10;
var _DefaultPriority = 10;
var _SingleStep = false;
var _Memory = null;
var _MemorySize = 768;
var _MemBlock = 256;
var _MemoryManager = null;
var _MemoryTable = null;
var _TableRow = 0;
var _CurrMemBlock = -1;
var _RunnablePIDs = [];
var _RunningPID = null;
//File System Things
var _HardDriveTable = null;
var _FileSystem = null;
var _Formatted = false;
var _DefaultProgName = "program";
var _SwappingBase = 0;
var _ListOfFileNames = [];
//CPU SCHEDULER
var _SchedType = "roundrobin";
var _Scheduler;
var _QUANTUM = 6;
var _CycleCounter = 0;
// UI
var _Console;
var _OsShell;
// At least this OS is not trying to kill you. (Yet.)
var _SarcasticMode = false;
// Global Device Driver Objects - page 12
var _krnKeyboardDriver; //  = null;
var _hardwareClockID = null;
// For testing (and enrichment)...
var Glados = null; // This is the function Glados() in glados.js on Labouseur.com.
var _GLaDOS = null; // If the above is linked in, this is the instantiated instance of Glados.
var onDocumentLoad = function () {
    TSOS.Control.hostInit();
};
var _ExecutedCMDs = new Array(); //Keeps track of all commands
var _CurrCMDArrayPos = 0; //Position of which we are in the Array
var _cmdEntered = ""; //Keeps track of the command entered
var _NumOfCMDs = null; //Keeps track of the number of commands executed in the console
var _TabHitCount = 0; //Number of times the tab key is pressed on one line
var _LineCount = 0; //Keeps track of what line typed we are on
var _LastCharOnLine = "";
var _LastCursorPos = 0;
