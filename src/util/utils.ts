/**
 * Check the which fields has change
 * @param newObj obj to compare from
 * @param krtObj obj to compare to
 * @returns new obj with the fields that changed
 */
export function diff<T>(newObj: T, krtObj: T): T {
  const diffObj: T = {} as T;

  Object.keys(newObj).forEach((k) => {
    if (newObj[k] instanceof Object && krtObj) {
      diffObj[k] = diff(newObj[k], krtObj[k]);

      if (Object.keys(diffObj[k]).length === 0) delete diffObj[k];
    } else if (!krtObj || newObj[k] !== krtObj[k]) diffObj[k] = newObj[k];
  });

  return diffObj;
}
