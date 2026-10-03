'use strict';

const express = require('express');
const { RunningAverage } = require('./runningAverage');

/**
 * Extracts the number from a request body.
 * Accepts either a bare JSON number (`5`) or an object (`{"number": 5}`).
 *
 * @param {unknown} body - The parsed JSON request body.
 * @returns {unknown} The candidate value (not yet validated).
 */
function extractNumber(body) {
  if (body !== null && typeof body === 'object') {
    return body.number;
  }
  return body;
}

/**
 * Builds the Express application.
 * The state is injected so tests can use an isolated instance per test.
 *
 * @param {RunningAverage} [store] - Holds the running average state.
 * @returns {import('express').Express} Configured Express app.
 */
function createApp(store = new RunningAverage()) {
  const app = express();

  // strict:false lets clients send a bare JSON number as the body.
  app.use(express.json({ strict: false }));

  /**
   * POST /average
   * Request body:  {"number": <number>}  (or a bare JSON number)
   * Response body: {"average": <number>}
   * Errors:        400 {"error": "<message>"}
   */
  app.post('/average', (req, res) => {
    try {
      const average = store.add(extractNumber(req.body));
      res.status(200).json({ average });
    } catch (err) {
      if (err instanceof TypeError) {
        return res.status(400).json({
          error: 'Request body must be a finite number, e.g. {"number": 10}',
        });
      }
      throw err;
    }
  });

  // Malformed JSON and other body-parser errors -> clean 400 instead of an HTML stack trace.
  // eslint-disable-next-line no-unused-vars
  app.use((err, req, res, next) => {
    const status = err.status || 500;
    const message = status === 400 ? 'Malformed JSON body' : 'Internal server error';
    res.status(status).json({ error: message });
  });

  return app;
}

module.exports = { createApp, extractNumber };
