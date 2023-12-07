

export const ShopList = {

    htg: {
        name: "Hometown Goods",
        description: "The local merchant. A good fellow.",
        tier: 1,
        startingInventory: { axe: 1, wdb: 1, wlt: 1, cnp: 1 },
        itemReq: [],
        resourceReq: {},
        location : "vil"
    },
    sib: {
        name:"Sibylle's hut",
        description: "Always worth checking Sibyll's fresh herbs",
        tier: 1,
        startingInventory: { hps: 1, hpm: 1, hpl: 1, cnp: 1 },
        itemReq: [],
        resourceReq: {},
        location : "vil"
    },
    ber: {
        name: "Strange Bear's Grove",
        description: "Do you have any honey?",
        tier: 2,
        startingInventory: {},
        itemReq: [],
        resourceReq: {},
        location: "for"
    }
}

export const nullShop = {
    nul: {
        name: "Null Shop",
        description: "How did you get here?",
        tier: 10,
        startingInventory: {},
        itemReq: [],
        resourceReq: {},
        location: "nul"
    }
}

export function ShopCodes() {
    let shopCodes = []
    Object.keys(ShopList).forEach(function (key, index) {
        shopCodes.push(key)
    })
    return shopCodes
}