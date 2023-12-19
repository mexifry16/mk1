export const villageActions = [
    {
        actionCode: "ptr",
        name: "Punch Tree",
        description: "Ow",
        tierReq: 0,
        resourceReq: {},
        itemReq: [],
        cost: {},
        outcomes: { },
        rewards: { wood: 1 },
        message: "You punch the tree until a log falls out",
        critfailMessage: "you whiff completely",
        failMessage: "Your fists fail to do any damage",
        partialMessage: "You punch the tree",
        successMessage: "Your fists leave a hole in the tree",
        critMessage: "You punch clean through the tree in a single blow",
        repeats: -1, /* number of times an action can be repeated. -1 for inifinite*/
        removable: false,
        clock: undefined,
        effect: "limited"

    },
    {
        actionCode: "cwd",
        name: "Chop Wood",
        description: "Much easier than doing it by hand",
        tierReq: 1,
        resourceReq: {},
        itemReq: ["axe"],
        cost: {},
        outcomes: {},
        rewards: { wood: 5 },
        message: "You chop down a tree. and gather a few logs ",
        progressMessage: "Your axe bites into the tree",
        successMessage: "You manage to punch a log free",
        critMessage: "Your axes goes clean through the tree",
        //progressMessage: "You chop down a tree. and gather a few logs ",

        repeats: -1, /* number of times an action can be repeated. -1 for inifinite*/
        removable: false,
        clock: undefined,
        effect: "standard"
    },
    {
        actionCode: "spd",
        name: "Sell Produce",
        description: "At least you get an allowance",
        tierReq: 1,
        resourceReq: {},
        itemReq: [],
        cost: {},
        outcomes: {},
        rewards: { coin: 1 },
        message: "You take your most recent harvest to market and manage to sell a few cabbages and some string beans",//TODO Can some of these be procedural?
        progressMessage: "You punch the tree",
        successMessage: "You manage to punch a log free",
        critMessage: "You punch clean through the tree in a single blow",
        repeats: -1, /* number of times an action can be repeated. -1 for inifinite*/
        removable: false,
        clock: undefined,
        effect: "standard"
    },
    {
        actionCode: "rst",
        name: "Rest",
        description: "Finally time to rest",
        tierReq: 0,
        resourceReq: {},
        itemReq: [],
        cost: {},
        outcomes: { rest: 0 },
        rewards: {},
        message: "You sleep and dream of gold and glory",
        progressMessage: "You punch the tree",
        successMessage: "You manage to punch a log free",
        critMessage: "You punch clean through the tree in a single blow",
        repeats: -1, /* number of times an action can be repeated. -1 for inifinite*/
        removable: false,
        clock: undefined,
        effect: "standard"
    },
    {
        actionCode: "cbd",
        name: "Cook Bread",
        description: "Delicious!",
        tierReq: 1,
        resourceReq: {},
        itemReq: [],
        cost: { flour: 2, water: 1, salt: 1 },
        outcomes: {},
        rewards: { bread: 1 },
        message: "The smell of baking bread permeates your home",
        progressMessage: "You punch the tree",
        successMessage: "You manage to punch a log free",
        critMessage: "You punch clean through the tree in a single blow",
        repeats: -1, /* number of times an action can be repeated. -1 for inifinite*/
        removable: false,
        clock: undefined,
        effect: "standard"
    },
    {
        actionCode: "tcp",
        name: "Tend Crops",
        description: "Your families main source of income. And food.",
        tierReq: 1,
        resourceReq: {},
        itemReq: [],
        cost: {},
        outcomes: {},
        rewards: { randomVeggie: 1 },
        message: "You spend hours picking weeds and watering vegetables.",
        progressMessage: "You punch the tree",
        successMessage: "You manage to punch a log free",
        critMessage: "You punch clean through the tree in a single blow",
        repeats: -1, /* number of times an action can be repeated. -1 for inifinite*/
        removable: false,
        clock: undefined,
        effect: "standard"
    },
    {
        actionCode: "fda",
        name: "Feed Artifact",
        description: "Your families main source of income. And food.",
        tierReq: 2,
        resourceReq: {},
        itemReq: ["gem"],
        cost: { gold: 5 },
        outcomes: {},
        rewards: { randomVeggie: 1 },
        message: "You spend hours picking weeds and watering vegetables.",
        progressMessage: "You punch the tree",
        successMessage: "You manage to punch a log free",
        critMessage: "You punch clean through the tree in a single blow",
        repeats: -1, /* number of times an action can be repeated. -1 for inifinite*/
        removable: false,
        clock: undefined,
        effect: "standard"
    }

]

//export const villageActionsNEW = {

//    "ptr": {
//        actionCode: 0,
//        name: "Punch Tree",
//        description: "Ow",
//        tierReq: 0,
//        resourceReq: {},
//        itemReq: [],
//        cost: {},
//        effect: { wood: 1 },
//        rewards: { wood: 5 },
//        message: "You punch the tree until a log falls out",
//        messages: ["Your fist slams into the tree and leaves a sizable dent", "Your fist widens the whole created previously", "You manage to punch through the tree", "You fell the tree with your fists and gather its wood"],
//        repeats: -1 /* number of times an action can be repeated. -1 for inifinite*/
//    },
//    "cwd": {
//        actionCode: 0,
//        name: "Chop Wood",
//        description: "Much easier than doing it by hand",
//        tierReq: 1,
//        resourceReq: {},
//        itemReq: ["axe"],
//        cost: {},
//        effect: { wood: 5 },
//        rewards: { wood: 5 },
//        message: "You chop down a tree. and gather a few logs ",
//        messages: ["Your axe bites into the tree", "You fell the tree and gather its wood"],
//        //progressMessage: "You chop down a tree. and gather a few logs ",

//        repeats: -1 /* number of times an action can be repeated. -1 for inifinite*/
//    },
//    "pdc": {
//        actionCode: 0,
//        name: "Sell Produce",
//        description: "At least you get an allowance",
//        tierReq: 1,
//        resourceReq: {},
//        itemReq: [],
//        cost: {},
//        effect: { coin: 1 },
//        rewards: { wood: 5 },
//        message: "You take your most recent harvest to market and manage to sell a few cabbages and some string beans",//TODO Can some of these be procedural?
//        messages: ["You take your most recent harvest to market and manage to sell a few cabbages and some string beans"],//TODO Can some of these be procedural?
//        repeats: -1 /* number of times an action can be repeated. -1 for inifinite*/
//    },
//    "rst": {
//        actionCode: 0,
//        name: "Rest",
//        description: "Finally time to rest",
//        tierReq: 0,
//        resourceReq: {},
//        itemReq: [],
//        cost: {},
//        effect: { rest: 0 },
//        rewards: { wood: 5 },
//        message: "You sleep and dream of gold and glory",
//        messages: ["You sleep and dream of gold and glory"],
//        repeats: -1 /* number of times an action can be repeated. -1 for inifinite*/
//    },
//    "cbd": {
//        actionCode: 0,
//        name: "Cook Bread",
//        description: "Delicious!",
//        tierReq: 1,
//        resourceReq: {},
//        itemReq: [],
//        cost: { flour: 2, water: 1, salt: 1 },
//        effect: {},
//        reward: { bread: 1 },
//        message: "The smell of baking bread permeates your home",
//        messages: ["The smell of baking bread permeates your home"],
//        repeats: -1 /* number of times an action can be repeated. -1 for inifinite*/
//    },
//    "tcp": {
//        actionCode: 0,
//        name: "Tend Crops",
//        description: "Your families main source of income. And food.",
//        tierReq: 1,
//        resourceReq: {},
//        itemReq: [],
//        cost: {},
//        effect: {},
//        reward: { randomVeggie: 1 },
//        message: "You spend hours picking weeds and watering vegetables.",
//        messages: ["You spend hours picking weeds and watering vegetables."],
//        repeats: -1 /* number of times an action can be repeated. -1 for inifinite*/
//    },
//    "fda": {
//        actionCode: 0,
//        name: "Feed Artifact",
//        description: "Your families main source of income. And food.",
//        tierReq: 2,
//        resourceReq: {},
//        itemReq: ["gem"],
//        cost: { gold: 5 },
//        effect: {},
//        reward: { randomVeggie: 1 },
//        message: "You spend hours picking weeds and watering vegetables.",
//        messages: ["You spend hours picking weeds and watering vegetables."],
//        repeats: -1 /* number of times an action can be repeated. -1 for inifinite*/
//    }

//}