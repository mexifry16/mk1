import { makeAutoObservable } from "mobx"
import { keyExists } from '../../Helpers/JSONHelpers';
import { Items } from '../../Data/Items';
import { log } from '../Debugger';


export default class{

    constructor(args) {
        this._name = "New Character"
        this.HP = 10
        this.maxHP = 10
        //this._condition = conditions.WELL //simpler than HP, getting hurt is more meaningful
        this._tier = 1
        this._AP = 5
        this._curAP = 4
        this._inventory = new Map()
        this._status = ["well"]
        this._fate = 0
        this._LCK = 0
        this._STR = 1
        this._DEX = 1
        this._CON = 1
        this._INT = 1
        this._WIS = 1
        this._CHA = 1
        this._LCK = 1
        this.class = 'Peasant'

            //TODO SHOULD BE keyExistsAndHasValue()
        //if (keyExists(args, "name"))
        //    this.name = args.name
        //if(keyExists(args, "lvl"))
        //    this.lvl = args.lvl

        //Object.keys(args).forEach((key) => {
        //    this[key] = args[key];
        //});

        //With _ naming conventions
        if (args)
            Object.keys(args).forEach((key) => {
                this[`_${key}`] = args[key];
            });
        makeAutoObservable(this)
    }

    get name() {
        return this._name
    }

    set name(newName) {
        this._name = newName
    }

    get tier() {
        return this._tier
    }

    tierUp() {
        this._tier = this._tier + 1
        this._AP++
        this._curAP++
    }

    tierDown() {
        this._tier = this._tier - 1
        this._AP--
        if (this._curAP > this._AP)
            this._curAP = this._AP
        if (this._tier < 0) {
            //Do Something special? Anti-tiers? you die?
            this._tier = 0
        }
    }

    get AP() {
        return this._AP
    }

    get curAP() {
        return this._curAP
    }

    restoreAP(quantity) {
        quantity = quantity ?? this._AP
        this._curAP = this._AP
    }

    get fate() {
        return this._fate
    }

    set fate(newFate) {
        this._fate = newFate
    }

    get STR() {
        return this._STR
    }

    get DEX() {
        return this._DEX
    }

    get CON() {
        return this._CON
    }

    get INT() {
        return this._INT
    }

    get WIS() {
        return this._WIS
    }

    get CHA() {
        return this._CHA
    }

    get LCK() {
        return this._LCK
    }

    set luck(newLuck) {
        this._LCK = newLuck
    }

    get inventory() {
        return this._inventory
    }

    hasItem(itemID) {
        let quantity = this._inventory.get(itemID)
        return quantity != undefined && quantity > 0
    }

    travel() {

    }

    attack() {

    }

    addItem(itemCode, quantity) {
        quantity = quantity ?? 1
        this._inventory.set(itemCode, quantity)
    }

    removeItem(itemCode, quantity) {
        let curQuantity = this._inventory.get(itemCode)

        //If we find it then modify the entry
        if (curQuantity != undefined) {
            let newQuantity = curQuantity - (quantity ?? 1)
            if (newQuantity < 1)
                this._inventory.delete(itemCode)
            else
                this._inventory.set(itemCode, newQuantity)
        }

    }

    addStatus(statusCode) {
        this._status.append(statusCode)
    }

    removeStatus(statusCode) {
        let removeIndex = this._status.indexOf(statusCode)
        if (removeIndex >= 0)
            this._status.splice(removeIndex, 1)
    }

    //TODO Think about more interesting methods of combat
    get ATK() {
        return this._STR
    }

    get DEF() {
        return this._DEX + this._CON 
    }

   

    
    //TODO: EQUIPMENT
    //TODO BUFFS
    //TODO: COMBAT
    
}