export function diff<T>(newObj: T, krtObj: T) {
  const diff: T = {} as T;

  Object.keys(newObj).forEach((k) => {
    if (newObj[k] !== krtObj[k]) diff[k] = newObj[k];
  });

  return diff;
}
