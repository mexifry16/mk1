import POSITION from '../Enums/PositionEnum';
import EFFECT from '../Enums/EffectEnum';

export function determinePosition(action, character) {
    let position = POSITION.CONTROLLED
    if (action.repeats == 0)
        position = POSITION.RISKY
    if (action.tierReq >= character.tier + 1)
        position = POSITION.RISKY
    if (action.tierReq >= character.tier + 2)
        position = POSITION.DESPERATE
    //check for action unique risks?
    //check for relevant items to bring position down
    //maybe use a tug of war system to determine position. +1s and -1s cancel each other out leaving an int somwhere for controlled, risky, desperate
    return position
}

export function determineEffect() {
    return EFFECT.STANDARD
}

export const GAMEHELPERS = {
    determinePosition: determinePosition,
    determineEffect: determineEffect
}

