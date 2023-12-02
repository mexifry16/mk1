import Entity from './Entity';
import { keyExists } from '../../Helpers/JSONHelpers';
import { items } from '../../Data/Items';

export default class Character {

    constructor(args) {
        this._name = "New Character"
        this.HP = 10
        this.maxHP = 10
        this._tier = 1
        //TODO: consider resident evil (tilable) style inventory
        this._inventory = ["axe"]
        this._fate = 0
        this._doom = 0
        this._LCK = 0
        this.curXP = 0
        this.ATK = 1
        this.DEF = 1
        this.CHA = 1
        this.CON = 1
        this.INT = 1
        this.DEX = 1
        this.WIS = 1
        this.class = 'Peasant'
        this.AP = 1

            //TODO SHOULD BE keyExistsAndHasValue()
        //if (keyExists(args, "name"))
        //    this.name = args.name
        //if(keyExists(args, "lvl"))
        //    this.lvl = args.lvl

        Object.keys(args).forEach((key) => {
            this[key] = args[key];
        });
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

    get fate() {
        return this._fate
    }

    set fate(newFate) {
        this._fate = newFate
    }

    get luck() {
        return this._LCK
    }

    set luck(newLuck) {
        this._LCK = newLuck
    }

    hasItem(itemID) {
        return this._inventory.includes(itemID)
    }

    travel() {

    }

    attack() {

    }

    addItem(itemCode) {

    }

    addStatus(statusCode) {

    }

    get ATK() {
        return this._ATK
    }

    get DEF() {

    }

    //TODO: EQUIPMENT
    //TODO BUFFS
    //TODO: COMBAT
    
}