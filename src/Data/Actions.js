export const villageActions = [
    {
        id: 0,
        name: "Punch Tree",
        description: "Ow",
        tierReq: 0,
        resourceReq: {},
        itemReq: [],
        cost: {},
        effect: { wood: 1 },
        reward: {},
        message: "You punch the tree until a log falls out",
        repeats: -1 /* number of times an action can be repeated. -1 for inifinite*/
        
    },
    {
        id: 0,
        name: "Chop Wood",
        description: "Much easier than doing it by hand",
        tierReq: 1,
        resourceReq: {},
        itemReq: ["axe"],
        cost: {},
        effect: { wood: 5 },
        reward: {},
        message: "You chop down a tree. and gather a few logs ",
        repeats: -1 /* number of times an action can be repeated. -1 for inifinite*/
    },
    {
        id: 0,
        name: "Sell Produce",
        description: "At least you get an allowance",
        tierReq: 1,
        resourceReq: {},
        itemReq: [],
        cost: {},
        effect: { coin: 1 },
        reward: {},
        message: "You take your most recent harvest to market and manage to sell a few cabbages and some string beans",//TODO Can some of these be procedural?
        repeats: -1 /* number of times an action can be repeated. -1 for inifinite*/
    },
    {
        id: 0,
        name: "Rest",
        description: "Finally time to rest",
        tierReq: 0,
        resourceReq: {},
        itemReq: [],
        cost: {},
        effect: { rest:0 },
        reward: {},
        message: "You sleep and dream of gold and glory",
        repeats: -1 /* number of times an action can be repeated. -1 for inifinite*/
    },
    {
        id: 0,
        name: "Cook Bread",
        description: "Delicious!",
        tierReq: 1,
        resourceReq: {},
        itemReq: [],
        cost: { flour: 2, water: 1, salt: 1 },
        effect: {},
        reward: { bread: 1 },
        message: "The smell of baking bread permeates your home",
        repeats: -1 /* number of times an action can be repeated. -1 for inifinite*/
    },
    {
        id: 0,
        name: "Tend Crops",
        description: "Your families main source of income. And food.",
        tierReq: 1,
        resourceReq: {},
        itemReq: [],
        cost: {},
        effect: {},
        reward: { randomVeggie: 1 },
        message: "You spend hours picking weeds and watering vegetables.",
        repeats: -1 /* number of times an action can be repeated. -1 for inifinite*/
    },
    {
        id: 0,
        name: "Feed Artifact",
        description: "Your families main source of income. And food.",
        tierReq: 2,
        resourceReq: {},
        itemReq: ["gem"],
        cost: {gold:5},
        effect: {},
        reward: { randomVeggie: 1 },
        message: "You spend hours picking weeds and watering vegetables.",
        repeats: -1 /* number of times an action can be repeated. -1 for inifinite*/
    }

]