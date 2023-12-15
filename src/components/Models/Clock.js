import { makeAutoObservable } from "mobx";
import { JSONCheatCopy } from '../../Helpers/JSONHelpers';
import { log } from '../Debugger';

export default class Clock {

    constructor(args) {
        this._name = "New Clock"
        this._segments = 4
        this._completedSegments = 0
        this._repeatable = false
        //this._action = undefined
        this._effects = [] //for display
        this._resolve = function(){log("resolving clock") } //callback function
        this._remove = function () { log("removing clock") }  //potential callback for removing clocks

        Object.keys(args).forEach((key) => {
            this[`_${key}`] = args[key];
        });
        makeAutoObservable(this)
    }

    get name() {
        return this._name
    }

    get segments() {
        return this._segments
    }

    get completedSegments() {
        return this._completedSegments
    }

    get repeatable() {
        return this._repeatable
    }

    set repeatable(canRepeat) {
        this._repeatable = canRepeat ?? false
    }

    incrementClock(segments) {
        //let clock = this._clocks.find((clock) => { clock.name = clockName })
        segments = segments ?? 1
        let newSegments = this._segmentsCompleted + segments
        if (newSegments >= this._segments)
            this._resolve()
        if (newSegments < 0)
            this.removeClock()
    }

    resolveClock(clock) {
        this._resolve()
    }

    removeClock(clock) {
        let clockPostiion = this._clocks.indexOf(clock)
        this._clocks.splice(clockPostiion, 1)
    }


}