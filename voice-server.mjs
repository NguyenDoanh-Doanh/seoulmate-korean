import {createServer} from 'node:http';
import {readFile} from 'node:fs/promises';

const port = Number(process.env.SEOULMATE_PORT || 8787);
const origin = 'http://127.0.0.1:' + port;
const files = new Map([
  ['/', ['index.html', 'text/html; charset=utf-8']],
  ['/index.html', ['index.html', 'text/html; charset=utf-8']],
  ['/vocab-audio.js', ['vocab-audio.js', 'text/javascript; charset=utf-8']],
  ['/dialogue-audio.js', ['dialogue-audio.js', 'text/javascript; charset=utf-8']]
]);
const instructions = [
  'You are SeoulMate, a supportive Korean speaking tutor for a Vietnamese beginner.',
  'Speak Korean clearly and slightly slowly, and use Vietnamese for short explanations.',
  'Use one short turn at a time, then wait for the learner to answer aloud.',
  'If there is a clear mistake, give a brief Vietnamese explanation, say the natural Korean version and ask the learner to repeat.',
  'If the learner is doing a drama role-play, stay in the scene and elicit the Korean target phrase naturally.'
].join(' ');

createServer(async (request, response) => {
  if (request.headers.host !== '127.0.0.1:' + port) {
    response.writeHead(403).end();
    return;
  }
  const path = new URL(request.url, origin).pathname;
  if (request.method === 'GET' && path === '/voice-status') {
    response.writeHead(200, {'Content-Type': 'application/json', 'Cache-Control': 'no-store'})
      .end(JSON.stringify({available: Boolean(process.env.OPENAI_API_KEY)}));
    return;
  }
  if (request.method === 'POST' && path === '/voice-session') {
    if (request.headers.origin !== origin || request.headers['content-type'] !== 'application/sdp') {
      response.writeHead(403).end();
      return;
    }
    const key = process.env.OPENAI_API_KEY;
    if (!key) {
      response.writeHead(503).end();
      return;
    }
    try {
      let sdp = '';
      request.setEncoding('utf8');
      for await (const part of request) {
        sdp += part;
        if (sdp.length > 64000) {
          response.writeHead(413).end();
          return;
        }
      }
      if (!sdp.startsWith('v=0')) {
        response.writeHead(400).end();
        return;
      }
      const form = new FormData();
      form.set('sdp', sdp);
      form.set('session', JSON.stringify({
        type: 'realtime',
        model: 'gpt-realtime',
        instructions,
        audio: {output: {voice: 'marin'}}
      }));
      const result = await fetch('https://api.openai.com/v1/realtime/calls', {
        method: 'POST', headers: {Authorization: 'Bearer ' + key},
        body: form, signal: AbortSignal.timeout(20000)
      });
      if (!result.ok) {
        response.writeHead(502).end();
        return;
      }
      response.writeHead(200, {'Content-Type': 'application/sdp', 'Cache-Control': 'no-store'})
        .end(await result.text());
    } catch {
      response.writeHead(502).end();
    }
    return;
  }
  const file = files.get(path);
  if (request.method !== 'GET' || !file) {
    response.writeHead(404).end();
    return;
  }
  try {
    const contents = await readFile(new URL(file[0], import.meta.url));
    response.writeHead(200, {'Content-Type': file[1]}).end(contents);
  } catch {
    response.writeHead(404).end();
  }
}).listen(port, '127.0.0.1', () => console.log('SeoulMate → ' + origin));
