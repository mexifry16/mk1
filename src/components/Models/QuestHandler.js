import { makeAutoObservable, runInAction, when } from "mobx"
import { QUESTS } from '../../Data/Quests';
import QUEST_NODE_TYPES from "../../Enums/QuestNodeTypesEnum";
import { LocationCodesEnum as LocCodes } from '../../Enums/LocationCodesEnum';
import { JSONCheatCopy } from '../../Helpers/JSONHelpers';
import ResourceHandler from './ResourceHandler';
import Character from './Character';
import Clock from './Clock';
import OUTCOME from '../../Enums/OutcomeEnum';
import { Dice, readRoll } from '../Tools/Dice'
import { log } from '../Debugger';


export default class QuestHandler {
       
    constructor(args) {
        //log("Constructing Action Handler")
        this._activeQuests = new Map()
        this._completedQuests = []
        this._visibleQuests = []

        if (args)
            Object.keys(args).forEach((key) => {
                this[`_${key}`] = args[key];
            });

        makeAutoObservable(this)
    }

    loadQuests(){
        for(let [questName, quest] in QUESTS.entries()){
            this.addQuest(questName, quest)
        }
    }

    addQuest(questName, quest){
        let curStep = null
        let questSteps = quest.keys()
        for (let questStep in questSteps){
            if(quest[questStep].Type === QUEST_NODE_TYPES.ENTRY_POINT)
                curStep = questStep
        }
        this._activeQuests.set(questName, curStep)
        advanceQuestStep(questName)
    }

    setQuestStep(questName, newStep){
        this._activeQuests.set(questName, newStep)
        initializeQuestStep(questName)
    }

    advanceQuestStep(questName){
        let curQuestStep = this._activeQuests.get(questName)
        let nextStep = QUESTS[questName][curQuestStep].Next
        this._activeQuests.set(questName, nextStep)
        initializeQuestStep(questName)
    }

    initializeQuestStep(questName){
        let curQuestStep = this._activeQuests.get(questName)
        let stepType = QUESTS[questName][curQuestStep].Type = undefined
        switch (stepType) {
            case QUEST_NODE_TYPES.ENTRY_POINT:
                break
            case QUEST_NODE_TYPES.DIALOG:
                break
            case QUEST_NODE_TYPES.ACTION:
                break
            case QUEST_NODE_TYPES.SKILL_CHECK:
                break
            case QUEST_NODE_TYPES.REWARD:
                break
            case QUEST_NODE_TYPES.FINAL:
                break
            default:
                log("Undefined Quest Node Type")
                attribute = undefined
        }

        return this.getModifier(attribute)
    }

    completeQuestStep(questname){

    }

    completeQuest(questName){
        this._completedQuests.push(questName)
        let indexToRemove = this._visibleQuests.indexOf(questName)
        this._visibleQuests = this._visibleQuests.splice(indexToRemove,1)
        this._activeQuests.delete(questName)
    }

    processReward(){

    }

    processAction(){

    }

}