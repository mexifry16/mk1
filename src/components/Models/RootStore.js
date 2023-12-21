import Character from './Character';
import ActionHandler from './ActionHandler';
import ResourceHandler from './ResourceHandler';
import ShopHandler from './ShopHandler';

class RootStore {
    constructor() {
        this.resourceHandler = new ResourceHandler(this)
        this.curCharacter = new Character(this, { name: "Billy Wigglestick" })
        this.actionHandler = new ActionHandler(this, { "curResources": resourceHandler, "curCharacter": curCharacter, rollDice: rollDice })
        this.shopHandler = new ShopHandler(this, resourceHandler, curCharacter)
    }
}