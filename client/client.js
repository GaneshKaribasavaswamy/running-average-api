#!/usr/bin/env node
'use strict';

/**
 * Command-line client for the Average API.
 *
 * Usage: node client/client.js <number> [<number> ...]
 * Env:   API_URL (default http://localhost:3000)
 */

const API_URL = process.env.API_URL || 'http://localhost:3000';

/**
 * Sends one number to the server.
 *
 * @param {number} value - The number to submit.
 * @param {string} [baseUrl] - Server base URL.
 * @returns {Promise<number>} The running average returned by the server.
 * @throws {Error} If the server responds with a non-2xx status.
 */
async function sendNumber(value, baseUrl = API_URL) {
  const res = await fetch(`${baseUrl}/average`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ number: value }),
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || `HTTP ${res.status}`);
  }
  return data.average;
}

/**
 * CLI entry point. Sends each argument in order and prints the average after each.
 *
 * @param {string[]} args - Raw command-line arguments.
 * @returns {Promise<void>}
 */
async function main(args) {
  if (args.length === 0) {
    console.error('Usage: node client/client.js <number> [<number> ...]');
    process.exit(1);
  }
  for (const arg of args) {
    const value = Number(arg);
    if (arg.trim() === '' || !Number.isFinite(value)) {
      console.error(`"${arg}" is not a valid number`);
      process.exit(1);
    }
    const average = await sendNumber(value);
    console.log(`sent ${value} -> average so far: ${average}`);
  }
}

if (require.main === module) {
  main(process.argv.slice(2)).catch((err) => {
    console.error(`Request failed: ${err.message}`);
    process.exit(1);
  });
}

module.exports = { sendNumber };
