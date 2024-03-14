export function useCharactersLimit(value, limit = 200) {
  if (value.length > limit) {
    return value.substring(0, limit) + "...";
  }else {
    return value;
  }
}