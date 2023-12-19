import { makeAutoObservable } from "mobx";
import { JSONCheatCopy } from '../../Helpers/JSONHelpers';
import { log } from '../Debugger';

export default class Clock {

    constructor(args) {
        this._clockCode = "clk"
        this._name = "New Clock"
        this._segments = 4
        this._completedSegments = 0
        this._repeatable = false
        this._removable = false
        this._effectsDisplay = "" //for display
        this._resolve = function () { log("resolving clock") } //callback function
        this._remove = function () { log("removing clock") }  //potential callback for removing clocks
        this._crit = false

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

    get progress() {
        return { "completed":this._completedSegments, "total":this._segments }
    }

    get repeatable() {
        return this._repeatable
    }

    set repeatable(canRepeat) {
        this._repeatable = canRepeat ?? false
    }

    get crit() {
        return this._crit
    }

    set crit(val) {
        this._crit = val
    }

    increment(segments) {
        segments = segments ?? 1
        let newSegments = this._completedSegments + segments
        log(`Incrementing clock by ${segments} to a total of ${newSegments}`)
        switch (true) {
            case (newSegments >= this._segments):
                log("complete or overflow")
                this._completedSegments = newSegments - this._segments
                this.resolveClock(this._clockCode)
                break
            case (newSegments < this._segments && newSegments > 0):
                log("progress made but not complete")
                this._completedSegments = newSegments
                break
            case (newSegments <= 0):
                log("progress lost")
                this._completedSegments = 0
                if(this._removable === true)
                    this.removeClock(this._clockCode)
                break
            default:
                log("(Clock.js, `We shouldn't be able to get here")
        }
    }

    resolveClock() {
        this._resolve(this._clockCode)
    }

    removeClock() {
        this._remove(this._clockCode)
    }

    setClock(args) {
        Object.keys(args).forEach((key) => {
            this[`_${key}`] = args[key];
        });
    }



}