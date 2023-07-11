// results is an array of booleans that correspond to the groupAddresses block status
// good: because we want the non blocked groups good is false, but true for getting health groups.
export function getGoodAddresses(results: boolean[], groupAddresses: string[], good = false) {
  if (results.length !== groupAddresses.length) {
    throw new Error('results and groupAddresses must be the same length');
  }
  return results.reduce<Set<string>>((goodies, result, index) => {
    if (result === good) {
      goodies.add(groupAddresses[index]);
    }
    return goodies;
  }, new Set());
}
