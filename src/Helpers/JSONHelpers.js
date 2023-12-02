
export function keyExists(object, key){
    return key in object
}

export function JSONCheatCopy(jsonIn){
    let copy = JSON.stringify(jsonIn)
    return JSON.parse(copy)
}