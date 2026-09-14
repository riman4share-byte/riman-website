const { spawn } = require('child_process');
const API_KEY = process.env.API_KEY_21ST || '21st_sk_39151bbd99356281a41b1b2293b5b3fab821cbb39d3ec96bce04200ff99a4963';

const env = { ...process.env, API_KEY_21ST: API_KEY };
const proc = spawn('npx', ['-y', '@21st-dev/magic@latest'], { env });

let buffer = '';
const timeout = setTimeout(() => {
  proc.kill();
  console.log(buffer);
  process.exit(0);
}, 10000);

proc.stdout.on('data', (data) => {
  buffer += data.toString();
});

proc.stderr.on('data', (data) => {});

proc.on('close', () => {
  clearTimeout(timeout);
  console.log(buffer);
});

const req1 = JSON.stringify({ jsonrpc: '2.0', id: 1, method: 'tools/list', params: {} });
const req2 = JSON.stringify({ jsonrpc: '2.0', id: 2, method: 'tools/call', params: { name: 'search', arguments: { query: 'hero', type: 'component', limit: 3 } } });

setTimeout(() => proc.stdin.write(req1), 500);
setTimeout(() => proc.stdin.write(req2), 800);
setTimeout(() => proc.stdin.end(), 1500);
