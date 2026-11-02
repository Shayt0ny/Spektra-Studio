import { afterEach, beforeEach, test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, mkdirSync, mkdtempSync, readFileSync, realpathSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { collectInstallers, packageWorkspace, stageHost, writeBundleConfig } from './packaging.mjs';

let desktop;
const put = (path, data) => { mkdirSync(dirname(path), { recursive: true }); writeFileSync(path, data); return path; };
beforeEach(() => { desktop = realpathSync(mkdtempSync(join(tmpdir(), 'spk packaging test-'))); });
afterEach(() => {
  // Remove only the exact temporary test directory created above.
  assert.equal(dirname(realpathSync(desktop)), realpathSync(tmpdir()));
  assert.ok(desktop.split(/[\\/]/).at(-1).startsWith('spk packaging test-'));
  rmSync(desktop, { recursive: true, force: true });
});

test('separate invocations stage independent hosts/configs and leave existing runtime folders intact', () => {
  const sentinels = ['src-tauri/binaries/running.exe', 'src-tauri/host-staging/engine/old', 'release/windows/portable/running.exe']
    .map((path) => put(join(desktop, path), 'running'));
  const hostDir = join(desktop, 'host source');
  put(join(hostDir, 'spektralab-host.exe'), 'host one'); put(join(hostDir, 'engine/data.bin'), 'data one');
  const target = { hostDir, exe: 'spektralab-host.exe', triple: 'x86_64-pc-windows-msvc' };
  const a = packageWorkspace(desktop, 'windows'); stageHost(a, target);
  put(join(hostDir, 'spektralab-host.exe'), 'host two');
  const b = packageWorkspace(desktop, 'windows'); stageHost(b, target);
  assert.notEqual(a.work, b.work); assert.notEqual(a.release, b.release);
  assert.equal(readFileSync(join(a.bin, 'spektralab-host-x86_64-pc-windows-msvc.exe'), 'utf8'), 'host one');
  assert.equal(readFileSync(join(b.bin, 'spektralab-host-x86_64-pc-windows-msvc.exe'), 'utf8'), 'host two');
  const config = JSON.parse(readFileSync(writeBundleConfig(a), 'utf8'));
  assert.equal(config.bundle.externalBin[0], join(a.bin, 'spektralab-host').replaceAll('\\', '/'));
  for (const name of ['engine', 'licenses', 'agents']) {
    assert.equal(config.bundle.resources[join(a.staging, name).replaceAll('\\', '/')], name === 'agents' ? name : `host/${name}`);
  }
  for (const path of sentinels) assert.equal(readFileSync(path, 'utf8'), 'running');
});

test('same-version packages remain separate and a failed build leaves prior output untouched', () => {
  const bundle = join(desktop, 'target/bundle');
  const installer = put(join(bundle, 'nsis/App_1.0_x64-setup.exe'), 'first');
  const a = packageWorkspace(desktop, 'windows');
  const [first] = collectInstallers(a, [bundle]);
  put(installer, 'second');
  const b = packageWorkspace(desktop, 'windows');
  const [second] = collectInstallers(b, [bundle]);
  assert.equal(readFileSync(first, 'utf8'), 'first'); assert.equal(readFileSync(second, 'utf8'), 'second');
  const failed = packageWorkspace(desktop, 'windows');
  assert.throws(() => collectInstallers(failed, [join(desktop, 'absent')]), /no installer/);
  assert.equal(existsSync(failed.release), false);
  assert.throws(() => collectInstallers(a, [bundle]), /EEXIST/);
  assert.equal(readFileSync(first, 'utf8'), 'first');
  assert.throws(() => stageHost(failed, { hostDir: resolve(desktop, 'missing'), exe: 'host.exe' }), /no engine host/);
});
