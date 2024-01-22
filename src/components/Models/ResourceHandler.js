import { makeAutoObservable, trace } from "mobx"
import { log } from '../Debugger';

export default class ResourceHandler {

    constructor(args) {
        this._coins = 0
        this._maxCoins = 420
        this._wood = 0
        this._maxWood = 420
        if (args) {
            Object.keys(args).forEach((key) => {
                this[`_${key}`] = args[key];
            });
        }

        makeAutoObservable(this)
    }


    get coins() {
        return this._coins
    }

    get maxCoins() {
        return this._maxCoins
    }

    addCoins(val) {
        let booty = val ?? 1
        let newTotal = this._coins + booty
        this._coins = newTotal > this._maxCoins ? this._maxCoins : newTotal
        return this._coins
    }

    remCoins(val) {
        log("Removing coins: ", val)
        let booty = val ?? 1
        let newTotal = this._coins - booty
        newTotal = newTotal < 0 ? 0 : newTotal
        log("New coin total: ", newTotal)
        this._coins = newTotal > this._maxCoins ? this._maxCoins : newTotal
        return this._coins
    }

    get wood() {
        return this._wood
    }

    get maxWood() {
        //log("getting max wood")
        return this._maxWood
    }

    addWood(val) {
        let newLogs = val ?? 1
        let newWoodPile = this._wood + newLogs
        this._wood = newWoodPile > this._maxWood ? this._maxWood : newWoodPile
        log("Wood Added")
        return this._wood
    }

}