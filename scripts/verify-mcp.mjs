import assert from 'node:assert/strict';
import { Buffer } from 'node:buffer';
import { spawn, spawnSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { existsSync, mkdirSync, mkdtempSync, readFileSync, readdirSync, realpathSync, statSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { tmpdir } from 'node:os';
import { dirname, isAbsolute, join, relative, resolve } from 'node:path';
import process from 'node:process';
import { StringDecoder } from 'node:string_decoder';
import { setTimeout, clearTimeout } from 'node:timers';
import { fileURLToPath, pathToFileURL } from 'node:url';

// A finite local consumer check with owned images, not a provider test.
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

async function imageConsumer(rpc, env) {
  const inventory = json(join(output, rpc.entry.name + '.inventory.json'));
  check('full preset image tool exists', inventory.tools.result.tools.some((tool) => tool.name === 'manipulate_screenshot'));
  const mcpRequire = createRequire(join(root, 'node_modules/nodebench-mcp/package.json'));
  const sharpEntry = mcpRequire.resolve('sharp');
  const sharpPackage = json(resolve(dirname(sharpEntry), '../package.json'));
  const sharp = (await import(pathToFileURL(sharpEntry).href)).default;
  check('MCP resolves selected Sharp', sharpPackage.name === 'sharp' && sharpPackage.version === pkg.overrides['nodebench-mcp'].sharp);
  const hash = (bytes) => createHash('sha256').update(bytes).digest('hex');
  // A 64x32 RGB PNG: left half (200,40,30), right half (20,70,210).
  const fixture = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAEAAAAAgCAIAAAAt/+nTAAAAPklEQVR4nO3PMQ0AMAgAMETs5p6Sad+NIjRw8DWpgca/ueq8WhUCAgICAgICAgICAgICAgICAgICAgICAlMNEqLoeU+/I80AAAAASUVORK5CYII=', 'base64');
  writeFileSync(join(output, 'image-input.png'), fixture, { flag: 'wx' });
  const input = await sharp(fixture).metadata();
  check('image fixture is 64x32 PNG', input.format === 'png' && input.width === 64 && input.height === 32);
  const captures = join(env.HOME, '.nodebench', 'captures');
  const captureState = () => {
    const names = existsSync(captures) ? readdirSync(captures).sort() : [];
    assert(names.length <= 8, 'Finite owned capture inventory');
    return names.map((name) => {
      const path = join(captures, name);
      assert(statSync(path).size <= 2 * 1024 * 1024, '2 MB capture limit');
      return { name, sha256: hash(readFileSync(path)) };
    });
  };
  report.images = { sharpEntry, version: sharpPackage.version, versions: sharp.versions, platform: process.platform, arch: process.arch,
    inputSHA256: hash(fixture), results: [], scope: 'PNG resize/crop/rejection/recovery; other formats and tools unverified' };
  const transform = async (label, bytes, args, width, height, solid = false) => {
    const reply = await rpc.request('tools/call', { name: 'manipulate_screenshot', arguments: { imageBase64: bytes.toString('base64'), label, ...args } });
    save(label + '.reply.json', reply);
    assert(!reply.error && reply.result?.isError === false, 'Successful image response envelope');
    const content = reply.result.content;
    assert.equal(content.length, 2);
    const body = JSON.parse(content.find((item) => item.type === 'text').text);
    const image = content.find((item) => item.type === 'image');
    assert(!body.error && body.operation === args.operation && body.label === label);
    assert.equal(image.mimeType, 'image/png');
    const result = Buffer.from(image.data, 'base64');
    assert(result.length <= 2 * 1024 * 1024);
    assert.equal(result.subarray(0, 8).toString('hex'), '89504e470d0a1a0a');
    const destination = realpathSync(body.filepath);
    const local = relative(realpathSync(captures), destination);
    assert(local && !isAbsolute(local) && local !== '..' && !local.startsWith('..' + (process.platform === 'win32' ? '\\' : '/')), 'Capture stays inside owned profile');
    assert.equal(statSync(destination).size, result.length);
    assert.deepEqual(readFileSync(destination), result);
    assert.equal(body.outputSizeBytes, result.length);
    const decoded = await sharp(result).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
    assert.equal(decoded.info.width, width); assert.equal(decoded.info.height, height); assert.equal(decoded.info.channels, 4);
    const pixel = (x, y) => [...decoded.data.subarray((y * width + x) * 4, (y * width + x) * 4 + 4)];
    if (solid) {
      for (let y = 0; y < height; y++) for (let x = 0; x < width; x++) assert.deepEqual(pixel(x, y), [200, 40, 30, 255]);
    } else {
      assert.deepEqual(pixel(4, 4), [200, 40, 30, 255]);
      assert.deepEqual(pixel(width - 5, height - 5), [20, 70, 210, 255]);
    }
    report.images.results.push({ label, width, height, bytes: result.length, sha256: hash(result), filepath: destination });
    check(label + ' actual pixels, transport and saved bytes', true);
    return result;
  };
  const resized = await transform('sharp-consumer-resize', fixture, { operation: 'resize', width: 32, height: 16 }, 32, 16);
  await transform('sharp-consumer-crop', resized, { operation: 'crop', x: 2, y: 2, cropWidth: 8, cropHeight: 8 }, 8, 8, true);
  const beforeMalformed = captureState();
  const malformed = await rpc.request('tools/call', { name: 'manipulate_screenshot', arguments: {
    imageBase64: Buffer.from('not-a-png').toString('base64'), operation: 'resize', width: 32, height: 16, label: 'sharp-consumer-malformed' } });
  save('sharp-consumer-malformed.reply.json', malformed);
  assert(!malformed.error && Array.isArray(malformed.result?.content));
  assert.equal(malformed.result.content.length, 1);
  assert.equal(malformed.result.content[0].type, 'text');
  const rejected = JSON.parse(malformed.result.content[0].text);
  check('malformed image rejects body without image output', rejected.error === true && rejected.operation === 'resize' && /^Image manipulation failed:/.test(rejected.message) && !rejected.filepath);
  assert.deepEqual(captureState(), beforeMalformed);
  check('malformed image creates no capture', true);
  report.images.malformed = { body: rejected, isError: malformed.result.isError, capturesBefore: beforeMalformed, capturesAfter: captureState(),
    protocolStatus: malformed.result.isError === true ? 'ERROR_ENVELOPE_OBSERVED' : 'OPEN_UPSTREAM_HONEST_STATUS_DEFECT',
    telemetry: 'Published raw-content arrays are logged as success by upstream source; telemetry not queried by this proof' };
  await transform('sharp-consumer-recovery', fixture, { operation: 'resize', width: 32, height: 16 }, 32, 16);
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
    const env = isolatedEnv('npm-' + preset);
    await session('npm-' + preset, process.execPath, [process.env.npm_execpath, 'run', '--silent', 'mcp:' + preset], env, async (rpc) => {
      await inventory(rpc, actual !== 'starter', actual === 'starter');
      if (actual === 'full') await imageConsumer(rpc, env);
    });
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
