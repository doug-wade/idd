// Safely gets a property from a deeply nested object, and
// returns undefined if any intermediate value is undefined.
export default function getSafe(obj, key) {
  if (!obj) {
    return undefined;
  }
  const parts = key.split('.');
  let curr = obj;
  for (let i = 0; i < parts.length; i++) {
    if (parts[i].includes('[')) {
      let [part, index] = parts[i].split("[");
      index = +index.replace(']', '');
      if (!Array.isArray(curr[part]) || i >= curr[part].length) {
        return undefined;
      }
      curr = curr[part][index];
    } else if (typeof curr[parts[i]] === 'undefined') {
      return undefined;
    } else {
      curr = curr[parts[i]];
    }
  }
  return curr;
}
