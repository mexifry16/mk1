
/**
 * Takes any number of Iterables and ruturns a Generator capable of producing the Cartesian Product of the input
 * Use: const cartesianIteratorA = cartesianGeneratorFacotry([1,2,3],[4,5,6],[7,8,9])
 *      const cartesianIteratorB = cartesianGeneratorFacotry(['a','b','c'],[4,5,6],someOtherArray)
 *      const cartesianIteratorB = cartesianGeneratorFacotry(...arrayOfArrays)
 *      let result = cartesianIteratorA.ne`xt()
        while (!result.done) {
            console.log(result.value); // [1, 4, 7]
            result = cartesianIteratorA.next();
        }
    OutputA: ([1,4,7], [1,4,8], ..., [3,6,9])

 *  Credit to user le_m from this Stack Exchange answer
 *  https://stackoverflow.com/questions/4331092/finding-all-combinations-cartesian-product-of-javascript-array-values
 * @param {Iterable} head 
 * @param  {...Iterable} tail 
 */
export function* CartesianProductGenerator(head, ...tail) {
    let remainder = tail.length ? CartesianProductGenerator(...tail) : [[]]
    for (let r of remainder) for (let h of head) yield [h, ...r]
}

/**
 * Takes in a list of lists and returns an array containing the Cartesian Product (An array of each possible combination)
 * @param  {...Iterator} lists 
 */
export function CartesianProduct(...lists) {
    let product = []
    const cartesianGenerator = CartesianProductGenerator(...lists)
    let result = cartesianGenerator.next()
    while (!result.done) {
        product.push(result.value)
        result = cartesianGenerator.next();
    }
    return product
}