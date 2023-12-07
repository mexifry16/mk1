import { Shops } from '../../Data/Shops';


const emptyLocation = {
        locCode : "vil",
        name : "Village",
        tierReq : 0,
        itemReq : [],
        resourceReq: {}
}

export default class Location {
    constructor(args) {
        this._LocCode = args.locCode
        this._name = args.name
        this._lvlReq = args.lvlReq
        this._itemReq = args.itemReq
        this._resourceReq = args.resourceReq

    };

    getShops() {
        const areaShops = {}
        for (const [shopCode, shop] of Object.entries(areaShops)) {
            shop.location.forEach((location) => {

                if (location == this._locCode) { 
                areaShops[location] = shop
                }
            })
        }

        //return areaShops;
    };

    getActions() {

    };

    getDungeons() {

    };

    getEvents() {

    };

}