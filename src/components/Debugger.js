import { useEffect } from 'react';
import { observer } from "mobx-react-lite"
import { autorun, trace, getDependencyTree, getDebugName, getObserverTree, spy } from "mobx"

/*
 * DEBUGGING SETTINGS
 * */
const SPY_ENABLED = false
const LOGGING_CHARACTER = false
const LOGGING_ACTION_HANDLER = false
const LOGGING_RESOURCES = false
const LOGGING_SHOP = false
const LOGGING_SHOP_HANDLER = false
export const LOGGING_ENABLED = false
export const DEBUGGING_ENABLED = false

const logg = console.log

export function log(message, object) {
    if (LOGGING_ENABLED) {
        if (message && object)
            logg(message, object)
        if (message && !object)
            logg(message)
        if (!message && object)
            logg(object)
    }
}

export const Debugger = observer(({ resourceHandler, actionHandler, curCharacter, shopHandler, curLocation, log, children }) => {

    useEffect(() => {
        if (SPY_ENABLED)
            spy(event => {
                //CUSTOMIZE SPY
                //EXAMPLE 1
                //if (event.type === "reaction") {
                //    console.log(`${event.name} with args: ${event.arguments}`)
                //}

                //EXAMPLE 2
                //if (event.type === "reaction") {
                //    console.log("Event fired: ", event)
                //}
            })
    }, [])

    useEffect(() => {
        if (LOGGING_CHARACTER)
            autorun(() => {
                console.log("currentcharacter: ", JSON.stringify(curCharacter)) // also reads the entire structure.
            })
    }, [])

    useEffect(() => {
        if (LOGGING_ACTION_HANDLER)
            autorun(() => {
                console.log("action handler: ", JSON.stringify(actionHandler)) // also reads the entire structure.
            })
    }, [])

    useEffect(() => {
        if (LOGGING_RESOURCES)
            autorun(() => {
                console.log("Resource Handler: ", JSON.stringify(resourceHandler)) // Also reads the entire structure.
            })
    }, [])

    useEffect(() => {
        if (LOGGING_SHOP)
            
            autorun(() => {
                console.log("currentshop: ", JSON.stringify(shopHandler.curshop)) // also reads the entire structure.
            })
    }, [])

    useEffect(() => {
        if (LOGGING_SHOP_HANDLER)

            autorun(() => {
                console.log("currentshop: ", JSON.stringify(shopHandler)) // also reads the entire structure.
            })
    }, [])
      
    return (<>{children}</>)
})