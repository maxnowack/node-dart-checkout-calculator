import arraySame from 'array-same';
import some from 'lodash.some';
import scores from './scores';

export default function getCheckoutWays(
  current,
  goal = 0,
  maxLength = 3,
  minValue = 0,
  settings = { doubles: true },
  length = 0,
) {
  const checkoutWays = [];
  if (length >= maxLength) return checkoutWays;
  const testCheckout = what => Object.keys(scores[what]).forEach((name) => {
    const value = scores[what][name];
    if (value < minValue) return;
    const newValue = current - value;

    if (newValue < goal) return;
    if (newValue === goal) {
      checkoutWays.push([name]);
      return;
    }

    if (length + 1 >= maxLength) return;
    getCheckoutWays(newValue, goal, maxLength, minValue, {
      singles: true,
      doubles: true,
      triples: true,
    }, length + 1).forEach(way => checkoutWays.push(way.concat([name])));
  });
  if (settings.triples) testCheckout('triples');
  if (settings.doubles) testCheckout('doubles');
  if (settings.singles) testCheckout('singles');
  return checkoutWays.filter((way, index) => {
    if (length !== 0) return true;
    const values = way.slice(0, -1);
    return !some(checkoutWays.slice(index + 1).map((w) => {
      if (!arraySame(way, w)) return false;
      const v = w.slice(0, -1);
      return arraySame(values, v);
    }));
  }).reverse();
}
