/**
 * Check the which fields has change
 * @param newObj obj to compare from
 * @param krtObj obj to compare to
 * @returns new obj with the fields that changed
 */
export function diff<T>(newObj: T, krtObj: T) {
  const diff: T = {} as T;

  Object.keys(newObj).forEach((k) => {
    if (newObj[k] !== krtObj[k]) diff[k] = newObj[k];
  });

  return diff;
}
