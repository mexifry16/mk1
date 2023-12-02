export const villageActions = [
    {
        id: 0,
        name: "Punch Tree",
        description: "Ow",
        lvlReq: 0,
        resourceReq: {},
        itemReq: [],
        cost: null,
        effect: { wood: 1 },
        message: "You punch the tree until a log falls out",
        repeats: -1 /* number of times an action can be repeated. -1 for inifinite*/
        
    },
    {
        id: 0,
        name: "Chop Wood",
        description: "Much easier than doing it by hand",
        lvlReq: 1,
        resourceReq: {},
        itemReq: ["axe"],
        cost: null,
        effect: { wood: 5 },
        message: "You chop down a tree. and gather a few logs ",
        repeats: -1 /* number of times an action can be repeated. -1 for inifinite*/
    },
    {
        id: 0,
        name: "Do Chores",
        description: "At least you get an allowance",
        lvlReq: 1,
        resourceReq: {},
        itemReq: [],
        cost: null,
        effect: { coin: 5 },
        message: "You chore for untold hours for a pittance",
        repeats: -1 /* number of times an action can be repeated. -1 for inifinite*/
    },
    {
        id: 0,
        name: "Speak With Father",
        description: "At least you get an allowance",
        lvlReq: 1,
        resourceReq: {},
        itemReq: [],
        cost: null,
        effect: { fate: 1 },
        message: "Your father tells you stories of his childhood",
        repeats: -1 /* number of times an action can be repeated. -1 for inifinite*/
    }

]