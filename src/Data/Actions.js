import {ATTRIBUTES} from '../Enums';
export const villageActions = [
    {
        actionCode: "ptr",
        name: "Punch Tree",
        description: "This is an action description",
        tier: 1,
        statReq: [ATTRIBUTES.STRENGTH],
        resourceReq: {},
        itemReq: [],
        visibilityReq: {}, //Define a point at which actions enter into your play area even if you don't actually qualify to do them yet
        cost: {},
        outcomes: { },
        rewards: { Wood: 1 },
        message: "You punch the tree until a log falls out",
        critfailMessage: "you whiff completely",
        failMessage: "Your fists fail to do any damage",
        partialMessage: "You punch the tree",
        successMessage: "Your fists leave a hole in the tree",
        critMessage: "You punch clean through the tree in a single blow",
        repeats: -1, /* number of times an action can be repeated. -1 for inifinite*/
        removable: false,
        clock: undefined,
        effect: "limited",
        unlocked: false,
        available: false

    },
    {
        actionCode: "cwd",
        name: "Chop Wood",
        description: "Much easier than doing it by hand",
        tier: 2,
        statReq: [ATTRIBUTES.STRENGTH, ATTRIBUTES.DEXTERITY, ATTRIBUTES.CONSTITUTION],
        resourceReq: {},
        itemReq: ["axe"],
        cost: {},
        outcomes: {},
        rewards: { Wood: 5, Coins:3, Iron:1 },
        message: "You chop down a tree and gather a few logs ",
        critfailMessage: "Your axe misses the tree and hits a stone chipping the blade and neccessitating repairs",
        failMessage: "You miss the tree entirely.",
        partialMessage: "Your axe bites into the tree.",
        successMessage: "Your axe bites into the tree.",
        critMessage: "Your axes goes clean through the tree.",
        repeats: -1, /* number of times an action can be repeated. -1 for inifinite*/
        removable: false,
        clock: undefined,
        effect: "standard"
    },
    {
        actionCode: "spd",
        name: "Sell Produce",
        description: "At least you get an allowance",
        tier: 1,
        statReq: [ATTRIBUTES.INTELLIGENCE, ATTRIBUTES.WISDOM, ATTRIBUTES.CHARISMA],
        resourceReq: {},
        itemReq: [],
        cost: {},
        outcomes: {},
        rewards: { Coins: 1 },
        message: "You sell through your supply of produce",
        critfailMessage: "You drive customers away with overly aggresive sales tactics",
        failMessage: "You fail to sell any produce",
        partialMessage: "You sell some produce",
        successMessage: "Your sell some produce",
        critMessage: "You manage to upsell several customers",
        repeats: -1, /* number of times an action can be repeated. -1 for inifinite*/
        removable: false,
        clock: undefined,
        effect: "standard"
    },
    {
        actionCode: "ta1",
        name: "Test Action 1",
        description: "Ow",
        tier: 1,
        statReq: [ATTRIBUTES.INTELLIGENCE, ATTRIBUTES.LUCK],
        resourceReq: {},
        itemReq: [],
        visibilityReq: {}, //Define a point at which actions enter into your play area even if you don't actually qualify to do them yet
        cost: {},
        outcomes: { },
        rewards: { Wood: 1 },
        message: "You punch the tree until a log falls out",
        critfailMessage: "you whiff completely",
        failMessage: "Your fists fail to do any damage",
        partialMessage: "You punch the tree",
        successMessage: "Your fists leave a hole in the tree",
        critMessage: "You punch clean through the tree in a single blow",
        repeats: -1, /* number of times an action can be repeated. -1 for inifinite*/
        removable: false,
        clock: undefined,
        effect: "limited",
        unlocked: false,
        available: false

    },
    {
        actionCode: "ta2",
        name: "Test Action 2",
        description: "Ow",
        tier: 1,
        statReq: [ATTRIBUTES.LUCK],
        resourceReq: {},
        itemReq: [],
        visibilityReq: {}, //Define a point at which actions enter into your play area even if you don't actually qualify to do them yet
        cost: {},
        outcomes: { },
        rewards: { Wood: 1 },
        message: "You punch the tree until a log falls out",
        critfailMessage: "you whiff completely",
        failMessage: "Your fists fail to do any damage",
        partialMessage: "You punch the tree",
        successMessage: "Your fists leave a hole in the tree",
        critMessage: "You punch clean through the tree in a single blow",
        repeats: -1, /* number of times an action can be repeated. -1 for inifinite*/
        removable: false,
        clock: undefined,
        effect: "limited",
        unlocked: false,
        available: false

    },
    {
        actionCode: "ta3",
        name: "Test Action 3",
        description: "Ow",
        tier: 1,
        statReq: [ATTRIBUTES.STRENGTH],
        resourceReq: {},
        itemReq: [],
        visibilityReq: {}, //Define a point at which actions enter into your play area even if you don't actually qualify to do them yet
        cost: {},
        outcomes: { },
        rewards: { Wood: 1 },
        message: "You punch the tree until a log falls out",
        critfailMessage: "you whiff completely",
        failMessage: "Your fists fail to do any damage",
        partialMessage: "You punch the tree",
        successMessage: "Your fists leave a hole in the tree",
        critMessage: "You punch clean through the tree in a single blow",
        repeats: -1, /* number of times an action can be repeated. -1 for inifinite*/
        removable: false,
        clock: undefined,
        effect: "limited",
        unlocked: false,
        available: false

    },
    {
        actionCode: "ta4",
        name: "Test Action 4",
        description: "Ow",
        tier: 1,
        statReq: [ATTRIBUTES.STRENGTH],
        resourceReq: {},
        itemReq: [],
        visibilityReq: {}, //Define a point at which actions enter into your play area even if you don't actually qualify to do them yet
        cost: {},
        outcomes: { },
        rewards: { Wood: 1 },
        message: "You punch the tree until a log falls out",
        critfailMessage: "you whiff completely",
        failMessage: "Your fists fail to do any damage",
        partialMessage: "You punch the tree",
        successMessage: "Your fists leave a hole in the tree",
        critMessage: "You punch clean through the tree in a single blow",
        repeats: -1, /* number of times an action can be repeated. -1 for inifinite*/
        removable: false,
        clock: undefined,
        effect: "limited",
        unlocked: false,
        available: false

    },
    {
        actionCode: "ta5",
        name: "Test Action 5",
        description: "Ow",
        tier: 1,
        statReq: [ATTRIBUTES.STRENGTH],
        resourceReq: {},
        itemReq: [],
        visibilityReq: {}, //Define a point at which actions enter into your play area even if you don't actually qualify to do them yet
        cost: {},
        outcomes: { },
        rewards: { Wood: 1 },
        message: "You punch the tree until a log falls out",
        critfailMessage: "you whiff completely",
        failMessage: "Your fists fail to do any damage",
        partialMessage: "You punch the tree",
        successMessage: "Your fists leave a hole in the tree",
        critMessage: "You punch clean through the tree in a single blow",
        repeats: -1, /* number of times an action can be repeated. -1 for inifinite*/
        removable: false,
        clock: undefined,
        effect: "limited",
        unlocked: false,
        available: false

    },
    {
        actionCode: "ta6",
        name: "Test Action 3",
        description: "Ow",
        tier: 1,
        statReq: [ATTRIBUTES.STRENGTH],
        resourceReq: {},
        itemReq: [],
        visibilityReq: {}, //Define a point at which actions enter into your play area even if you don't actually qualify to do them yet
        cost: {},
        outcomes: { },
        rewards: { Wood: 1 },
        message: "You punch the tree until a log falls out",
        critfailMessage: "you whiff completely",
        failMessage: "Your fists fail to do any damage",
        partialMessage: "You punch the tree",
        successMessage: "Your fists leave a hole in the tree",
        critMessage: "You punch clean through the tree in a single blow",
        repeats: -1, /* number of times an action can be repeated. -1 for inifinite*/
        removable: false,
        clock: undefined,
        effect: "limited",
        unlocked: false,
        available: false

    }
    // {
    //     actionCode: "cbd",
    //     name: "Cook Bread",
    //     description: "Delicious!",
    //     tier: 1,
    //     statReq: [ATTRIBUTES.STRENGTH],
    //     resourceReq: {},
    //     itemReq: [],
    //     cost: { flour: 2, water: 1, salt: 1 },
    //     outcomes: {},
    //     rewards: { bread: 1 },
    //     message: "The smell of baking bread permeates your home",
    //     progressMessage: "You punch the tree",
    //     successMessage: "You manage to punch a log free",
    //     critMessage: "You punch clean through the tree in a single blow",
    //     repeats: -1, /* number of times an action can be repeated. -1 for inifinite*/
    //     removable: false,
    //     clock: undefined,
    //     effect: "standard"
    // },
    // {
    //     actionCode: "tcp",
    //     name: "Tend Crops",
    //     description: "Your families main source of income. And food.",
    //     tier: 1,
    //     statReq: [ATTRIBUTES.STRENGTH],
    //     resourceReq: {},
    //     itemReq: [],
    //     cost: {},
    //     outcomes: {},
    //     rewards: { randomVeggie: 1 },
    //     message: "You spend hours picking weeds and watering vegetables.",
    //     progressMessage: "You punch the tree",
    //     successMessage: "You manage to punch a log free",
    //     critMessage: "You punch clean through the tree in a single blow",
    //     repeats: -1, /* number of times an action can be repeated. -1 for inifinite*/
    //     removable: false,
    //     clock: undefined,
    //     effect: "standard"
    // },
    // {
    //     actionCode: "fda",
    //     name: "Feed Artifact",
    //     description: "Your families main source of income. And food.",
    //     tier: 2,
    //     statReq: [ATTRIBUTES.STRENGTH],
    //     resourceReq: {},
    //     itemReq: ["gem"],
    //     cost: { Gold: 5 },
    //     outcomes: {},
    //     rewards: { randomVeggie: 1 },
    //     message: "You spend hours picking weeds and watering vegetables.",
    //     progressMessage: "You punch the tree",
    //     successMessage: "You manage to punch a log free",
    //     critMessage: "You punch clean through the tree in a single blow",
    //     repeats: -1, /* number of times an action can be repeated. -1 for inifinite*/
    //     removable: false,
    //     clock: undefined,
    //     effect: "standard"
    // }

]

//export const villageActionsNEW = {

//    "ptr": {
//        actionCode: 0,
//        name: "Punch Tree",
//        description: "Ow",
//        tier: 0,
//        resourceReq: {},
//        itemReq: [],
//        cost: {},
//        effect: { Wood: 1 },
//        rewards: { Wood: 5 },
//        message: "You punch the tree until a log falls out",
//        messages: ["Your fist slams into the tree and leaves a sizable dent", "Your fist widens the whole created previously", "You manage to punch through the tree", "You fell the tree with your fists and gather its wood"],
//        repeats: -1 /* number of times an action can be repeated. -1 for inifinite*/
//    },
//    "cwd": {
//        actionCode: 0,
//        name: "Chop Wood",
//        description: "Much easier than doing it by hand",
//        tier: 1,
//        resourceReq: {},
//        itemReq: ["axe"],
//        cost: {},
//        effect: { Wood: 5 },
//        rewards: { Wood: 5 },
//        message: "You chop down a tree. and gather a few logs ",
//        messages: ["Your axe bites into the tree", "You fell the tree and gather its Wood"],
//        //progressMessage: "You chop down a tree. and gather a few logs ",

//        repeats: -1 /* number of times an action can be repeated. -1 for inifinite*/
//    },
//    "pdc": {
//        actionCode: 0,
//        name: "Sell Produce",
//        description: "At least you get an allowance",
//        tier: 1,
//        resourceReq: {},
//        itemReq: [],
//        cost: {},
//        effect: { Gold: 1 },
//        rewards: { Wood: 5 },
//        message: "You take your most recent harvest to market and manage to sell a few cabbages and some string beans",//TODO Can some of these be procedural?
//        messages: ["You take your most recent harvest to market and manage to sell a few cabbages and some string beans"],//TODO Can some of these be procedural?
//        repeats: -1 /* number of times an action can be repeated. -1 for inifinite*/
//    },
//    "rst": {
//        actionCode: 0,
//        name: "Rest",
//        description: "Finally time to rest",
//        tier: 0,
//        resourceReq: {},
//        itemReq: [],
//        cost: {},
//        effect: { rest: 0 },
//        rewards: { Wood: 5 },
//        message: "You sleep and dream of gold and glory",
//        messages: ["You sleep and dream of gold and glory"],
//        repeats: -1 /* number of times an action can be repeated. -1 for inifinite*/
//    },
//    "cbd": {
//        actionCode: 0,
//        name: "Cook Bread",
//        description: "Delicious!",
//        tier: 1,
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
//        tier: 1,
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
//        tier: 2,
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