var TSOS;
(function (TSOS) {
    var CpuScheduler = (function () {
        function CpuScheduler(type) {
            this.schedulerType = type;
        }
        CpuScheduler.prototype.determineToNeedContextSwitch = function () {
            if (_CycleCounter >= _QUANTUM && _ReadyList.length > 0 && _SchedulerType === "rr") {
                this.roundRobinContextSwitch();
                _CycleCounter = 0;
            }
            else if (_SchedulerType === "fcfs") {
                _CycleCounter = 0;
            }
            else if (_SchedulerType === "priority") {
            }
            _CycleCounter++;
            _CPU.cycle();
        };
        return CpuScheduler;
    })();
    TSOS.CpuScheduler = CpuScheduler;
})(TSOS || (TSOS = {}));
//# sourceMappingURL=cpuScheduler.js.map