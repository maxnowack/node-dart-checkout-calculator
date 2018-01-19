import fs from 'fs';
import numberArray from 'number-array';
import leftPad from 'left-pad'; // eslint-disable-line import/no-extraneous-dependencies
import pMap from 'p-map'; // eslint-disable-line import/no-extraneous-dependencies
import pify from 'pify'; // eslint-disable-line import/no-extraneous-dependencies
import groupBy from 'lodash.groupby'; // eslint-disable-line import/no-extraneous-dependencies
import getCheckoutWays from './src';

const writeFile = pify(fs.writeFile);
const readFile = pify(fs.readFile);
const ensureFolder = (folder) => {
  if (!fs.existsSync(folder)) {
    fs.mkdirSync(folder);
  }
};

ensureFolder('generated');
const cache = {};
const getCache = (points, goal) => {
  if (!goal) return null;
  return cache[points - goal];
};

const pairsToCalculate = [];
numberArray(101).reverse().forEach(goal =>
  numberArray(169, 2).forEach(points => goal < points &&
    pairsToCalculate.push({ points, goal })));

pMap(pairsToCalculate, async ({ points, goal }) => {
  ensureFolder(`generated/${leftPad(goal, 3, '0')}`);
  const fileName = `generated/${leftPad(goal, 3, '0')}/${leftPad(points, 3, '0')}.json`;
  if (fs.existsSync(fileName)) {
    const checkouts = JSON.parse(await readFile(fileName));
    console.log('skipped', fileName);
    return { points, goal, checkouts };
  }
  const cached = getCache(points, goal);
  const checkouts = cached || getCheckoutWays({
    current: points,
    goal,
    settings: goal ? { singles: true, doubles: true, triples: true } : { doubles: true },
  });
  if (!cached && goal) cache[points - goal] = checkouts;
  await writeFile(fileName, JSON.stringify(checkouts));
  console.log('generated', fileName);
  return { points, goal, checkouts };
}, { concurrency: 1 }).then((values) => {
  writeFile('generated/bundled.json', JSON.stringify(values));
  const goals = groupBy(values, i => i.goal);
  Object.keys(goals).forEach(goal => writeFile(`generated/bundled-${leftPad(goal, 3, '0')}.json`, JSON.stringify(goals[goal])));
});
