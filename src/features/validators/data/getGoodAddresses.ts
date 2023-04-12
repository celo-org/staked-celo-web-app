// results is an array of booleans that correspond to the groupAddresses block status
// good: because we want the non blocked groups good is false, but true for getting health groups.
export function getGoodAddresses(results: boolean[], groupAddresses: string[], good = false) {
  return results.reduce<Set<string>>((goodies, result, index) => {
    if (result === good) {
      goodies.add(groupAddresses[index]);
    }
    return goodies;
  }, new Set());
}
