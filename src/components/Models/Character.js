import { makeAutoObservable } from "mobx"
import { keyExists } from '../../Helpers/JSONHelpers';
import { Items } from '../../Data/Items';
import { log } from '../Debugger';
import { JSONCheatCopy } from '../../Helpers/JSONHelpers';
import ATTRIBUTE from '../../Enums/AttributeEnum';


export default class {

    constructor(args) {
        this._name = "New Character"
        this.HP = 10
        this.maxHP = 10
        //this._condition = conditions.WELL //simpler than HP, getting hurt is more meaningful
        this._tier = 1
        this._AP = 5
        this._curAP = 4
        //this._inventory = new Map([
        //    ["axe", {
        //        "id": 0,
        //        "name": "Axe",
        //        "description": "Belonged to your father",
        //        "lvlReq": 0,
        //        "tier": 1,
        //        "tags": ["chopsWood", "weapon", "dualWield", "slashing", "close"],
        //        "location": ["vil"],
        //        "quantity": 1
        //    }],
        //    ["wlt", {
        //        "id": 1,
        //        "name": "Wallet",
        //        "description": "brown leather",
        //        "lvlReq": 0,
        //        "tier": 1,
        //        "tags": ["goldStoreSmall"],
        //        "quantity": 1
        //    }]
        //])
        this._inventory = new Map()
        this._status = ["well"]
        this._equipped = new Map([["head", null], ["chest", null], ["weapon", null]])
        this._fate = 0
        this._STR = 10
        this._DEX = 10
        this._CON = 10
        this._INT = 10
        this._WIS = 10
        this._CHA = 10
        this._LCK = 10
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
        makeAutoObservable(this, {}, { autoBind: true })
        //makeAutoObservable(this)
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

    set curAP(newAP) {
        this._curAP = (newAP ?? this._curAP)
        if (this._curAP < 0)
            this._curAP = 0
    }

    rest(quantity) {
        log("resting: ", quantity)
        quantity = quantity ?? this._AP
        log(`Restoring ${quantity} AP`)
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
        let selectedItem = this._inventory.get(itemID)
        //return quantity != undefined && quantity > 0
        return (selectedItem.quantity ?? 0) > 0
    }

    get helmet() {
        return this._equipped.get("helmet")
    }

    get chest() {
        return this._equipped.get("chest")
    }

    get weapon() {
        return this._equipped.get("weapon")
    }

    set helmet(itemCode) {
        this._equipped.set("helmet", itemCode)
    }

    set chest(itemCode) {
        this._equipped.set("chest", itemCode)
    }

    set weapon(itemCode) {
        this._equipped.set("weapon", itemCode)
    }

    travel() {

    }

    attack() {

    }

    addItem(itemCode, quantity) {
        log("Adding item: ", itemCode)
        quantity = quantity ?? 1
        //check to see if we already have it
        let item = this._inventory.get(itemCode)

        //If we already have it them increment
        if (item != undefined) {
            item.quanity = item.quantity ?? 1
            item.quantity += quantity
        }

        //If item is still undefined create a new item
        if (item == undefined) {
            item = JSONCheatCopy(Items[itemCode])
            item.quantity = 1
            this._inventory.set(itemCode, item)
        }
}

    removeItem(itemCode, quantity) {
        let selectedItem = this._inventory.get(itemCode)

        //If we find it then modify the entry
        if (selectedItem != undefined) {
            let curQuantity = selectedItem.quantity ?? 1

            let newQuantity = curQuantity - (quantity ?? 1)
            if (newQuantity < 1)
                this._inventory.delete(itemCode)
            else {
                selectedItem.quantity = newQuantity
                this._inventory.set(itemCode, selectedItem)
            }
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

    getHighestMod(stats) {
        log("Stats: ", stats)
        let highestStat = undefined
        let highestMod = -4
        stats.forEach((stat) => {
            let checkMe = this.getAttrModifier(stat)
            log(`${stat} is ${checkMe}`)
            if (checkMe > highestMod) {
                highestStat = stat
                highestMod = checkMe
            }
        })
        return { attr: highestStat, mod: highestStat === undefined ? undefined : highestMod }
    }

    getAttrModifier(stat) {
        let attribute = undefined
        switch (stat) {
            case ATTRIBUTE.STRENGTH:
                attribute = this.STR
                break
            case ATTRIBUTE.DEXTERITY:
                attribute = this.DEX
                break
            case ATTRIBUTE.CONSTITUTION:
                attribute = this.CON
                break
            case ATTRIBUTE.WIDSOM:
                attribute = this.WIS
                break
            case ATTRIBUTE.INTELLIGENCE:
                attribute = this.INT
                break
            case ATTRIBUTE.CHARISMA:
                attribute = this.CHA
                break
            case ATTRIBUTE.LUCK:
                attribute = this.LCK
                break
            default:
                log("Undefined attribute when getting modifier")
                attribute = undefined
        }

        return this.getModifier(attribute)
    }

    getModifier(stat) {
        let modifier = 0
        switch (true) {
            case stat >= 18:
                modifier = 3
                break
            case stat >= 16 && stat < 18:
                modifier = 2
                break
            case stat >= 13 && stat < 15:
                modifier = 1
                break
            case stat >= 9 && stat < 13:
                modifier = 0
                break
            case stat >= 6 && stat < 9:
                modifier = -1
                break
            case stat >= 4 && stat < 6:
                modifier = -2
                break
            case stat >= 1 && stat < 4:
                modifier = -3
                break
            default:
                log("Stat less than 1 when getting modifier")
                modifier = 0
        }
        return modifier
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