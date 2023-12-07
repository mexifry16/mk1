import { makeAutoObservable } from "mobx";
import Shop from './Shop';
import ResourceHandler from './ResourceHandler';
import { ShopList, NullShop, ShopCodes } from '../../Data/ShopList';
import { log } from '../Debugger';


export default class ShopHandler {
    static _inactiveShops
    static _lockedShopCodes = []

    constructor(resourceHandler, characterHandler) {
        this._curShop = undefined
        this._inactiveShops = new Map() //currently holds a map of every shop you've ever been to and it's state.
        this._lockedShopCodes = ShopCodes()
        this._curResources = new ResourceHandler()
        
        if(resourceHandler != undefined)
            this._curResources = resourceHandler
        if (characterHandler != undefined)
            this._curCharacter = characterHandler

        makeAutoObservable(this)
    }

    get curShop() {
        return this._curShop
    }

    setCurShop(shopCode) {
        //Store activeshop in inactive
        if (this._curShop != undefined) {
            log("Setting old shop as inactive")
            this._inactiveShops.set(this._curShop.shopCode, this._curShop)
        }
        //Load new shop
        if (shopCode != undefined) {
            log("New shop code: ", shopCode)
            //Search for the shop in inactive
            let newShop = this._inactiveShops.get(shopCode)
            //log("Huh: ", newShop)
            if (newShop) { 
                log("Shop found in inactive")
                this._curShop = newShop
            }
            //Search in locked shops
            if (!newShop && this._lockedShopCodes.includes(shopCode)) {
                log("Building shop for first time")
                //Build the new shop
                this._curShop = new Shop(shopCode, ShopList[shopCode])
                //remove from locked shops
                let codeIndex = this._lockedShopCodes.indexOf(shopCode)
                this._lockedShopCodes.splice(codeIndex, 1 )
            }
        }

        //Deselect shop
        if (shopCode === undefined) {
            log("Deselecting shop")
            this._curShop = undefined
        }

    }

    makePurchase(itemCode, quantity, character) {
        log(`Buying ${quantity} of ${itemCode}`)
        let quantityToBuy = quantity ?? 1
        //make the purchase
        let results = this.curShop.makePurchase(itemCode, quantity)
        log(`Purchased ${results.totalPurchased} of ${results.totalCost}`)
        //calculate the cost
        //add the item to the character
        character.addItem(itemCode, quantity)
        //remove the cost from the player
        this._curResources.remCoins(results.totalCost)
    }

}