'use strict';

/**
 * Keeps a running average of every number it has been given.
 * Only the sum and the count are stored, so memory use is O(1)
 * no matter how many numbers are added.
 */
class RunningAverage {
  constructor() {
    /** @private @type {number} */
    this.sum = 0;
    /** @private @type {number} */
    this.count = 0;
  }

  /**
   * Adds a number to the data set and returns the new average.
   *
   * @param {number} value - A finite number.
   * @returns {number} The average of all numbers added so far, including `value`.
   * @throws {TypeError} If `value` is not a finite number.
   */
  add(value) {
    if (typeof value !== 'number' || !Number.isFinite(value)) {
      throw new TypeError('value must be a finite number');
    }
    this.sum += value;
    this.count += 1;
    return this.sum / this.count;
  }

  /**
   * How many numbers have been added so far.
   *
   * @returns {number}
   */
  getCount() {
    return this.count;
  }
}

module.exports = { RunningAverage };
