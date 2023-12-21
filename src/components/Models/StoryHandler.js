//Strategy:
//The dialoge, events, actions, and rewards are part of a large map structure, each node points to the next parts of the quest. This class merely keeps track of the players place in a given quest tree
//hopefully requiring very little overhead and or upkeep, as well as making extending quests or making new ones very simple

import { makeAutoObservable } from "mobx"
import { villageActions } from '../../Data/Actions';
import { LocationCodesEnum as LocCodes } from '../../Enums/LocationCodesEnum';
import { JSONCheatCopy } from '../../Helpers/JSONHelpers';
import ResourceHandler from './ResourceHandler';
import Character from './Character';
import Clock from './Clock';
import { log } from '../Debugger';

export class StoryHandler {
    constructor(args) {

    }
}