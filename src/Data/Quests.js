import { QUEST_NODE_TYPES, SKILLS} from '../Enums';

const QUESTS = {
    "Blueberry Hill": {
        "bb00": {
            Type: QUEST_NODE_TYPES.ENTRY_POINT,
            Name: "Blueberry Hill",
            Tier: 1,
            Next: "bbo1"
        },

        "bb01": {
            Type: QUEST_NODE_TYPES.DIALOG,
            Target: "ShopKeeper",
            Dialog: [
                {
                    "": "Thank you for the goods.",
                    "": "Tell your parents this batch was their best yet!",
                    "": "You wouldn't be interested in a little extra spending cash would you? I'm looking to expand my stock and I have some ideas, but I can't leave the shop alone. Are you interested?",
                    Branch: [
                        {
                            "Yes!": "Great! ",
                            Next: "bb10"
                        },
                        {
                            "No": "Well if you ever change your mind you know where to find me.",
                            Next: "bb05"
                        }
                    ],
                }
            ],
        },

        "bb05": {
            Type: QUEST_NODE_TYPES.DIALOG,
            Target: "ShopKeeper",
            Dialog: [
                {
                    "Tell me about this job of yours.": "Oh! Delightful! ",
                    "": "Yes I would like to expand my inventory but I need assistance.",
                    "": "I would pay you for your time",
                    Branch: [
                        {
                            "I've changed my mind and I'm in!": "Marvelous!",
                            next: "bbo4"
                        },
                        {
                            "I don't think I can take this on right now": "What a pity. Please do think about it.",
                            next: "bb03"
                        }
                    ],
                }
            ]
        },
        "bb10": {
            Type: QUEST_NODE_TYPES.DIALOG,
            BeginTracking: true,
            Target: "ShopKeeper",
            Dialog: [
                {
                    "So what do you need me to do?": "That hill just north of town, a hunter came in a week ago and told me there are dozens of blueberry bushes near the peak",
                    "": "If we can secure access to them I can begin seeling them at the shop.",
                    "": "Just think! Blueberry pie! Blueberry scones! Blueberry Jam!",
                    "": "If you can find the blueberries and report their location back to me I'll pay you 2 silver.",
                    "": "If you can establish a trailhead and mark the trail I'll pay you 2 more.",
                }
            ],
            Next: "bb20"
        },
        "bb20": {
            Type: QUEST_NODE_TYPES.SKILL_CHECK,
            Name: "Find the wild blueberries",
            Description:"Climb the hill north of town, find the blueberries, and report their location to the shopkeeper",
            Tier: 1,
            SkillPlus: SKILLS.SURVIVAL,
            Skill: SKILLS.PERCEPTION,
            SkillMinus: SKILLS.INVESTIGATION,
            Next: "bb30",
            Fail: "optional",
            FailMessages:[
                "You find yourself caught in a bramble patch and struggle to get free",
                "Your trail takes you to the bottom of a cliff",
                "You reach the top and as you take in the view you realize you've climbed the wrong hilltop."
            ],
            RepeatOnFail: true,
            RepeatOnSuccess: false
        },
        "bb30": {
            Type: QUEST_NODE_TYPES.DIALOG,
            Target: "ShopKeeper",
            Dialog: [
                {
                    "I found them!": "That's fantastic news!",
                    "": "Next Steps:",
                    "": "We need to establish a trailhead at the base of the hill.",
                    "": "You'll need to clear a space big enough for a couple workstations and a couple supply wagons, and build a camp.",
                    "": "Lastly you'll need to mark the trail.",
                    "": "I'm giving you some ribbon. You can tie small bits on trees and bushes",
                    "": "When you've completed this I've hired some workers from [construction company?] to takeover",
                    "": "They'll move into the trailhead you establish and clear the trail you marked so be sure each marker can be seen clearly from the last",
                    "": "Return to me when you've finished."
                }
            ],
            Next: "bb35"
        },
        "bb35":{
            Type:QUEST_NODE_TYPES.REWARD,
            Rewards:{copper:50},
            Next:"bb40"
        },
        "bb40":{
            Type: QUEST_NODE_TYPES.ACTION,
            Action:
            {
                actionCode: "bb1",
                name: "Prepare the trail",
                description: "Prepare a trailhead then find the best path to the blueberries and mark it with some ribbon",
                tierReq: 1,
                statReq: ["WIS","DEX"],
                resourceReq: {},
                itemReq: [],
                itemTags:["Slashing", "Marking"],
                visibilityReq: {}, //Define a point at which actions enter into your play area even if you don't actually qualify to do them yet
                cost: {},
                outcomes: { },
                rewards: { },
                message: "The trail is marked and the trailhead is prepared for a team to begin work.",
                critfailMessage: "You realize a large section of your marked trail loops and must be removed and re-marked.",
                failMessage: "You get lost while marking the trail.",
                partialMessage: "You make some progress.",
                successMessage: "You make significant progress.",
                critMessage: "You make incredible progress!",
                repeats: 0, /* number of times an action can be repeated. -1 for inifinite*/
                removable: false,
                clock: undefined,
                effect: "standard",
                unlocked: true,
                available: true
        
            },
            Next:"bb50",
        },
        "bb50":{
            Type: QUEST_NODE_TYPES.DIALOG,
            Target: "ShopKeeper",
            Dialog: [
                {
                    "It's complete!": "I knew I chose the right person for the job!",
                    "": "You just wait. In a few short years we'll be the blueberry capital of the Ashen Forest!",
                    "": "I think I'll pay [construction boss] a visit and tell him the good news",
                    "": "They should begin construction of a proper trail on the next workday",
                    "": "If you're in a hurry for some blueberries I'm sure you can have a chat with [construction boss].",
                    "": "I'm sure him and his team would love some volunteer work",
                    "": "In the meantime, here's your payment. Well earned I'd say."
                }
            ],
            Next: "bb55"
        },
        "bb55":{
            Type:QUEST_NODE_TYPES.REWARD,
            Rewards:{silver:2},
            Next:"bb60"
        },
        "bb60":{
            Type: QUEST_NODE_TYPES.ACTION,
            Action:
            {
                actionCode: "bb2",
                name: "Staircase to Blueberries",
                description: "[Construction company] is working on your trail. You can help them if you want",
                tierReq: 1,
                statReq: ["STR","DEX"],
                resourceReq: {},
                itemReq: [],
                itemTags:["Slashing", "Digging", "Bludgeoning"],
                visibilityReq: {}, //Define a point at which actions enter into your play area even if you don't actually qualify to do them yet
                cost: {},
                outcomes: { },
                rewards: { },
                message: "A trail has been built. Including a beautiful natural stone staircase to the peak. Now anyone in Ecclesia access the wild blueberries.",
                critfailMessage: "Your mistake sets the entire project backwards",
                failMessage: "With dismay you notice your trail is of course and the last three hours of labor were wasted.",
                partialMessage: "You make some progress.",
                successMessage: "You make significant progress.",
                critMessage: "You make incredible progress!",
                repeats: 0, /* number of times an action can be repeated. -1 for inifinite*/
                removable: false,
                clock: undefined,
                effect: "standard",
                unlocked: true,
                available: true
        
            },
            Next:"bb70",
        },
        "bb70":{
            Type:QUEST_NODE_TYPES.DIALOG,
            Target: "ShopKeeper",
            Dialog: [
                {
                    "The trail is finished. Anyone can access the blueberries now!": "You'll be eating blueberry tarts in no time! You can count on it!",
                    "": "I would like to thank you again. None of this would have happened were if not for your help.",
                    "": "If I have any jobs you can be sure you're at the top of my list.",
                    "": "Here's a token of my gratitude"
                }
            ],
            Next: "bb75"
        },
        "bb75":{
            Type:QUEST_NODE_TYPES.REWARD,
            Rewards:{blueberriesBushels:2, experience:2},
            Next:"bb80"
        },
        "bb80":{
            Type:QUEST_NODE_TYPES.ACTION,
            Action:
            {
                actionCode: "gbb",
                name: "Gather Blueberries",
                description: "Climb the staircase and gather blueberries",
                tierReq: 1,
                statReq: ["DEX","INT"],
                resourceReq: {},
                itemReq: [],
                itemTags:[],
                visibilityReq: {}, //Define a point at which actions enter into your play area even if you don't actually qualify to do them yet
                cost: {},
                outcomes: { },
                rewards: { blueberriesBushels:"1:3" },
                message: "You gather some blueberries into a basket.",
                critfailMessage: "You hear squawking and turn to find crows eating from a basket you had already filled. You lose some berries.",
                failMessage: "You spill some of the blueberries you had just gathered",
                partialMessage: "You find some blueberries.",
                successMessage: "You find lots of blue berries.",
                critMessage: "You find a ton of blueberries",
                repeats: -1, /* number of times an action can be repeated. -1 for inifinite*/
                removable: false,
                clock: undefined,
                effect: "standard",
                unlocked: true,
                available: true
        
            },
            Required:false, //lets the quest crawler add the action for the player 
            Next:"bb99"
        },
        "bb99":{
            Type: QUEST_NODE_TYPES.FINAL
        }
    },
}

export default QUESTS;