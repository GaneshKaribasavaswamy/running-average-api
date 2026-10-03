'use strict';

const http = require('http');
const { createApp } = require('../src/app');
const { sendNumber } = require('../client/client');

describe('client.sendNumber', () => {
  let server;
  let baseUrl;

  beforeAll((done) => {
    server = http.createServer(createApp()).listen(0, () => {
      baseUrl = `http://localhost:${server.address().port}`;
      done();
    });
  });
  afterAll((done) => {
    // fetch keeps connections alive; drop them so close() can complete.
    server.closeAllConnections();
    server.close(done);
  });

  it('talks to the server and returns the running average', async () => {
    expect(await sendNumber(10, baseUrl)).toBe(10);
    expect(await sendNumber(20, baseUrl)).toBe(15);
  });
});
