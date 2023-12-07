import { makeAutoObservable } from "mobx"

export default class TestClass{

    constructor(){
        this._count = 0
        makeAutoObservable(this)
    }

    get count() {
        return this._count
    }

    increment() {
        this._count++
    }
     

}