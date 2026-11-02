// SPDX-License-Identifier: GPL-3.0-or-later
// Each invocation owns its inputs and outputs. Never clear a shared release
// directory: it may contain an older build that the user is still running.
import { cpSync, existsSync, mkdirSync, mkdtempSync, readdirSync, statSync, writeFileSync } from 'node:fs';
import { basename, dirname, join, resolve } from 'node:path';

export function packageWorkspace(desktop, platform) {
  const root = resolve(desktop, '.cache', 'packaging');
  mkdirSync(root, { recursive: true });
  const work = mkdtempSync(join(root, `${platform}-`));
  return { work, bin: join(work, 'binaries'), staging: join(work, 'host'),
    config: join(work, 'tauri.bundle.json'), release: resolve(desktop, 'release', platform, basename(work)) };
}

export function stageHost(workspace, target) {
  const exe = join(target.hostDir, target.exe);
  if (!existsSync(exe)) throw new Error(`no engine host at ${exe}; refusing to package an app without its engine`);
  if (!existsSync(join(target.hostDir, 'engine'))) throw new Error(`no engine resources at ${join(target.hostDir, 'engine')}`);
  mkdirSync(workspace.bin, { recursive: true });
  const ext = target.exe.endsWith('.exe') ? '.exe' : '';
  cpSync(exe, join(workspace.bin, `spektralab-host-${target.triple}${ext}`));
  cpSync(join(target.hostDir, 'engine'), join(workspace.staging, 'engine'), { recursive: true });
  if (existsSync(join(target.hostDir, 'licenses'))) cpSync(join(target.hostDir, 'licenses'), join(workspace.staging, 'licenses'), { recursive: true });
  else mkdirSync(join(workspace.staging, 'licenses'), { recursive: true });
}

export function writeBundleConfig(workspace) {
  // Tauri supports absolute externalBin/resource paths. Forward slashes also
  // keep its resource glob parser from interpreting Windows separators.
  const portable = (p) => p.replaceAll('\\', '/');
  const resources = Object.fromEntries(['engine', 'licenses', 'agents'].map((name) =>
    [portable(join(workspace.staging, name)), name === 'agents' ? 'agents' : `host/${name}`]));
  writeFileSync(workspace.config, JSON.stringify({ bundle: {
    externalBin: [portable(join(workspace.bin, 'spektralab-host'))], resources,
  } }, null, 2));
  return workspace.config;
}

export function collectInstallers(workspace, roots) {
  const installers = [];
  for (const root of roots) {
    if (!existsSync(root)) continue;
    for (const kind of readdirSync(root)) {
      const dir = join(root, kind);
      if (!statSync(dir).isDirectory()) continue;
      for (const name of readdirSync(dir)) {
        const file = join(dir, name);
        if (statSync(file).isFile() && /\.(deb|AppImage|exe|rpm)$/.test(name)) installers.push({ file, name });
      }
    }
  }
  if (!installers.length) throw new Error(`the build finished but no installer was found under ${roots.join(', ')}`);
  // The invocation-specific destination must be new; never merge/overwrite it.
  mkdirSync(dirname(workspace.release), { recursive: true });
  mkdirSync(workspace.release, { recursive: false });
  for (const { file, name } of installers) cpSync(file, join(workspace.release, name), { errorOnExist: true, force: false });
  return installers.map(({ name }) => join(workspace.release, name));
}
