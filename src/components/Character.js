import Entity from './Entity';
import { keyExists } from '../Helpers/JSONHelpers';

export default class Character {

    constructor(args) {
        this._name = "New Character"
        //this.HP = 10
        //this.maxHP = 10
        //this.lvl = 1
        //this.curXP = 0
        //this.ATK = 1
        //this.DEF = 1
        //this.CHA = 1
        //this.CON = 1
        //this.INT = 1
        //this.DEX = 1
        //this.WIS = 1
        //this.class = 'Peasant'
        //this.AP = 1

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
        console.log("This: ", this)
        return this._name
    }

    set name(newName) {
        this._name = newName
    }

    getActions() {
         let possibleActions = []
         return possibleActions

    }

    //TODO: EQUIPMENT
    //TODO BUFFS
    //TODO: COMBAT
    //
    
}