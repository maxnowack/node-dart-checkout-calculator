import test from 'ava';
import getCheckoutWays from './src';

const possibleCheckouts = {
  170: [['T20', 'T20', 'BULL']],
  169: [],
  168: [],
  167: [
    ['T20', 'T19', 'BULL'],
  ],
  166: [],
  165: [],
  164: [
    ['T19', 'T19', 'BULL'],
    ['T20', 'T18', 'BULL'],
  ],
  20: [
    ['D10'],
    ['6', 'D7'],
    ['14', 'D3'],
    ['12', 'D4'],
    ['10', 'D5'],
    ['8', 'D6'],
    ['6', '6', 'D4'],
    ['9', '5', 'D3'],
    ['8', '6', 'D3'],
    ['7', '7', 'D3'],
    ['7', '5', 'D4'],
    ['5', '5', 'D5'],
  ],
  10: [['D5']],
};

const testCheckout = num => test(num, (t) => {
  const ways = getCheckoutWays(num, 0, 3, 5);
  t.deepEqual(ways, possibleCheckouts[num]);
});

Object.keys(possibleCheckouts).forEach(num => testCheckout(num));

test('ways to 32', (t) => {
  const ways = getCheckoutWays(50, 32, 2, 10, { singles: 1, doubles: 1 });
  t.deepEqual(ways, [
    ['18'],
  ]);
});
