import { makeAutoObservable } from "mobx";
import { ShopList, nullShop } from '../../Data/ShopList';
import { JSONCheatCopy } from '../../Helpers/JSONHelpers';
import { Items } from '../../Data/Items'
import { log } from '../Debugger';

export default class Shop {

    //I want to use unique IDs for shops but I want to use a custom locked list of unique IDs
    static lockedShops = [

    ]

    constructor(shopCode, args) {

        this._shopCode = shopCode
        this._name = ""
        this._description = ""
        this._tier = 1
        this._startingGold = 5 * this.tier + 5
        this._curGold = this._startingGold
        this._startingInventory = {}
        this._inventory = new Map()
        this._itemReq = []
        this._itemReq = []
        this._resourceReq = {}
        this._location = "vil"

        this.loadShop(args)
        makeAutoObservable(this)
    }

    get name() {
        return this._name
    }

    set name(newName) {
        this._name = newName
    }

    get shopCode() {
        return this._shopCode
    }

    get description() {
        return this._description
    }

    set description(newDesc) {
        this._description = newDesc
    }

    get tier() {
        return this._tier
    }

    set tier(newTier) {
        this._tier = newTier
    }

    get gold() {
        return this._curGold
    }

    get inventory() {
        return this._inventory
    }

    get inventoryArray() {
        return this._inventory.entries()
    }

    sortedInventoryArray(sortBy) {
        if (sortBy === undefined)
            sortBy = "name"
        let sortedInventory = this.inventoryArray()

        //only two real cases, numeric or string
        switch (sortBy) {
            //list numeric cases
            case "tier":
                break
            default:
                //otherwise assume string case
        }

    }

    get location() {
        return this._location
    }

    addGold(booty) {
        this._curGold = this._curGold + booty
    }

    loadShop(args) {
        //figure out what shop to load
        let shopList = JSONCheatCopy(ShopList)
        if (args) {
            if ("shopCode" in args) {
                let shopCode = args["shopCode"]
                log("Shop code: ", shopCode)
                args = JSONCheatCopy(shopList[shopCode])
                log("args: ", args)
                //TODO: If it's a new code it means we're adding a new shop. Handle that here
            }
        } else 
            args = JSONCheatCopy(nullShop)

        log("args: ", args)
        //load shop details
        Object.keys(args).forEach((key) => {
            this[`_${key}`] = args[key];
        });

        //add shop inventory
        for (const [item, quantity] of Object.entries(this._startingInventory)) {
            log(`Adding ${quantity} ${item}'s`);
            this.addInventory(item, quantity)
        }
    }

    addInventory(itemCode, quantity) {
        let oldQuantity = this._inventory.get(itemCode)
        if (oldQuantity != undefined)
            quantity += oldQuantity
        this._inventory.set(itemCode, quantity)

        //if (this._inventory.hasOwnProperty(itemCode)) {
        //    this._inventory.itemCode = this._inventory.itemCode + quantity ?? 1
        //} else
        //    this._inventory.itemCode = quantity ?? 1
    }

    removeInventory(itemCode) {
        let oldQuantity = this._inventory.get(itemCode)
        if (oldQuantity != undefined) {
            let newQuantity = oldQuantity--
            if (newQuantity < 0)
                this._inventory.delete(itemCode)
            if (oldQuantity >= 0)
                this._inventory.set(itemCode, newQuantity)
        }

        //if (this._inventory.has(itemCode)) {
        //    this._inventory.itemCode = this._inventory.itemCode - 1
        //    if (this._inventory.itemCode.quantity < 0)
        //        delete this._inventory.itemCode
        //}
    }

    getCost(itemCode) {
        return Items[itemCode].tier * 2
    }

    makePurchase(itemCode, quantity) {
        let cost = this.getCost(itemCode)
        let totalPurchased = 0
        let totalCost = 0
        while (totalPurchased < (quantity ?? 1) && this._inventory.has(itemCode)) {
            this.removeInventory(itemCode)
            totalPurchased += 1
            totalCost += cost
        }

        this._curGold += totalCost
        return { totalPurchased: totalPurchased, totalCost: totalCost }
    }

}
