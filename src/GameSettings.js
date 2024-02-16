import { OUTCOMES } from './Enums';

export const NUM_STARTING_DICE = 2
export const STARTING_DICE_SIZE = 6
export const OUTCOME_THRESHOLDS = {
    // CRITICAL_FAILURE:1, //Anything below failure
    FAILURE: 2,
    PARTIAL_SUCCESS: 7,
    SUCCESS: 10,
    CRITICAL_SUCCESS: 12
}