import assert from 'node:assert/strict';
import { Buffer } from 'node:buffer';
import { spawn, spawnSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { mkdirSync, mkdtempSync, readFileSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import process from 'node:process';
import { StringDecoder } from 'node:string_decoder';
import { setTimeout, clearTimeout } from 'node:timers';
import { fileURLToPath, pathToFileURL } from 'node:url';

// A finite local consumer check, not a provider or tool-execution test.
const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const output = process.argv[2] ? resolve(process.argv[2]) : mkdtempSync(join(tmpdir(), 'nodebench-mcp-proof-'));
if (process.argv[2]) mkdirSync(output); // Refuse an existing run before touching its state.
assert(!process.argv[3], 'Use npm run verify:mcp -- [new-output-directory]');
const json = (path) => JSON.parse(readFileSync(path, 'utf8'));
const save = (name, value) => writeFileSync(join(output, name), JSON.stringify(value, null, 2) + '\n', { flag: 'wx' });
const digest = (value) => createHash('sha256').update(JSON.stringify(value)).digest('hex');
const config = json(join(root, '.mcp.json')).mcpServers.nodebench;
const pkg = json(join(root, 'package.json'));
const installed = json(join(root, 'node_modules/nodebench-mcp/package.json'));
const bin = './node_modules/nodebench-mcp/' + installed.bin['nodebench-mcp'];
assert.equal(config.command, 'node');
assert.deepEqual(config.args, [bin, '--stdio', '--no-embedding', '--preset', 'core']);
assert.deepEqual(config.env, {});
assert(process.env.npm_execpath, 'Run through npm run verify:mcp to bind the actual npm CLI');
const required = ['bootstrap_project', 'search_all_knowledge', 'getMethodology', 'start_verification_cycle',
  'log_phase_findings', 'log_test_result', 'get_verification_status', 'get_gate_preset',
  'run_quality_gate', 'get_gate_history', 'run_closed_loop', 'run_mandatory_flywheel',
  'record_learning', 'search_learnings', 'get_project_context'];
const report = { version: installed.version, output, checks: [], sessions: [], status: 'FAIL' };
const check = (name, condition) => { report.checks.push({ name, passed: Boolean(condition) }); assert(condition, name); };

function isolatedEnv(lane) {
  const base = join(output, lane);
  const env = {};
  for (const [key, value] of Object.entries(process.env)) {
    if (['systemroot', 'windir', 'comspec', 'pathext', 'path'].includes(key.toLowerCase())) env[key] = value;
  }
  for (const name of ['profile', 'data', 'appdata', 'localappdata', 'tmp', 'cache']) mkdirSync(join(base, name), { recursive: true });
  Object.assign(env, {
    HOME: join(base, 'profile'), USERPROFILE: join(base, 'profile'),
    NODEBENCH_DATA_DIR: join(base, 'data'), APPDATA: join(base, 'appdata'),
    LOCALAPPDATA: join(base, 'localappdata'), TEMP: join(base, 'tmp'), TMP: join(base, 'tmp'),
    NPM_CONFIG_CACHE: join(base, 'cache'), NPM_CONFIG_OFFLINE: 'true', NPM_CONFIG_YES: 'false',
    NPM_CONFIG_USERCONFIG: join(base, 'empty.npmrc'), NPM_CONFIG_GLOBALCONFIG: join(base, 'empty-global.npmrc'),
    NO_COLOR: '1', CI: 'true',
  });
  writeFileSync(env.NPM_CONFIG_USERCONFIG, '');
  writeFileSync(env.NPM_CONFIG_GLOBALCONFIG, '');
  return env;
}

async function session(name, command, args, env, exercise, cwd = root) {
  const child = spawn(command, args, { cwd, env, stdio: ['pipe', 'pipe', 'pipe'], windowsHide: true, detached: process.platform !== 'win32' });
  const entry = { name, command, args, pid: child.pid, requests: [], exitCode: null, signal: null };
  report.sessions.push(entry);
  const streams = { stdout: [], stderr: [] };
  const decoder = new StringDecoder('utf8');
  const pending = new Map();
  let bytes = 0, buffer = '', nextId = 0, failure;
  let rejectFatal;
  const fatal = new Promise((_, reject) => { rejectFatal = reject; });
  // A handler exists even when an EOF is being awaited.
  fatal.catch(() => {});
  const fail = (error) => {
    if (failure) return;
    failure = error;
    rejectFatal(error);
    for (const waiter of pending.values()) waiter.reject(error);
    pending.clear();
  };
  const closed = new Promise((resolveClose) => child.once('close', (code, signal) => {
    entry.exitCode = code; entry.signal = signal;
    if (pending.size) fail(new Error('Child closed with requests pending'));
    resolveClose();
  }));
  child.on('error', fail);
  child.stdin.on('error', fail);
  for (const stream of ['stdout', 'stderr']) child[stream].on('data', (chunk) => {
    bytes += chunk.length;
    if (bytes > 8 * 1024 * 1024) return fail(new Error('8 MB child stream limit'));
    streams[stream].push(chunk);
    if (stream !== 'stdout' || !exercise) return;
    buffer += decoder.write(chunk);
    try {
      while (buffer.includes('\n')) {
        const end = buffer.indexOf('\n'), line = buffer.slice(0, end);
        buffer = buffer.slice(end + 1);
        assert(Buffer.byteLength(line) <= 2 * 1024 * 1024, '2 MB frame limit');
        if (!line.trim()) continue;
        const message = JSON.parse(line);
        assert.equal(message.jsonrpc, '2.0');
        if (Object.hasOwn(message, 'id')) {
          const waiter = pending.get(message.id);
          assert(waiter, 'Unknown or duplicate response ID');
          pending.delete(message.id); waiter.resolve(message);
        } else assert.equal(typeof message.method, 'string');
      }
      assert(Buffer.byteLength(buffer) <= 2 * 1024 * 1024, '2 MB incomplete frame limit');
    } catch (error) { fail(error); }
  });
  const notify = (method, params) => child.stdin.write(JSON.stringify({ jsonrpc: '2.0', method, params }) + '\n');
  const request = (method, params = {}) => {
    assert(pending.size < 8, 'At most eight pending requests');
    const id = ++nextId;
    entry.requests.push({ id, method });
    return new Promise((resolveReply, reject) => {
      if (failure) return reject(failure);
      pending.set(id, { resolve: resolveReply, reject });
      child.stdin.write(JSON.stringify({ jsonrpc: '2.0', id, method, params }) + '\n');
    });
  };
  const timer = setTimeout(() => fail(new Error('25 second protocol deadline')), 25_000);
  try {
    if (exercise) await Promise.race([exercise({ request, notify, entry }), fatal]);
    child.stdin.end();
    let eofTimer;
    try {
      await Promise.race([closed, fatal, new Promise((_, reject) => { eofTimer = setTimeout(() => reject(new Error('5 second EOF deadline')), 5_000); })]);
    } finally { clearTimeout(eofTimer); }
    if (exercise) {
      assert.equal(buffer.trim(), '', 'No trailing non-frame output');
      assert.equal(entry.exitCode, 0, 'Clean protocol EOF');
    }
  } catch (error) {
    entry.error = error.message;
    throw error;
  } finally {
    clearTimeout(timer);
    if (child.exitCode === null && child.signalCode === null) {
      if (process.platform === 'win32') spawnSync('taskkill', ['/PID', String(child.pid), '/T', '/F'], { windowsHide: true, timeout: 5000 });
      else process.kill(-child.pid, 'SIGKILL');
      let cleanupTimer;
      try {
        await Promise.race([closed, new Promise((_, reject) => { cleanupTimer = setTimeout(() => reject(new Error('5 second forced cleanup deadline')), 5_000); })]);
      } finally { clearTimeout(cleanupTimer); }
    }
    for (const stream of ['stdout', 'stderr']) writeFileSync(join(output, name + '.' + stream + '.txt'), Buffer.concat(streams[stream]), { flag: 'wx' });
    entry.streamBytes = bytes;
    entry.pendingAtClose = pending.size;
  }
  return entry;
}

async function inventory(rpc, expectedCore, repeated = false) {
  const init = await rpc.request('initialize', { protocolVersion: '2024-11-05', capabilities: {}, clientInfo: { name: 'boilerplate-local-proof', version: '1' } });
  assert(init.result?.serverInfo);
  rpc.notify('notifications/initialized');
  const [tools, prompts] = await Promise.all([rpc.request('tools/list'), rpc.request('prompts/list')]);
  const names = tools.result.tools.map((tool) => tool.name);
  const promptNames = prompts.result.prompts.map((prompt) => prompt.name);
  check(rpc.entry.name + ' unique nonempty tools/prompts', names.length && promptNames.length && new Set(names).size === names.length && new Set(promptNames).size === promptNames.length);
  if (expectedCore) check(rpc.entry.name + ' AGENTS methods', required.every((name) => names.includes(name)));
  const shape = digest({ tools: tools.result, prompts: prompts.result });
  if (repeated) {
    const unknown = await rpc.request('boilerplate/unknown-method');
    check('unknown method rejects', unknown.error?.code === -32601);
    for (let i = 0; i < 8; i++) {
      const next = await rpc.request('tools/list');
      check('sustained read ' + i, digest(next.result) === digest(tools.result));
    }
  }
  Object.assign(rpc.entry, { tools: names.length, prompts: promptNames.length, inventoryDigest: shape });
  save(rpc.entry.name + '.inventory.json', { initialize: init, tools, prompts });
  return shape;
}

try {
  const nativeEnv = isolatedEnv('native');
  const dbUrl = pathToFileURL(join(root, 'node_modules/nodebench-mcp/dist/db.js')).href;
  const nativeProgram = `import assert from 'node:assert/strict';
    import { getDb, getOptionalDatabaseCtorSource } from ${JSON.stringify(dbUrl)};
    const db = getDb();
    const tables = db.prepare("SELECT name FROM sqlite_master WHERE type='table'").all();
    assert(tables.length > 0, 'Native MCP tables required; noop is not storage');
    db.exec('CREATE TABLE IF NOT EXISTS handoff_probe (id INTEGER PRIMARY KEY, value TEXT NOT NULL)');
    if (process.argv[1] === 'write') {
      const result = db.prepare('INSERT INTO handoff_probe VALUES (?, ?)').run(1, 'retained test value');
      assert.equal(result.changes, 1);
    }
    assert.equal(db.prepare('SELECT value FROM handoff_probe WHERE id=1').get().value, 'retained test value');
    console.log(JSON.stringify({ adapter:getOptionalDatabaseCtorSource(), tables:tables.length, sqlite:db.prepare('SELECT sqlite_version() AS version').get(), readback:true }));
    db.close();`;
  for (const mode of ['write', 'reopen']) {
    const run = await session('native-' + mode, process.execPath, ['--input-type=module', '-e', nativeProgram, mode], nativeEnv, null);
    check('native ' + mode, run.exitCode === 0);
  }
  const configured = await session('configured', config.command, config.args, isolatedEnv('configured'), (rpc) => inventory(rpc, true));
  for (const preset of ['start', 'starter', 'core', 'full']) {
    const actual = preset === 'start' ? 'core' : preset;
    assert.equal(pkg.scripts['mcp:' + preset], `node ${bin} --stdio --no-embedding --preset ${actual}`);
    await session('npm-' + preset, process.execPath, [process.env.npm_execpath, 'run', '--silent', 'mcp:' + preset], isolatedEnv('npm-' + preset), (rpc) => inventory(rpc, actual !== 'starter', actual === 'starter'));
  }
  const restarted = await session('configured-restart', config.command, config.args, isolatedEnv('configured'), (rpc) => inventory(rpc, true));
  check('restart schema identity', configured.inventoryDigest === restarted.inventoryDigest);
  const invalid = await session('invalid-preset', config.command, [bin, '--stdio', '--no-embedding', '--preset', 'boilerplate-invalid'], isolatedEnv('invalid'), null);
  check('invalid preset fails', invalid.exitCode !== 0 && /Unknown preset/.test(readFileSync(join(output, 'invalid-preset.stderr.txt'), 'utf8')));
  const empty = join(output, 'missing-install'); mkdirSync(empty);
  const missing = await session('missing-local-install', config.command, config.args, isolatedEnv('missing'), null, empty);
  check('missing local install fails without npx/cache/global fallback', missing.exitCode !== 0 && /MODULE_NOT_FOUND/.test(readFileSync(join(output, 'missing-local-install.stderr.txt'), 'utf8')));
  report.status = 'PASS';
} catch (error) {
  report.error = error.stack;
  process.exitCode = 1;
} finally {
  save('report.json', report);
  process.stdout.write(JSON.stringify({ status: report.status, checks: report.checks.length, output, error: report.error }) + '\n');
}
