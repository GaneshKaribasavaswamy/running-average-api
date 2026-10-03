'use strict';

const request = require('supertest');
const { createApp } = require('../src/app');

describe('POST /average', () => {
  let app;
  beforeEach(() => {
    app = createApp(); // fresh state per test
  });

  it('returns the number as the average on first call', async () => {
    const res = await request(app).post('/average').send({ number: 10 });
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ average: 10 });
  });

  it('returns the average of ALL numbers sent so far', async () => {
    await request(app).post('/average').send({ number: 10 });
    await request(app).post('/average').send({ number: 20 });
    const res = await request(app).post('/average').send({ number: 60 });
    expect(res.body.average).toBe(30);
  });

  it('accepts a bare JSON number as the body', async () => {
    const res = await request(app)
      .post('/average')
      .set('Content-Type', 'application/json')
      .send('42');
    expect(res.status).toBe(200);
    expect(res.body.average).toBe(42);
  });

  it('returns 400 when the number is missing', async () => {
    const res = await request(app).post('/average').send({});
    expect(res.status).toBe(400);
    expect(res.body.error).toBeDefined();
  });

  it('returns 400 when the value is not a number', async () => {
    const res = await request(app).post('/average').send({ number: 'ten' });
    expect(res.status).toBe(400);
  });

  it('returns 400 for malformed JSON', async () => {
    const res = await request(app)
      .post('/average')
      .set('Content-Type', 'application/json')
      .send('{bad json');
    expect(res.status).toBe(400);
    expect(res.body.error).toBe('Malformed JSON body');
  });

  it('is not affected by rejected requests', async () => {
    await request(app).post('/average').send({ number: 10 });
    await request(app).post('/average').send({ number: 'bad' });
    const res = await request(app).post('/average').send({ number: 20 });
    expect(res.body.average).toBe(15);
  });

  it('returns 404 for other routes and GET /average', async () => {
    expect((await request(app).get('/average')).status).toBe(404);
  });
});
