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
const APP_NAME: string    = "TOMS OS";   // 'cause Bob and I were at a loss for a better name.
const APP_VERSION: string = "17.38";   // What did you expect?

var CPU_CLOCK_INTERVAL: number = 100;   // This is in ms (milliseconds) so 1000 = 1 second.

const TIMER_IRQ: number = 0;  // Pages 23 (timer), 9 (interrupts), and 561 (interrupt priority).
                              // NOTE: The timer is different from hardware/host clock pulses. Don't confuse these.
const KEYBOARD_IRQ: number = 1;


//
// Global Variables
// TODO: Make a global object and use that instead of the "_" naming convention in the global namespace.
//
var _CPU: TSOS.Cpu;  // Utilize TypeScript's type annotation system to ensure that _CPU is an instance of the Cpu class.

var _OSclock: number = 0;  // Page 23.

var _Mode: number = 0;     // (currently unused)  0 = Kernel Mode, 1 = User Mode.  See page 21.

var _Canvas: HTMLCanvasElement;         // Initialized in Control.hostInit().
var _DrawingContext: any; // = _Canvas.getContext("2d");  // Assigned here for type safety, but re-initialized in Control.hostInit() for OCD and logic.
var _DefaultFontFamily: string = "sans";        // Ignored, I think. The was just a place-holder in 2008, but the HTML canvas may have use for it.
var _DefaultFontSize: number = 13;
var _FontHeightMargin: number = 4;              // Additional space added to font size when advancing a line.

var _Trace: boolean = true;  // Default the OS trace to be on.

// The OS Kernel and its queues.
var _Kernel: TSOS.Kernel;
var _KernelInterruptQueue;          // Initializing this to null (which I would normally do) would then require us to specify the 'any' type, as below.
var _KernelInputQueue: any = null;  // Is this better? I don't like uninitialized variables. But I also don't like using the type specifier 'any'
var _KernelBuffers: any[] = null;   // when clearly 'any' is not what we want. There is likely a better way, but what is it?

// Standard input and output
var _StdIn;    // Same "to null or not to null" issue as above.
var _StdOut;

//CPU Things
var _PID:number = -1;
var _ProgramSize = 256;
var _CurrPCB:any = null;
var _Program = 1;
var _ProgramEXE:number = null;
var _NumberOfPrograms:number = 3;

//Memory Things
var _ResidentList:any [] = [];
var _ReadyQueue:any[] = [];
var _Priority:number = 10;
var _DefaultPriority = 10;
var _SingleStep: boolean = false;
var _Memory:any = null;
var _MemorySize = 768;
var _MemBlock:number = 256;
var _MemoryManager: any = null;
var _MemoryTable:any = null;
var _TableRow:number = 0;
var _CurrMemBlock: number = -1;
var _RunnablePIDs: any[] = [];
var _RunningPID: any = null;

//File System Things
var _HardDriveTable:any= null;
var _FileSystem:any= null;
var _Formatted:boolean=false;
var _DefaultProgName: string = "program";
var _SwappingBase:any = 0;
var _ListOfFileNames:any = [];

//CPU SCHEDULER
var _SchedType:any = "roundrobin";
var _Scheduler: TSOS.CPUScheduler;
var _QUANTUM: number = 6;
var _CycleCounter: number = 0;

// UI
var _Console: TSOS.Console;
var _OsShell: TSOS.Shell;

// At least this OS is not trying to kill you. (Yet.)
var _SarcasticMode: boolean = false;

// Global Device Driver Objects - page 12
var _krnKeyboardDriver; //  = null;

var _hardwareClockID: number = null;

// For testing (and enrichment)...
var Glados: any = null;  // This is the function Glados() in glados.js on Labouseur.com.
var _GLaDOS: any = null; // If the above is linked in, this is the instantiated instance of Glados.

var onDocumentLoad = function() {
	TSOS.Control.hostInit();
};


var _ExecutedCMDs = new Array<string>();  //Keeps track of all commands
var _CurrCMDArrayPos = 0;                 //Position of which we are in the Array
var _cmdEntered: string = "";             //Keeps track of the command entered
var _NumOfCMDs: number = null;            //Keeps track of the number of commands executed in the console
var _TabHitCount: number = 0;             //Number of times the tab key is pressed on one line
var _LineCount: number = 0;               //Keeps track of what line typed we are on
var _LastCharOnLine = "";
var _LastCursorPos: number = 0;


