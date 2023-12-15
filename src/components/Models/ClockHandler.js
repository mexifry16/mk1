import { makeAutoObservable } from "mobx";
import { JSONCheatCopy } from '../../Helpers/JSONHelpers';
import { log } from '../Debugger';

export class ClockHandler{

    blankClock = {
        "Name": "New Clock",
        "turnStarted": 0,
        "segments": 4,
        "segmentsCompleted": 0,
        "action": undefined,
        "effect": []

    }

    constructor(args){
        this._clocks = []
        this._actionClocks = []
        this._gameClocks = []
        makeAutoObservable(thus)
    }

    get clocks() {
        return this._clocks
    }

    addClock(name, segments, action, effects) {
        let newClock = JSON.parse(JSON.stringify(blankClock))

        newClock.name = name
        newClock.segments = segments

        if (action)
            newClock.action = action
        if (effects)
            newClock.effects = effects

        this._clocks.push()
    }

    incrementClock(clockName, segments) {
        let clock = this._clocks.find((clock) => { clock.name = clockName })
        segments = segments ?? 1
        let newSegments = clock.segmentsCompleted + segments
        if (newSegments >= clock.segments)
            resolveClock(clock)
        if (newSegments < 0)
            removeClock(clock)
    }

    resolveClock(clock) {
        //TODO: resolving clocks
    }

    removeClock(clock) {
        let clockPostiion = this._clocks.indexOf(clock)
        this._clocks.splice(clockPosition, 1)
    }

}