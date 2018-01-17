import arraySame from 'array-same';
import some from 'lodash.some';
import scores from './scores';

const convertToValue = value => scores.singles[value]
  || scores.doubles[value]
  || scores.triples[value]
  || value;
const convertToValues = arr => arr.map(convertToValue);
const sameValues = (a, b) => arraySame(convertToValues(a), convertToValues(b));

const getDifficulty = (value) => {
  if (!value) return 0;
  let difficulty = 100 - convertToValue(value);
  if (value === 'SINGLE_BULL') {
    difficulty += 200;
  } else if (value === 'BULL') {
    difficulty += 250;
  } else if (value.charAt(0) === 'D') {
    difficulty += 100;
  } else if (value.charAt(0) === 'T') {
    difficulty += 200;
  }
  return difficulty;
};

export default function getCheckoutWays({
  current,
  goal = 0,
  maxLength = 3,
  minScore = 0,
  settings = { doubles: true },
  length = 0,
}) {
  const checkoutWays = [];
  if (length >= maxLength) return checkoutWays;
  const testCheckout = what => Object.keys(scores[what]).forEach((name) => {
    const value = scores[what][name];
    if (value < minScore) return;
    const newValue = current - value;

    if (newValue < goal) return;
    if (newValue === goal) {
      checkoutWays.push([name]);
      return;
    }

    if (length + 1 >= maxLength) return;
    getCheckoutWays({
      current: newValue,
      goal,
      maxLength,
      minScore,
      settings: {
        singles: true,
        doubles: true,
        triples: true,
      },
      length: length + 1,
    }).forEach(way => checkoutWays.push(way.concat([name])));
  });
  if (settings.triples) testCheckout('triples');
  if (settings.doubles) testCheckout('doubles');
  if (settings.singles) testCheckout('singles');
  return checkoutWays
    .sort((a, b) => {
      if (a.length < b.length) return -1;
      if (a.length > b.length) return 1;

      const a0 = getDifficulty(a[0]);
      const b0 = getDifficulty(b[0]);
      if (a0 < b0) return -1;
      if (a0 > b0) return 1;

      const a1 = getDifficulty(a[1]);
      const b1 = getDifficulty(b[1]);
      if (a1 < b1) return -1;
      if (a1 > b1) return 1;

      const a2 = getDifficulty(a[2]);
      const b2 = getDifficulty(b[2]);
      if (a2 < b2) return -1;
      if (a2 > b2) return 1;
      return 0;
    })
    .reverse()
    .filter((way, index) => {
      if (length !== 0) return true;
      const values = way.slice(0, -1);
      return !some(checkoutWays.slice(index + 1).map((w) => {
        if (!sameValues(way, w)) return false;
        const v = w.slice(0, -1);
        return sameValues(values, v);
      }));
    }).sort((a, b) => {
      if (a.length < b.length) return -1;
      if (a.length > b.length) return 1;
      return 0;
    });
}
