import { setsAreEqual } from './language';

test('setsAreEqual', () => {
  expect(setsAreEqual(new Set(), new Set())).toBe(true);
  expect(setsAreEqual(new Set([1, 2]), new Set([1, 2]))).toBe(true);
  expect(setsAreEqual(new Set([1, 2]), new Set([2, 1]))).toBe(true);
  expect(setsAreEqual(new Set([1, 2, 3]), new Set([1, 2]))).toBe(false);
  expect(setsAreEqual(new Set([1, 2]), new Set([1, 2, 3]))).toBe(false);
  expect(setsAreEqual(new Set([1, 2]), new Set())).toBe(false);
  expect(setsAreEqual(new Set(), new Set([1, 2]))).toBe(false);
});
