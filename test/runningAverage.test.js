'use strict';

const { RunningAverage } = require('../src/runningAverage');

describe('RunningAverage', () => {
  it('returns the number itself on the first call', () => {
    expect(new RunningAverage().add(10)).toBe(10);
  });

  it('averages all numbers added so far', () => {
    const avg = new RunningAverage();
    avg.add(10);
    expect(avg.add(20)).toBe(15);
    expect(avg.add(30)).toBe(20);
    expect(avg.getCount()).toBe(3);
  });

  it('handles negatives and decimals', () => {
    const avg = new RunningAverage();
    avg.add(-5);
    expect(avg.add(2.5)).toBeCloseTo(-1.25);
  });

  it.each([['abc'], [null], [undefined], [NaN], [Infinity], [{}], [true]])(
    'rejects invalid value %p',
    (bad) => {
      expect(() => new RunningAverage().add(bad)).toThrow(TypeError);
    }
  );

  it('does not change state when a value is rejected', () => {
    const avg = new RunningAverage();
    avg.add(4);
    expect(() => avg.add('x')).toThrow();
    expect(avg.getCount()).toBe(1);
  });
});
